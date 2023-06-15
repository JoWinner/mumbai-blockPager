import { useState, useEffect } from "react";
import { HiX, HiLink, HiOutlineMenuAlt3, HiUserCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { pagerLogo } from "../../images";
import { Search } from "../components";
import {
  signContract,
} from "../constants/ContentFetch";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
    adminLog();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        /* MetaMask is installed */ 
        toggleMenu();
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
       
        // console.log("walletAddress:", accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      // console.log("Please aaa install MetaMask");
    }
  };

  async function adminLog() {
    const contractOwner = await signContract.getContractOwner();
    setOwnerAddress(contractOwner);
    // console.log("Owner", contractOwner);
  }

  const getCurrentWalletConnected = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          // console.log("Connected walletAddress:", accounts[0]);
        } else {
          navigate("/connect");
          // console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      // console.log("Please install MetaMask");
    }
  };
  const addWalletListener = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        // console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      navigate("/connect");
      setWalletAddress("");

      // console.log("Please install MetaMask");
    }
  };

 const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div className=" bg-white py-3 font-secondary font-medium text-gray-dark text-lg">
      <nav className=" flex justify-between items-center w-[92%] mx-auto  ">
        <div>
          <Link to="/">
            <img src={pagerLogo} className="w-10 h-10 md:w-14 md:h-14 cursor-pointer" />
          </Link>
        </div>

        <Search />
        <div
          className={` duration-500 absolute lg:static px-5 lg:min-h-fit min-h-[30vh] left-0 ${
            isMenuOpen
              ? "top-[12%] py-6 lg:py-0 z-10 bg-white lg:hover:bg-transparent "
              : "top-[-100%] flex justify-end"
          } lg:w-1/3 w-full flex lg:justify-between items-center `}
        >
          <ul className="flex  w-full lg:flex-row flex-col lg:items-center  gap-2 lg:gap-3 text-lg font-semibold tracking-wider text-gray-dark">
            <li>
              <Link
                to="/"
                className="focus:bg-gray-light cursor-pointer flex px-20 lg:px-0 py-2 lg:py-0  hover:bg-gray-light lg:hover:text-gray transition-all duration-500 lg:hover:bg-transparent"
                onClick={toggleMenu}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="focus:bg-gray-light cursor-pointer flex px-20 lg:px-0 py-2 lg:py-0  hover:bg-gray-light lg:hover:text-gray transition-all duration-500 lg:hover:bg-transparent"
                onClick={toggleMenu}
              >
                Buy dApp
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="focus:bg-gray-light cursor-pointer flex px-20 lg:px-0 py-2 lg:py-0  hover:bg-gray-light lg:hover:text-gray transition-all duration-500 lg:hover:bg-transparent"
                onClick={toggleMenu}
              >
                Support
              </Link>
            </li>

            {walletAddress && walletAddress === ownerAddress && (
              <li>
                <Link
                  to="/admin"
                  className="focus:bg-gray-light cursor-pointer flex px-20 lg:px-0 py-2 lg:py-0  hover:bg-gray-light lg:hover:text-gray transition-all duration-500 lg:hover:bg-transparent"
                  onClick={toggleMenu}
                >
                  Admin
                </Link>
              </li>
            )}

            <li>
              <div className="  lg:hidden">
                {walletAddress && walletAddress.length > 0 ? (
                  <div className="w-8 p-1 bg-black text-green font-extrabold text-2xl rounded-full  hover:text-gray-light transition-colors duration-500">
                    <HiLink />
                  </div>
                ) : (
                  <div
                    className="p-1 w-24  text-center lg:px-0 bg-black text-gray-light font-extrabold text-lg rounded-full cursor-pointer hover:bg-deep-blue hover:text-white transition-colors duration-500"
                    onClick={connectWallet }
                  >
                    connect
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
        <div className="flex items-center ">
          <div className="hidden lg:flex">
            {walletAddress && walletAddress.length > 0 ? (
              <div className="w-8 p-1 bg-black text-green font-extrabold text-2xl rounded-full hover:text-gray-light transition-colors duration-500">
                <HiLink />
              </div>
            ) : (
              <div
                className="py-1 px-4 w-30 bg-black text-gray-light font-extrabold text-lg rounded-full cursor-pointer hover:bg-deep-blue hover:text-white transition-colors duration-500"
                onClick={connectWallet}
              >
                connect
              </div>
            )}
          </div>
          <div>
            <Link
              to="/user-dashboard"
              className="py-2 cursor-pointer"
              onClick={toggleMenu}
            >
              <HiUserCircle className="text-5xl text-blue hover:text-deep-blue transition-colors duration-500"/>
            </Link>
          </div>
          {isMenuOpen ? (
            <HiX
              onClick={toggleMenu}
              className="text-3xl cursor-pointer lg:hidden"
            />
          ) : (
            <HiOutlineMenuAlt3
              onClick={toggleMenu}
              className="text-3xl cursor-pointer lg:hidden"
            />
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
