'use client'
import Comments from "@/Components/Layout/Comments";
import Layout from "@/Components/Layout/Layout";
import Form from "@/Components/Post/Form";
import PostItem, { dataProps } from "@/Components/Post/PostItem";
import useUserStore from "@/hooks/useMutateUser";
import tweetServices from "@/services/twitter.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PostPage = ({ params }: { params: { id: string } }) => {
    const { data: session } = useSession();
    const id = useRef(params.id);
    const currentUser = useUserStore((state) => state.userProfile);
    const [accessToken, setAccessToken] = useState<string>(session?.user.accessToken)
    const [data, setData] = useState<dataProps>(null);
    const [userSession, setUserSession] = useState<any>(session?.user)
    const [author, setAuthor] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        if (session?.error) {
            router.push('/login');
            return;
        } else {
            setAccessToken(session?.user?.accessToken)
            setUserSession(session?.user)
        }
    }, [session])
    useEffect(() => {
        const fetchData = async () => {
            try {
                return await tweetServices.getTweetById(accessToken, id.current);
            } catch (error) {
                console.error('Error fetching parent tweet:', error);
            }
        }
        if (accessToken) {
            fetchData().then((res) => {
                if (res && res.result) {
                    setData(res?.result);
                    setAuthor(res?.result.author);
                }
            })
        }
    }, [accessToken])
    return (
        <Layout labelHeader="Post" userSession={userSession}>
            {data && accessToken && author && <PostItem data={data} user={author} accessToken={accessToken} />}
            {userSession && <Form isComment={true} postId={id.current} user={userSession} />}
            {accessToken && currentUser && <Comments user_id={id.current} accessToken={accessToken} user={currentUser} />}
        </Layout>
    );
}

export default PostPage;