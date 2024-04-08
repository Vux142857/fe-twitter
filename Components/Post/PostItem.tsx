'use client'
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineRetweet } from 'react-icons/ai';
import { format } from 'date-fns';
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
  inPost?: boolean;
}

export interface dataProps {
  _id: string;
  user_id: string;
  content: string;
  audience: TweetAudience | number;
  media: Media[];
  mention: string[];
  parent_id: string;
  hashtag: string[];
  user_views: number;
  guest_views: number;
  tweet_circle: string[];
  type: number;
  createdAt: string;
  updatedAt: string;
  likes: number;
  author: {
    _id: string;
    username: string;
    name: string;
    avatar: string;
  };
  retweets: number;
  comments: number;
}

const PostItem: React.FC<PostItemProps> = ({ data, accessToken, user, inPost }) => {
  const router = useRouter();
  const [like, setLike] = useState(data.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmark, setBookmark] = useState(false);
  const [isRetweet, setIsRetweet] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [tweet, setTweet] = useState<dataProps>(data);
  const createdAt = useMemo(() => {
    if (!data.createdAt) return;
    return format(new Date(data.createdAt), 'MMMM dd, yyyy');
  }, [data._id]);

  const commentValue = useMemo(() => {
    if (data.type === TweetType.Comment) {
      return data.content;
    }
  }, [data._id]);

  useEffect(() => {
    if (data.parent_id) {
      if (data.type === TweetType.Retweet || (data.type === TweetType.Comment && inPost === false)) {
        if (data.type === TweetType.Retweet) {
          setIsRetweet(true);
        }
        if (data.type === TweetType.Comment) {
          setIsComment(true);
        }
        const fetchParent = async () => {
          try {
            return await tweetServices.getTweetById(accessToken, data.parent_id);
          } catch (error) {
            console.error('Error fetching parent tweet:', error);
          }
        }
        fetchParent().then((res) => {
          setTweet(res?.result);
        })
      }
      if (data.type === TweetType.Comment) {
        setIsComment(true);
      }
    }
    const fetchReact = async () => {
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
      fetchReact()
    }
  }, [accessToken, data._id]);

  // const fetchParent = useCallback(
  //   , [accessToken, data.parent_id]
  // )

  const goToUser = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/${tweet?.author?.username}`)
  }, [router, tweet?.author?._id.toString()]);

  const goToPost = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/post/${tweet._id}`);
  }, [router, tweet?._id]);

  const onLike = useCallback(async (ev: any) => {
    ev.stopPropagation();
    if (!accessToken) {
      return router.push('/login')
    }
    if (hasLiked) {
      setHasLiked(false);
      if (like > 0) {
        setLike(like - 1);
        await likeServices.unlike(accessToken, tweet?._id)
      }
    } else {
      setHasLiked(true);
      setLike(like + 1);
      await likeServices.like(accessToken, tweet?._id)
    }
  }, [hasLiked, tweet?._id, accessToken]);

  const onBookmark = useCallback(async (ev: any) => {
    ev.stopPropagation();
    if (!accessToken) {
      return router.push('/login')
    }
    if (hasBookmark) {
      setBookmark(false);
      await bookmarkServices.unbookmark(accessToken, tweet._id)
    } else {
      setBookmark(true);
      await bookmarkServices.bookmark(accessToken, tweet._id)
    }
  }, [hasBookmark, tweet?._id, accessToken]);

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
  const isRetweetStyle = (isRetweet || isComment) ? 'pl-4' : '';
  return (
    <>
      <div
        className="
          border-b-[1px] 
          p-5
          cursor-pointer 
          hover:bg-secondary
          transition
        "
      >
        {(isRetweet || isComment) && user && !inPost && <div className="flex flex-col border-b-[1px] 
          border-neutral-800 mb-2 pb-2">
          <div className='flex flex-row items-center gap-2'>
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
              @{user.username}
            </span>
            <span className="text-neutral-500 text-sm">
              {createdAt}
            </span>
          </div>
          {isComment && !inPost && <div className="text-white p-4">{commentValue}</div>}
        </div>}
        <div className={isRetweetStyle}>
          <div className="flex flex-row items-center gap-2">
            <Avatar username={tweet?.author?.username} avatarURL={tweet?.author?.avatar} isLarge={false} />
            <p
              onClick={goToUser}
              className="
                  text-white 
                  font-semibold 
                  cursor-pointer 
                  hover:underline
              ">
              {tweet?.author?.name}
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
              @{tweet?.author?.username}
            </span>
            <span className="text-neutral-500 text-sm">
              {createdAt}
            </span>
          </div>
          <div className="text-white mt-1" onClick={goToPost}>
            {tweet?.content}
          </div>
          <div className="grid grid-cols-4 gap-1 m-2">
            {tweet && tweet?.media && tweet.media.map((mediaItem) => (
              <div key={mediaItem._id} className={mediaItem.type === MediaType.Video ? "col-span-4" : ""}>
                {mediaItem.type === MediaType.Video && (
                  <Player url={mediaItem.url} username={tweet?.author?.username} />
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
                    <Image src={mediaItem.url} alt={`Image from ${tweet?.author?.username}`} width={100} height={100} onClick={() => (document.getElementById(`${mediaItem._id}`) as HTMLDialogElement).showModal()} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-row items-center mt-3 gap-10">
            {!isComment && <div
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
            </div>}
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
            {!isRetweet && accessToken && <div
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
              <AiOutlineRetweet size={20} />
            </div>}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(PostItem);