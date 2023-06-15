import { pagerLogo } from "../../images";

import {
  FaTwitter,
  FaTelegramPlane,
  FaDiscord,
  FaMedium,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full  min-h-screen flex items-center justify-center bg-black">
      <div className="lg:w-2/3 w-full px-4 text-field-bg flex flex-col">
        <div className="w-full text-5xl md:text-7xl font-bold">
          <h1 className="w-full md:w-2/3">Everyone must Page-on-the-block</h1>
        </div>
        <div className="flex mt-8 flex-col md:flex-row md:justify-between">
          <p className="w-full md:w-2/3 text-white font-light text-xl">
            No more prying eyes - create, encrypt, share or burn with peace of
            mind
          </p>
        </div>
        <div className="flex flex-col ">
          <div className="flex my-12  justify-between">
            <div className="">
              <img src={pagerLogo} className="w-14 h-14 md:w-24 md:h-24" />
            </div>
            <div className="flex flex-1  justify-between flex-col md:justify-between md:flex-row gap-10">
              <div className="flex flex-1 flex-row space-x-8 items-center justify-evenly font-medium uppercase">
                <a className=" md:block cursor-pointer text-slate-300 hover:text-white  transition-colors duration-500 ">
                  About
                </a>
                <a className="md:block cursor-pointer  text-slate-300 hover:text-white  transition-colors duration-500 ">
                  Services
                </a>
                <a className=" md:block cursor-pointer  text-slate-300 hover:text-white  transition-colors duration-500 ">
                  Contact
                </a>
              </div>
              <div className="flex flex-row space-x-8 items-center justify-evenly">
                <a href="discordapp.com/876152493330010183">
                  <FaDiscord className="text-xl text-white hover:text-slate-300 transition-colors duration-500 " />
                </a>
                <a href="https://twitter.com/isPrimos">
                  <FaTwitter className="text-xl text-white hover:text-slate-300 transition-colors duration-500 " />
                </a>
                <a href="https://t.me/joprimos">
                  <FaTelegramPlane className="text-xl text-white hover:text-slate-300 transition-colors duration-500 " />
                </a>
                <a href="https://www.youtube.com/">
                  <FaMedium className="text-xl text-white hover:text-slate-300 transition-colors duration-500  " />
                </a>
              </div>
            </div>
          </div>
          <hr className="border-gray" />
          <p className="w-full text-center py-5 text-gray-600">
            Copyright © 2023 Block-Pager
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
