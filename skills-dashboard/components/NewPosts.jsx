import React from "react";
import { user_data } from "../data/user_data.jsx";
// import { SlBadge } from "react-icons/sl";

const NewPosts = (props) => {
  return (
    <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll">
      <h1 className="font-bold">{props.title}</h1>
      <ul>
        {user_data.map((post, id) => (
          <li
            key={id}
            className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer"
          >
            <div className="bg-purple-100 rounded-lg p-3">
              <p className="text-purple-800 font-bold">{post.vender}</p>
            </div>
            <div className="pl-4">
              <p className="text-gray-800 font-bold">{post.certification}</p>
              <p className="text-gray-400 text-sm">{post.name}</p>
              <p className="text-gray-400 text-sm">{post.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewPosts;
