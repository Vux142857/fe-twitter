import SidebarItem from "./SidebarItem";
import { BsBellFill } from "react-icons/bs";
import Avatar from "../Avatar";
import test from "node:test";
import Button from "../Button";

const RightBar = () => {
  return (
    <div className="w-full hidden lg:block">
      <div className="lg:w-full flex flex-col gap-4 sticky top-0 p-8">
        {/* Trends for you */}
        <div className="border-2 flex flex-col gap-2 rounded-lg overflow-hidden">
          <h1 className="font-bold text-xl px-4 py-4">Trends for you</h1>
          <ul className="flex flex-col gap-2">
            <li className="flex flex-col gap-2 hover:bg-gray-300 p-4 cursor-pointer">
              <p className="font-bold">ABC</p>
              <span>123 posts</span>
            </li>
            <li className="flex flex-col gap-2 hover:bg-gray-300 p-4 cursor-pointer">
              <p className="font-bold">ABC</p>
              <span>123 posts</span>
            </li>
          </ul>
          <a className="px-4 py-2 cursor-pointer hover:bg-gray-200">See more</a>
        </div>
        {/* Who to follow */}
        <div className="border-2 flex flex-col gap-2 rounded-lg overflow-hidden">
          <h1 className="font-bold text-xl px-4 py-4">Who to follow</h1>
          <ul className="flex flex-col gap-2">
            <li className="flex flex-col gap-2 hover:bg-gray-300 p-4 cursor-pointer">
              <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center gap-2">
                  <Avatar username={"Test"} avatarURL={""} isLarge={false} />
                  <div className="flex flex-col">
                    <a
                      href="/"
                      className="
                      font-semibold 
                      cursor-pointer 
                      hover:underline
                  ">
                      {"Test"}
                    </a>
                    <a
                      href="/"
                      className="
                      text-neutral-500
                      cursor-pointer
                      hover:underline
                      hidden
                      md:block
                  ">
                      @{"test"}
                    </a>
                  </div>
                </div>
                <Button
                  onClick={() => { }}
                  label={'Follow'}
                  secondary={false}
                />
              </div>
            </li>
          </ul>
          <a className="px-4 py-2 cursor-pointer hover:bg-gray-200">See more</a>
        </div>
      </div>
    </div>
  );
}

export default RightBar;