/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useSession } from "next-auth/react";
import { useState } from "react";
import Layout from "@/Components/Layout/Layout";
import UserView from "@/Components/User/UserView";

const MyProfile = () => {
    const { data: session } = useSession();
    console.log(session?.user?.profile)
    const [profile, setProfile] = useState({
        avatar: '' || session?.user?.profile?.avatar,
        cover_photo: '' || session?.user?.profile?.cover_photo,
        username: '' || session?.user?.profile?.username,
        email: '' || session?.user?.profile?.email,
        name: '' || session?.user?.profile?.name,
        bio: '' || session?.user?.profile?.bio,
        website: '' || session?.user?.profile?.website,
        location: '' || session?.user?.profile?.location,
        date_of_birth: '' || session?.user?.profile?.date_of_birth,
        followed: 0,
        following: 0
    });
    const accessToken = session?.user.accessToken;

    return (
        <Layout labelHeader={session?.user?.profile?.username}>
            <UserView
                user={profile}
                isCurrentUser={true}
                accessToken={accessToken}
            />
        </Layout>
    );
}

export default MyProfile;
