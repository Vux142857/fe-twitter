import { Media } from "@/constants/dataBody";
import { randomUUID } from "crypto";
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
                        <Image
                            src={img[0].url}
                            alt={`Image from ${author}`}
                            width={1920}
                            height={1080}
                            className="w-full"
                            quality={100}
                        />
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
        const carouselId = crypto.randomUUID()
        return imgs.map((img, index) => (
            <div id={`${carouselId}-${index}`} className="carousel-item relative w-full group">
                <dialog id={img._id} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <Image
                            src={img?.url}
                            alt={`Image from ${author}`}
                            width={1920}
                            height={1080}
                            className="w-full"
                            quality={100}
                        />
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
                    width={300}
                    height={300}
                    className="w-full"
                    quality={100}
                    onClick={() => (document.getElementById(`${img._id}`) as HTMLDialogElement).showModal()}
                />
                <div className={`absolute justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 
                    ${imgs.length > 0 ? 'flex' : 'hidden'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <a href={`#${carouselId}-${index == 0 ? imgs.length - 1 : index - 1}`} className="btn btn-circle">❮</a>
                    <a href={`#${carouselId}-${index == imgs.length - 1 ? 0 : index + 1}`} className="btn btn-circle">❯</a>
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