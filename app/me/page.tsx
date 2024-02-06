// /* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import fetcher from "@/libs/fetcher"; // Import the Fetcher class

const MyProfile = () => {
    const { data: session } = useSession();
    const [profile, setProfile] = useState(null);
    const accessToken = session?.user.accessToken;

    useEffect(() => {
        fetcher.setAccessToken(accessToken as string);
        const fetchData = async () => {
            const data = await fetcher.get('http://localhost:3000/user/me');
            setProfile(data)
        }
        fetchData().catch((e) => {
            // handle the error as needed
            console.error('An error occurred while fetching the data: ', e)
        })
    }, [profile])

    // Render profile data
    return (
        <>
            <p>{profile ? JSON.stringify(profile) : 'Hello world'}</p>
        </>
    );
}

export default MyProfile;
