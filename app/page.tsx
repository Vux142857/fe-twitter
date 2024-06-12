'use client'
import Layout from "@/components/Layout/Layout";
import Newfeeds from "@/components/Layout/Newfeeds";
import Form from "@/components/Post/Form";
import useUserStore from "@/hooks/useMutateUser";
import userServices from "@/services/user.services";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Home() {
  const { data: session } = useSession();
  const router = useRouter()
  const setCurrentUser = useUserStore((state: any) => state.setUserProfile);
  const [userSession, setUser] = useState(session?.user || null);
  useEffect(() => {
    if (session?.error) {
      router.push('/login')
      return
    }
    if (session?.user || userSession) {
      const fetchData = async () => {
        return await userServices.getMe(userSession?.accessToken)
      }
      fetchData().then((res) => {
        if (res && res.result) {
          const { user, followers, following } = res.result
          setCurrentUser({ ...user, followers, following })
        }
      }).catch((error) => {
        console.log(error)
      })
    }
    setUser(session?.user)
  }, [session, userSession])

  return (
    <Layout labelHeader="Home" userSession={userSession}>
      <Form isComment={false} user={userSession} />
      <Newfeeds />
    </Layout>
  );
}