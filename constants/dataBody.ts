export interface UserData {
    _id: string
    name: string
    username: string
    email: string
    bio: string
    location: string
    website: string
    avatar: string
    cover_photo: string
    date_of_birth: string
}

export enum UserVerifyStatus {
    Unverified,
    Verified,
    Banned
}

export interface EditBody {
    name: string
    username: string
    bio: string
    location: string
    website: string
    avatar: string
    cover_photo: string
    date_of_birth: string
}

export enum TweetAudience {
    TweetCircle,
    Everyone
}

export enum MediaType {
    Image,
    Video,
    Audio
}

export enum TweetType {
    Tweet,
    Retweet,
    Comment
}

export interface Media {
    _id?: string
    user_id?: string
    type: MediaType | number
    url: string
    status: StatusType | number
    created_at?: Date
}

export enum StatusType {
    Pending,
    Done,
    Failure,
    Cancelled,
    Abandoned
}