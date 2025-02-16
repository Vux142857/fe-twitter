import { useRouter } from "next/navigation"; // Import from next/router
import { memo, useCallback } from "react";
import Icon from "../../public/iconTheme.svg";
import Image from "next/image";
import Link from "next/link";
interface SidebarTweetButtonProps {
  isLogin: boolean;
}
const SidebarTweetButton: React.FC<SidebarTweetButtonProps> = ({ isLogin }) => {
  const router = useRouter();
  const onClick = useCallback(() => {
    if (isLogin) {
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [isLogin, router]);
  return (
    <div
      onClick={onClick}
      className="w-full"
    >
      <div className="flex items-center justify-center p-4 mt-6 transition rounded-full cursor-pointer lg:hidden h-14 w-14 hover:bg-opacity-80 border-2">
        <Link href='/'>
          <Image src={Icon} width={100} height={100} alt="Daisy flower" />
        </Link>
      </div>
      <div className="hidden px-4 py-4 mt-6 transition rounded-full cursor-pointer lg:block bg-secondary hover:bg-opacity-30 ">
        <p className="hidden lg:block text-center font-semibold text-primary text-[20px]">Tweet</p>
      </div>
    </div>
  );
};

export default memo(SidebarTweetButton);
