import fetcher from "@/libs/fetcher"

const SERVER = process.env.SERVER as string

class BookmarkServices {
    async getBookmark(accessToken: string, tweetId: string) {
        return await fetcher.getWithAuth(`${SERVER}/bookmark/get-bookmark/${tweetId}`, accessToken)
    }

    async bookmark(accessToken: string, tweetId: string) {
        return await fetcher.postWithAuth(`${SERVER}/bookmark/create-bookmark/${tweetId}`, {}, accessToken)
    }
    async unbookmark(accessToken: string, tweetId: string) {
        return await fetcher.deleteWithAuth(`${SERVER}/bookmark/unbookmark/${tweetId}`, accessToken)
    }
}

const bookmarkServices = new BookmarkServices ()
export default bookmarkServices