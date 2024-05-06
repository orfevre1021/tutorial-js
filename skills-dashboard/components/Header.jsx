import React from "react";

const Header = (props) => {
  return (
    <div className="flex justify-between px-4 pt-4">
      <h2 className="text-lg font-bold p-4">{props.title}</h2>
      <h2 className="text-lg font-bold p-4">ログインユーザ： {props.user}</h2>
    </div>
  );
};

export default Header;
