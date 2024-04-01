/* eslint-disable @next/next/no-img-element */
'use client'
import { memo, use, useCallback, useEffect, useRef, useState } from "react";
import MyModal from "@/Components/Modals/MyModal";
import Button from "@/Components/Button";
import { useMentionStore, useTweetCircleStore } from "@/hooks/useChosenList";
import useFollowList from "@/hooks/useGetFollowList";

interface SelectUserProps {
  isLoading: boolean;
  user_id: string;
  accessToken: string;
  isTweetCirle: boolean;
}

const SelectUser: React.FC<SelectUserProps> = ({ isLoading, user_id, accessToken, isTweetCirle }) => {
  const [chosenList, setChosenList] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(1)
  const isFollower = true
  const useChosenList = isTweetCirle ? useTweetCircleStore((state) => state.setTweetCircle) : useMentionStore((state) => state.setMention)

  const { loading, followList, error, hasMore } = useFollowList(pageNumber, user_id, accessToken, isFollower)
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

  const onSubmit = useCallback(() => {
    useChosenList(chosenList.map((user) => user._id))
  }, [chosenList]);

  const removeUser = useCallback((_id: string) => {
    setChosenList(chosenList.filter((user: any) => user._id !== _id));
  }, [chosenList])

  const addUser = useCallback((follower: any) => {
    if (chosenList.find((user: any) => user._id === follower._id)) {
      return;
    }
    setChosenList([...chosenList, follower]);
  }, [chosenList])

  const title = isTweetCirle ? 'Tweet circle' : 'Mention'
  const action = isTweetCirle ? 'Save Twitter circle' : 'Save Mention'

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <h4 className="mb-4 text-2xl font-bold">Followers</h4>
        <div className='h-80 overflow-y-auto'>
          <div className="flex flex-col gap-4">
            {followList.map((follower, index) => {
              if (followList.length === index + 1) {
                return (
                  <div key={index} ref={lastNewfeedsElementRef} className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-bold">{follower.follower_user.name}</span>
                      <span className="text-gray-500">@{follower.follower_user.username}</span>
                    </div>
                    <div className="flex flex-col">
                      <Button label="Add" onClick={() => addUser(follower.follower_user)} />
                    </div>
                  </div>
                )
              } else {
                return (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-bold">{follower.follower_user.name}</span>
                      <span className="text-gray-500">@{follower.follower_user.username}</span>
                    </div>
                    <div className="flex flex-col">
                      <Button label="Add" onClick={() => addUser(follower.follower_user)} />
                    </div>
                  </div>
                )
              }
            })}
          </div>
          <div>{error && 'Error'}</div>
        </div>
      </div>
      <div >
        <h4 className="mb-4 text-2xl font-bold">Chosen</h4>
        <div className='h-80 overflow-y-auto'>
          <div className="flex flex-col gap-4">
            {chosenList.map((follower, index) => (
              <div key={index} className="flex items-center gap-2 justify-between flex-r">
                <div className="flex flex-col">
                  <span className="font-bold">{follower.name}</span>
                  <span className="text-gray-500">@{follower.username}</span>
                </div>
                <div className="flex flex-row">
                  <Button label="Delete" onClick={() => removeUser(follower._id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <MyModal
      disabled={isLoading}
      title={title}
      actionLabel={action}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
}

export default memo(SelectUser);