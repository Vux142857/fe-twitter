import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
const LIMIT_POST = 10

const useFollowingList = (pageNumber: number, user_id: string, accessToken: string) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [followings, setFollowings] = useState<any[]>([])
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
            params: { limit: LIMIT_POST, type: 'following', skip },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            if (res.data.result.followings.length > 0) {
                setFollowings(prev => {
                    return [...new Set([...prev, ...res.data.result.followings])]
                })
            }
            setHasMore(res.data.result?.totalFollowings > followings.length)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [pageNumber])
    return { loading, error, followings, hasMore }
}

export default useFollowingList;