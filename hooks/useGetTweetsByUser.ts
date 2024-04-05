import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
const LIMIT_POST = 4

const useGetTweetsByUser = (pageNumber: number, user_id: string, accessToken: string) => {
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
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            url: process.env.SERVER + `/tweet/${user_id}/tweets`,
            params: { limit: LIMIT_POST, type: 0, skip },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setNewfeeds(prev => {
                return [...new Set([...prev, ...res.data.result.tweetsByUser])]
            })
            setHasMore(res.data.result.tweetsByUser.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [pageNumber])
    return { loading, error, newfeeds, hasMore }
}

export default useGetTweetsByUser;