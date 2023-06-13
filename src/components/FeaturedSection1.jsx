import { Link } from "react-router-dom";
import { HiArrowRight, HiEye } from "react-icons/hi";
import { polygonToken1 } from "../../images";

const FeaturedSection1 = ({ featuredPager, currentContents }) => {
  return (
    <div className="my-16 text-gray-dark">
      <div className="grid grid-cols-12 px-10 gap-4">
        <div
          className="flex flex-col justify-center col-span-12 rounded-md align-middle bg-no-repeat bg-cover bg-gray-dark lg:col-span-6 lg:h-screen"
          style={{
            backgroundImage: `url(${featuredPager?.image})`,
            backgroundPosition: "center center",
            backgroundBlendMode: "multiply",
            backgroundSize: "cover",
          }}
        >
          <div className="flex flex-col items-center p-8 text-center text-gray-light">
            <div className="px-3 lg:mb-16 rounded-md space-x-2 items-center flex-row flex">
              <span className="flex items-center">
                <HiEye className="text-3xl pr-1" />
                {featuredPager?.numViews}
              </span>
              <span className="px-4 flex items-center">
                <img src={polygonToken1} className="w-6 pr-1" alt="" />
                {featuredPager?.price}
              </span>
            </div>

            <span className="pt-14 md:pt-2">{featuredPager?.date}</span>
            <h1 className="pb-20 text-2xl md:text-4xl font-bold">
              {featuredPager?.title}
            </h1>
            <p className="pb-6 line-clamp-2">{featuredPager?.description}</p>
            <span className="flex flex-row items-center mt-2 gap-2 text-xl font-bold">
              <Link
                className="hover:underline transitions-all duration-500 "
                to={`/creator/${featuredPager.id}/${featuredPager.creatorAddress}/${featuredPager.creator}`}
                state={{ content: featuredPager }}
              >
                {featuredPager?.creator}
              </Link>
              <Link
                to={`/published-item/${featuredPager.id}/${encodeURIComponent(
                  featuredPager.title
                )}/${encodeURIComponent(featuredPager.category)}`}
                state={{ content: featuredPager }}
              >
                <HiArrowRight className="text-2xl mt-1 hover:text-blue transition-all duration-500 hover:translate-x-2" />
              </Link>
            </span>
          </div>
        </div>
        <div className="flex flex-col col-span-12 px-5 divide-y lg:col-span-6 divide-blue">
          {currentContents.map((content) => (
            <div key={content?.id} className="py-2  space-y-2">
              <div className="flex flex-row items-center  justify-between w-full">
                <span className="bg-gray-light text-gray px-4 py-1 text-sm font-bold rounded-full">
                  {content?.category}
                </span>
                <span className="flex items-center">
                  <HiEye className="text-xl pr-1" />
                  {content?.numViews}
                </span>
                <span className="px-4 flex items-center">
                  <img src={polygonToken1} className="w-5 pr-1" alt="" />
                  {content?.price}
                </span>
              </div>
              <h1 className="text-lg font-bold">{content?.title}</h1>
              <p className="line-clamp-3">{content?.description}</p>
              <div className="flex flex-row items-center justify-between w-full">
                <Link
                  to={`/published-item/${content.id}/${encodeURIComponent(
                    content.title
                  )}/${encodeURIComponent(content.category)}`}
                  state={{ content: content }}
                  className="inline-flex items-center py-2 space-x-2 text-sm text-blue group"
                >
                  <span>Read more</span>
                  <HiArrowRight className="transition-all duration-500 group-hover:translate-x-2" />
                </Link>
                <span>{content?.date}</span>
                <h3 className="text-base hover:underline transitions-all duration-500 font-medium">
                  <span className="text-2xl text-blue tracking-wider">-</span>
                  <Link
                    to={`/creator/${content.id}/${content.creatorAddress}/${content.creator}`}
                    state={{ content: content }}
                  >
                    {content?.creator}
                  </Link>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection1;
