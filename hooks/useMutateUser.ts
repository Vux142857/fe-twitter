import { create } from 'zustand';

export type UserProfile = {
    _id: string;
    name: string;
    email: string;
    date_of_birth: string;
    bio: string;
    location: string;
    username: string;
    avatar: string;
    cover_photo: string;
    website: string;
    created_at?: string;
    updated_at?: string;
    verify?: number;
    followers?: number;
    following?: number;
};

type UserStore = {
    userProfile: any | null;
    setUserProfile: (profile: UserProfile) => void;
    clearUserProfile: () => void;
};

const useUserStore = create<UserStore>((set) => ({
    userProfile: null,
    setUserProfile: (profile) => set({ userProfile: profile }),
    clearUserProfile: () => set({ userProfile: null }),
}));

export default useUserStore;