import { EditBody } from "@/constants/dataBody"
import fetcher from "@/libs/fetcher"

const SERVER = process.env.SERVER as string

class LikeServices {
    async getLike(accessToken: string, tweetId: string) {
        return await fetcher.getWithAuth(`${SERVER}/like/get-like/${tweetId}`, accessToken)
    }

    async like(accessToken: string, tweetId: string) {
        return await fetcher.postWithAuth(`${SERVER}/like/create-like/${tweetId}`, {}, accessToken)
    }
    async unlike(accessToken: string, tweetId: string) {
        return await fetcher.deleteWithAuth(`${SERVER}/like/unlike/${tweetId}`, accessToken)
    }
}

const likeServices = new LikeServices()
export default likeServices