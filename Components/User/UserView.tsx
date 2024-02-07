import { UserData } from "@/constants/dataBody";
import UserHero from "@/Components/User/UserHero";
import UserBio from "./UserBio";
import { Toaster } from 'react-hot-toast';
import EditModal from "../Modals/EditModal";
interface UserViewProps {
    user: UserData;
    isCurrentUser: boolean;
}

const UserView: React.FC<UserViewProps> = ({ user, isCurrentUser }) => {
    return (
        <>
            <Toaster />
            <UserHero
                avatarURL={user.avatar}
                coverPhotoURL={user.cover_photo}
                username={user.username} />
            <UserBio
                username={user.username}
                name={user.name}
                bio={user.bio}
                website={user.website}
                location={user.location}
                dateOfBirth={user.date_of_birth}
                followed={0}
                following={0}
                isCurrentUser={isCurrentUser}
            />
            <EditModal user={user} />
        </>
    );
}

export default UserView;