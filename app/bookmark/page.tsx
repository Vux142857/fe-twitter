'use client'
import React, { useLayoutEffect, useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import { useSession } from "next-auth/react";
import BookmarkList from '@/Components/Layout/BookmarkList';

const BookmarksList = () => {
  const { data: session } = useSession();
  const [accessToken, setAccessToken] = useState(null)
  useLayoutEffect(() => {
    if (session) {
      setAccessToken(session.user.accessToken)
    }
  }, [session])
  return (
    <Layout labelHeader="Bookmarks">
      {accessToken &&
        <BookmarkList accessToken={accessToken} />
      }
    </Layout>
  );
}

export default BookmarksList;