import { TweetType } from "@/constants/dataBody";
import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
const LIMIT_POST = 4

const useGetComments = (pageNumber: number, user_id: string, accessToken: string) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [comments, setComments] = useState<any[]>([])
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
            url: process.env.SERVER + `/tweet/${user_id}/children`,
            params: { limit: LIMIT_POST, type: TweetType.Comment, skip },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setComments(prev => {
                return [...new Set([...prev, ...res.data.result.tweetsChildren])]
            })
            console.log(res.data.result)
            setHasMore(res.data.result.tweetsChildren.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [pageNumber])
    return { loading, error, comments, hasMore }
}

export default useGetComments;