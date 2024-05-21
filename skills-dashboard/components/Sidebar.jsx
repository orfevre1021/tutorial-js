import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RxPerson } from "react-icons/rx";
import { FiSettings } from "react-icons/fi";
import { SiSkillshare } from "react-icons/si";
import { FaSignOutAlt } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
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
    if (isOpen) {
      setIsOpen(false); // まずサイドバーを閉じる
      setShowText(false); // サイドバーが閉じたらテキストを非表示にする
    } else {
      setIsOpen(true); // まずサイドバーを開く
      setTimeout(() => {
        setShowText(true); // その後、テキストを表示する
      }, 100); // サイドバーのトランジション時間に合わせる
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setShowText(false);
    }
  }, [isOpen]);

  return (
    <ChakraProvider>
      <div className="flex">
        <Box
          className={`fixed h-screen p-4 bg-blue-700 text-white flex flex-col justify-between z-20 transition-width duration-100 ${
            isOpen ? "w-64" : "w-20"
          }`}
        >
          <div>
            <div className="flex items-center justify-center mb-6">
              <Link href="/">
                <div className="text-white p-3 rounded-lg inline-block">
                  <SiSkillshare size={isOpen ? 100 : 40} />
                </div>
              </Link>
            </div>

            <nav className="flex flex-col space-y-4 flex-1">
              <Link href="/dashboard">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-blue-300 ${
                    currentRoute === "/dashboard"
                      ? "bg-blue-500"
                      : "bg-blue-700"
                  }`}
                >
                  <RxDashboard size={24} />
                  <span
                    className={`${
                      showText ? "block" : "hidden"
                    } font-bold text-lg`}
                  >
                    ダッシュボード
                  </span>
                </div>
              </Link>
              <Link href="/users">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer font-bold hover:bg-blue-300 ${
                    currentRoute === "/users" ? "bg-blue-500" : "bg-blue-700"
                  }`}
                >
                  <RxPerson size={24} />
                  <span className={`${showText ? "block" : "hidden"} text-lg`}>
                    ユーザー
                  </span>
                </div>
              </Link>
              <Link href="/settings">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer font-bold hover:bg-blue-300 ${
                    currentRoute === "/settings" ? "bg-blue-500" : "bg-blue-700"
                  }`}
                >
                  <FiSettings size={24} />
                  <span className={`${showText ? "block" : "hidden"} text-lg`}>
                    設定
                  </span>
                </div>
              </Link>
              <Link href="/signout">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer font-bold  hover:bg-blue-300 ${
                    currentRoute === "/signout" ? "bg-blue-500" : "bg-blue-700"
                  }`}
                >
                  <FaSignOutAlt size={24} />
                  <span className={`${showText ? "block" : "hidden"} text-lg`}>
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
            isOpen ? "ml-64" : "ml-20"
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
