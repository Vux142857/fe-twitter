import { Media, TweetAudience, TweetType } from "@/constants/dataBody"
import fetcher from "@/libs/fetcher"

const SERVER = process.env.SERVER as string

export interface TweetReqBody {
    audience: TweetAudience
    content: string
    media: Media[]
    mention: string[]
    parent_id: string | null
    hashtag: string[]
    type: TweetType
    tweet_circle: string[] | string[]
}

class TweetServices {
    async getTweetById(accessToken: string, userId: string) {
        return await fetcher.getWithAuth(`${SERVER}/tweet/follow/${userId}`, accessToken)
    }

    async postTweet(accessToken: string, data: TweetReqBody) {
        return await fetcher.postWithAuth(`${SERVER}/tweet/create-tweet`, data, accessToken)
    }
}

const tweetServices = new TweetServices()
export default tweetServices