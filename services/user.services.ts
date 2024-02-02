import fetcher from "@/libs/fetcher"

const HOST = process.env.HOST as string
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
        return await fetcher.post(`${HOST}/user/register`, payload)
    }
    async login(payload: LoginReqBody) {
        console.log('check payload', payload)
        return await fetcher.post(`${HOST}/user/login`, payload)
    }

    async getUserProfile(username: string) {
        const res = await fetcher.get(`${HOST}/user/${username}`)
    }

    async getMe() {
        const res = await fetcher.get(`${HOST}/user/me`)
    }
}

export const userServices = new UserServices()