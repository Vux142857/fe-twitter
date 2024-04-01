'use client'
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Avatar from "../Avatar";
import { useSession } from "next-auth/react";
import Button from "../Button";
import toast from "react-hot-toast";
import axios from "axios";
import Input from "../Input";
import Textarea from "../TextArea";
import SelectUser from "../Layout/FollowList";
import { useMentionStore, useTweetCircleStore } from "@/hooks/useChosenList";
import tweetServices, { TweetReqBody } from "@/services/twitter.service";
import { Media, TweetAudience, TweetType } from "@/constants/dataBody";
interface FormProps {
    isComment: boolean;
    postId?: string;
}
const Form: React.FC<FormProps> = ({ isComment, postId }) => {
    const { data: session } = useSession();
    const [user, setUser] = useState(session?.user);
    const [body, setBody] = useState<TweetReqBody>({
        audience: TweetAudience.TweetCircle,
        content: '',
        type: isComment ? TweetType.Comment : TweetType.Tweet,
        tweet_circle: [],
        mention: [],
        hashtag: [],
        media: [],
        parent_id: (postId ? postId : null)
    });
    const getTweetCircle = useTweetCircleStore((state) => state.tweetCircle);
    const getMention = useMentionStore((state) => state.mention);
    const [media, setMedia] = useState<Media[]>([]);
    const [content, setContent] = useState<string>('');
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isImage, setTypeMedia] = useState(false);
    useEffect(() => {
        if (!session?.error) {
            setUser(session?.user)
        }
    }, [session])
    useEffect(() => {
        if (session) {
            setUser(session.user)
        }
    }, [session])

    const handleMediaChange = useCallback((event) => {
        event.stopPropagation()
        const filesList: File[] = Array.from(event.target.files);
        if (filesList.length <= 4) {
            if (filesList.every((file: File) => file?.type.startsWith('image/'))) {
                setFiles(filesList);
                setTypeMedia(true);
            } else if (filesList.every((file: File) => file?.type.startsWith('video/'))) {
                setFiles(filesList);
                setTypeMedia(false);
            }
        }
    }, [files]);

    const handleUpload = useCallback(async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('file', file);
            });
            const uploadType = isImage ? 'upload-images' : 'upload-video';
            const response = await axios.post(`http://localhost:3000/media/${uploadType}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user?.accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [files]);

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);
            console.log(body)
            if (files.length > 0) {
                const response = await handleUpload();
                if (response) {
                    isImage ? setMedia(response.data.map((item) => item))
                        : setMedia([...response.data]);
                }
            }
            body.media = media;
            body.tweet_circle = getTweetCircle;
            body.mention = getMention;
            body.content = content;
            console.log(body)
            await tweetServices.postTweet(user?.accessToken, body).then((res) => {
                toast.success('Tweet created');
            }).catch((err) => {
                console.log(err)
                toast.error('Something went wrong');
            })
            setBody(null);
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, [body, isComment, body, files, media, getTweetCircle, getMention, content]);

    return (
        <>
            {user && (
                <div className="border-b border-gray-200 py-4 px-6">
                    <div className="flex items-start">
                        <Avatar username={user?.username} avatarURL={user?.avatar} />
                        <div className="ml-4 w-full">
                            <Textarea
                                placeholder="What's happening?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            {files && (
                                <div className="mt-2">
                                    {files.map((file, index) =>
                                        file.type.startsWith('image/') ? (
                                            <img
                                                key={index}
                                                src={URL.createObjectURL(file)}
                                                alt="Uploaded image"
                                                className="max-h-48 w-auto"
                                            />
                                        ) : file.type.startsWith('video/') ? (
                                            <video
                                                key={index}
                                                src={URL.createObjectURL(file)}
                                                controls
                                                className="max-h-48 w-auto"
                                            ></video>
                                        ) : null
                                    )}
                                </div>
                            )}
                            <div className="mt-2 flex justify-between items-center">
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Only upload images (limit 4) or video (only 1)</span>
                                    </div>
                                    <Input
                                        placeholder="Website"
                                        onChange={handleMediaChange}
                                        disabled={isLoading}
                                        type="file"
                                        accept="image/*, video/*"
                                    />
                                </label>
                                {user && <SelectUser accessToken={user?.accessToken} isLoading={isLoading} user_id={user?.id} isTweetCirle={true} />}
                                <Button
                                    onClick={() => onSubmit()}
                                    disabled={isLoading || content.length === 0}
                                    label="Tweet"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default memo(Form);