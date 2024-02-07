import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";

interface SidebarItemProps {
  label: string;
  href?: string;
  icon: IconType;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  icon: Icon,
  onClick,
}) => {
  const router = useRouter()

  const handleClick = useCallback(() => {
    if (onClick) {
      return onClick()
    }
    if (href) {
      router.push(href)
    }
  }, [router, onClick, href])

  return (
    <div onClick={handleClick} className="flex flex-row items-center">
      <div className="relative flex items-center justify-center p-4 rounded-full cursor-pointer h-14 w-14 hover:bg-base-100 lg:hidden">
        <Icon size={28} color="primary" />
      </div>
      <div className="relative items-center hidden gap-4 p-4 rounded-full cursor-pointer lg:flex hover:bg-base-100">
        <Icon size={24} color="primary" />
        <p className="hidden text-xl text-primary-content lg:block">{label}</p>
      </div>
    </div>
  );
};

export default SidebarItem;
