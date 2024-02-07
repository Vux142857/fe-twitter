/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/Components/Layout/Layout";
import userServices from "@/services/user.services";
import UserView from "@/Components/User/UserView";

const MyProfile = () => {
    const { data: session } = useSession();
    const [profile, setProfile] = useState({
        avatar: '',
        cover_photo: '',
        username: '',
        email: '',
        name: '',
        bio: '',
        website: '',
        location: '',
        date_of_birth: '',
        followed: 0,
        following: 0
    });
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const accessToken = session?.user.accessToken;

    useEffect(() => {
        const fetchData = async () => {
            userServices.setAccessToken(accessToken as string);
            const res = await userServices.getMe()
            const data = res?.data;
            const { user } = data;
            if (user) {
                setProfile(user);
                setIsCurrentUser(true);
            }
        }
        fetchData()
    }, [accessToken]);

    return (
        <Layout labelHeader="Profile">
            <UserView
                user={profile}
                isCurrentUser={isCurrentUser}
                accessToken={accessToken}
            />
        </Layout>
    );
}

export default MyProfile;
