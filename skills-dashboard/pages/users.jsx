import React from "react";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import { user_data } from "../data/user_data.jsx";
import Header from "../components/Header.jsx";

const users = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* <div className="flex justify-between p-4">
        <h2 className="text-2xl font-bold p-4">ユーザ一覧</h2>
      </div> */}
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
                      {user.name}
                      <br></br>
                    </p>
                    <p className="text-gray-400">
                      {"（"}
                      {user.name_code}
                      {"）"}
                    </p>
                  </div>
                </div>
                <p className="hidden md:flex">
                  {user.department} {user.division}
                </p>
                <p className="sm:text-left text-right">{user.mail}</p>

                <div className="sm:flex hidden justify-between items-center">
                  <p>{user.date}</p>
                  <BsThreeDotsVertical />
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
