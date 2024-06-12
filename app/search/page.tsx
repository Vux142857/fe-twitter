'use client'
import { useSession } from "next-auth/react";
import { memo, useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import Input from "@/components/Input";
import { SearchFilterQuery } from "@/constants/dataBody";
import SearchResult from "@/components/Layout/SearchResult";

const MyProfile = () => {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState(SearchFilterQuery.Tweet);
    const [userSession, setUser] = useState(session?.user || null);
    const [searchValue, setSearchValue] = useState("");
    useEffect(() => {
        if (session?.error) {
            return
        }
        if (session?.user) {
            setUser(session?.user)
        }
    }, [session, userSession])

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchValue(searchQuery)
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearchSubmit(event);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    }

    const handleTabClick = (tabName) => {
        setFilter(tabName);
    }

    return (
        <Layout labelHeader={"Search"} userSession={userSession}>
            <Input type="text" placeholder="Search" value={searchQuery} onChange={handleSearchChange} onKeyDown={handleKeyDown} />
            <div role="tablist" className="tabs tabs-lifted tabs-lg w-full p-4">
                <p role="tab" className={`tab ${filter === SearchFilterQuery.Tweet ? "tab-active" : ""}`}
                    onClick={() => handleTabClick(SearchFilterQuery.Tweet)}>Tweet</p>
                <p role="tab" className={`tab ${filter === SearchFilterQuery.Video ? "tab-active" : ""}`}
                    onClick={() => handleTabClick(SearchFilterQuery.Video)}>Video</p>
                <p role="tab" className={`tab ${filter === SearchFilterQuery.Image ? "tab-active" : ""}`}
                    onClick={() => handleTabClick(SearchFilterQuery.Image)}>Image</p>
                <p role="tab" className={`tab ${filter === SearchFilterQuery.User ? "tab-active" : ""}`}
                    onClick={() => handleTabClick(SearchFilterQuery.User)}>User</p>
            </div>
            {userSession?.accessToken && searchValue !== '' && <SearchResult accessToken={userSession?.accessToken} filter={filter} searchValue={searchValue} />}
        </Layout>
    );
}

export default memo(MyProfile);
