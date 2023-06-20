import { useState, useEffect, lazy, Suspense } from "react";
import { HiEye, HiOutlineBookOpen } from "react-icons/hi";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { polygonToken1 } from "../../images";
import {
  signContract,
  getContents,
  provideContract,
} from "../constants/ContentFetch";
import { ethers } from "ethers";
import { Modal, Loader } from "../components";

const PublishedCard = lazy(() => import("../components/PublishedCard"));
const CategoryTab = lazy(() => import("../components/CategoryTab"));
const HorizontalCard = lazy(() => import("../components/HorizontalCard"));
const Carousel = lazy(() => import("../components/Carousel"));

const PublishedItem = () => {
  const { id } = useParams();
  const { state: { content } = {} } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [contentData, setContentData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const [featuredPagers, setFeaturedPagers] = useState([]);
  const [userData, setUserData] = useState([]);
  const [publishedPagers, setPublishedPagers] = useState([]);

  const horizCardHeading = "Featured pagers";
  const publishedCardHeading = `Peak your interests`;

  useEffect(() => {
    async function fetchData() {}
    if (!content) {
      fetchData();
    } else {
      setContentData(content);
    }
    loadFeatured();
    loadPublishedPagers();
  }, [content, id]);

  async function loadFeatured() {setIsLoading(true);setIsLoading(true);
    const data = await provideContract.fetchFeaturedItems();
    let contents = await getContents(data, setUserData);
    setFeaturedPagers(contents);
    setIsLoading(false);
  }

  async function loadPublishedPagers() {setIsLoading(true);
    const publishedData = await provideContract.fetchAllContents();
    const contents = await getContents(publishedData, setUserData);
    setPublishedPagers(contents);
    setIsLoading(false);
  }

  const handleRead = async () => {
    setIsLoading(true);

    try {
      const isViewed = await signContract.viewPublicItem(id);
      setShowModal(true);
      setIsViewed(isViewed);
    } catch (error) {
      // console.error(error);
    }

    setIsLoading(false);
  };

  const readFree = async () => {
    try {
      setShowModal(false);
      let content = await signContract.viewPublicItemForFree(id);
      content = await signContract.tokenURI(id);

      navigate(
        `/read-published/${id}/${encodeURIComponent(
          contentData.title
        )}/${encodeURIComponent(contentData.creator)}`,
        {
          state: {
            content,
            contentData,
          },
        }
      );
      // }
    } catch (error) {
      // console.error(error);
    }
  };

  const payToView = async () => {
    try {
      setShowModal(false);
      let content = await signContract.viewPublicItemWithPayment(id, {
        value: ethers.utils.parseEther(contentData.price),
      });
      content = await signContract.tokenURI(id);
      console.log("Public item viewed with payment:", content);
      navigate(
        `/read-published/${id}/${encodeURIComponent(
          contentData.title
        )}/${encodeURIComponent(contentData.creator)}`,
        {
          state: {
            content,
            contentData,
          },
        }
      );
    } catch (error) {
      // console.error(error);
    }
  };

  const cancel = () => {
    setShowModal(false);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Suspense fallback={<Loader />}>
        <HorizontalCard
          featuredPagers={featuredPagers}
          horizCardHeading={horizCardHeading}
        />
        <div className="my-20">
          <header className="px-6 md:px-10 py-4 text-2xl bg-blue w-fit my-5 rounded-r-md">
            <h2 className="font-semibold  leading-6 text-white">
              You can simply sign and read all of this pager!
            </h2>
          </header>
          <section className="bg-white rounded-md mx-8  text-gray-dark ">
            <div className="container max-w-6xl  space-y-6 sm:space-y-12">
              <div className="block max-w-sm relative gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 ">
                <img
                  src={contentData.image}
                  alt={contentData.title}
                  className="object-cover w-full rounded-md md:max-h-full xs:h-96 lg:col-span-6 border-4 border-blue shadow-xl"
                />
                <div className=" lg:col-span-6 py-3">
                  <h3 className="text-2xl font-semibold sm:text-4xl px-4 underline ">
                    {contentData.title}
                  </h3>
                  <div className="flex flex-row justify-between items-center py-4 px-4">
                    <h1 className="font-bold hover:underline">
                      <Link
                        to={`/creator/${contentData.id}/${contentData.creatorAddress}/${contentData.creator}`}
                        state={{ content: contentData }}
                      >
                        {contentData.creator}
                      </Link>
                    </h1>
                    <div className="flex pl-4 space-x-1 items-center text-gray-dark  text-lg font-medium transition-colors duration-500 ">
                      <HiEye />
                      <span className="text-base">{contentData.numViews}</span>
                    </div>
                    <span className="text-xs ">{contentData.date}</span>
                  </div>

                  <p className="px-4 text-justify">{contentData.description}</p>
                  <div className="flex space-x-2  md:px-4 xs:px-2 flex-row text-sm mt-5  justify-between items-center ">
                    <span className="inline-block bg-slate-200 rounded-full px-3 py-2 text-sm font-semibold text-slate-700 ">
                      {contentData.category}
                    </span>
                    <div className="  space-x-1 text-gray-dark   rounded-md px-3 py-2 flex justify-center w-max ">
                      <img src={polygonToken1} className="w-6" />
                      <h2 className=" transition-colors text-lg font-medium duration-500">
                        {contentData.price}
                      </h2>
                    </div>

                    <button
                      onClick={handleRead}
                      className="flex space-x-1 items-center text-white text-base font-normal bg-blue p-2  rounded-md  hover:bg-deep-blue transition-colors duration-500"
                    >
                      <HiOutlineBookOpen className="text-xl font-bold" />
                      <span>Read Pager</span>
                    </button>
                    <div>
                      {showModal && (
                        <Modal
                          title={isViewed ? "Read Pager" : "Sign Pager"}
                          content={
                            isViewed
                              ? "Already signed this pager. Confirm from your wallet to read."
                              : "You are about to sign for a new pager. Please make sure you have enough funds before you continue."
                          }
                          cancelLabel="Cancel"
                          onModalClose={cancel}
                          agreeLabel={isViewed ? "Continue" : "Sign Now"}
                          onAgreeClick={isViewed ? readFree : payToView}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Carousel slides={featuredPagers} />
        <PublishedCard
          publishedPagers={publishedPagers}
          horizCardHeading={publishedCardHeading}
        />
        <CategoryTab publishedPagers={publishedPagers} />
      </Suspense>
    </>
  );
};

export default PublishedItem;
