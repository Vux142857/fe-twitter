'use client'
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { format } from 'date-fns';

// import useLike from '@/hooks/useLike';

import Avatar from '../Avatar';
import { useSession } from 'next-auth/react';
interface PostItemProps {
    data: dataProps;
}

export interface dataProps {
    _id?: string;
    user_id?: string;
    content?: string;
    media?: string[];
    mention?: string[];
    parent_id?: string;
    hashtag?: string[];
    user_views?: number;
    guest_views?: number;
    tweet_circle?: string[];
    type?: number;
    createdAt?: string;
    updatedAt?: string;
    bookmarks?: number;
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

const PostItem: React.FC<PostItemProps> = ({ data }) => {
    const router = useRouter();
    const currentUser = useSession().data?.user;
    const [hasLiked, setHasLiked] = useState(false);
    // const { hasLiked, toggleLike } = useLike({ postId: data.id, currentUser?.id });
    // const { hasLiked, toggleLike } = { hasLiked: false, toggleLike: () => { } };
    useEffect(() => {
        if (currentUser) {
            
            setHasLiked(true);
        }
    },[])
    const goToUser = useCallback((ev: any) => {
        ev.stopPropagation();
        router.push(`/users/${data.author.username}`)
    }, [router, data.author?._id.toString()]);

    const goToPost = useCallback(() => {
        router.push(`/posts/${data._id}`);
    }, [router, data._id]);

    const onLike = useCallback(async (ev: any) => {
        ev.stopPropagation();

        if (!currentUser) {
            return router.push('/login')
        }

        toggleLike();
    }, [toggleLike]);

    // const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
    const LikeIcon = AiFillHeart
    console.log(data.author.avatar)
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
            <Avatar username={data.author.username} avatarURL={data.author.avatar} isLarge={false} />
            <div className="flex flex-row items-start gap-3">
                <div>
                    <div className="flex flex-row items-center gap-2">
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
                                {/* {data.comments?.length || 0} */}
                            </p>
                        </div>
                        <div
                            // onClick={onLike}
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
                            {/* <LikeIcon color={hasLiked ? 'red' : ''} size={20} /> */}
                            <LikeIcon color={'red'} size={20} />
                            <p>
                                {data.likes}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostItem;