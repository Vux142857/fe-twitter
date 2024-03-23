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
            url: process.env.SERVER + "/tweet/trending/views",
            params: { limit: 3, type: 0, skip },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setNewfeeds(prevBooks => {
                return [...new Set([...prevBooks, ...res.data.result.tweetsByViews])]
            })
            setHasMore(res.data.result.tweetsByViews.length > 0)
            setLoading(false)
            console.log(res.data.result.tweetsByViews)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [pageNumber])
    return { loading, error, newfeeds, hasMore }
}

export default useNewfeeds;