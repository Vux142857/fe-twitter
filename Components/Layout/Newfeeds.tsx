'use client'
import useNewfeeds from "@/hooks/useGetNewfeeds"
import { redirect } from 'next/navigation'
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import PostItem from "../Post/PostItem"
import { useSession } from "next-auth/react"
import useUserStore from "@/hooks/useMutateUser"

const Newfeeds = () => {
  const { data: session } = useSession()
  const [accessToken, setAccessToken] = useState('')
  const currentUser = useUserStore(state => state.userProfile)
  const [pageNumber, setPageNumber] = useState(1)
  useEffect(() => {
    if (session) {
      setAccessToken(session.user.accessToken)
    }
  }, [session])
  const { loading, newfeeds, error, hasMore } = useNewfeeds(pageNumber)
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
      {loading && (<span className="loading loading-ring loading-lg"></span>)}
      {newfeeds.map((data, index) => {
        if (newfeeds.length === index + 1) {
          return (
            <div key={index} ref={lastNewfeedsElementRef}><PostItem data={data} accessToken={accessToken} user={currentUser} /></div>
          )
        } else {
          return (
            <div key={index}><PostItem data={data} accessToken={accessToken} user={currentUser} /></div>
          )
        }
      })}
      <div>{error && 'Error'}</div>
    </>
  )
}

export default memo(Newfeeds);