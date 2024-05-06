import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { skill_data } from "../data/skill_data.jsx";
import Header from "../components/Header.jsx";
import { FaAws } from "react-icons/fa";

//サービスアイコンの下記サイトから引用する予定
//https://icons8.jp/icons

const skills = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="スキル一覧" user="Tanaka" />

      <div className="p-4">
        <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
          <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
            <span>ベンダー</span>
            <span className="sm:text-left text-right">区分1</span>
            <span className="hidden md:grid">区分2</span>
            <span className="hidden sm:grid">スキル</span>
          </div>
          <ul>
            {skill_data.map((skill, id) => (
              <li
                key={id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaAws className="text-purple-800" />
                  </div>
                  <div className="pl-4">
                    <p>
                      {skill.icon}
                      <br></br>
                    </p>
                  </div>
                </div>
                <p className="hidden md:flex">{skill.type1}</p>
                <p className="sm:text-left text-right">{skill.type2}</p>

                <div className="sm:flex hidden justify-between items-center">
                  <p>{skill.skill_name}</p>
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

export default skills;
