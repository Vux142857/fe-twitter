'use client'
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { format } from 'date-fns';
import Avatar from '../../Components/Avatar';
import likeServices from '@/services/like.services';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import bookmarkServices from '@/services/bookmark.services';
import { MediaType } from '@/constants/dataBody';
interface PostItemProps {
  data: dataProps;
  accessToken?: string;
}

export interface dataProps {
  _id?: string;
  user_id?: string;
  content?: string;
  media?: any[];
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

const mock = {
  data: {
    _id: "65e164adcc7876c59414c436",
    user_id: "65cb7e5e5ba9399f3019fa9f",
    audience: 1,
    content: "Hello world",
    media: [
      {
        url: "http://localhost:3000/static/video/5be0db99-9e75-487c-adec-eb91fab29d24.mp4",
        type: 1,
        status: 1,
        _id: "660afe3cd26c52535acfb102"
      }
    ],
    mention: [
      "someone"
    ],
    parent_id: null,
    hashtag: [
      "111",
      "2222",
      "2333",
      "222"
    ],
    user_views: 90,
    guest_views: 0,
    tweet_circle: [],
    type: 0,
    createdAt: "2024-03-01T05:16:29.916Z",
    updatedAt: "2024-04-01T16:57:29.791Z",
    likes: 0,
    author: {
      _id: "65cb7e5e5ba9399f3019fa9f",
      name: "Vux",
      username: "vu7a1",
      avatar: "https://mytweets-bucket.s3.ap-southeast-1.amazonaws.com/images/259eb957878a6911628ec6100.jpg"
    },
    retweets: 0,
    comments: 0
  },
  accessToken: "qweqweqweqweqweqwe"
}

const PostItem: React.FC<PostItemProps> = (mockData) => {
  const router = useRouter();
  mockData = mock
  const data = mock.data;
  const accessToken = mock.accessToken;
  const [like, setLike] = useState(data.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmark, setBookmark] = useState(false);
  useEffect(() => {
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

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart
  const BookmarkIcon = hasBookmark ? BsFillBookmarkFill : BsBookmark
  return (
    <div
      onClick={goToPost}
      className="
        border-b-[1px] 
        border-neutral-800 
        p-5 
        cursor-pointer 
        hover:bg-neutral-900 
        transition
      "
    >
      <div className="flex flex-row items-start gap-3">
        <div>
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
          <div className="flex flex-col mt-3">
            {data.media.map((mediaItem) => (
              <div key={mediaItem._id} className="flex flex-col items-center gap-2">
                {/* Conditionally render media based on type */}
                {mediaItem.type === MediaType.Video && (
                  <video src={mediaItem.url} controls autoPlay />
                )}
                {mediaItem.type === MediaType.Image && (
                  <img src={mediaItem.url} alt={`Image from ${data.author.username}`} />
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
                hover:text-sky-500">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(PostItem);