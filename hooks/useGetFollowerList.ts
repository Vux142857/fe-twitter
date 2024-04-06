import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
const LIMIT_POST = 10

const useFollowerList = (pageNumber: number, user_id: string, accessToken: string) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [followers, setFollowers] = useState<any[]>([])
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
            url: process.env.SERVER + `/user/follows/${user_id}`,
            params: { limit: LIMIT_POST, type: 'followers', skip },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            if (res.data.result.followers.length > 0) {
                setFollowers(prev => {
                    return [...new Set([...prev, ...res.data.result.followers])]
                })
            }
            setHasMore(res.data.result?.followers > followers.length)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [pageNumber])
    return { loading, followers, error, hasMore }
}

export default useFollowerList;