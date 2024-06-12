'use client'
import React, { useEffect, useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import { useSession } from "next-auth/react";
import BookmarkList from '@/Components/Layout/BookmarkList';

const BookmarksList = () => {
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
    <Layout labelHeader="Bookmarks" userSession={useSession}>
      {userSession &&
        <BookmarkList accessToken={userSession?.accessToken} />
      }
    </Layout>
  );
}

export default BookmarksList;