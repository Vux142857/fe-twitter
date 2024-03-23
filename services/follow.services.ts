import { EditBody } from "@/constants/dataBody"
import fetcher from "@/libs/fetcher"

const SERVER = process.env.SERVER as string

class FollowServices {
    async getFollow(accessToken: string, tweetId: string) {
        return await fetcher.getWithAuth(`${SERVER}/follow/get-follow/${tweetId}`, accessToken)
    }

    async follow(accessToken: string, tweetId: string) {
        return await fetcher.postWithAuth(`${SERVER}/follow/create-follow/${tweetId}`, {}, accessToken)
    }
    async unfollow(accessToken: string, tweetId: string) {
        return await fetcher.deleteWithAuth(`${SERVER}/follow/unfollow/${tweetId}`, accessToken)
    }
}

const followServices = new FollowServices()
export default followServices