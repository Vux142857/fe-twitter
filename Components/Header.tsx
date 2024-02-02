"use client"
import { useRouter } from "next/navigation";
import { useCallback } from "react";
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
        <div className="border-b-[1px] border-neutral-800 p-5">
            <div className="flex items-center gap-2 flex-arrow">
                {
                    showBackArrow && (
                        < BiArrowBack
                            onClick={handleBack}
                            color="white"
                            size={20}
                            className="transition cursor-pointer hover:opacity-70"
                        />)
                }
                <h1 className="text-xl font-semibold text-white">{label}</h1>
            </div>
        </div>
    );
}

export default Header;