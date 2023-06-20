import React, { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { polygonToken1 } from "../../images";
import {
  HiArrowLeft,
  HiDocumentText,
  HiEye,
  HiGlobeAlt,
  HiMail,
} from "react-icons/hi";
import { ethers } from "ethers";
import { Loader } from "../components";
import { pagerLogo, banner } from "../../images/index";
import {
  getContents,
  provideContract,
  signContract,
} from "../constants/ContentFetch";

const PublishedCard = lazy(() => import("../components/PublishedCard"));

const CreatorPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id, creatorAddress, creator } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [userData, setUserData] = useState([]);
  const [publishedPagers, setPublishedPagers] = useState([]);
  const [viewedPagers, setViewedPagers] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [stats, setStats] = useState({
    numPublicItems: "0",
    totalViews: "0",
    totalEarnings: "0",
  });
  const { state: { content } = {} } = useLocation();
  const publishedCardHeading = `Published by ${creator}`;
  const viewedCardHeading = `What you have read from ${creator}`;

  useEffect(() => {
    const loadProfile = async () => {};

    if (!content) {
      loadProfile();
    } else {
      setProfile(content);
    }
  }, [id, creatorAddress, content]);

  useEffect(() => {
    loadStats();
    loadPublished(creatorAddress);
    loadViewed(creatorAddress);
  }, [id, creatorAddress, creator]);

  async function loadStats() {
    try {
      const [numPublicItems, totalViews, totalEarnings] =
        await provideContract.getUserStats(creatorAddress);

      setStats({
        numPublicItems: numPublicItems.toNumber(),
        totalViews: totalViews.toNumber(),
        totalEarnings: ethers.utils.formatUnits(
          totalEarnings.toString(),
          "ether"
        ),
      });
    } catch (error) {
      // toast.error(error);
    }
  }

  async function loadPublished(creatorAddress) {
    setIsLoading(true);
    const data = await provideContract.fetchAllContents();

    let contents = await getContents(data, setUserData);
    if (creatorAddress) {
      contents = contents.filter((content) => {
        return content.creatorAddress === creatorAddress;
      });
    }
    setPublishedPagers(contents);
    setIsLoading(false);
  }

  async function loadViewed(creatorAddress) {
    setIsLoading(true);
    const data = await signContract.fetchPaidItems();

    let contents = await getContents(data, setUserData);
    if (creatorAddress) {
      contents = contents.filter((content) => {
        return content.creatorAddress === creatorAddress;
      });
    }
    setViewedPagers(contents);
    setIsLoading(false);
  }

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Suspense fallback={<Loader />}>
        <div className="  pb-8">
          <div className="w-full h-[300px]">
            {profile?.creatorPicture ? (
              <img
                src={profile?.creatorPicture}
                className="w-full h-full object-cover"
                alt={profile?.creator}
              />
            ) : (
              <img src={banner} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="py-8 ">
            <div className="grid grid-cols-1 md:grid-cols-3 px-8">
              <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0 gap-10">
                <div className="flex flex-col ">
                  <p className=" flex items-center justify-center text-black text-xl">
                    <HiDocumentText className="text-2xl text-blue" />

                    {stats?.numPublicItems}
                  </p>
                  <p className="text-gray-dark font-medium">Published</p>
                </div>
                <div className="flex flex-col items-center justify-center ">
                  <span className="flex gap-1">
                    <img src={polygonToken1} className="w-5" />
                    <h2 className=" transition-colors  duration-500 text-xl">
                      {stats?.totalEarnings}
                    </h2>
                  </span>

                  <p className="text-gray-dark font-medium">Earnings</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-black text-xl flex justify-center items-center gap-1">
                    <HiEye className="text-2xl" />
                    {stats?.totalViews}
                  </span>
                  <p className="text-gray-dark font-medium">Views</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src={pagerLogo}
                  className=" h-10 w-10 mx-auto inset-x-0 top-0  "
                />
              </div>
              <div className="space-x-8 flex md:justify-end justify-start md:mt-0 md:py-1  ">
                <button
                  onClick={goBack}
                  className="text-white px-6 md:py-0  bg-blue hover:bg-deep-blue  group rounded-md inline-block py-1 font-medium transition-colors duration-500"
                >
                  <HiArrowLeft className=" transform group-hover:-translate-x-5 duration-500 text-3xl transition-transform" />
                </button>
              </div>
            </div>
            <div className="mt-20 text-center border-b border-gray pb-12 ">
              <div
                className={`bg-white rounded-md ${
                  showMore ? "" : "h-20  sm:h-16  overflow-hidden"
                }`}
              >
                <div className="border-b text-center">
                  <h2 className="md:text-3xl xs:text-2xl p-2 uppercase insetshadow px-8">
                    About {profile?.creator}
                  </h2>
                </div>
                <p className="text-justify leading-6 text-gray-dark text-lg px-8 md:px-20 py-5 ">
                  {profile?.creatorBio}
                </p>
                <p className="text-lg font-normal text-gray-dark px-8 md:px-20 flex flex-row items-center gap-1">
                  <HiMail className="text-2xl text-blue" />
                  {profile?.creatorEmail}
                </p>
                <p className="text-lg font-normal text-gray-dark px-8 flex flex-row items-center gap-1 pb-8 md:px-20">
                  <HiGlobeAlt className="text-2xl text-blue" />
                  {profile?.creatorLink}
                </p>
              </div>
              <button
                className="text-indigo-500 py-2 px-4  font-medium mt-4"
                onClick={handleShowMore}
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex  justify-center min-h-screen mb-60  ">
          <ul className="mx-auto grid max-w-full w-full grid-cols-2 gap-x-5 px-8 ">
            <li className="">
              <input
                className="peer sr-only"
                type="radio"
                value="yes"
                name="answer"
                id="yes"
                defaultChecked
              />
              <label
                className="flex justify-center cursor-pointer rounded-md border border-gray bg-white py-2 px-4 hover:bg-black  hover:text-white  focus:outline-none peer-checked:border-transparent peer-checked:text-white font-medium   peer-checked:ring-blue peer-checked:ring-2 peer-checked:bg-black transition-all duration-500 ease-in-out"
                htmlFor="yes"
              >
                Published
              </label>

              <div className="absolute shadow-lg left-0 right-0 mt-2 rounded-md w-[98vw] mx-auto h-screen overflow-y-scroll scrolling-touch custom-scroll scroll-smooth transition-all duration-500 ease-in-out bg-gray-light  opacity-0 invisible peer-checked:opacity-100 peer-checked:visible  ">
                <PublishedCard
                  publishedPagers={publishedPagers}
                  heading={publishedCardHeading}
                />
              </div>
            </li>

            <li className="">
              <input
                className="peer sr-only"
                type="radio"
                value="yesno"
                name="answer"
                id="yesno"
              />
              <label
                className="flex justify-center cursor-pointer rounded-md border border-gray bg-white py-2 px-4 hover:bg-black  hover:text-white  focus:outline-none peer-checked:border-transparent       peer-checked:text-white font-medium   peer-checked:ring-blue     peer-checked:ring-2 peer-checked:bg-black transition-all duration-500 ease-in-out "
                htmlFor="yesno"
              >
                Viewed
              </label>

              <div className="absolute shadow-lg left-0 right-0   mt-2  rounded-md w-[98vw] mx-auto h-screen overflow-y-scroll scrolling-touch custom-scroll scroll-smooth transition-all duration-500 ease-in-out bg-gray-light  opacity-0 invisible peer-checked:opacity-100 peer-checked:visible   ">
                <PublishedCard
                  publishedPagers={viewedPagers}
                  heading={viewedCardHeading}
                />
              </div>
            </li>
          </ul>
        </div>
      </Suspense>
    </div>
  );
};

export default CreatorPage;
