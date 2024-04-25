import { useCallback } from "react";
import { RiDeleteBack2Fill } from "react-icons/ri";
import Button from "../Button";

const DeleteModal = ({ accessToken, tweet_id }: { accessToken: string, tweet_id: string }) => {
    const deleteTweet = useCallback(async (ev: any) => {
        ev.stopPropagation();
        if (!accessToken) {
            return;
        }
    }, [accessToken, tweet_id])
    return (
        <div className=''>
            <dialog id={tweet_id} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
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