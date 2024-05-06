import React from "react";

const TopCards = () => {
  return (
    <div className="grid lg:grid-cols-6 gap-4 p-4">
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-base font-bold">登録ユーザ数</p>
        </div>
        <p className="bg-[#bfdbfe] flex justify-center items-center p-2 rounded-lg">
          <span className="text-[#1d4ed8] text-base">10</span>
        </p>
      </div>
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-base font-bold">有資格者数</p>
        </div>
        <p className="bg-[#bfdbfe] flex justify-center items-center p-2 rounded-lg">
          <span className="text-[#1d4ed8] text-base">5</span>
        </p>
      </div>
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-base font-bold">他</p>
        </div>
        <p className="bg-[#bfdbfe] flex justify-center items-center p-2 rounded-lg">
          <span className="text-[#1d4ed8] text-base">N/A</span>
        </p>
      </div>
    </div>
  );
};

export default TopCards;
