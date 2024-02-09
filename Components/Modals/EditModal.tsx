'use client'
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useEditModal from "@/hooks/useEditModal";
import Input from "../Input";
import Modal from "../Modals/Modal";
import ImageUpload from "../ImageUpload";
import { EditBody, UserData } from "@/constants/dataBody";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import userServices from "@/services/user.services";
import mediaServices from "@/services/media.services";
import { IoIosImages } from "react-icons/io";

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
            console.log(editBody)
            const res = await userServices.editProfile(editBody);
            toast.success('Updated');
            editModal.onClose();
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, [name, username, bio, location, website, profileImage, coverImage, dob, accessToken, editModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            {/* <ImageUpload value={profileImage} disabled={isLoading} onChange={(image) => setProfileImage(image)} label="Upload profile image" /> */}
            <input
                type="file"
                name="profileImage"
                accept='image/*' onChange={(e) => {
                    setProfileImage(e.target.files?.[0] || null);
                }}
            />
            <input
                type="file"
                name="coverImage"
                accept='image/*' onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
            {/* <ImageUpload value={coverImage} disabled={isLoading} onChange={(image) => setCoverImage(image)} label="Upload cover image" /> */}
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