import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
const LIMIT_MESSAGES = 10

const useMessages = (pageNumber: number, conversation_id: string, accessToken: string) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [messages, setMessages] = useState<any[]>([])
    const [hasMore, setHasMore] = useState(false)
    const skip = (pageNumber - 1) * LIMIT_MESSAGES
    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel: Canceler
        axios({
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            url: process.env.SERVER + "/message/" + conversation_id,
            params: { limit: LIMIT_MESSAGES, skip },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setMessages(prev => {
                return [...new Set([...res.data.result.messages, ...prev])]
            })
            setHasMore(res.data.result.totalPage > pageNumber)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [pageNumber])
    return { loading, error, messages, hasMore }
}

export default useMessages;