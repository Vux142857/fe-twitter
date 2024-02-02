import { useRouter } from "next/navigation"; // Import from next/router
import { useCallback } from "react";
import { FaFeather } from "react-icons/fa";

const SidebarTweetButton = () => {
  const router = useRouter(); // Use useNavigation
  // const loginModal = useLoginModal();
  // const onClick = useCallback(() => {
  //   loginModal.onOpen();
  // }, [loginModal])
  return (
    <div
      // onClick={() => router.push("/")}
    >
      <div className="flex items-center justify-center p-4 mt-6 transition rounded-full cursor-pointer lg:hidden h-14 w-14 bg-sky-500 hover:bg-opacity-80 ">
        <FaFeather size={24} color="white" />
      </div>
      <div className="hidden px-4 py-4 mt-6 transition rounded-full cursor-pointer lg:block bg-sky-500 hover:bg-opacity-90 ">
        <p className="hidden lg:block text-center font-semibold text-white text-[20px]">Tweet</p>
      </div>
    </div>
  );
};

export default SidebarTweetButton;
