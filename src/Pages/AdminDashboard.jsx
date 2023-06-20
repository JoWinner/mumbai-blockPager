import { useState, useEffect } from "react";
import { polygonToken1, polygonToken2 } from "../../images";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Modal } from "../components";
import { useNavigate, Link } from "react-router-dom";

import {
  HiBookOpen,
  HiUserGroup,
  HiDocumentText,
  HiHome,
  HiBookmark,
  HiLink,
  HiExclamation,
} from "react-icons/hi";

import { provider, signContract } from "../constants/ContentFetch";

const AdminDashboard = () => {
  const [ownerAddress, setOwnerAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [personalFee, setPersonalFee] = useState("");
  const [featuredFee, setFeaturedFee] = useState("");
  const [personalFeeValue, setPersonalFeeValue] = useState("");
  const [featuredFeeValue, setFeaturedFeeValue] = useState("");
  const [totalUser, setTotalUser] = useState("");
  const [totalPagers, setTotalPagers] = useState("");
  const [privatePagers, setPrivatePagers] = useState("");
  const [publishedPagers, setPublishedPagers] = useState("");
  const [contractBalance, setContractBalance] = useState("");
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    content: null,
  });
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
  }, [walletAddress]);

  const getCurrentWalletConnected = async () => {
    const contractOwner = await signContract.getContractOwner();
    setOwnerAddress(contractOwner);

    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0].toLowerCase());
          // console.log(
          //   "The Connected walletAddress:",
          //   accounts[0].toLowerCase()
          // );
          if (accounts[0].toLowerCase() !== contractOwner.toLowerCase()) {
            navigate("*");
          }
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      const blockPagerAddress = signContract.address;
      // const contractOwner = await signContract.getContractOwner();

      setContractAddress(blockPagerAddress);
      // setOwnerAddress(contractOwner.toLowerCase());

      const [perFee, featFee] = await signContract.getFees();
      const personalFee = ethers.utils.formatUnits(perFee.toString(), "ether");
      const featuredFee = ethers.utils.formatUnits(featFee.toString(), "ether");
      setPersonalFee(personalFee);
      setFeaturedFee(featuredFee);

      const supply = await signContract.totalSupply();
      setTotalPagers(supply.toNumber());

      const users = await signContract.userCount();
      setTotalUser(users.toNumber());

      const privates = await signContract.totalPrivateItems();
      setPrivatePagers(privates.toNumber());

      const published =
        (await signContract.totalSupply()) - privates.toNumber();
      setPublishedPagers(published);

      const balance = await provider.getBalance(blockPagerAddress);
      setContractBalance(ethers.utils.formatEther(balance));
    };
    init();
  }, []);

  const handleWithdraw = async () => {
    try {
      const address = document.getElementsByName("address")[0].value;
      const tx = await signContract.withdrawFunds(address);
      const receipt = await tx.wait();
      console.log(receipt);
      toast.success("Funds withdrawn successfully!");
    } catch (error) {
      const errorMessage = error.reason;
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handlePersonalFeeUpdate = async (e) => {
    e.preventDefault();
    try {
      const newPersonalFee = ethers.utils.parseEther(personalFeeValue);

      await signContract.updatePersonalFee(newPersonalFee);
      setPersonalFee(ethers.utils.formatEther(newPersonalFee));
      toast.success("Private content fee updated successfully!");
    } catch (error) {
      const errorMessage = error.reason;
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleFeaturedFeeUpdate = async (e) => {
    e.preventDefault();
    try {
      const newFeaturedFee = ethers.utils.parseEther(featuredFeeValue);

      await signContract.updateFeaturedFee(newFeaturedFee);
      setFeaturedFee(ethers.utils.formatEther(newFeaturedFee));
      toast.success("Featured content fee updated successfully!");
    } catch (error) {
      const errorMessage = error.reason;
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const setNewOwner = async () => {
    try {
      const addressField = document.getElementById("address");
      const newOwner = addressField.value;
      await signContract.setContractOwner(newOwner);
      setModalConfig({
        isOpen: false,
        title: "",
        content: null,
      });
      // console.log("Owner has been changed successfully");
      toast.success("Owner has been changed successfully!");
    } catch (error) {
      toast.error(error.reason);
      console.error(error);
    }
  };

  const changeOwnerModal = async () => {
    setModalConfig({
      isOpen: true,
      title: "Change Owner",
      content: (
        <>
          <h1 className="text-lg mb-3">Enter the address of the new owner</h1>

          <form className="flex flex-col ">
            <label htmlFor="address">Paste Address here:</label>
            <input
              type="text"
              id="address"
              className="w-100 mt-2  py-2 px-3 rounded-md bg-gray-dark border border-gray    text-gray-light font-semibold focus:border-blue focus:outline-none"
              placeholder=" 0xf39fd6e51a..."
            />
            <span className="text-sm text-orange-500 flex flex-row mt-2 items-center">
              <HiExclamation className="text-yellow-400 text-2xl mr-1" />
              Please make sure the address is valid and that it is on the same
              network
            </span>
          </form>
        </>
      ),
    });
  };

  const disconnectModal = async () => {
    setModalConfig({
      isOpen: true,
      title: "Disconnect",
      content: (
        <>
          <h1 className="text-lg mb-3">
            You are about to leave the admin panel
          </h1>

          <p>
            Please disconnect from your wallet directly to ensure maximum
            security!
          </p>
        </>
      ),
    });
  };
  const handleDisconnect = async () => {
    setOwnerAddress("");
    navigate("/connect");
  };

  const handleConfirm = () => {
    if (modalConfig.title === "Change Owner") {
      setNewOwner();
    }
    else if (modalConfig.title === "Disconnect") {
      handleDisconnect();
    }
  };

  const cancel = () => {
    setModalConfig({
      isOpen: false,
      title: "",
      content: null,
    });
  };

  return (
    <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-field-bg   text-black  ">
      <div>
        {modalConfig.isOpen && (
          <Modal
            title={modalConfig.title}
            content={modalConfig.content}
            cancelLabel="Cancel"
            onModalClose={cancel}
            agreeLabel="Continue"
            onAgreeClick={handleConfirm}
          />
        )}
      </div>
      {/* <!-- Sidebar --> */}
      <div className="fixed flex flex-col top-40 left-0 w-14 hover:w-64 md:w-64 bg-gray-dark rounded-r-md  overflow-y-auto   text-white transition-all duration-300 border-none z-10 sidebar">
        <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
          <ul className="flex flex-col py-4 space-y-1">
            <li className="px-5 hidden md:block">
              <div className="flex flex-row items-center h-8">
                <div className="md:text-3xl text-3xl text-gray-light   font-extrabold tracking-tight ">
                  Admin
                </div>
              </div>
            </li>
            <li>
              <div
                onClick={disconnectModal}
                className="relative flex flex-row items-center h-11 focus:outline-none text-white border-l-4 cursor-pointer focus:border-blue border-transparent hover:border-blue duration-500 transition-colors pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <HiLink className="w-5 h-5" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Disconnect
                </span>
              </div>
            </li>
            <li>
              <Link
                to="/admin"
                className="relative flex flex-row items-center h-11 focus:outline-none focus:border-blue  text-white border-l-4 border-transparent hover:border-blue duration-500 transition-colors pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <HiHome className="w-5 h-5" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <div
                className="relative flex flex-row items-center h-11 focus:outline-none text-white  focus:border-blue cursor-pointer border-l-4 border-transparent hover:border-blue duration-500 transition-colors pr-6"
                onClick={changeOwnerModal}
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <HiBookmark className="w-5 h-5" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Change Owner
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* <!-- ./Sidebar --> */}

      <div className="h-full ml-14 mt-14 mb-10 md:ml-64">
        {/* <!-- Statistics Cards --> */}
        <div className="grid grid-cols-2  lg:grid-cols-4 p-4 gap-4">
          <div className="bg-blue shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-slate-600   text-white font-medium group">
            <div className="flex justify-center items-center w-14 h-14 bg-gray-dark rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <HiUserGroup className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-2xl">{totalUser}</p>
              <p>Users</p>
            </div>
          </div>
          <div className="bg-blue  shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-slate-600   text-white font-medium group">
            <div className="flex justify-center items-center w-14 h-14 bg-gray-dark rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <HiBookOpen className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-xl">{totalPagers}</p>
              <p>All Pagers</p>
            </div>
          </div>
          <div className="bg-blue  shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-slate-600   text-white font-medium group">
            <div className="md:flex hidden justify-center items-center w-14 h-14 bg-gray-dark rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <HiDocumentText className="w-6 h-6 " />
            </div>
            <div className="text-left">
              <p className="text-xl">{privatePagers}</p>
              <p>Privates</p>
            </div>
            <div className="text-right">
              <p className="text-xl">{publishedPagers}</p>
              <p>Published</p>
            </div>
          </div>
          <div className="bg-blue shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-slate-600   text-white font-medium group">
            <div className="flex justify-center items-center w-14 h-14 rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <img src={polygonToken2} />
            </div>
            <div className="text-right">
              <p className="text-xl">{contractBalance}</p>
              <p>Balance</p>
            </div>
          </div>
        </div>
        {/* <!-- ./Statistics Cards --> */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 md:p-6  p-4   bg-gray-dark  rounded-lg mt-8 mb-8 mx-4">
          <div>
            <h2 className="text-xl text-white font-bold">Contract address</h2>
            <p className="md:text-lg text-sm font-display text-[#00ff00] bg-black p-2 rounded-md">
              {contractAddress}
            </p>
          </div>
          <div>
            <h2 className="text-xl text-white font-bold">Admin address</h2>
            <p className="md:text-lg text-sm font-display text-[#ffff00] bg-black p-2 rounded-md">
              {ownerAddress}
            </p>
          </div>
        </div>
        {/* <!-- Withdrawal Form --> */}
        <div className="mt-8 mb-8 mx-4">
          <div className="p-6 mr-2    bg-gray-dark  rounded-lg">
            <h1 className="md:text-3xl xs:text-3xl text-white   font-extrabold tracking-tight">
              Withdraw Balance
            </h1>
            <p className="text-normal text-lg sm:text-2xl font-medium   text-gray-light mt-2">
              Fill in the receiving address
            </p>

            <form className=" flex flex-col justify-center">
              <div className="flex flex-col mt-2">
                <textarea
                  name="address"
                  placeholder="Paste address here"
                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-gray-dark border border-gray     text-white text-lg font-semibold focus:border-blue focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleWithdraw}
                className="md:w-32 bg-blue  text-white  font-bold py-3 px-6 rounded-lg mt-4 hover:bg-deep-blue  transition ease-in-out duration-300"
              >
                Withdraw
              </button>
            </form>
          </div>
        </div>
        {/* <!-- Withdrawal Form --> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 p-4 gap-4">
          {/* <!-- Personal Fee --> */}
          <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words    bg-gray-dark w-full shadow-lg rounded">
            <div className="rounded-t mb-0 px-0 border-0">
              <div className="flex flex-wrap items-center px-4 py-2">
                <div className="relative w-full max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-xl  text-white">
                    Private Pager Fee
                  </h3>
                </div>
              </div>
              <div className="block w-full">
                <div className="p-4">
                  <div className="flex items-center justify-between  text-white font-medium group">
                    <div className="flex justify-center items-center w-14 h-14 rounded-full transition-all duration-300 transform group-hover:rotate-12">
                      <img src={polygonToken1} />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl">{personalFee}</p>
                    </div>
                  </div>
                </div>

                <div className="px-4    bg-gray-dark     text-gray-light align-middle border border-solid border-blue   py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  New private fee
                </div>

                <div className="p-4">
                  <form className="flex  justify-between">
                    <div className="flex flex-col mt-2">
                      <input
                        type="number"
                        name="personal"
                        placeholder="Set personal fee"
                        className="w-40 mt-2 py-3 px-3 rounded-lg bg-gray-dark border border-gray text-white font-semibold focus:border-blue focus:outline-none"
                        value={personalFeeValue}
                        onChange={(e) => setPersonalFeeValue(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      onClick={(e) => handlePersonalFeeUpdate(e)}
                      className=" bg-blue  
                      text-white  font-bold py-3 px-6 rounded-lg mt-4 hover:bg-deep-blue  transition ease-in-out duration-300"
                    >
                      Set Fee
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col min-w-0 break-words    bg-gray-dark w-full shadow-lg rounded">
            <div className="rounded-t mb-0 px-0 border-0">
              <div className="flex flex-wrap items-center px-4 py-2">
                <div className="relative w-full max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-xl    text-white">
                    Featured Pager Fee
                  </h3>
                </div>
              </div>
              <div className="block w-full">
                <div className="p-4">
                  <div className="flex items-center justify-between  text-white font-medium group">
                    <div className="flex justify-center items-center w-14 h-14 rounded-full transition-all duration-300 transform group-hover:rotate-12">
                      <img src={polygonToken1} />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl">{featuredFee}</p>
                    </div>
                  </div>
                </div>

                <div className="px-4    bg-gray-dark     text-gray-light align-middle border border-solid border-blue   py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  New featured fee
                </div>
                <div className="p-4">
                  <form className="flex  justify-between">
                    <div className="flex flex-col mt-2">
                      <input
                        type="number"
                        name="featured"
                        placeholder="Set featured fee"
                        className="w-40 mt-2 py-3 px-3 rounded-lg bg-gray-dark border border-gray    text-white font-semibold focus:border-blue focus:outline-none"
                        value={featuredFeeValue}
                        onChange={(e) => setFeaturedFeeValue(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      onClick={handleFeaturedFeeUpdate}
                      className="md:w-32 bg-blue  text-white  font-bold py-3 px-6 rounded-lg mt-4 hover:bg-deep-blue  transition ease-in-out duration-300"
                    >
                      Set Fee
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Featured Fee --> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
