'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import UserView from "@/components/User/UserView";
import TweetsByUser from "@/components/Layout/TweetsByUser";
import useUserStore from "@/hooks/useMutateUser";

const MyProfile = () => {
    const { data: session } = useSession();
    const profile = useUserStore((state: any) => state.userProfile);
    const [userSession, setUser] = useState(session?.user || null);
    useEffect(() => {
        if (session?.error) {
            return
        }
        if (session?.user) {
            setUser(session?.user)
        }
    }, [session, userSession])
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
