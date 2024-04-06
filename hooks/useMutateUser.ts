import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'
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

// type UserStore = {
//     userProfile: any | null;
//     setUserProfile: (profile: any) => void;
//     clearUserProfile: () => void;
// };

const useUserStore = create(
    persist(
        (set, get) => ({
            userProfile: null,
            setUserProfile: (profile: any) => set({ userProfile: profile }),
            clearUserProfile: () => set({ userProfile: null }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => sessionStorage),
        },
    ));

export default useUserStore;