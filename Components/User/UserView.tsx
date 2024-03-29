import { UserData } from "@/constants/dataBody";
import UserHero from "@/Components/User/UserHero";
import UserBio from "./UserBio";
import { Toaster } from 'react-hot-toast';
import EditModal from "../Modals/EditModal";
interface UserViewProps {
    user: UserData;
    isCurrentUser: boolean;
    accessToken?: string;
}

const UserView: React.FC<UserViewProps> = ({ user, isCurrentUser, accessToken }) => {
    return (
        <>
            <Toaster />
            <UserHero
                avatarURL={user.avatar}
                coverPhotoURL={user.cover_photo}
                username={user.username} />
            <UserBio
                _id={user._id}
                username={user.username}
                name={user.name}
                bio={user.bio}
                website={user.website}
                location={user.location}
                dateOfBirth={user.date_of_birth}
                isCurrentUser={isCurrentUser}
            />
            {accessToken && <EditModal user={user} accessToken={accessToken} />}
        </>
    );
}

export default UserView;