/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Image from "next/image";
import { memo, use, useCallback } from "react";
import defaultAvatar from "@/public/default-avatar-icon-of-social-media-user-vector.jpg";
import { useRouter } from "next/navigation";
interface AvatarProps {
    avatarURL: string;
    username: string;
    isLarge?: boolean;
    hasBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ avatarURL, username, isLarge, hasBorder }) => {
    const router = useRouter();
    const onClick = useCallback((event: any) => {
        event.stopPropagation()
        const url = `/${username}`
        router.push(url)
    }, [username])
    const avatarSrc = (avatarURL != '') ? avatarURL : defaultAvatar;
    return (
        <div className={`
        ${isLarge ? "h-32 w-32" : "h-12 w-12"} 
        ${hasBorder ? "border-4 border-primary" : ""}
        rounded-full
        hover:opacity-90
        transition
        cursor-pointer
        `}>
            <Image
                src={avatarSrc}
                alt="avatar"
                width={isLarge ? 128 : 48}
                height={isLarge ? 128 : 48}
                onClick={onClick}
                style={{ borderRadius: "100%", objectFit: "cover" }}
            />
        </div>
    );
}

export default memo(Avatar);