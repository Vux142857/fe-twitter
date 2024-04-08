import { SearchFilterQuery } from "@/constants/dataBody";
import useUserStore from "@/hooks/useMutateUser";
import useSearch from "@/hooks/useSearch";
import { memo, use, useCallback, useEffect, useRef, useState } from "react";
import PostItem from "../Post/PostItem";
import Avatar from "../Avatar";
import Link from "next/link";

const SearchResults = ({ searchValue, accessToken, filter }) => {
  const [pageNumber, setPageNumber] = useState(1)
  const { loading, searchResults, error, hasMore } = useSearch(pageNumber, searchValue, accessToken, filter)
  const observer = useRef<IntersectionObserver | undefined>()
  const user = useUserStore((state: any) => state.userProfile);
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
    setPageNumber(1)
  }, [filter])
  return (
    <div className="mt-2">
      {loading && (<div className="flex flex-row justify-center items-center"><span className="loading loading-ring loading-lg"></span></div>)}
      {filter !== SearchFilterQuery.User && searchResults.length > 0 && searchResults.map((data, index) => {
        if (searchResults.length === index + 1) {
          return (
            <div key={index} ref={lastNewfeedsElementRef}><PostItem data={data} user={user} accessToken={accessToken} inPost={false} /></div>
          )
        } else {
          return (
            <div key={index}><PostItem data={data} user={user} accessToken={accessToken} inPost={false} /></div>
          )
        }
      })}
      {filter === SearchFilterQuery.User && searchResults.length > 0 && searchResults.map((data, index) => {
        if (searchResults.length === index + 1) {
          return (
            <div
              key={index}
              ref={lastNewfeedsElementRef}
              className="
        border-b-[1px] 
        p-5
        cursor-pointer 
        hover:bg-secondary
        transition
      "
            >
              <div >
                <div className="flex flex-row items-center gap-2">
                  <Avatar username={data.username} avatarURL={data.avatar} isLarge={false} />
                  <Link
                    href={`/${data.username}`}
                    className="
                text-white 
                font-semibold 
                cursor-pointer 
                hover:underline
            ">
                    {data.name}
                  </Link>
                  <Link
                    href={`/${data.username}`}
                    className="
                text-neutral-500
                cursor-pointer
                hover:underline
                hidden
                md:block
            ">
                    @{data.username}
                  </Link>

                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div
              key={index}
              className="
          border-b-[1px] 
          p-5
          cursor-pointer 
          hover:bg-secondary
          transition
        "
            >
              <div >
                <div className="flex flex-row items-center gap-2">
                  <Avatar username={data.username} avatarURL={data.avatar} isLarge={false} />
                  <Link
                    href={`/${data.username}`}
                    className="
                  text-white 
                  font-semibold 
                  cursor-pointer 
                  hover:underline
              ">
                    {data.name}
                  </Link>
                  <Link
                    href={`/${data.username}`}
                    className="
                  text-neutral-500
                  cursor-pointer
                  hover:underline
                  hidden
                  md:block
              ">
                    @{data.username}
                  </Link>

                </div>
              </div>
            </div>
          )
        }
      })}
    </div>
  );
}

export default memo(SearchResults);