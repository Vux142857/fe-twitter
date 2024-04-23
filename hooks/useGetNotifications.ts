import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
const LIMIT_POST = 10

const useGetNotification = (pageNumber: number, accessToken: string) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [notitications, setNotification] = useState<any[]>([])
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
            url: process.env.WORKER + `/notitication`,
            params: { limit: LIMIT_POST, skip },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            console.log(res.data.result)
            if (res.data.result.length > 0) {
                setNotification(prev => {
                    return [...new Set([...prev, ...res?.data?.result])]
                })
            }
            console.log(notitications)
            setHasMore(res?.data?.result?.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [pageNumber])
    return { loading, error, notitications, hasMore }
}

export default useGetNotification;