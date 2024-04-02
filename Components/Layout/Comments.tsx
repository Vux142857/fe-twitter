'use client'
import { redirect } from 'next/navigation'
import { memo, useCallback, useEffect, useRef, useState } from "react"
import PostItem from "../Post/PostItem"
import useGetComments from '@/hooks/useGetComments'

const Comments = ({ user_id, accessToken, user }: { user_id: string, accessToken: string, user: any }) => {
  const [pageNumber, setPageNumber] = useState(1)
  const { loading, comments, error, hasMore } = useGetComments(pageNumber, user_id, accessToken)
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
  useEffect(() => {
    if (pageNumber > 8) {
      redirect('/')
    }
  }, [pageNumber]);

  return (
    <>
      {loading && (<span className="loading loading-ring loading-lg"></span>)}
      {comments.map((data, index) => {
        if (comments.length === index + 1) {
          return (
            <div key={index} ref={lastNewfeedsElementRef}><PostItem data={data} user={user} accessToken={accessToken} /></div>
          )
        } else {
          return (
            <div key={index}><PostItem data={data} user={user} accessToken={accessToken} /></div>
          )
        }
      })}
      <div>{error && 'Error'}</div>
    </>
  )
}

export default memo(Comments);