import Button from "../Button";
import { memo, useCallback } from "react";

interface MyModalProps {
    onSubmit?: any;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel?: string;
    disabled?: boolean;
}

const MyModal: React.FC<MyModalProps> = ({ onSubmit, title, body, actionLabel, footer, disabled }) => {
    const handleSubmit = useCallback(() => {
        if (disabled) {
            return;
        }
        onSubmit()
    }, [onSubmit, disabled]);

    return (
        <>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <Button label={`${title}`} onClick={() =>
                (document.getElementById(`${title}`) as HTMLDialogElement).showModal()
            } />
            <dialog id={`${title}`} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{title}</h3>
                    {/*body*/}
                    <div className="relative p-10 pt-0 flex-auto">
                        {body}
                    </div>
                    {/*footer*/}
                    {onSubmit && <div className="flex flex-col gap-2">
                        <Button disabled={disabled} label={actionLabel} secondary fullWidth large onClick={handleSubmit} />
                        {footer}
                    </div>}
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <Button label="Close" />
                        </form>
                    </div>
                </div>
            </dialog>
        </>)
}

export default memo(MyModal);