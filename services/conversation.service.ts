import { EditBody } from "@/constants/dataBody"
import fetcher from "@/libs/fetcher"

const SERVER = process.env.SERVER as string

class ConversationServices {

    async getConversation(id: string, accessToken: string) {
        return await fetcher.getWithAuth(`${SERVER}/conversation/${id}`, accessToken)
    }
}

const conversationServices = new ConversationServices()
export default conversationServices