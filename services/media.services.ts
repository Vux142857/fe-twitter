import fetcher from "@/libs/fetcher"

const SERVER = process.env.NEXT_PUBLIC_SERVER as string
class MediaService {

    async uploadSingleImage(file: any, accessToken: string) {
        return await fetcher.postWithAuth(`${SERVER}/media/upload-image`, file, accessToken)
    }
}

const mediaServices = new MediaService()
export default mediaServices