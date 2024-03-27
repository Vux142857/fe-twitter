'use client'
import { redirect } from 'next/navigation'
import { memo, useCallback, useEffect, useRef, useState } from "react"
import PostItem from "../Post/PostItem"
import useMessages from "@/hooks/useGetMessages"

interface MessageListProps {
  page: number
  conversation_id: string
}
const MessagesList: React.FC<MessageListProps> = ({ page, conversation_id }) => {
  const [pageNumber, setPageNumber] = useState(1)
  const { loading, messages, error, hasMore } = useMessages(page, conversation_id)
  const observer = useRef<IntersectionObserver | undefined>()
  const lastNewfeedsElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setTimeout(() => {
          setPageNumber((prevPageNumber) => prevPageNumber + 1)
        }, 2000)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  return (
    <>
      <div>{loading && 'Loading...'}</div>
      {messages.map((data, index) => {
        if (index === -1) {
          return (
            <div key={index} ref={lastNewfeedsElementRef}><PostItem data={data} /></div>
          )
        } else {
          return (
            <div key={index}><PostItem data={data} /></div>
          )
        }
      })}
      <div>{error && 'Error'}</div>
    </>
  )
}

export default memo(MessagesList);