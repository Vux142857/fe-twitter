'use client'
import Comments from "@/Components/Layout/Comments";
import Layout from "@/Components/Layout/Layout";
import Form from "@/Components/Post/Form";
import PostItem, { dataProps } from "@/Components/Post/PostItem";
import useUserStore from "@/hooks/useMutateUser";
import tweetServices from "@/services/tweet.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PostPage = ({ params }: { params: { id: string } }) => {
    const { data: session } = useSession();
    const currentUser = useUserStore((state: any) => state.userProfile);
    const [data, setData] = useState<dataProps>(null);
    const [userSession, setUserSession] = useState<any>(session?.user)
    const [author, setAuthor] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        if (session?.error) {
            router.push('/login');
            return;
        } else {
            setUserSession(session?.user)
        }
    }, [session, params.id, userSession])
    useEffect(() => {
        const fetchData = async () => {
            try {
                return await tweetServices.getTweetById(userSession?.accessToken, params.id);
            } catch (error) {
                console.error('Error fetching parent tweet:', error);
            }
        }
        if (userSession) {
            fetchData().then((res) => {
                if (res && res.result) {
                    setData(res?.result);
                    setAuthor(res?.result.author);
                }
            })
        }
    }, [session, params.id, userSession])
    return (
        <Layout labelHeader="Post" userSession={userSession}>
            {data && userSession && author && <PostItem data={data} user={author} accessToken={userSession?.accessToken} />}
            {userSession && data && <Form author={data?.author} isComment={true} postId={params.id} user={userSession} />}
            {userSession && currentUser && <Comments user_id={params.id} accessToken={userSession?.accessToken} user={currentUser} />}
        </Layout>
    );
}

export default PostPage;