import React from "react";
import { HiFire, HiEye, HiExclamation, HiShare } from "react-icons/hi";

const PagerActions = ({ onClick }) => {
  return (
    <div className=" bg-slate-200 rounded-md shadow-lg transform duration-200 easy-in-out ">
      <div className="flex flex-wrap justify-around gap-2 sm:gap-4 text-xl">
        <div className="rounded-full bg-black h-7 flex justify-center w-7 md:mt-1 xs:mt-0">
          <button
            className="text-red hover:text-yellow-400 p-1 sm:p-2 inline-flex items-center "
            onClick={() => onClick("alert")}
          >
            <HiExclamation />
          </button>
        </div>
        <button
          className="text-teal-500 hover:text-teal-700 p-1 sm:p-2 inline-flex items-center "
          onClick={() => onClick("view")}
        >
          <HiEye />
        </button>

        <button
          className="text-orange-500 hover:text-orange-700 p-1 sm:p-2  inline-flex items-center "
          onClick={() => onClick("burn")}
        >
          <HiFire />
        </button>
        <button
          className="text-lime-500  hover:text-lime-700 p-1 sm:p-2  inline-flex items-center  "
          onClick={() => onClick("transfer")}
        >
          <HiShare />
        </button>
      </div>
    </div>
  );
};

export default PagerActions;
