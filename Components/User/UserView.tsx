import UserHero from "@/Components/User/UserHero";
import UserBio from "./UserBio";
import { UserProfile } from "@/hooks/useMutateUser";
import { memo } from "react";
interface UserViewProps {
    user: UserProfile;
    isCurrentUser: boolean;
    accessToken?: string;
}

const UserView: React.FC<UserViewProps> = ({ user, isCurrentUser, accessToken }) => {
    return (
        <>
            <UserHero
                avatarURL={user.avatar}
                coverPhotoURL={user.cover_photo}
                username={user.username} />
            <UserBio
                profile={user}
                isCurrentUser={isCurrentUser}
                accessToken={accessToken}
            />
        </>
    );
}

export default memo(UserView);