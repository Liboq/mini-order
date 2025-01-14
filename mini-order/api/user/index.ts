import { request } from "@/lib/request"
import { IBalanceParams, ILoginParams, ILoginResult, IRegisterParams, IResetPasswordParams, IUpdateUserInfoParams, IUserBalance, IUserInfo } from "@shared/interfaces"


export const register = (data: IRegisterParams) =>
    request<RequestResult<string>>({
        url: '/users/register',
        method: 'post',
        data
    })

export const login = (data: ILoginParams) =>
    request<RequestResult<ILoginResult>>({
        url: '/users/login',
        method: 'post',
        data
    })

export const logout = async () => {
    await request<RequestResult<string>>({
        url: '/users/logout',
        method: 'post'
    })
}
export const getUserInfo = () =>
    request<RequestResult<IUserInfo>>({
        url: '/users/info',
        method: 'post'
    })

export const updateUserInfo = (id: number, data: IUpdateUserInfoParams) =>
    request<RequestResult<IUserInfo>>({
        url: `/users/${id}`,
        method: 'put',
        data
    })

export const sendPasswordResetEmail = (email: string) =>
    request<RequestResult<void>>({
        url: '/users/send-password-reset-email',
        method: 'post',
        data: { email }
    })

export const resetPassword = (data: IResetPasswordParams) =>
    request<RequestResult<string>>({
        url: '/users/reset-password',
        method: 'post',
        data
    })

export const sendRegisterCode = async (email: string) =>
    request<RequestResult<void>>({
        url: '/users/send-register-code',
        method: 'post',
        data: { email }
    }
    )
export const getUserBalances = (data: IBalanceParams) =>
    request<RequestResult<IUserBalance>>({
        url: '/users/balance-transactions',
        method: 'get',
        data
    })

