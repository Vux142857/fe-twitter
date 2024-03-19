/* eslint-disable @next/next/no-img-element */
interface MessageElementProps {
    content: string
    fromSelf: boolean
}
const MessageElement: React.FC<MessageElementProps> = ({ content, fromSelf }) => {
    const sender = (
        <div className="chat-message">
            <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                    <div>
                        <span
                            className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600"
                        >{content}</span>
                    </div>
                </div>
            </div>
        </div>
    )
    const self = (
        <div className="chat-message">
            <div className="flex items-end justify-end">
                <div
                    className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end"
                >
                    <div>
                        <span
                            className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white"
                        >{content}</span>
                    </div>
                </div>
                {/* <img
                    src={selfAvatar}
                    alt="My profile"
                    className="w-6 h-6 rounded-full order-2"
                /> */}
            </div>
        </div>
    )
    const result = fromSelf ? self : sender
    return (
        <>
            {result}
        </>
    )
}

export default MessageElement;