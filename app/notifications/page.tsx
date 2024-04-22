'use client'
import React, { useEffect, useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import { useSession } from "next-auth/react";
import NotificationList from '@/Components/Layout/NotificationList';

const NotificationsList = () => {
  const { data: session } = useSession();
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
    <Layout labelHeader="Notifications" userSession={useSession}>
      {userSession &&
        <NotificationList accessToken={userSession?.accessToken} />
      }
    </Layout>
  );
}

export default NotificationsList;