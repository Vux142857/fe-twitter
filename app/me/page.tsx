/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/Components/Layout/Layout";
import UserView from "@/Components/User/UserView";
import TweetsByUser from "@/Components/Layout/TweetsByUser";
import useUserStore from "@/hooks/useMutateUser";

const MyProfile = () => {
    const profile = useUserStore(state => state.userProfile);
    const { data: session } = useSession();
    const [accessToken, setAccessToken] = useState(session?.user?.accessToken);
    useEffect(() => {
        setAccessToken(session?.user?.accessToken)
    }, [session]);
    return (
        <Layout labelHeader={profile?.username}>
            {
                accessToken && profile &&
                <UserView
                    user={profile}
                    isCurrentUser={true}
                    accessToken={accessToken}
                />
            }
            {accessToken && profile && <TweetsByUser user_id={profile._id.toString()} accessToken={accessToken} />}
        </Layout>
    );
}

export default MyProfile;
