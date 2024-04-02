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
import { TweetAudience, TweetType } from "@/constants/dataBody";
interface FormProps {
  isComment: boolean;
  postId?: string;
}
const Form: React.FC<FormProps> = ({ isComment, postId }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);
  const [body, setBody] = useState<TweetReqBody>({
    audience: TweetAudience.Everyone,
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
  const clearTweetCircle = useTweetCircleStore((state) => state.clearTweetCircle);
  const clearMention = useMentionStore((state) => state.clearMention);
  const [content, setContent] = useState<string>('');
  const [hashtag, setHashtag] = useState<string>('');
  const [hashtagList, setHashtagList] = useState<string[]>([]);
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
  }, [files, isImage]);

  const onSubmit = useCallback(async () => {
    setIsLoading(true);

    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      });
      const uploadType = isImage ? 'upload-images' : 'upload-video';

      new Promise((resolve, reject) => {
        axios.post(`http://localhost:3000/media/${uploadType}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }).then((response) => {
          if (response.data) {
            const responseData = response.data.data;
            resolve(responseData)
          } else {
            reject(new Error('Failed to upload media'));
          }
        }).catch((error) => {
          console.error('Error uploading media:', error);
          reject(error);
        });
      }).then((mediaData) => {
        // Now that mediaData is set, you can set the body data
        const temp = []
        if (isImage && Array.isArray(mediaData)) {
          console.log('mediaData', mediaData)
          mediaData.forEach((media) => {
            temp.push(media)
          })
        } else {
          temp.push(mediaData)
          console.log('temp', temp)
        }
        body.media = temp;
        body.tweet_circle = getTweetCircle;
        if (body.tweet_circle.length > 0) {
          body.audience = TweetAudience.TweetCircle;
        }
        body.mention = getMention;
        body.content = content;
        body.hashtag = hashtagList;
        // Post the tweet with the updated body data
        return tweetServices.postTweet(user?.accessToken, body);
      }).then(() => {
        toast.success('Tweet created');
        setBody(null);
        setContent('');
        setFiles([]);
        clearMention();
        clearTweetCircle();
      }).catch((error) => {
        console.error('Error submitting tweet:', error);
        toast.error('Something went wrong');
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      body.tweet_circle = getTweetCircle;
      body.mention = getMention;
      body.content = content;
      body.hashtag = hashtagList;
      await tweetServices.postTweet(user?.accessToken, body)
        .then(() => {
          toast.success('Tweet created');
          setBody(null);
          setContent('');
          setFiles([]);
          setBody(null);
          setContent('');
          setFiles([]);
          clearMention();
          clearTweetCircle();
        }).catch((error) => {
          console.error('Error submitting tweet:', error);
          toast.error('Something went wrong');
        }).finally(() => {
          setIsLoading(false);
        });
    }
  }, [body, isComment, files, getTweetCircle, getMention, content, isImage, hashtagList, user]);


  const handleHashtag = useCallback((e) => {
    const value = e.target.value;
    setHashtag(value);
    if (value && value.includes(',')) {
      const arrayHashtag = value.split(',');
      setHashtagList(arrayHashtag);
    }
  }, [hashtag])

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
              <Textarea
                placeholder="Add hastag ex: #hashtag"
                value={hashtag}
                onChange={(e) => handleHashtag(e)}
              />
              <div className="flex items-center flex-row gap-2">
                {user && (
                  <>
                    <SelectUser accessToken={user?.accessToken} isLoading={isLoading} user_id={user?.id} isTweetCirle={true} />
                    <SelectUser accessToken={user?.accessToken} isLoading={isLoading} user_id={user?.id} isTweetCirle={false} />
                  </>
                )}
              </div>
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
                    multiple={true}
                  />
                </label>

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