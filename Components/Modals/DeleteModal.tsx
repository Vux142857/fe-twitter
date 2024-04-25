import { useCallback } from "react";
import { RiDeleteBack2Fill } from "react-icons/ri";
import Button from "../Button";
import tweetServices from "@/services/tweet.service";
import { Bounce, toast } from "react-toastify";

const DeleteModal = ({ accessToken, tweet_id }: { accessToken: string, tweet_id: string }) => {
    const deleteTweet = useCallback(async (ev: any) => {
        ev.stopPropagation();
        try {
            if (!accessToken) {
                return;
            }
            toast.info('🦄 Deleting...', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            const result = await tweetServices.deleteTweet(accessToken, tweet_id)
            if (result) {
                (document.getElementById(`${tweet_id}`) as HTMLDialogElement).close()
                window.location.reload()
            }
        } catch (error) {
            toast.warning('Something went wrong!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
    }, [accessToken, tweet_id])
    return (
        <div className=''>
            <dialog id={tweet_id} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <p className="font-bold text-lg text-primary-content">Are you sure to delete it?</p>
                    <div className="modal-action">
                        <Button onClick={deleteTweet} label="Delete" />
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <Button label="Close" />
                        </form>
                    </div>
                </div>
            </dialog>
            <RiDeleteBack2Fill
                size={20}
                onClick={() => (document.getElementById(`${tweet_id}`) as HTMLDialogElement).showModal()} />
        </div>
    );
}

export default DeleteModal;