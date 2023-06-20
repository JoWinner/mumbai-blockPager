import { useState, useEffect, lazy, Suspense } from "react";
import { toast } from "react-toastify";
import { Loader } from "../components";

import {
  getUserStats,
  getUserProfile,
  getUserPicture,
  signContract,
  getUserContents,
  getContents,
} from "../constants/ContentFetch";

const PublishedCard = lazy(() => import("../components/PublishedCard"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const UserProfile = lazy(() => import("../components/UserProfile"));

const UserDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [pagers, setPagers] = useState([]);
  const [userData, setUserData] = useState([]);
  const [publishedPagers, setPublishedPagers] = useState([]);
  const [viewedPagers, setViewedPagers] = useState([]);
  const [pic, setPic] = useState({});
  const publishedCardHeading = "My Published pagers";
  const viewedCardHeading = "Pagers you have read";

  useEffect(() => {
    loadProfile();
    loadPic();
    loadPagers();
    loadPublished();
    loadViewed();
  }, []);

  async function loadProfile() {
    try {
      const userProfile = await getUserProfile(setProfile);
      const { numPublicItems, totalViews, totalEarnings } =
        await getUserStats();

      setProfile({
        ...userProfile,
        numPublicItems,
        totalViews,
        totalEarnings,
      });
    } catch (error) {
      const errorMessage =
        "Please complete your account with a profile!" || error.reason;
      setProfile({
        ...profile,
        bio: (
          <span className="text-2xl font-bold text-red">
            An account without a profile doesn't not exist yet, and cannot
            perform any activity.
          </span>
        ),
      });
      toast.error(errorMessage);
    }
  }

  async function loadPic() {
    try {
      const picture = await getUserPicture();
      setPic({ picture });
    } catch (error) {
      const errorMessage =
        "Please add an image to your profile!" || error.reason;
      toast.error(errorMessage);
    }
  }

  async function loadPagers() {
    setIsLoading(true);
    const data = await signContract.fetchPrivateContents();
    const contents = await getUserContents(data, setUserData);
    setPagers(contents);
    setIsLoading(false);
  }

  async function loadPublished() {
    setIsLoading(true);
    const data = await signContract.fetchMyPublishedItems();
    const contents = await getUserContents(data, setUserData);
    setPublishedPagers(contents);
    setIsLoading(false);
  }

  async function loadViewed() {
    setIsLoading(true);
    const data = await signContract.fetchPaidItems();
    const contents = await getContents(data, setUserData);
    setViewedPagers(contents);
    setIsLoading(false);
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <UserProfile profile={profile} pic={pic} />

        <div className="flex justify-center min-h-screen mb-60 ">
          <ul className="mx-auto grid max-w-full w-full grid-cols-3 gap-x-5 px-8 ">
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
                className="flex justify-center cursor-pointer rounded-md border border-gray bg-white py-2 px-4 hover:bg-black  hover:text-white  focus:outline-none peer-checked:border-transparent       peer-checked:text-white font-medium   peer-checked:ring-blue     peer-checked:ring-2 peer-checked:bg-black transition-all duration-500 ease-in-out"
                htmlFor="yes"
              >
                Privates
              </label>

              <div className="absolute shadow-lg left-0 right-0 py-10 px-6 mt-2  rounded-md w-[98vw] mx-auto transition-all duration-500 ease-in-out  bg-gray-light opacity-0 invisible peer-checked:opacity-100 peer-checked:visible  ">
                <Sidebar pagers={pagers} />
              </div>
            </li>

            <li className="">
              <input
                className="peer sr-only"
                type="radio"
                value="no"
                name="answer"
                id="no"
              />
              <label
                className="flex justify-center cursor-pointer rounded-md border border-gray bg-white py-2 px-4 hover:bg-black  hover:text-white  focus:outline-none peer-checked:border-transparent       peer-checked:text-white font-medium   peer-checked:ring-blue peer-checked:ring-2 peer-checked:bg-black transition-all duration-500 ease-in-out"
                htmlFor="no"
              >
                Published
              </label>

              <div className="absolute shadow-lg left-0 right-0 mt-2 px-6 rounded-md w-[98vw] mx-auto h-screen overflow-y-scroll scrolling-touch custom-scroll scroll-smooth transition-all duration-500 ease-in-out bg-gray-light  opacity-0 invisible peer-checked:opacity-100 peer-checked:visible  ">
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

export default UserDashboard;
