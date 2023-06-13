import { useState } from "react";
import { NavLink } from "react-router-dom";
import { polygonToken1 } from "../../images";
import { HiDocumentText, HiEye, HiGlobeAlt, HiMail } from "react-icons/hi";
import { edit, banner } from "../../images/index";

const UserProfile = ({ profile,pic }) => {
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="  pb-8">
      <div className="w-full h-[300px]">
        {pic.picture ? (
          <img
            src={pic.picture}
            className="w-full h-full object-cover"
            alt={profile?.title}
          />
        ) : (
          <img src={banner} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="">
        <div className="py-8 ">
          <div className="grid grid-cols-1 md:grid-cols-3 px-8">
            <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0 gap-10">
              <div className="flex flex-col ">
                <p className=" flex items-center justify-center text-black text-xl">
                  <HiDocumentText className="text-2xl text-blue" />

                  {profile?.numPublicItems}
                </p>
                <p className="text-gray-dark font-medium">Published</p>
              </div>
              <div className="flex flex-col items-center justify-center ">
                <span className="flex gap-1">
                  <img src={polygonToken1} className="w-5" />
                  <h2 className=" transition-colors  duration-500 text-xl">
                    {profile?.totalEarnings}
                  </h2>
                </span>

                <p className="text-gray-dark font-medium">Earnings</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-black text-xl flex justify-center items-center gap-1">
                  <HiEye className="text-2xl" />
                  {profile?.totalViews}
                </span>
                <p className="text-gray-dark font-medium">Views</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <NavLink to="/edit-profile">
                <img
                  src={edit}
                  alt="edit"
                  className=" h-10 w-10 mx-auto inset-x-0 top-0  "
                />
              </NavLink>
            </div>

            <div className="space-x-8 flex justify-between md:mt-0 md:justify-center">
              <NavLink to="/private-pager">
                <button className="text-white px-6 py-2 rounded-md bg-blue hover:bg-deep-blue  inline-block w-full font-medium transition-colors duration-500">
                  Private
                </button>
              </NavLink>
              <NavLink to="/publish-pager">
                <button className="text-white px-6 py-2 rounded-md  bg-black hover:bg-dark-black font-medium  transition-colors duration-500">
                  Publish
                </button>
              </NavLink>
            </div>
          </div>
          <div className="mt-20 text-center border-b border-gray pb-12 ">
            <div
              className={`bg-white rounded-md ${
                showMore ? "" : "h-20 sm:h-16 overflow-hidden"
              }`}
            >
              <div className="border-b text-center">
                <h2 className="md:text-3xl xs:text-2xl p-2 uppercase insetshadow px-8">
                  About {profile?.name}
                </h2>
              </div>
              <p className="text-justify leading-6 text-gray-dark text-lg px-8 md:px-20 py-5 ">
                {profile?.bio}
              </p>
              <p className="text-lg font-normal text-gray-dark px-8 md:px-20 flex flex-row items-center gap-1">
                <HiMail className="text-2xl text-blue" />
                {profile?.email}
              </p>
              <p className="text-lg font-normal text-gray-dark px-8 flex flex-row items-center gap-1 pb-8 md:px-20">
                <HiGlobeAlt className="text-2xl text-blue" />
                {profile?.link}
              </p>
            </div>
            <button
              className="text-indigo-500 py-2 px-4  font-medium mt-4"
              onClick={handleShowMore}
            >
              {showMore ? "<Show less" : "Show more"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
