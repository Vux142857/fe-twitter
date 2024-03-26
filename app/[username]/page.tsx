/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState } from "react";
import Layout from "@/Components/Layout/Layout";
import userServices from "@/services/user.services";
import UserView from "@/Components/User/UserView";
import { useSession } from "next-auth/react";

const MyProfile = ({ params }: { params: { username: string } }) => {
    const { data: session } = useSession();
    const [profile, setProfile] = useState({
        _id: '',
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
    const [label, setLabel] = useState('Profile');
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const res = await userServices.getUserProfile(params.username)
            const { user } = res;
            if (user) {
                setProfile(user);
                setLabel(user.username);
                setIsCurrentUser(session?.user.username === user.username);
            }
        }
        fetchData()
    }, []);

    return (
        <Layout labelHeader={label}>
            <UserView
                user={profile}
                isCurrentUser={isCurrentUser}
                accessToken={session ? session?.user.accessToken : ''}
            />
        </Layout>
    );
}

export default MyProfile;
