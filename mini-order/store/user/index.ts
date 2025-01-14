
import { IUserInfo } from '@/shared/interfaces';
import { create } from 'zustand'

interface UserStore {
    user: IUserInfo | null;
    setUser: (user: IUserInfo) => void;
    clearUser: () => void;
    token: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    token:  null,
    setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token })
    },
    clearToken: () => {
        localStorage.removeItem('token');
        set({ token: null })
    },
    user: null, // 默认没有用户
    setUser: (user) => {
        sessionStorage.setItem('userInfo', JSON.stringify(user))
        return set({ user })
    }, // 设置用户信息
    clearUser: () => {
        sessionStorage.removeItem('userInfo');
        set({ user: null })
    }, // 清除用户信息
}));