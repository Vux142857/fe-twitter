'use client'
import { redirect, useRouter } from 'next/navigation'
import { memo, useCallback, useEffect, useRef, useState } from "react"
import PostItem from "../Post/PostItem"
import useGetTweetsByUser from "@/hooks/useGetTweetsByUser"

const TweetsByUser = ({ user_id, accessToken, user }: { user_id: string, accessToken: string, user: any }) => {
  const router = useRouter()
  const [pageNumber, setPageNumber] = useState(1)
  const { loading, newfeeds, error, hasMore } = useGetTweetsByUser(pageNumber, user_id, accessToken)
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
      {loading && (<span className="loading loading-ring loading-lg"></span>)}
      {newfeeds.map((data, index) => {
        if (newfeeds.length === index + 1) {
          return (
            <div key={index} ref={lastNewfeedsElementRef}><PostItem data={data} user={user} accessToken={accessToken} inPost={false} /></div>
          )
        } else {
          return (
            <div key={index}><PostItem data={data} user={user} accessToken={accessToken} inPost={false} /></div>
          )
        }
      })}
      <div>{error && 'Error'}</div>
    </>
  )
}

export default memo(TweetsByUser);