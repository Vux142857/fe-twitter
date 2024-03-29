'use client'
import { redirect } from 'next/navigation'
import { memo, useCallback, useLayoutEffect, useRef, useState } from "react"
import useGetBookmarksList from '@/hooks/useGetBookmarksList'
import BookmarkItem from '../Post/BookmarkItem'

const BookmarkList = ({ accessToken }: { accessToken: string }) => {
  const [pageNumber, setPageNumber] = useState(1)
  const { loading, bookmarks, error, hasMore } = useGetBookmarksList(pageNumber, accessToken)
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
  useLayoutEffect(() => {
    if (pageNumber > 8) {
      redirect('/')
    }
  }, [pageNumber]);

  return (
    <>
      <div>{loading && 'Loading...'}</div>
      {bookmarks.map((data, index) => {
        if (bookmarks.length === index + 1) {
          return (
            <div key={index} ref={lastNewfeedsElementRef}><BookmarkItem tweet={data.tweet} author={data.author} /></div>
          )
        } else {
          return (
            <div key={index}><BookmarkItem tweet={data.tweet} author={data.author} /></div>
          )
        }
      })}
      <div>{error && 'Error'}</div>
    </>
  )
}

export default memo(BookmarkList);