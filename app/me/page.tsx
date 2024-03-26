/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/Components/Layout/Layout";
import UserView from "@/Components/User/UserView";
import TweetsByUser from "@/Components/Layout/TweetsByUser";

const MyProfile = () => {
    const { data: session } = useSession();
    const [profile, setProfile] = useState({
        _id: session?.user?.profile?._id,
        avatar: session?.user?.profile?.avatar,
        cover_photo: session?.user?.profile?.cover_photo,
        username: session?.user?.profile?.username,
        email: session?.user?.profile?.email,
        name: session?.user?.profile?.name,
        bio: session?.user?.profile?.bio,
        website: session?.user?.profile?.website,
        location: session?.user?.profile?.location,
        date_of_birth: session?.user?.profile?.date_of_birth,
    });
    const [accessToken, setAccessToken] = useState(session?.user?.accessToken);
    useEffect(() => {
        setProfile(
            {
                _id: session?.user?.profile?._id,
                avatar: session?.user?.profile?.avatar,
                cover_photo: session?.user?.profile?.cover_photo,
                username: session?.user?.profile?.username,
                email: session?.user?.profile?.email,
                name: session?.user?.profile?.name,
                bio: session?.user?.profile?.bio,
                website: session?.user?.profile?.website,
                location: session?.user?.profile?.location,
                date_of_birth: session?.user?.profile?.date_of_birth,
            }
        )
        setAccessToken(session?.user?.accessToken)
    }, [session]);

    return (
        <Layout labelHeader={session?.user?.profile?.username}>
            <UserView
                user={profile}
                isCurrentUser={true}
                accessToken={accessToken}
            />
            {accessToken && <TweetsByUser user_id={profile._id} accessToken={accessToken} />}
        </Layout>
    );
}

export default MyProfile;
