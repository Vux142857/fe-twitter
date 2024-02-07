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

    private accessToken: string

    constructor() {
        this.accessToken = ''
    }
    async register(payload: RegisterReqBody) {
        return await fetcher.post(`${HOST}/user/register`, payload)
    }
    async login(payload: LoginReqBody) {
        console.log('check payload', payload)
        return await fetcher.post(`${HOST}/user/login`, payload)
    }

    async getUserProfile(username: string) {
        return await fetcher.get(`${HOST}/user/${username}`)
    }

    async getMe() {
        return await fetcher.getWithAuth(`${HOST}/user/me`, this.accessToken)
    }

    setAccessToken(accessToken: string) {
        this.accessToken = accessToken
    }
    
    // Use for test
    getAccessToken() {
        return this.accessToken
    }

    // async editProfile(username: string, payload: any) {
    //     return await fetcher.put(`${HOST}/user/${username}`, payload)
    // }
}

export const userServices = new UserServices()