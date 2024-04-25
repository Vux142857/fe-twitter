import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
const LIMIT_POST = 10

const useNewfeeds = (pageNumber: number) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [newfeeds, setNewfeeds] = useState<any[]>([])
    const [hasMore, setHasMore] = useState(false)
    const skip = (pageNumber - 1) * LIMIT_POST
    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel: Canceler
        axios({
            method: 'GET',
            // /tweet/trending/views?limit=10&type=1&skip=0
            url: process.env.NEXT_PUBLIC_SERVER + "/tweet/trending/views",
            params: { limit: LIMIT_POST, type: 0, skip },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setNewfeeds(prev => {
                return [...new Set([...prev, ...res.data.result.tweetsByViews])]
            })
            setHasMore(res.data.result.tweetsByViews.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [pageNumber])
    return { loading, error, newfeeds, hasMore }
}

export default useNewfeeds;