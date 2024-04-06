'use client'
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import Avatar from '../Avatar';

export interface BookmarkItem {
    tweet: {
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
    },
    author: {
        _id: string,
        name: string,
        email: string,
        username: string,
        avatar: string
    }
}

const PostItem: React.FC<BookmarkItem> = ({ tweet, author }) => {
    const router = useRouter();
    const goToUser = useCallback((ev: any) => {
        ev.stopPropagation();
        router.push(`/${author.username}`)
    }, [router, author?._id.toString()]);

    const goToPost = useCallback(() => {
        router.push(`/post/${tweet._id}`);
    }, [router, tweet._id]);

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
            <Avatar username={author.username} avatarURL={author.avatar} isLarge={false} />
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
                            {author.name}
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
                            @{author.username}
                        </span>
                        <span className="text-neutral-500 text-sm">
                            {format(new Date(tweet.createdAt), 'MMMM dd, yyyy')}
                        </span>
                    </div>
                    <div className="text-white mt-1">
                        {tweet.content}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(PostItem);