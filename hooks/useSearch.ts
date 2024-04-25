import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
import { SearchFilterQuery } from "@/constants/dataBody";

const LIMIT_POST = 10;

const useSearch = (pageNumber: number, value: string, accessToken: string, filter: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchResults, setSearchResult] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(false);
    useEffect(() => {
        setSearchResult([]);
    }, [filter]);
    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel: Canceler;

        axios({
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            url: process.env.NEXT_PUBLIC_SERVER + `/search`,
            params: { limit: LIMIT_POST, filter, skip: (pageNumber - 1) * LIMIT_POST, value },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            let result = [];
            let hasMore = false;
            switch (filter) {
                case SearchFilterQuery.Tweet:
                    result = res.data.result.tweets;
                    hasMore = result.length > 0;
                    break;
                case SearchFilterQuery.Image:
                    result = res.data.result.images;
                    hasMore = result.length > 0;
                    break;
                case SearchFilterQuery.Video:
                    result = res.data.result.videos;
                    hasMore = result.length > 0;
                    break;
                case SearchFilterQuery.User:
                    result = res.data.result.users;
                    hasMore = result.length > 0;
                    break;
                default:
                    break;
            }
            setSearchResult(prevResults => [...prevResults, ...result]);
            setHasMore(hasMore);
            setLoading(false);
        }).catch(e => {
            if (axios.isCancel(e)) return;
            setError(true);
        });

        return () => cancel();
    }, [pageNumber, value, filter]);

    return { loading, error, searchResults, hasMore };
}

export default useSearch;
