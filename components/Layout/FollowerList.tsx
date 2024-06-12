'use client'
import { memo, useCallback, useRef, useState } from "react";
import MyModal from "../Modals/MyModal";
import useFollowerList from "@/hooks/useGetFollowerList";
import Link from "next/link";

interface FollowerListProps {
  user_id: string;
  accessToken: string;
}

const FollowerList: React.FC<FollowerListProps> = ({ user_id, accessToken }) => {
  const [pageNumber, setPageNumber] = useState(1)
  const title = "Followers"
  const { loading, followers, error, hasMore } = useFollowerList(pageNumber, user_id, accessToken)
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

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <div className='overflow-y-auto'>
          <div className="flex flex-col gap-4">
            {followers.map((follower, index) => {
              if (followers.length === index + 1) {
                return (
                  <div key={index} ref={lastNewfeedsElementRef} className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-bold">{follower.follower_user.name}</span>
                      <Link href={`/${follower.follower_user.username}`} className="text-gray-500">@{follower.follower_user.username}</Link>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-bold">{follower.follower_user.name}</span>
                      <Link href={`/${follower.follower_user.username}`} className="text-gray-500">@{follower.follower_user.username}</Link>
                    </div>
                  </div>
                )
              }
            })}
          </div>
          <div>{error && 'Error'}</div>
        </div>
      </div>
    </div>
  )

  return (
    <MyModal
      title={title}
      body={bodyContent}
    />
  );
}

export default memo(FollowerList);