'use client'
import { memo, useCallback, useRef, useState } from "react"
import BookmarkItem from '../Post/BookmarkItem'
import useGetNotification from "@/hooks/useGetNotifications"
import NotificationItem from "../Post/NotificationItem"

const NotificationList = ({ accessToken }: { accessToken: string }) => {
  const [pageNumber, setPageNumber] = useState(1)
  const { loading, notitications, hasMore } = useGetNotification(pageNumber, accessToken)
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
      {loading && (<div className="flex flex-row justify-center items-center"><span className="loading loading-ring loading-lg"></span></div>)}
      {notitications.map((data, index) => {
        if (notitications.length === index + 1) {
          return (
            <div key={index} ref={lastNewfeedsElementRef}>
              <NotificationItem notification={data} />
            </div>
          )
        } else {
          return (
            <div key={index}><NotificationItem notification={data} /></div>
          )
        }
      })}
    </>
  )
}

export default memo(NotificationList);