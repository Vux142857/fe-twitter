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
        console.log('check payload', payload)
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
}

const userServices = new UserServices()
export default userServices