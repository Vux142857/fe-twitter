import { EditBody } from "@/constants/dataBody"
import fetcher from "@/libs/fetcher"

const SERVER = process.env.SERVER as string

class LikeServices {
    async getLike(accessToken: string, tweetId: string) {
        return await fetcher.getWithAuth(`${SERVER}/like/${tweetId}`, accessToken)
    }

    async refreshToken(refreshToken: string) {
        return await fetcher.post(`${SERVER}/user/refresh-token`, { refresh_token: refreshToken })
    }

    async logout(refreshToken: string, accessToken) {
        return await fetcher.postWithAuth(`${SERVER}/user/logout`, { refresh_token: refreshToken }, accessToken)
    }
}

const likeServices = new LikeServices()
export default LikeServices