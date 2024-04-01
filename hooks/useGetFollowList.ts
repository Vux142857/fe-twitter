import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
const LIMIT_POST = 4

const useFollowList = (pageNumber: number, user_id: string, accessToken: string, isFollower: boolean) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [followList, setFollowList] = useState<any[]>([])
    const [hasMore, setHasMore] = useState(false)
    const skip = (pageNumber - 1) * LIMIT_POST
    const query = isFollower ? 'followers' : 'following'
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
            params: { limit: LIMIT_POST, type: query, skip },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            if (isFollower) {
                setFollowList(prev => {
                    return [...new Set([...prev, ...res.data.result.followers])]
                })
                setHasMore(res.data.result.followers.length > 0)
            } else {
                setFollowList(prev => {
                    return [...new Set([...prev, ...res.data.result.following])]
                })
                setHasMore(res.data.result.following.length > 0)
            }
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [pageNumber])
    return { loading, error, followList, hasMore }
}

export default useFollowList;