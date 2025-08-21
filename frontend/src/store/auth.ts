import {create} from 'zustand'
import {persist} from 'zustand/middleware'


type User = {
    id: string;
    username: string;
    email: string;
    fullname: string;
    profilePic?: string;
}

type AuthStore = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (user: User, accessToken: string, refreshToken?: string) => void;
    logout: () => void;
}


export const useAuth = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            login: (user, accessToken, refreshToken) => {
                set({
                    user,
                    accessToken,
                    refreshToken: refreshToken || null,
                    isAuthenticated: true
                })
            },

            logout: () =>(
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false
                })
            ),
        }),
        {
            name: "auth-storage",
        }
    )
)