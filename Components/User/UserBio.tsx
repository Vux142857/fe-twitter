'use client'
import { format } from 'date-fns';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { BiCalendar } from 'react-icons/bi';
import Button from '../Button';
import followServices from '@/services/follow.services';
import EditModal from '../Modals/EditModal';
import { UserProfile } from '@/hooks/useMutateUser';
interface UserBioProps {
    profile: UserProfile
    isCurrentUser?: boolean
    accessToken: string
}
const UserBio: React.FC<UserBioProps> = ({ profile, isCurrentUser, accessToken }) => {
    const dob = useMemo(() => {
        if (!profile.date_of_birth) return;
        return format(new Date(profile.date_of_birth), 'MMMM dd, yyyy');
    }, [profile.date_of_birth]);
    const [hasFollowed, setFollowed] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            return await followServices.getFollow(accessToken, profile._id)
        }
        fetchData().then(res => {
            if (res?.result) {
                setFollowed(true);
            }
        })
    }, [accessToken])
    const onFollow = useCallback(async (ev: any) => {
        ev.stopPropagation();
        if (hasFollowed) {
            await followServices.unfollow(accessToken, profile._id)
            setFollowed(false);
        } else {
            await followServices.follow(accessToken, profile._id)
            setFollowed(true);
        }
    }, [hasFollowed, accessToken, profile._id]);
    const isFollowed = hasFollowed ? 'Unfollow' : 'Follow';
    return (
        <div className="border-b-2 border-neutral-200 pb-4 mt-4">
            <div className='flex justify-end p-2'>
                {isCurrentUser ? (
                    <EditModal accessToken={accessToken} user={profile} />
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
                        {profile.name}
                    </p>
                    <p className="text-md text-neutral-500">
                        @{profile.username}
                    </p>
                </div>
                <div className="flex flex-col mt-4">
                    <p className="text-primary-content">
                        {profile.bio}
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
                        <p className="text-primary-content">{profile.following}</p>
                        <p className="text-neutral-500">Following</p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <p className="text-primary-content">{profile.followers}</p>
                        <p className="text-neutral-500">Followers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(UserBio);