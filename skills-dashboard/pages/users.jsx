import React, { useState, useEffect, useRef } from "react";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import { FaSort } from "react-icons/fa";
import Header from "../components/Header.jsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredEmployees = sortedEmployees.filter((employee) => {
    const userName = employee.user_name.S.toLowerCase();
    const employeeCode = employee.employee_code.N.toString();
    const query = searchQuery.toLowerCase();
    return userName.startsWith(query) || employeeCode.startsWith(query);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
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

        const sortedData = data.Items.sort(
          (a, b) => new Date(b.updated_date.S) - new Date(a.updated_date.S)
        );

        setEmployees(sortedData);

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

        // Check for deleteSuccess query parameter
        if (params.get("deleteSuccess") === "true") {
          if (!showPopup) {
            toast.success("ユーザーが正常に削除されました！");
            setShowPopup(true);
            params.delete("deleteSuccess");
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
      <style jsx>{`
        .fixed-width {
          width: 3.5rem;
        }
        .flex-grow {
          flex: 1;
        }
        .grid-container {
          display: grid;
          grid-template-columns: 3.5rem repeat(6, 1fr) 3.5rem;
        }
        .grid-item {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .grid-header {
          cursor: pointer;
        }
        .border-right {
          border-right: 1px solid #e2e8f0;
        }
      `}</style>
      <ToastContainer />
      <div className="bg-gray-100 min-h-screen">
        <Header user="Tanaka" />
        <div className="p-4">
          <Flex
            mb={4}
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ base: "flex-start", md: "center" }}
            gap={4}
          >
            <InputGroup flex="9">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="氏名または氏名コードで検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg="white"
                borderRadius="md"
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
                _focus={{ boxShadow: "outline" }}
              />
            </InputGroup>
            <Button
              colorScheme="blue"
              onClick={() => router.push("/register")}
              flex="2"
              whiteSpace="normal"
              wordWrap="break-word"
            >
              ユーザー追加
            </Button>
          </Flex>
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <div className="my-3 p-2 grid-container items-center justify-between cursor-pointer border-b border-gray-200">
              <div className="fixed-width"></div>

              <div
                className="flex-grow grid-item border-right grid-header"
                onClick={() => handleSort("employee_code")}
              >
                氏名コード
                <FaSort className="ml-2" />
              </div>

              <div
                className="flex-grow grid-item border-right grid-header"
                onClick={() => handleSort("user_name")}
              >
                氏名
                <FaSort className="ml-2" />
              </div>

              <div
                className="flex-grow grid-item border-right grid-header"
                onClick={() => handleSort("department")}
              >
                事業部
                <FaSort className="ml-2" />
              </div>

              <div
                className="flex-grow grid-item border-right grid-header"
                onClick={() => handleSort("division")}
              >
                担当
                <FaSort className="ml-2" />
              </div>

              <div
                className="flex-grow grid-item border-right grid-header"
                onClick={() => handleSort("position")}
              >
                役職
                <FaSort className="ml-2" />
              </div>

              <div
                className="flex-grow grid-item border-right grid-header"
                onClick={() => handleSort("updated_date")}
              >
                最新更新
                <FaSort className="ml-2" />
              </div>

              <div className="fixed-width"></div>
            </div>
            <ul>
              {filteredEmployees.map((item, index) => (
                <li
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid-container items-center justify-between cursor-pointer border-b border-gray-200"
                >
                  <div className="fixed-width grid-item">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <BsPersonFill className="text-blue-800" />
                    </div>
                  </div>

                  <div className="flex-grow grid-item border-right">
                    <p>{item.employee_code.N}</p>
                  </div>

                  <p className="hidden md:flex flex-grow grid-item border-right">
                    {item.user_name.S}
                  </p>

                  <p className="hidden md:flex flex-grow grid-item border-right">
                    {item.department.S}
                  </p>
                  <p className="hidden md:flex flex-grow grid-item border-right">
                    {item.division.S}
                  </p>
                  <p className="flex-grow grid-item border-right">
                    {item.position.S}
                  </p>

                  <p className="flex-grow grid-item border-right">
                    {item.updated_date.S}
                  </p>

                  <div className="fixed-width grid-item">
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
