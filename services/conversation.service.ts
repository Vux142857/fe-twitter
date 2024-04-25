import { EditBody } from "@/constants/dataBody"
import fetcher from "@/libs/fetcher"

const SERVER = process.env.NEXT_PUBLIC_SERVER as string

class ConversationServices {

    async getConversation(id: string, accessToken: string) {
        return await fetcher.getWithAuth(`${SERVER}/conversation/${id}`, accessToken)
    }

    async createConversation(accessToken: string, receiver: string) {
        return await fetcher.postWithAuth(`${SERVER}/conversation/store-conversation/${receiver}`, {}, accessToken)
    }

    async enterConversation(accessToken: string, receiver: string) {
        return await fetcher.getWithAuth(`${SERVER}/conversation/get-conversation/${receiver}`, accessToken)
    }
}

const conversationServices = new ConversationServices()
export default conversationServices