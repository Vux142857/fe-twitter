'use client'
import Layout from "@/Components/Layout/Layout";
import Newfeeds from "@/Components/Layout/Newfeeds";
import Form from "@/Components/Post/Form";
import useUserStore from "@/hooks/useMutateUser";
import userServices from "@/services/user.services";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
export default function Home() {
  const { data: session } = useSession();
  const setCurrentUser = useUserStore((state) => state.setUserProfile);
  const [userSession, setUser] = useState(session?.user || null);
  useEffect(() => {
    if (session?.error) {
      return
    }
    if (session?.user || userSession) {
      const fetchData = async () => {
        return await userServices.getMe(userSession?.accessToken)
      }
      fetchData().then((res) => {
        if (res && res.result) {
          console.log(res)
          const { user, followers, following } = res.result
          console.log(user, followers, following)
          setCurrentUser({ ...user, followers, following })
        }
      }).catch((error) => {
        console.log(error)
      })
    }
    setUser(session?.user)
  }, [session])

  return (
    <Layout labelHeader="Home" userSession={userSession}>
      {userSession && <Form isComment={false} user={userSession} />}
      <Newfeeds />
    </Layout>
  );
}