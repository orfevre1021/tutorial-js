import React from "react";
import Link from "next/link";
import { useRouter } from "next/router"; // useRouterフックのインポート
import { RxPerson } from "react-icons/rx";
import { FiSettings } from "react-icons/fi";
import { SiSkillshare } from "react-icons/si";
import { FaSignOutAlt } from "react-icons/fa";
import { MdOutlineAppRegistration } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import Header from "./Header"; // Headerのインポート
import Footer from "./Footer"; // Footerのインポート

const Sidebar = ({ children }) => {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <div className="flex">
      <div className="fixed w-64 h-screen p-4 bg-blue-700 text-white flex flex-col justify-between z-20">
        <div>
          <div className="flex items-center justify-center mb-6">
            <Link href="/">
              <div className="text-white p-3 rounded-lg inline-block">
                <SiSkillshare size={100} />
              </div>
            </Link>
          </div>

          <nav className="flex flex-col space-y-4">
            <Link href="/overview">
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-blue-300 ${
                  currentRoute === "/overview" ? "bg-blue-500" : "bg-blue-700"
                }`}
              >
                <RxDashboard size={24} />
                <span className="text-lg">ダッシュボード</span>
              </div>
            </Link>
            <Link href="/register">
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-blue-300 ${
                  currentRoute === "/register" ? "bg-blue-500" : "bg-blue-700"
                }`}
              >
                <MdOutlineAppRegistration size={24} />
                <span className="text-lg">ユーザ登録</span>
              </div>
            </Link>
            <Link href="/users">
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-blue-300 ${
                  currentRoute === "/users" ? "bg-blue-500" : "bg-blue-700"
                }`}
              >
                <RxPerson size={24} />
                <span className="text-lg">ユーザ一覧</span>
              </div>
            </Link>
            <Link href="/settings">
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-blue-300 ${
                  currentRoute === "/settings" ? "bg-blue-500" : "bg-blue-700"
                }`}
              >
                <FiSettings size={24} />
                <span className="text-lg">設定</span>
              </div>
            </Link>
          </nav>
        </div>

        <Link href="/signout">
          <div className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-blue-300">
            <FaSignOutAlt size={24} />
            <span className="text-lg">サインアウト</span>
          </div>
        </Link>
      </div>
      <div className="flex flex-col flex-1 ml-64">
        <Header user="Tanaka" />
        <main className="mt-16 mb-16 p-6 bg-gray-100 flex-1 min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Sidebar;
