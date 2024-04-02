/* eslint-disable @next/next/no-img-element */
'use client'
import { memo, useCallback, useEffect, useState } from "react";
import Input from "../Input";
import { EditBody } from "@/constants/dataBody";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import userServices from "@/services/user.services";
import mediaServices from "@/services/media.services";
import { BiTrash } from "react-icons/bi";
import MyModal from "./MyModal";
import useUserStore, { UserProfile } from "@/hooks/useMutateUser";
import { useRouter } from "next/navigation";

interface EditModalProps {
    user: UserProfile;
    accessToken: string;
}
const EditModal: React.FC<EditModalProps> = ({ user, accessToken }) => {
    const setUser = useUserStore(state => state.setUserProfile);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [dob, setDob] = useState(new Date());
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
    const router = useRouter();
    useEffect(() => {
        setName(user?.name)
        setUsername(user?.username)
        setBio(user?.bio)
        setDob(new Date(user?.date_of_birth))
        setLocation(user?.location)
        setWebsite(user?.website)
    }, [user?.name, user?.username, user?.bio, user?.date_of_birth, user?.location, user?.website]);
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);
            const profileImageData = new FormData()
            profileImageData.append('file', profileImage as Blob)
            const coverImageData = new FormData()
            coverImageData.append('file', coverImage as Blob)
            let avatarUrl = '';
            let coverUrl = '';
            if (profileImage) {
                const { data } = await mediaServices.uploadSingleImage(profileImageData, accessToken);
                avatarUrl = data?.url || '';
            }
            if (coverImage) {
                const { data } = await mediaServices.uploadSingleImage(coverImageData, accessToken);
                coverUrl = data?.url || '';
            }
            const editBody: EditBody = {
                name,
                username,
                bio,
                location,
                website,
                avatar: avatarUrl,
                cover_photo: coverUrl,
                date_of_birth: dob.toISOString()
            }
            await userServices.editProfile(editBody, accessToken);
            const res = await userServices.getMe(accessToken);
            if (res && res.result && res.result.user) {
                setUser(res.result.user)
            }
            router.refresh();
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }, [name, username, bio, location, website, profileImage, coverImage, dob, accessToken]);

    const handleRemoveImage = useCallback((name: string) => {
        if (name === 'profile') {
            setProfileImage(null);
        }
        if (name === 'coverImage') {
            setCoverImage(null);
        }
    }, [profileImage, coverImage])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            {!profileImage && (
                <>
                    <div className="label">
                        <span className="text-primary-content">CHOOSE PROFILE IMAGE:</span>
                    </div>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setProfileImage(e.target.files?.[0] || null);
                        }}
                    />
                </>
            )}
            {profileImage && (
                <div className="relative w-60 cursor-move break-inside-avoid">
                    <img src={URL.createObjectURL(profileImage)} alt="work" />
                    <button type="button" className="btn absolute right-0 top-0 p-1 hover:text-secondary-content 
                    rounded-none
                    text-xl" onClick={() => { handleRemoveImage('profile') }}>
                        <BiTrash />
                    </button>
                </div>
            )}
            {!coverImage && (
                <>
                    <div className="label">
                        <span className="text-primary-content">CHOOSE COVER IMAGE:</span>
                    </div>
                    <Input
                        type="file"
                        accept="image/*"
                        placeholder="Cover Image"
                        onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    />
                </>
            )}
            {coverImage && (
                <div className="relative w-60 cursor-move break-inside-avoid">
                    <img src={URL.createObjectURL(coverImage)} alt="work" />
                    <button type="button" className="btn absolute right-0 top-0 p-1 hover:text-secondary-content 
                    rounded-none
                    text-xl" onClick={() => { handleRemoveImage('coverImage') }}>
                        <BiTrash />
                    </button>
                </div>
            )}
            <Input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                disabled={isLoading}
            />
            <Input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                disabled={isLoading}
            />
            <Input
                placeholder="Bio"
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                disabled={isLoading}
            />
            <Input
                placeholder="Location"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                disabled={isLoading}
            />
            <Input
                placeholder="Website"
                onChange={(e) => setWebsite(e.target.value)}
                value={website}
                disabled={isLoading}
            />
            <DatePicker selected={dob} onChange={(date) => setDob(date || dob)}
                className="p-3 text-white transition bg-primary-content border-2 rounded-md outline-none w-fulltext-lg border-neutral-800 focus:border-secondary focus:border-2 disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed" />
        </div>
    )

    return (
        <MyModal
            disabled={isLoading}
            title="Edit your profile"
            actionLabel="Save"
            onSubmit={onSubmit}
            body={bodyContent}
        />
    );
}

export default memo(EditModal);