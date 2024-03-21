'use client'
import useNewfeeds from "@/hooks/useGetNewfeeds"
import { useRouter } from "next/navigation"
import { use, useCallback, useEffect, useRef, useState } from "react"

const Newfeeds = () => {
  const router = useRouter()
  const [pageNumber, setPageNumber] = useState(1)
  const { loading, newfeeds, error, hasMore } = useNewfeeds(pageNumber)
  const observer = useRef<IntersectionObserver | undefined>()
  const lastNewfeedsElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])
  useEffect(() => {
    if (pageNumber === 10) {
      router.push('/')
    }
  }, [pageNumber])
  return (
    <>
      {newfeeds.map((post, index) => {
        if (newfeeds.length === index + 1) {
          return <div ref={lastNewfeedsElementRef} key={post}>{post}</div>
        } else {
          return <div key={post}>{post}</div>
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  )
}

export default Newfeeds;