'use client'
import { format } from 'date-fns';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { BiCalendar } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import useEditModal from '@/hooks/useEditModal';
import followServices from '@/services/follow.services';
import { useSession } from 'next-auth/react';
interface UserBioProps {
    _id: string
    username: string;
    name: string;
    bio: string;
    website?: string;
    location?: string;
    dateOfBirth: string;
    isCurrentUser?: boolean;
}
const UserBio: React.FC<UserBioProps> = ({ _id, bio, dateOfBirth, name, username, isCurrentUser }) => {
    const { data: session } = useSession();
    const editModal = useEditModal();
    const router = useRouter();
    const dob = useMemo(() => {
        if (!dateOfBirth) return;
        return format(new Date(dateOfBirth), 'MMMM dd, yyyy');
    }, [dateOfBirth]);
    const [hasFollowed, setFollowed] = useState(false);
    useEffect(() => {
        if (!session?.user?.accessToken) return;
        const fetchData = async () => {
            return await followServices.getFollow(session?.user?.accessToken, _id)

        }
        fetchData().then(res => {
            if (res?.result) {
                setFollowed(true);
            }
        })
    }, [])
    const onFollow = useCallback(async (ev: any) => {
        ev.stopPropagation();

        if (hasFollowed) {
            await followServices.unfollow(session?.user?.accessToken, _id)
            setFollowed(false);
        } else {
            await followServices.follow(session?.user?.accessToken, _id)
            setFollowed(true);
        }
    }, [hasFollowed]);
    const isFollowed = hasFollowed ? 'Unfollow' : 'Follow';
    return (
        <div className="border-b-2 border-neutral-200 pb-4 mt-4">
            <div className='flex justify-end p-2'>
                {isCurrentUser ? (
                    <Button secondary label="Edit" onClick={editModal.onOpen} />
                ) : (
                    <Button
                        onClick={onFollow}
                        label={isFollowed}
                        secondary={!hasFollowed}
                    />
                )}
            </div>
            <div className="mt-8 px-4">
                <div className="flex flex-col">
                    <p className="text-primary-content text-2xl font-semibold">
                        {name}
                    </p>
                    <p className="text-md text-neutral-500">
                        @{username}
                    </p>
                </div>
                <div className="flex flex-col mt-4">
                    <p className="text-primary-content">
                        {bio}
                    </p>
                    <div className="flex flex-row items-center gap-2 mt-4 text-neutral-500">
                        <BiCalendar size={24} />
                        <p>
                            Date of birth: {dob}
                        </p>
                    </div>
                </div>
                <div className="flex flex-row items-center mt-4 gap-6">
                    <div className="flex flex-row items-center gap-1">
                        {/* <p className="text-primary-content">{following}</p> */}
                        <p className="text-neutral-500">Following</p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        {/* <p className="text-primary-content">{followed}</p> */}
                        <p className="text-neutral-500">Followers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(UserBio);