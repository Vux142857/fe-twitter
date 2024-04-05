/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/Components/Layout/Layout";
import UserView from "@/Components/User/UserView";
import TweetsByUser from "@/Components/Layout/TweetsByUser";
import useUserStore from "@/hooks/useMutateUser";

const MyProfile = () => {
    const { data: session } = useSession();
    const profile = useUserStore((state) => state.userProfile);
    const [userSession, setUser] = useState(session?.user || null);
    useEffect(() => {
        if (session?.error) {
            return
        }
        if (session?.user) {
            setUser(session?.user)
        }
    }, [session])
    return (
        <Layout labelHeader={profile?.username} userSession={userSession}>
            {
                userSession && profile &&
                <UserView
                    user={profile}
                    isCurrentUser={true}
                    accessToken={userSession?.accessToken}
                />
            }
            {userSession && profile && <TweetsByUser user_id={profile._id.toString()} accessToken={userSession?.accessToken} user={profile} />}
        </Layout>
    );
}

export default MyProfile;
