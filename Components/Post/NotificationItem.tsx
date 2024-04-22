'use client'
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import Avatar from '../Avatar';
import { ActionNotify } from '@/constants/dataBody';

export interface NotificationItem {
    _id: string
    from: string // username of sender
    to: string
    action: ActionNotify
    link: string
    created_at?: Date
    updated_at?: Date
}

const PostItem: React.FC<NotificationItem> = (notification: NotificationItem) => {
    const router = useRouter();
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
        hover:bg-neutral-900 
        transition
        hover:text-primary text-secondary
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