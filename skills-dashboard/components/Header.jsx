import React from "react";
import { FiBell } from "react-icons/fi";

const Header = (props) => {
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-10 flex justify-between items-center px-6 py-4">
      <h1 className="text-2xl font-semibold text-gray-700">{props.title}</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">サインインユーザ： {props.user}</span>
        <FiBell className="text-gray-600" size={24} />
      </div>
    </header>
  );
};

export default Header;
