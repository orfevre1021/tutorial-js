import React from "react";
import Link from "next/link";
import Image from "next/image";

//react-icons
//https://react-icons.github.io/react-icons/
import { RxPerson } from "react-icons/rx";
import { FiSettings } from "react-icons/fi";
import { SiSkillshare } from "react-icons/si";
import { FaSignOutAlt } from "react-icons/fa";
import { GiSkills } from "react-icons/gi";
import { MdOutlineAppRegistration } from "react-icons/md";

const Sidebar = ({ children }) => {
  return (
    <div className="flex">
      <div className="fixed w-20 h-screen p-4 bg-[#475569] border-r-[1px] flex flex-col justify-between">
        <div className="flex flex-col items-center">
          <Link href="/">
            <div className="bg-purple-800 text-white p-3 rounded-lg inline-block mt-1">
              <SiSkillshare size={20} />
            </div>
          </Link>

          <span className="border-b-[1px] border-gray-200 w-full p-2 mb-2"></span>
          <Link href="/forms">
            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer mt-4 mb-4 p-3 rounded-lg inline-block">
              <MdOutlineAppRegistration size={20} />
            </div>
          </Link>

          <Link href="/users">
            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer mt-4 mb-4 p-3 rounded-lg inline-block">
              <RxPerson size={20} />
            </div>
          </Link>

          <Link href="/skills">
            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer mt-4 mb-4 p-3 rounded-lg inline-block">
              <GiSkills size={20} />
            </div>
          </Link>

          <Link href="/settings">
            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer mt-4 mb-2 p-3 rounded-lg inline-block">
              <FiSettings size={20} />
            </div>
          </Link>

          <span className="border-b-[1px] border-gray-200 w-full p-2 mb-2"></span>

          <Link href="/signout">
            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer mt-4 mb-4 p-3 rounded-lg inline-block">
              <FaSignOutAlt size={20} />
            </div>
          </Link>
        </div>
      </div>
      <main className="ml-20 w-full">{children}</main>
    </div>
  );
};

export default Sidebar;
