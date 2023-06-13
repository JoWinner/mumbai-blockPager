import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { polygonToken1 } from "../../images";
import {
  HiChevronLeft,
  HiChevronRight,
  HiEye,
  HiOutlineBookOpen,
} from "react-icons/hi";
import { signContract } from "../constants/ContentFetch";
import { ethers } from "ethers";
import { Modal } from "../components";

const Carousel = ({ slides}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];
  const [showModal, setShowModal] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const navigate = useNavigate();

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentIndex]);


  const handleRead = async () => {
    
    try {
      const isViewed = await signContract.viewPublicItem(currentSlide.id);
      setShowModal(true);
      setIsViewed(isViewed);
    } catch (error) {
      console.error(error);
    }

   
  };

  const readFree = async () => {
    try {
      setShowModal(false);
      let content = await signContract.viewPublicItemForFree(currentSlide.id);
      content = await signContract.tokenURI(currentSlide.id);

      navigate(
        `/read-published/${currentSlide.id}/${encodeURIComponent(
          currentSlide.title
        )}/${encodeURIComponent(currentSlide.creator)}`,
        {
          state: {
            content,
            currentSlide,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const payToView = async () => {
    try {
      setShowModal(false);
      let content = await signContract.viewPublicItemWithPayment(currentSlide.id, {
        value: ethers.utils.parseEther(currentSlide.price),
      });
      content = await signContract.tokenURI(currentSlide.id);
      console.log("Public item viewed with payment:", content);
      navigate(
        `/read-published/${currentSlide.id}/${encodeURIComponent(
          currentSlide.title
        )}/${encodeURIComponent(currentSlide.creator)}`,
        {
          state: {
            content,
            currentSlide,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const cancel = () => {
    setShowModal(false);
  };

  return (
    <div className="max-w-[1400px] h-[400px] w-full mx-auto my-16 md:pl-9 xs:px-4 relative group">
      {slides.map((content) => (
        <div
          key={content?.id}
          style={{ backgroundImage: `url(${currentSlide?.image})` }}
          className="w-full h-full rounded-md bg-center bg-cover duration-500 absolute mx-auto max-w-screen-xl pt-5 px-4 xs:px-6 md:flex  md:px-8"
        >
          <div
            className="max-w-3xl text-center xs:text-left md:pl-5
           "
          >
            <h1 className="md:text-4xl font-extrabold xs:text-4xl highlight after:bg-gradient-to-tr after:from-blue via-slate-900 after:to-black highlight-variant-5 text-white">
              {currentSlide?.title}
            </h1>

            <p className="hidden mt-4 xs:hidden md:block max-w-4xl xs:text-md xs:leading-relaxed rounded-md text-white backdrop-opacity-10 backdrop-invert bg-black/40 p-3 line-clamp-3">
              <Link
                to={`/published-item/${currentSlide.id}/${encodeURIComponent(
                  currentSlide.title
                )}/${encodeURIComponent(currentSlide.category)}`}
                state={{ content: currentSlide }}
              >
                {currentSlide?.description}
              </Link>
            </p>

            <div className="flex absolute space-x-16 bottom-4  flex-row text-sm mt-4  justify-between items-center ">
              <span className="inline-block bg-slate-200 rounded-full px-3 py-1 md:text-lg text-sm font-semibold text-slate-700 ">
                {currentSlide?.category}
              </span>

              <div className="flex pl-2 space-x-1 items-center bg-slate-200 px-6 rounded-full text-gray-dark  md:text-lg text-sm  font-medium py-1 ">
                <HiEye />
                <span>{currentSlide?.numViews}</span>
              </div>
              <div className=" bg-black space-x-1 text-white rounded-md px-2 py-1 flex justify-center md:text-lg text-sm  w-max  hover:bg-gray-dark transition-colors duration-500 ">
                <button
                  onClick={handleRead}
                  className="flex space-x-1 items-center text-white text-base font-normal  p-2  rounded-md  "
                >
                  <img src={polygonToken1} className="w-4" />
                  <h2 className="">{currentSlide?.price}</h2>
                  <HiOutlineBookOpen className="text-xl font-bold" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-blue/20 text-white cursor-pointer">
        <HiChevronLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-blue/20 text-white cursor-pointer">
        <HiChevronRight onClick={nextSlide} size={30} />
      </div>
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
  );
};
export default Carousel;
