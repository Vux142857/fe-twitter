import { EditBody } from "@/constants/dataBody"
import fetcher from "@/libs/fetcher"

const SERVER = process.env.SERVER as string

class FollowServices {
    async getFollow(accessToken: string, userId: string) {
        return await fetcher.getWithAuth(`${SERVER}/user/follow/${userId}`, accessToken)
    }

    async follow(accessToken: string, userId: string) {
        return await fetcher.postWithAuth(`${SERVER}/user/follow`, { following_user_id: userId }, accessToken)
    }
    async unfollow(accessToken: string, userId: string) {
        return await fetcher.deleteWithAuth(`${SERVER}/user/unfollow/${userId}`, accessToken)
    }
}

const followServices = new FollowServices()
export default followServices