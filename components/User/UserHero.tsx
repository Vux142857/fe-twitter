import Image from "next/image";
import Avatar from "../Avatar";

interface UserHeroProps {
    avatarURL: string;
    coverPhotoURL: string;
    username: string;
}

const UserHero: React.FC<UserHeroProps> = ({ avatarURL, coverPhotoURL, username }) => {
    return (
        <div className="relative bg-slate-600 h-44">
            {coverPhotoURL && <Image fill src={coverPhotoURL} alt={username} />}
            <div className="absolute -bottom-16 left-4">
                <Avatar
                    avatarURL={avatarURL}
                    username={username}
                    isLarge={true}
                    hasBorder={true} />
            </div>
        </div>
    );
}

export default UserHero;