import { Media } from "@/constants/dataBody";
import Image from "next/image";
import { memo } from "react";

interface CarouselProps {
    imgs: Media[]
    author: string
}

const Carousel: React.FC<CarouselProps> = ({ imgs, author }: { imgs: Media[], author: string }) => {
    const OneImage = (img: Media[]) => {
        return (
            <div className="carousel-item relative w-full group">
                <dialog id={img[0]._id} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <img src={img[0].url} className='h-full w-auto' alt={`Image from ${author}`} />
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
                <Image
                    src={img[0].url}
                    alt={`Image from ${author}`}
                    width={300}
                    height={300}
                    className="w-full"
                    quality={100}
                    onClick={() => (document.getElementById(`${img[0]._id}`) as HTMLDialogElement).showModal()}
                />
            </div>
        )
    }

    const carouselImgs = (imgs: Media[]) => {
        return imgs.map((img, index) => (
            <div id={String(index)} className="carousel-item relative w-full group">
                <dialog id={img._id} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <img src={img.url} className='h-full w-auto' alt={`Image from ${author}`} />
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
                <Image
                    src={img.url}
                    alt={`Image from ${author}`}
                    width={200}
                    height={200}
                    className="w-full"
                    quality={100}
                    onClick={() => (document.getElementById(`${img._id}`) as HTMLDialogElement).showModal()}
                />
                <div className={`absolute justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 
                    ${imgs.length > 0 ? 'flex' : 'hidden'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <a href={`#${index == 0 ? imgs.length - 1 : index - 1}`} className="btn btn-circle">❮</a>
                    <a href={`#${index == imgs.length - 1 ? 0 : index + 1}`} className="btn btn-circle">❯</a>
                </div>
            </div>
        ))
    }
    return (
        <div className="carousel w-full">
            {imgs.length === 1 ? OneImage(imgs) : carouselImgs(imgs)}
        </div>
    );
}

export default memo(Carousel);