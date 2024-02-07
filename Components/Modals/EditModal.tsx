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

interface EditModalProps {
    user: UserData;
    accessToken: string;
}
const EditModal: React.FC<EditModalProps> = ({ user, accessToken }) => {
    const editModal = useEditModal();
    const [profileImage, setProfileImage] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [dob, setDob] = useState(new Date());
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
    useEffect(() => {
        setProfileImage(user?.avatar)
        setCoverImage(user?.cover_photo)
        setName(user?.name)
        setUsername(user?.username)
        setBio(user?.bio)
        setDob(new Date(user?.date_of_birth))
        setLocation(user?.location)
        setWebsite(user?.website)
    }, [user?.name, user?.username, user?.bio, user?.avatar, user?.cover_photo, user?.date_of_birth, user?.location, user?.website]);

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);
            const editBody: EditBody = {
                name,
                username,
                bio,
                location,
                website,
                avatar: profileImage,
                cover_photo: coverImage,
                date_of_birth: dob.toISOString()
            }
            userServices.setAccessToken(accessToken);
            const res = await userServices.editProfile(editBody);
            console.log(res);
            toast.success('Updated');
            editModal.onClose();
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, [name, username, bio, location, website, profileImage, coverImage, dob, accessToken, editModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <ImageUpload value={profileImage} disabled={isLoading} onChange={(image) => setProfileImage(image)} label="Upload profile image" />
            <ImageUpload value={coverImage} disabled={isLoading} onChange={(image) => setCoverImage(image)} label="Upload cover image" />
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