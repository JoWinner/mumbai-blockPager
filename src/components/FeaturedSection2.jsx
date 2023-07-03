import { HiEye } from "react-icons/hi";
import { polygonToken1 } from "../../images";
import { Link } from "react-router-dom";

const FeaturedSection2 = ({ featuredPagers, featuredPager }) => {


  return (
    <div className="px-10 my-16 text-black grid grid-cols-12 gap-y-6 md:gap-4">
      <div className="flex flex-col justify-between col-span-12 py-2 space-y-8 md:space-y-10 md:col-span-5 lg:col-span-4 xl:col-span-3 md:h-[450px] h-[500px]">
        {/* Left Scroll */}
        <div className="flex flex-col md:space-y-5 xs:space-y-3 flex-no-wrap overflow-y-scroll scrolling-touch scroll-smooth custom-scroll">
          {featuredPagers.map((content) => (
            <div
              className="flex flex-col rounded-md bg-white shadow-lg space-y-2  pb-2"
              key={content?.id}
            >
              <div className="flex flex-row justify-between p-2 items-center bg-gradient-to-br from-slate-900 via-slate-900 to-black text-gray-light">
                <h3 className="flex items-center space-x-2">
                  <span className="flex-shrink-0 w-2 h-2 uppercase rounded-full bg-blue"></span>
                  <span className="text-sm font-bold tracking-wider ">
                    <Link to={`/category/${content.category}/pagers`}>
                      {content?.category}
                    </Link>
                  </span>
                </h3>
                <span className="text-xs text-gray">{content?.date}</span>
              </div>
              <p className="text-gray-dark hover:text-blue transition-colors duration-500 line-clamp-4 px-2 text-sm">
                <Link
                  to={`/published-item/${content.id}/${encodeURIComponent(
                    content.title
                  )}/${encodeURIComponent(content.category)}`}
                  state={{ content: content }}
                >
                  {content?.description}
                </Link>
              </p>
              <div className="flex flex-row text-sm justify-between items-center text-gray-400 px-2">
                <Link
                  to={`/creator/${content.id}/${content.creatorAddress}/${content.creator}`}
                  state={{ content: content }}
                  className="hover:underline transitions-all duration-500  text-blue truncate"
                >
                  {content?.creator}
                </Link>
                <div className="flex space-x-1 items-center text-gray-dark font-medium">
                  <HiEye className="text-lg" />
                  <span>{content?.numViews}</span>
                </div>
                <div className="px-3 flex justify-center w-max gap-1">
                  <img src={polygonToken1} className="w-4" alt="" />
                  <h2 className="font-medium text-gray-dark">
                    {content?.price}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col w-full space-y-2">
          <div className="flex w-full h-1 bg-opacity-30 bg-blue">
            <div className="w-1/2 h-full bg-blue"></div>
          </div>
          <span className="flex items-center justify-between w-full">
            <span className="text-2xl px-4 font-semibold text-gray-dark">
              Featured Pagers
            </span>
            <svg
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 strokeCurrent text-blue"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </div>
      </div>
      {/* Banner with link */}
      <Link
        to={`/published-item/${featuredPager.id}/${encodeURIComponent(
          featuredPager.title
        )}/${encodeURIComponent(featuredPager.category)}`}
        state={{ content: featuredPager }}
        className="relative flex col-span-12 bg-slate-500 xl:col-span-6 lg:col-span-5 md:col-span-7 h-96 rounded-lg"
      >
        <img
          src={featuredPager?.image}
          className="rounded-lg w-full bg-cover bg-center"
          alt={featuredPager?.title}
        />

        <div className="flex text-base px-4 py-1 top-5 left-5 absolute bg-gradient-to-br from-slate-900 via-slate-900 to-black space-x-1 items-center rounded-md text-gray-light">
          <span className="relative flex-shrink-0 w-2 h-2 rounded-full bg-blue">
            <span className="absolute flex-shrink-0 w-3 h-3 rounded-full -left-1 -top-1 animate-ping bg-blue"></span>
          </span>

          <span className="hover:text-white transition-colors duration-500">
            {featuredPager?.numViews}
          </span>
        </div>

        <div className="flex items-center p-2 justify-between bg-dark-black bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 absolute w-full bottom-0 rounded-b-lg border-t-2 border-y-blue left-1/2 -translate-x-1/2 transition-colors duration-500">
          <h2 className="md:text-2xl text-xl text-white font-bold w-4/5">
            {featuredPager?.title}
          </h2>
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-black rounded-md p-2 flex justify-center w-max gap-1 transition-colors duration-500">
            <img src={polygonToken1} className="w-5" alt="" />
            <h2 className="text-base font-semibold text-gray-light">
              {featuredPager?.price}
            </h2>
          </div>
        </div>
      </Link>
      {/* Right Scroll */}
      <div className=" py-1 col-span-12  lg:col-span-3  lg:block">
        <div className="flex flex-col text-white h-[500px] md:h-96 px-1 flex-no-wrap overflow-y-scroll scrolling-touch divide-y custom-scroll scroll-smooth space-y-2">
          {featuredPagers.map((content) => (
            <div
              className="flex bg-gradient-to-br from-slate-900 via-slate-900 to-black px-1 py-3"
              key={content?.id}
            >
              <img
                alt={content?.title}
                className="flex-shrink-0 object-cover w-20 h-20 mr-4 bg-gray-500"
                src={content?.image}
              />
              <div className="flex flex-col flex-grow">
                <span className="hover:underline text-base transitions-all duration-500 font-semibold">
                  <Link
                    to={`/published-item/${content.id}/${encodeURIComponent(
                      content.title
                    )}/${encodeURIComponent(content.category)}`}
                    state={{ content: content }}
                  >
                    {content?.title}
                  </Link>
                </span>
                <div className="lg:hidden line-clamp-4 text-sm font-normal text-gray-light">
                  {content.description}
                </div>
                <p className="mt-auto text-xs text-gray">
                  {content.date}
                  <span className="block text-blue lg:ml-2 lg:inline hover:underline">
                    <Link to={`/category/${content.category}/pagers`}>
                      {content?.category}
                    </Link>
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection2;
