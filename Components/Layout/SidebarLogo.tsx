import Image from "next/image";
import { useRouter } from "next/navigation"; // Import from next/router
import IconDaisy from "@/public/iconDS.svg"
const SidebarLogo = () => {
  const router = useRouter(); // Use useNavigation

  return (
    <div
      onClick={() => router.push("/")}
      className="flex items-center justify-center rounded-full transition cursor-pointer h-14 w-14 hover:bg-blue-300 hover:bg-opacity-10 m-auto"
    >
      <Image src={IconDaisy} alt="Daisy" />
    </div>
  );
};

export default SidebarLogo;
