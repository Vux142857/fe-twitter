'use client'
import { useEffect, useState } from "react";
import Layout from "@/Components/Layout/Layout";
import userServices from "@/services/user.services";
import UserView from "@/Components/User/UserView";
import { useSession } from "next-auth/react";
import TweetsByUser from "@/Components/Layout/TweetsByUser";
import useUserStore, { UserProfile } from "@/hooks/useMutateUser";

const MyProfile = ({ params }: { params: { username: string } }) => {
    const { data: session } = useSession();
    const [userSession, setUser] = useState(session?.user || null);
    const currentUser = useUserStore((state: any) => state.userProfile);
    useEffect(() => {
        if (session?.error) {
            return
        }
        if (session?.user) {
            setUser(session?.user)
        }
    }, [session])
    const [profile, setProfile] = useState<UserProfile>({
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
        followers: 0,
        following: 0
    });
    const [label, setLabel] = useState('Profile');
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    useEffect(() => {
        setIsCurrentUser(currentUser?.username == params.username);
        const fetchData = async () => {
            const res = await userServices.getUserProfile(params.username)
            if (res && res.result) {
                const { user, followers, following } = res.result;
                setProfile({ ...user, followers, following });
                setLabel(user?.username);
            }
        }
        fetchData()
    }, [params.username, userSession, profile?._id]);

    return (
        <Layout labelHeader={label} userSession={userSession}>
            <UserView
                user={profile}
                isCurrentUser={isCurrentUser}
                accessToken={session ? session?.user.accessToken : ''}
            />
            {userSession && profile._id !== '' && <TweetsByUser user_id={profile._id} accessToken={userSession?.accessToken} user={profile} />}
        </Layout>
    );
}

export default MyProfile;
