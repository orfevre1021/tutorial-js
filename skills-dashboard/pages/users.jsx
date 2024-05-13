import React, { useState, useEffect, useRef } from "react";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import { user_data } from "../data/user_data.jsx";
import Header from "../components/Header.jsx";
import Link from "next/link";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "https://yurdpuchaa.execute-api.ap-northeast-1.amazonaws.com/dev3/users"
        );
        const data = await response.json();
        setEmployees(data.Items);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchEmployees();
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
            {employees.map((item, index) => (
              <li
                key={index}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BsPersonFill className="text-purple-800" />
                  </div>
                  <div className="pl-4">
                    <p>
                      {item.user_name.S}
                      <br></br>
                    </p>
                    <p className="text-gray-400">
                      {"（"}
                      {item.employee_code.N}
                      {"）"}
                    </p>
                  </div>
                </div>

                <p className="hidden md:flex">
                  {item.department.S} {item.division.S} {item.position.S}
                </p>
                <p className="sm:text-left text-right">
                  {item.email_address.S}
                </p>

                <div className="sm:flex hidden justify-between items-center">
                  <p>{item.updated_date.S}</p>
                  <BsThreeDotsVertical
                    onClick={() => setDropdownOpen(item.employee_code.N)}
                  />
                  {dropdownOpen === item.employee_code.N && (
                    <div
                      ref={dropdownRef}
                      className="absolute mt-12 right-0 bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <ul>
                        <li>
                          <Link href={`/view/${item.employee_code.N}`}>
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              閲覧
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link href={`/edit/${item.employee_code.N}`}>
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              編集
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link href={`/delete/${item.employee_code.N}`}>
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

export default EmployeeList;
