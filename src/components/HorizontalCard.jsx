import { HiEye } from "react-icons/hi";
import { polygonToken1 } from "../../images";
import { Link } from "react-router-dom";

const HorizontalCard = ({featuredPagers, heading}) => {


  return (
    <div className=" flex-grow w-full py-4 sm:py-10 ">
      <div className="mx-auto w-full md:w-11/12 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-dark">{heading}</h2>
        </div>
        <div
          id="scrollContainer"
          className="flex flex-no-wrap overflow-x-scroll custom-scroll scroll-smooth scrolling-touch items-start py-2"
        >
          {featuredPagers.map((content) => (
            <div
              key={content?.id}
              className="flex-none w-2/3 md:w-1/3 mr-8 pb-2  rounded-lg shadow-lg bg-white"
            >
              <div className="flex md:flex-row xs:flex-col justify-start">
                <div className=" ">
                  <div className="flex flex-row justify-between items-center py-1 px-2 bg-gradient-to-br from-slate-900 via-slate-900 to-black">
                    <h1 className="font-bold text-gray-light hover:underline transitions-all duration-500 ">
                      <Link
                        to={`/creator/${content.id}/${content.creatorAddress}/${content.creator}`}
                        state={{ content: content }}
                      >
                        {content?.creator}
                      </Link>
                    </h1>
                    <span className="text-xs text-gray">{content?.date}</span>
                  </div>
                  <p className="  text-gray-dark text-normal hover:text-blue transition-colors duration-500 line-clamp-3 px-2 text-justify">
                    <Link
                      key={content?.id}
                      to={`/published-item/${content.id}/${encodeURIComponent(
                        content.title
                      )}/${encodeURIComponent(content.category)}`}
                      state={{ content: content }}
                    >
                      {content?.description}
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-2 p-2">
                <div className="flex flex-row text-sm justify-between items-center text-gray-400">
                  <span className="inline-block bg-slate-200 rounded-full px-3 py-1 text-sm font-semibold text-slate-700 ">
                    {content?.category}
                  </span>
                  <div className="flex space-x-1 items-center text-gray-dark font-medium ">
                    <HiEye className="text-lg" />
                    <span>{content?.numViews}</span>
                  </div>
                  <div className=" px-3 flex justify-center w-max gap-1  ">
                    <img src={polygonToken1} className="w-4 " />
                    <h2 className=" font-medium  text-gray-dark">
                      {content?.price}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCard;
