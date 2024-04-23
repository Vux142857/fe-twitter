'use client'
import { useRouter } from 'next/navigation';
import { memo, use, useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import Avatar from '../Avatar';
import { ActionNotify } from '@/constants/dataBody';
import Link from 'next/link';

export interface NotificationItem {
    _id: string
    from: string // username of sender
    to: string
    action: ActionNotify
    link: string
    created_at?: Date
    updated_at?: Date
}

const PostItem = ({ notification }: { notification: NotificationItem }) => {
    const [msg, setMsg] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        if (notification.action == ActionNotify.MESSAGE) {
            setMsg(<Link href={notification.link}> has send message to you!</Link>)
        } else if (notification.action == ActionNotify.TWEET) {
            setMsg(<Link href={notification.link}> has created new tweet!</Link>)
        } else if (notification.action == ActionNotify.FOLLOW) {
            setMsg(<Link href={notification.link}> has followed you!</Link>)
        } else {
            setMsg(<Link href={notification.link}> has {notification.action}d your tweet!</Link>)
        }
    }, [notification._id.toString()])

    const goToUser = useCallback((ev: any) => {
        ev.stopPropagation();
        router.push(`/${notification.from}`)
    }, [router, notification?._id.toString()]);

    const goToPost = useCallback(() => {
        router.push(`${notification.link}`);
    }, [router, notification._id]);

    return (
        <div
            onClick={goToPost}
            className="
        border-b-[1px] 
        border-neutral-800 
        p-5 
        cursor-pointer 
        transition
        hover:text-secondary-content
        hover:bg-secondary
        text-primary-content
      "
        >
            <div className="flex flex-row items-start gap-3 ">
                <div>
                    <div className="flex flex-row items-center gap-2">
                        <span
                            onClick={goToUser}
                            className="
                text-neutral-500
                cursor-pointer
                hover:underline
                hidden
                md:block
            ">
                            @{notification.from}
                        </span>
                        {msg}
                        <span className="text-neutral-500 text-sm">
                            {format(new Date(notification.created_at), 'MMMM dd, yyyy')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(PostItem);