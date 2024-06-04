import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RxPerson } from "react-icons/rx";
import { FiSettings } from "react-icons/fi";
import { RiUserStarFill } from "react-icons/ri";
import { SiSkillshare } from "react-icons/si";
import { FaSignOutAlt } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { GiStrongMan } from "react-icons/gi";
import { GiStarMedal } from "react-icons/gi";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { ChakraProvider, Box, IconButton, Flex } from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";

const Sidebar = ({ children }) => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const [isOpen, setIsOpen] = useState(true);
  const [showText, setShowText] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) {
      setShowText(false);
    } else {
      setTimeout(() => {
        setShowText(true);
      }, 100);
    }
  }, [isOpen]);

  return (
    <ChakraProvider>
      <div className="flex">
        <Box
          className={`fixed h-screen p-4 bg-blue-700 text-white flex flex-col justify-between z-20 transition-width duration-100 ${
            isOpen ? "w-52" : "w-20"
          }`}
        >
          <div>
            <div className="flex items-center justify-center mb-6">
              <Link href="/">
                <div className="text-white p-3 rounded-lg inline-block">
                  <SiSkillshare size={isOpen ? 80 : 30} />
                </div>
              </Link>
            </div>

            <nav className="flex flex-col space-y-4 flex-1">
              <Link href="/notifications">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-blue-300 ${
                    currentRoute === "/notifications"
                      ? "bg-blue-500"
                      : "bg-blue-700"
                  }`}
                >
                  <IoIosNotifications size={20} />
                  <span
                    className={`${
                      showText ? "block" : "hidden"
                    } font-bold text-sm`}
                  >
                    お知らせ
                  </span>
                </div>
              </Link>
              <Link href="/users">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer font-bold hover:bg-blue-300 ${
                    currentRoute === "/users" ? "bg-blue-500" : "bg-blue-700"
                  }`}
                >
                  <RiUserStarFill size={20} />
                  <span className={`${showText ? "block" : "hidden"} text-sm`}>
                    ユーザー
                  </span>
                </div>
              </Link>
              <Link href="/skills">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer font-bold hover:bg-blue-300 ${
                    currentRoute === "/skills" ? "bg-blue-500" : "bg-blue-700"
                  }`}
                >
                  <GiStrongMan size={20} />
                  <span className={`${showText ? "block" : "hidden"} text-sm`}>
                    スキル
                  </span>
                </div>
              </Link>
              <Link href="/certifications">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer font-bold hover:bg-blue-300 ${
                    currentRoute === "/certifications"
                      ? "bg-blue-500"
                      : "bg-blue-700"
                  }`}
                >
                  <GiStarMedal size={20} />
                  <span className={`${showText ? "block" : "hidden"} text-sm`}>
                    資格
                  </span>
                </div>
              </Link>
              <Link href="/signout">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer font-bold hover:bg-blue-300 ${
                    currentRoute === "/signout" ? "bg-blue-500" : "bg-blue-700"
                  }`}
                >
                  <FaSignOutAlt size={20} />
                  <span className={`${showText ? "block" : "hidden"} text-sm`}>
                    サインアウト
                  </span>
                </div>
              </Link>
            </nav>
          </div>

          <Flex justify={isOpen ? "flex-end" : "center"}>
            <IconButton
              aria-label="Toggle Sidebar"
              icon={isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              onClick={toggleSidebar}
              bg="blue.700"
              color="white"
              _hover={{ bg: "blue.500" }}
              mb={4}
              alignSelf={isOpen ? "flex-end" : "center"}
            />
          </Flex>
        </Box>
        <div
          className={`flex flex-col flex-1 transition-all duration-100 ${
            isOpen ? "ml-52" : "ml-20"
          }`}
        >
          <Header user="Tanaka" />
          <main className="mt-16 mb-16 p-6 bg-gray-100 flex-1 min-h-screen">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default Sidebar;
