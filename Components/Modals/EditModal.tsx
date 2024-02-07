import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import useEditModal from "@/hooks/useEditModal";

import Input from "../Input";
import Modal from "../Modals/Modal";
import ImageUpload from "../ImageUpload";
import { UserData } from "@/constants/dataBody";

interface EditModalProps {
    user: UserData;
}
const EditModal: React.FC<EditModalProps> = ({ user }) => {
    const editModal = useEditModal();
    const [profileImage, setProfileImage] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        setProfileImage(user?.avatar)
        setCoverImage(user?.cover_photo)
        setName(user?.name)
        setUsername(user?.username)
        setBio(user?.bio)
    }, [user?.name, user?.username, user?.bio, user?.avatar, user?.cover_photo]);

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);

            await axios.patch('/api/edit', { name, username, bio, profileImage, coverImage });

            toast.success('Updated');

            editModal.onClose();
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, [editModal, name, username, bio, profileImage, coverImage]);

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