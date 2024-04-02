'use client'
import { useRouter } from 'next/navigation';
import { memo, use, useCallback, useEffect, useRef, useState } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineRetweet } from 'react-icons/ai';
import { format, set } from 'date-fns';
import Avatar from '../Avatar';
import likeServices from '@/services/like.services';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import bookmarkServices from '@/services/bookmark.services';
import { Media, MediaType, TweetAudience, TweetType } from '@/constants/dataBody';
import Player from '../Player';
import Image from 'next/image';
import tweetServices, { TweetReqBody } from '@/services/twitter.service';
interface PostItemProps {
  data: dataProps;
  accessToken?: string;
  user?: any;
}

export interface dataProps {
  _id?: string;
  user_id?: string;
  content?: string;
  audience?: TweetAudience | number;
  media?: Media[];
  mention?: string[];
  parent_id?: string;
  hashtag?: string[];
  user_views?: number;
  guest_views?: number;
  tweet_circle?: string[];
  type?: number;
  createdAt?: string;
  updatedAt?: string;
  likes?: number;
  author?: {
    _id?: string;
    username?: string;
    name?: string;
    avatar?: string;
  };
  retweets?: number;
  comments?: number;
}

const PostItem: React.FC<PostItemProps> = ({ data, accessToken, user }) => {
  const router = useRouter();
  const [like, setLike] = useState(data.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmark, setBookmark] = useState(false);
  const [isRetweet, setIsRetweet] = useState(false);

  useEffect(() => {
    const fecthParent = async () => {
      try {
        return await tweetServices.getTweetById(accessToken, data.parent_id);
      } catch (error) {
        console.error('Error fetching parent tweet:', error);
      }
    }
    if (data.parent_id) {
      if (data.type === TweetType.Retweet) {
        setIsRetweet(true);
      }
      fecthParent().then((res) => {
        data = res?.result
      })
    }
    const fetchData = async () => {
      try {
        const [likeResponse, bookmarkResponse] = await Promise.all([
          likeServices.getLike(accessToken, data._id),
          bookmarkServices.getBookmark(accessToken, data._id)
        ]);
        if (likeResponse?.result.like) {
          setHasLiked(true);
        }
        if (bookmarkResponse?.result.bookmark) {
          setBookmark(true);
        }
      } catch (error) {
        console.error('Error fetching like and bookmark data:', error);
      }
    }
    if (accessToken) {
      fetchData()
    }
  }, [accessToken, data._id]);

  const goToUser = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/${data.author.username}`)
  }, [router, data.author?._id.toString()]);

  const goToPost = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/posts/${data._id}`);
  }, [router, data._id]);

  const onLike = useCallback(async (ev: any) => {
    ev.stopPropagation();
    if (!accessToken) {
      return router.push('/login')
    }
    if (hasLiked) {
      setHasLiked(false);
      if (like > 0) {
        setLike(like - 1);
        await likeServices.unlike(accessToken, data._id)
      }
    } else {
      setHasLiked(true);
      setLike(like + 1);
      await likeServices.like(accessToken, data._id)
    }
  }, [hasLiked, data._id, accessToken]);

  const onBookmark = useCallback(async (ev: any) => {
    ev.stopPropagation();
    if (!accessToken) {
      return router.push('/login')
    }
    if (hasBookmark) {
      setBookmark(false);
      await bookmarkServices.unbookmark(accessToken, data._id)
    } else {
      setBookmark(true);
      await bookmarkServices.bookmark(accessToken, data._id)
    }
  }, [hasBookmark, data._id, accessToken]);

  const onRetweet = useCallback(async (ev: any) => {
    ev.stopPropagation();
    if (!accessToken) {
      return router.push('/login')
    }
    try {
      const bodyRetweet: TweetReqBody = {
        audience: data.audience,
        content: '',
        media: [],
        mention: [],
        parent_id: data._id,
        hashtag: [],
        type: TweetType.Retweet,
        tweet_circle: data.tweet_circle
      }
      await tweetServices.postTweet(accessToken, bodyRetweet)
    } catch (error) {
      console.error('Error retweeting:', error);
    }
  }
    , [data._id, accessToken, isRetweet])

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart
  const BookmarkIcon = hasBookmark ? BsFillBookmarkFill : BsBookmark
  const isRetweetStyle = isRetweet ? 'pl-4' : '';
  return (
    <>
      <div
        className="
          border-b-[1px] 
          border-neutral-800 
          p-5 
          cursor-pointer 
          hover:bg-neutral-900 
          transition
        "
      >
        {isRetweet && user && <div className="flex flex-row items-center gap-2 border-b-[1px] 
          border-neutral-800 mb-2 pb-2">
          <Avatar username={user.username} avatarURL={user.avatar} isLarge={false} />
          <p
            onClick={goToUser}
            className="
                  text-white 
                  font-semibold 
                  cursor-pointer 
                  hover:underline
              ">
            {user.name}
          </p>
          <span
            onClick={goToUser}
            className="
                  text-neutral-500
                  cursor-pointer
                  hover:underline
                  hidden
                  md:block
              ">
            @{data.author.username}
          </span>
          <span className="text-neutral-500 text-sm">
            {format(new Date(data.createdAt), 'MMMM dd, yyyy')}
          </span>
        </div>}
        <div className={isRetweetStyle}>
          <div className="flex flex-row items-center gap-2">
            <Avatar username={data.author.username} avatarURL={data.author.avatar} isLarge={false} />
            <p
              onClick={goToUser}
              className="
                  text-white 
                  font-semibold 
                  cursor-pointer 
                  hover:underline
              ">
              {data.author.name}
            </p>
            <span
              onClick={goToUser}
              className="
                  text-neutral-500
                  cursor-pointer
                  hover:underline
                  hidden
                  md:block
              ">
              @{data.author.username}
            </span>
            <span className="text-neutral-500 text-sm">
              {format(new Date(data.createdAt), 'MMMM dd, yyyy')}
            </span>
          </div>
          <div className="text-white mt-1">
            {data.content}
          </div>
          <div className="grid grid-cols-4 gap-1 m-2">
            {data.media.map((mediaItem) => (
              <div key={mediaItem._id} className={mediaItem.type === MediaType.Video ? "col-span-4" : ""}>
                {mediaItem.type === MediaType.Video && (
                  <Player url={mediaItem.url} username={data.author.username} />
                )}
                {mediaItem.type === MediaType.Image && (
                  <div>
                    <dialog id={mediaItem._id} className="modal modal-bottom sm:modal-middle">
                      <div className="modal-box">
                        <img src={mediaItem.url} className='w-full' />
                        <div className="modal-action">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                    <Image src={mediaItem.url} alt={`Image from ${data.author.username}`} width={100} height={100} onClick={() => (document.getElementById(`${mediaItem._id}`) as HTMLDialogElement).showModal()} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              className="
                  flex 
                  flex-row 
                  items-center 
                  text-neutral-500 
                  gap-2 
                  cursor-pointer 
                  transition 
                  hover:text-sky-500"
              onClick={goToPost}
            >
              <AiOutlineMessage size={20} />
              <p>
                {data.comments || 0}
              </p>
            </div>
            <div
              onClick={onLike}
              className="
                  flex 
                  flex-row 
                  items-center 
                  text-neutral-500 
                  gap-2 
                  cursor-pointer 
                  transition 
                  hover:text-red-500
              ">
              <LikeIcon color={hasLiked ? 'red' : ''} size={20} />
              <p>
                {like}
              </p>
            </div>
            <div
              onClick={onBookmark}
              className="
                  flex 
                  flex-row 
                  items-center 
                  text-neutral-500 
                  gap-2 
                  cursor-pointer 
                  transition 
                  hover:text-blue-500
              ">
              <BookmarkIcon color={hasBookmark ? 'blue' : ''} size={20} />
            </div>
            {accessToken && <div
              onClick={onRetweet}
              className="
                  flex 
                  flex-row 
                  items-center 
                  text-neutral-500 
                  gap-2 
                  cursor-pointer 
                  transition 
                  hover:text-blue-500
              ">
              {!isRetweet && <AiOutlineRetweet size={20} />}
            </div>}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(PostItem);