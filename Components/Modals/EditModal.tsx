'use client'
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useEditModal from "@/hooks/useEditModal";
import Input from "../Input";
import Modal from "../Modals/Modal";
import { EditBody, UserData } from "@/constants/dataBody";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import userServices from "@/services/user.services";
import mediaServices from "@/services/media.services";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";

interface EditModalProps {
    user: UserData;
    accessToken: string;
}
const EditModal: React.FC<EditModalProps> = ({ user, accessToken }) => {
    const editModal = useEditModal();
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [dob, setDob] = useState(new Date());
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
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
            console.log(profileImageData)
            const coverImageData = new FormData()
            coverImageData.append('file', coverImage as Blob)
            mediaServices.setAccessToken(accessToken);
            userServices.setAccessToken(accessToken);
            let avatarUrl = '';
            let coverUrl = '';
            if (profileImage) {
                const { data } = await mediaServices.uploadSingleImage(profileImageData);
                console.log(data)
                avatarUrl = data?.url || '';
            }
            if (coverImage) {
                const { data } = await mediaServices.uploadSingleImage(coverImageData);
                console.log(data)
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

            await userServices.editProfile(editBody);
            toast.success('Updated');
            editModal.onClose();
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, [name, username, bio, location, website, profileImage, coverImage, dob, accessToken, editModal]);

    const handleRemoveImage = (name: string) => {
        if (name === 'profile') {
            setProfileImage(null);
        }
        if (name === 'coverImage') {
            setCoverImage(null);
        }
    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            {!profileImage && (
                <>
                    <div className="label">
                        <span className="text-primary-content">CHOOSE PROFILE IMAGE:</span>
                    </div>
                    <input
                        type="file"
                        name="profileImage"
                        className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
                        accept='image/*' onChange={(e) => {
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
                    <input
                        type="file"
                        name="coverImage"
                        className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
                        placeholder="Cover Image"
                        accept='image/*' onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    />
                </>
            )}
            {coverImage && (
                <div className="relative w-60 cursor-move break-inside-avoid">
                    <img src={URL.createObjectURL(coverImage)} alt="work" />
                    <button type="button" className="btn absolute right-0 top-0 p-1 hover:text-secondary-content 
                    rounded-none
                    text-xl" onClick={() => { handleRemoveImage('cover') }}>
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
        <Modal
            disabled={isLoading}
            isOpen={editModal.isOpen}
            title="Edit your profile"
            actionLabel="Save"
            onClose={editModal.onClose}
            onSubmit={onSubmit}
            body={bodyContent}
        />
    );
}

export default EditModal;