"use client"
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";

interface HeaderProps {
    label?: string
    showBackArrow?: boolean
}

const Header: React.FC<HeaderProps> = ({ label, showBackArrow }) => {
    const router = useRouter()
    const handleBack = useCallback(() => {
        router.back()
    }, [router])
    return (
        <>
            <div className="border-b-[1px] border-neutral-800 p-5 fixed max-w-full">
                <div className="flex items-center gap-2 flex-arrow">
                    {
                        showBackArrow && (
                            < BiArrowBack
                                onClick={handleBack}
                                color="secondary"
                                size={20}
                                className="transition cursor-pointer hover:opacity-70"
                            />)
                    }
                    <h1 className="text-xl font-semibold text-primary-content">{label}</h1>
                </div>
            </div>
            <div className=" border-neutral-800 p-10">
                <div className="flex items-center gap-2 flex-arrow">
                </div>
            </div>
        </>
    );
}

export default memo(Header);