import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
const LIMIT_POST = 4

const useGetBookmarksList = (pageNumber: number, accessToken: string) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [bookmarks, setBookmarks] = useState<any[]>([])
    const [hasMore, setHasMore] = useState(false)
    const skip = (pageNumber - 1) * LIMIT_POST
    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel: Canceler
        axios({
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            url: process.env.SERVER + `/bookmark/get-bookmarks`,
            params: { limit: LIMIT_POST, skip },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setBookmarks(prev => {
                console.log(prev)
                return [...new Set([...prev, ...res.data.result])]
            })
            setHasMore(res.data.result.length > 0)
            setLoading(false)
            console.log(res.data.result)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [pageNumber])
    return { loading, error, bookmarks, hasMore }
}

export default useGetBookmarksList;