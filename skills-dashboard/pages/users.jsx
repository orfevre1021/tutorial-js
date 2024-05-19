import React, { useState, useEffect, useRef } from "react";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import { FaSort } from "react-icons/fa";
import Header from "../components/Header.jsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, Container, Flex, Grid, Text } from "@chakra-ui/react";

const EmployeeList = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  const positionOrder = {
    課長: 0,
    課長代理: 1,
    主任: 2,
    勤務: 3,
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key].S || a[sortConfig.key].N;
      const bValue = b[sortConfig.key].S || b[sortConfig.key].N;

      if (sortConfig.key === "position") {
        const aPosition =
          positionOrder[aValue] !== undefined ? positionOrder[aValue] : 99;
        const bPosition =
          positionOrder[bValue] !== undefined ? positionOrder[bValue] : 99;

        if (aPosition < bPosition) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aPosition > bPosition) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
      } else {
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
      }
      return 0;
    }
    return employees;
  });

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

        // updated_date.S を文字列として比較して昇順にソート
        const sortedData = data.Items.sort(
          (a, b) => new Date(b.updated_date.S) - new Date(a.updated_date.S)
        );

        setEmployees(sortedData);

        // 新規ユーザー登録後のポップアップ表示
        const params = new URLSearchParams(window.location.search);
        if (params.get("newUser") === "true") {
          const userName = params.get("userName");
          if (!showPopup) {
            toast.success(`ユーザー ${userName} が正常に登録されました！`);
            setShowPopup(true);
            params.delete("newUser");
            params.delete("userName");
            router.replace(
              { pathname: router.pathname, query: params.toString() },
              undefined,
              { shallow: true }
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchEmployees();
  }, [router, showPopup]);

  return (
    <Container maxW="container.xl">
      <ToastContainer />
      <div className="bg-gray-100 min-h-screen">
        <Header user="Tanaka" />
        <div className="p-4">
          <Button
            colorScheme="blue"
            mb={4}
            onClick={() => router.push("/register")}
          >
            ユーザー追加
          </Button>
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <div className="my-3 p-2 grid md:grid-cols-6 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
              <div
                className=" flex items-center"
                onClick={() => handleSort("user_name")}
              >
                氏名
                <FaSort className="ml-2" />
              </div>

              <div
                className="flex items-center"
                onClick={() => handleSort("employee_code")}
              >
                氏名コード
                <FaSort className="ml-2" />
              </div>

              <div
                className="flex items-center"
                onClick={() => handleSort("department")}
              >
                事業部
                <FaSort className="ml-2" />
              </div>

              <div
                className="flex items-center"
                onClick={() => handleSort("division")}
              >
                担当
                <FaSort className="ml-2" />
              </div>

              <div
                className="flex items-center"
                onClick={() => handleSort("position")}
              >
                役職
                <FaSort className="ml-2" />
              </div>

              <div
                className="flex items-center"
                onClick={() => handleSort("updated_date")}
              >
                最新更新
                <FaSort className="ml-2" />
              </div>
            </div>
            <ul>
              {sortedEmployees.map((item, index) => (
                <li
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-6 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <BsPersonFill className="text-blue-800" />
                    </div>
                    <div className="pl-4">
                      <p>{item.user_name.S}</p>
                    </div>
                  </div>

                  <p className="hidden md:flex">{item.employee_code.N}</p>

                  <p className="hidden md:flex">{item.department.S}</p>
                  <p className="hidden md:flex">{item.division.S}</p>
                  <p className="sm:text-left text-right">{item.position.S}</p>

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
                            <Link href={`/users/${item.employee_code.N}`}>
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
    </Container>
  );
};

export default EmployeeList;
