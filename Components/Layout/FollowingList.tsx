'use client'
import { memo, useCallback, useRef, useState } from "react";
import MyModal from "@/Components/Modals/MyModal";
import useFollowingList from "@/hooks/useGetFollowing";

interface FollowingListProps {
  user_id: string;
  accessToken: string;
}

const FollowingList: React.FC<FollowingListProps> = ({ user_id, accessToken }) => {
  const [pageNumber, setPageNumber] = useState(1)
  const title = "Followings"
  const { loading, followings, error, hasMore } = useFollowingList(pageNumber, user_id, accessToken)
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
            {followings.map((follower, index) => {
              if (followings.length === index + 1) {
                return (
                  <div key={index} ref={lastNewfeedsElementRef} className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-bold">{follower.following_user.name}</span>
                      <span className="text-gray-500">@{follower.following_user.username}</span>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-bold">{follower.following_user.name}</span>
                      <span className="text-gray-500">@{follower.following_user.username}</span>
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

export default memo(FollowingList);