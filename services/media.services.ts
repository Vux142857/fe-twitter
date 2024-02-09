import fetcher from "@/libs/fetcher"

const SERVER = process.env.SERVER as string
class MediaService {
    private accessToken: string
    constructor() {
        this.accessToken = ''
    }

    setAccessToken(accessToken: string) {
        this.accessToken = accessToken
    }

    async uploadSingleImage(file: any) {
        return await fetcher.postWithAuth(`${SERVER}/media/upload-image`, file, this.accessToken)
    }
}

const mediaServices = new MediaService()
export default mediaServices