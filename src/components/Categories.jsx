import { useState } from "react";
import { categoryList } from "../utils/categoryList";
import { Link } from "react-router-dom";
import { HiMinus, HiPlus } from "react-icons/hi";

const Categories = () => {
  const [expanded, setExpanded] = useState(false);

  // Slice the categoryList to display only half of the categories initially
  const displayedCategories = expanded
    ? categoryList // Display all categories if expanded
    : categoryList.slice(0, Math.ceil(categoryList.length / 2)); // Display half of the categories

  // Toggle the expand/collapse state
  const handleExpand = () => {
    setExpanded((prevState) => !prevState);
  };

  return (
    <div className="my-5 py-7 px-4 ">
      <ul
        className={`flex flex-wrap items-start justify-center px-6 ${
          expanded
            ? "translate-y-4 transform duration-500 transition-transform"
            : " overflow-hidden -translate-y-8 transform duration-500 transition-transform relative"
        }`}
      >
        {displayedCategories.map((category) => (
          <li
            key={category}
            className="bg-gray-light text-gray-dark font-semibold px-3 py-2 m-1 text-sm rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring cursor-pointer focus:ring-opacity-50 hover:ring-blue duration-50 transition-all"
          >
            <Link to={`/category/${category}/pagers`}>{category}</Link>
          </li>
        ))}
      </ul>
      <div className="bg-black rounded-full w-10  ml-16 mt-3">
        {expanded ? (
          <button onClick={handleExpand} className="px-2 py-2 group">
            <HiMinus className="text-2xl text-blue rounded-full group-hover:text-white duration-500 transition-colors" />
          </button>
        ) : (
          <button onClick={handleExpand} className="px-2 py-2 group">
            <HiPlus className="text-2xl text-blue group-hover:text-white duration-500 transition-colors" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Categories;
