import React, { useState, useEffect, useRef } from "react";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import { user_data } from "../data/user_data.jsx";
import Header from "../components/Header.jsx";
import Link from "next/link";

const users = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null); // ドロップダウンメニューを参照するためのref

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null); // メニュー外のクリックでドロップダウンを閉じる
      }
    };

    // ブラウザのクリックイベントを監視
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // コンポーネントのアンマウント時にイベントリスナーを削除
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="ユーザ一覧" user="Tanaka" />

      <div className="p-4">
        <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
          <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
            <span>氏名（氏名コード）</span>
            <span className="sm:text-left text-right">部署</span>
            <span className="hidden md:grid">メールアドレス</span>
            <span className="hidden sm:grid">最新更新</span>
          </div>
          <ul>
            {user_data.map((user, id) => (
              <li
                key={id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BsPersonFill className="text-purple-800" />
                  </div>
                  <div className="pl-4">
                    <p>
                      {user.user_name}
                      <br></br>
                    </p>
                    <p className="text-gray-400">
                      {"（"}
                      {user.employee_code}
                      {"）"}
                    </p>
                  </div>
                </div>
                <p className="hidden md:flex">
                  {user.department} {user.division}
                </p>
                <p className="sm:text-left text-right">{user.email_address}</p>

                <div className="sm:flex hidden justify-between items-center">
                  <p>{user.updated_date}</p>
                  <BsThreeDotsVertical
                    onClick={() => setDropdownOpen(user.employee_code)}
                  />
                  {dropdownOpen === user.employee_code && (
                    <div
                      ref={dropdownRef}
                      className="absolute mt-12 right-0 bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <ul>
                        <li>
                          <Link href={`/view/${user.employee_code}`}>
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              閲覧
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link href={`/edit/${user.employee_code}`}>
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              編集
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link href={`/delete/${user.employee_code}`}>
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              削除
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default users;
