import { EditBody } from "@/constants/dataBody"
import fetcher from "@/libs/fetcher"

const SERVER = process.env.SERVER as string
export interface RegisterReqBody {
    name: string
    email: string
    username: string
    password: string
    confirm_password: string
    date_of_birth: Date
}

export interface LoginReqBody {
    email: string
    password: string
}

class UserServices {

    async register(payload: RegisterReqBody) {
        return await fetcher.post(`${SERVER}/user/register`, payload)
    }
    async login(payload: LoginReqBody) {
        return await fetcher.post(`${SERVER}/user/login`, payload)
    }

    async getUserProfile(username: string) {
        return await fetcher.get(`${SERVER}/user/${username}`)
    }

    async getMe(accessToken: string) {
        return await fetcher.getWithAuth(`${SERVER}/user/me`, accessToken)
    }

    async editProfile(payload: EditBody, accessToken: string) {
        return await fetcher.patch(`${SERVER}/user/me`, payload, accessToken)
    }

    async refreshToken(refreshToken: string) {
        return await fetcher.post(`${SERVER}/user/refresh-token`, { refresh_token: refreshToken })
    }

    async logout(refreshToken: string, accessToken) {
        return await fetcher.postWithAuth(`${SERVER}/user/logout`, { refresh_token: refreshToken }, accessToken)
    }

    async verifyEmail(token: string, accessToken: string) {
        return await fetcher.postWithAuth(`${SERVER}/user/verify-email`, { verify_email_token: token }, accessToken)
    }

    async resendVerifyEmail(email: string, accessToken: string) {
        return await fetcher.postWithAuth(`${SERVER}/user/resend-verify-email`, { email }, accessToken)
    }

    async createForgotPassword(email: string) {
        return await fetcher.post(`${SERVER}/user/create-forgot-password`, { email })
    }

    async verifyForgotPassword(token: string) {
        return await fetcher.post(`${SERVER}/user/verify-forgot-password`, { forgot_password_token: token })
    }

    async changePassword(password: string, token: string, confirm_password: string) {
        return await fetcher.post(`${SERVER}/user/reset-password`, { password: password, confirm_password: confirm_password, forgot_password_token: token })
    }
}

const userServices = new UserServices()
export default userServices