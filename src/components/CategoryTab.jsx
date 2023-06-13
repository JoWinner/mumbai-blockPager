import { useState } from "react";
import { HiEye, HiRefresh } from "react-icons/hi";
import { Link } from "react-router-dom";
import { categoryList } from "../utils/categoryList";
import { polygonToken1,pagerLogo } from "../../images";

const CategoryTab = ({ publishedPagers }) => {
  const [activeTabs, setActiveTabs] = useState({});
  const [currentCategories, setCurrentCategories] = useState(
    categoryList.slice(0, 4)
  );

  const getFilteredContents = (category) => {
    const filteredContents = publishedPagers.filter(
      (content) => content.category === category
    );

    return filteredContents;
  };

  const changeCategories = () => {
    const randomCategories = getRandomCategories();
    setCurrentCategories(randomCategories.slice(0, 4));
  };

  const getRandomCategories = () => {
    const shuffledCategories = categoryList.sort(() => 0.5 - Math.random());
    return shuffledCategories;
  };

  const handleTabClick = (tabListId, tabIndex) => {
    setActiveTabs((prevActiveTabs) => ({
      ...prevActiveTabs,
      [tabListId]: tabIndex,
    }));
  };

  const tabLists = [
    {
      id: "tabList-1",
      tabs: currentCategories.map((category, index) => {
        const filteredContents = getFilteredContents(category);

        return {
          id: `tab-${index + 1}`,
          label: category,
          panelId: `panel-${index + 1}`,
          content: (
            <>
              {filteredContents.length === 0 ? (
                <div className="bg-white shadow-lg flex-none w-1/2 lg:w-1/4 mr-8 pb-4 rounded-md">
                  <div className="flex flex-row justify-between w-full px-3 bg-black py-2 text-sm md:text-base text-gray-light">
                    <span className="flex gap-1 ">
                      <img src={polygonToken1} className="w-4 md:w-5" alt="polygon" />
                      111
                    </span>
                    <span className=" flex justify-center items-center gap-1">
                      <HiEye className="text-lg md:text-2xl text-gray" />
                      111
                    </span>
                  </div>
                  <div className="px-3">
                    <h1 className="text-xl font-bold py-2 transition-colors duration-500 text-orange-600 ">
                      No pagers available for this category!
                    </h1>
                    <p className="">
                      Be the first to block a pager for this category
                    </p>
                    <div className="flex flex-row items-center text-sm gap-2">
                      <img
                        src={pagerLogo}
                        alt="logo"
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="flex flex-col">
                        <p className="text-blue">Block Pager</p>
                        <span className="text-gray">1/9/9</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                filteredContents.map((content, contentIndex) => (
                  <div
                    key={contentIndex}
                    className="bg-white shadow-lg flex-none w-1/2 lg:w-1/4 mr-8 pb-4 rounded-md"
                  >
                    <div className="flex flex-row justify-between w-full px-3 bg-black py-2 text-sm md:text-base text-gray-light">
                      <span className="flex gap-1 ">
                        <img
                          src={polygonToken1}
                          className="w-4 md:w-5"
                          alt={content.title}
                        />
                        {content?.price}
                      </span>
                      <span className=" flex justify-center items-center gap-1">
                        <HiEye className="text-lg md:text-2xl text-gray" />
                        {content?.numViews}
                      </span>
                    </div>
                    <div className="px-3">
                      <Link
                        to={`/published-item/${content.id}/${encodeURIComponent(
                          content.title
                        )}/${encodeURIComponent(content.category)}`}
                        state={{ content: content }}
                      >
                        <h1 className="text-base font-medium py-2 hover:text-blue transition-colors duration-500 text-black ">
                          {content?.title}
                        </h1>
                      </Link>
                      <div className="flex flex-row items-center text-sm gap-2">
                        <img
                          src={content?.image}
                          alt={content?.title}
                          className="w-10 h-10 rounded-md"
                        />
                        <div className="flex flex-col">
                          <p className="text-blue  hover:underline transitions-all duration-500">
                            <Link
                              to={`/creator/${content.id}/${content.creatorAddress}/${content.creator}`}
                              state={{ content: content }}
                            >
                              {content?.creator}
                            </Link>
                          </p>
                          <span className="text-gray">{content?.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          ),
        };
      }),
    },
  ];

  return (
    <div className="flex flex-col justify-center my-16 px-2 md:px-8">
      <header className="px-8 py-4 text-2xl">
        <h2 className="font-semibold text-gray-dark">
          Browse and Shuffle Categories
        </h2>
      </header>
      {tabLists.map((tabList) => (
        <div key={tabList?.id} className="mx-auto max-w-full w-full">
          <div
            role="tabList"
            aria-label="tabs"
            className="relative w-full mx-auto h-11 grid grid-cols-4 items-center px-[3px] gap-1 md:gap-4"
          >
            <div
              className={`absolute indicator h-9 my-auto top-0 bottom-0 left-0  shadow-md transition-transform ease-in-out duration-300 ${
                activeTabs[tabList?.id] === 1
                  ? "transform translate-x-0"
                  : activeTabs[tabList?.id] === 2
                  ? "transform translate-x-full"
                  : "transform  translate-x-full"
              }`}
            ></div>
            {tabList.tabs.map((tab) => (
              <button
                key={tab?.id}
                role="tab"
                aria-selected={
                  activeTabs[tabList?.id] === tab?.id ? "true" : "false"
                }
                aria-controls={tab?.panelId}
                id={tab?.id}
                tabIndex={activeTabs[tabList?.id] === tab?.id ? "0" : "-1"}
                onClick={() => handleTabClick(tabList?.id, tab?.id)}
                className={`${
                  activeTabs[tabList?.id] === tab?.id
                    ? "bg-black text-white border-2 border-blue"
                    : "bg-white border border-gray"
                } flex items-center justify-center w-full h-full font-medium text-sm transition-colors duration-300 focus:outline-none rounded-md`}
              >
                {tab?.label}
              </button>
            ))}
          </div>
          <div className="mt-4 ">
            {tabList.tabs.map((tab) => (
              <div
                key={tab?.panelId}
                role="tabpanel"
                aria-labelledby={tab?.id}
                id={tab?.panelId}
                tabIndex={activeTabs[tabList?.id] === tab?.id ? "0" : "-1"}
                className={`${
                  activeTabs[tabList?.id] === tab?.id ? "block" : "hidden"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl px-8 font-semibold text-gray-dark">
                    {tab?.label} pagers
                  </h2>
                  <div>
                    <Link
                      to={`/category/${tab?.label}/pagers`}
                      className="cursor-pointer text-xl mx-1 text-indigo-600 font-bold"
                    >
                      See all
                    </Link>
                  </div>
                </div>
                <div className="flex flex-no-wrap overflow-x-scroll custom-scroll scroll-smooth scrolling-touch items-start py-8">
                  {tab?.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={changeCategories}
        className="p-2 my-5 bg-blue text-white flex rounded-md cursor-pointer w-1/6 md:w-16 hover:bg-deep-blue transition-colors 
              duration-500 items-center "
      >
        <HiRefresh className="text-3xl w-10" />
      </button>
    </div>
  );
};

export default CategoryTab;

