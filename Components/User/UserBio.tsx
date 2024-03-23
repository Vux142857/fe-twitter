'use client'
import { format } from 'date-fns';
import { useMemo } from 'react';
import { BiCalendar } from 'react-icons/bi';
import Button from '../Button';
import useEditModal from '@/hooks/useEditModal';
interface UserBioProps {
    username: string;
    name: string;
    bio: string;
    website?: string;
    location?: string;
    dateOfBirth: string;
    followed: number;
    following: number;
    isCurrentUser?: boolean;
}
const UserBio: React.FC<UserBioProps> = ({ bio, dateOfBirth, name, username, followed, following, isCurrentUser }) => {
    const editModal = useEditModal();
    const dob = useMemo(() => {
        if (!dateOfBirth) return;
        return format(new Date(dateOfBirth), 'MMMM dd, yyyy');
    }, [dateOfBirth]);
    return (
        <div className="border-b-2 border-neutral-200 pb-4 mt-4">
            <div className='flex justify-end p-2'>
                {isCurrentUser ? (
                    <Button secondary label="Edit" onClick={editModal.onOpen} />
                ) : (
                    <Button
                        onClick={() => { }}
                        label={'Follow'}
                        secondary
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
                        <p className="text-primary-content">{following}</p>
                        <p className="text-neutral-500">Following</p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <p className="text-primary-content">{followed}</p>
                        <p className="text-neutral-500">Followers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserBio;