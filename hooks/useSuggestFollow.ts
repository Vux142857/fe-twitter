import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";

const LIMIT_SUGGEST = 3;

const useSuggestFollow = (accessToken: string, pageNumber) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [suggestList, setSuggestList] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel: Canceler;
        axios({
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            url: process.env.NEXT_PUBLIC_SERVER + `/suggest-follow`,
            params: { limit: LIMIT_SUGGEST, skip: (pageNumber - 1) * LIMIT_SUGGEST },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            let result = [];
            let hasMore = false;
            setSuggestList(prevResults => [...prevResults, ...result]);
            setHasMore(hasMore);
            setLoading(false);
        }).catch(e => {
            if (axios.isCancel(e)) return;
            setError(true);
        });
        return () => cancel();
    }, [pageNumber]);

    return { loading, error, suggestList, hasMore };
}

export default useSuggestFollow;