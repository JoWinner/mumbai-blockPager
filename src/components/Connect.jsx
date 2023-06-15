import { useEffect, useState, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EditorTools } from "../constants/EditorTools";
import { Modal } from "../components";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiHome, HiUserCircle } from "react-icons/hi";


const Connect = () => {
  const [showModal, setShowModal] = useState(false);
  const editorRef = useRef(null);
  const isEditorReady = useRef(false);
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (!isEditorReady.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        tools: EditorTools,
        data: {
          blocks: [
            {
              type: "header",
              data: {
                text: "Block Pagers On-The-Block",
                level: 1,
              },
            },
            {
              type: "header",
              data: {
                text: "Unleash your creativity, protect your work, and monetize your content with BlockPager:",
                level: 4,
              },
            },
            {
              type: "checklist",
              data: {
                items: [
                  {
                    text: "Pagers are the new thing!",
                    checked: true,
                  },
                  {
                    text: "Add seamless blend of creativity",
                    checked: true,
                  },
                  {
                    text: "Elevate your content game",
                    checked: true,
                  },
                ],
              },
            },
            {
              type: "warning",
              data: {
                title: "Watch Out!!!<br>",
                message: "Unlock the blocker in you!!",
              },
            },
          ],
        },
        autofocus: true,
      });

      editorRef.current = editor;
      isEditorReady.current = true;
    }
  }, []);

  useEffect(() => {
   getCurrentWalletConnected();
   addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        /* MetaMask is installed */
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        // console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      setShowModal(true);
      // console.log("Please aaa install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          // console.log(accounts[0]);
        } else {
          navigate("/connect");
          // console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      setShowModal(true);
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
      setShowModal(true);
      setWalletAddress("");
      // console.log("Please install MetaMask");
    }
  };



  const handleInstall = () => {
    setShowModal(false);
    window.open("https://metamask.io/download.html", "_blank");
  };

  const cancel = () => {
    setShowModal(false);
  };

  const goHome = () => {
    navigate("/");
  };
  const goBack = () => {
    navigate(-1);
  };
  const goUser = () => {
    navigate("/user-dashboard");
  };

  return (
    <div className="bg-gradient-to-bl from-neutral-800 via-sky-700 to-current">
      <div className="mx-auto px-3 w-11/12 md:w-1/2 pt-10 min-h-screen  ">
        <div className="bg-[#fff9f9] shadow-card hover:shadow-cardhover transition-colors duration-500 rounded ">
          <div className="border-b text-center">
            <h2 className="md:text-3xl xs:text-2xl p-3 uppercase insetshadow ">
              Block Pager
            </h2>
          </div>
          <div
            id="editorjs"
            className="overflow-y-auto h-80 py-8 px-16 custom-scroll overflow-x-hidden"
          ></div>
          <div className="flex p-2 justify-center border-t  border-black">
            {walletAddress && walletAddress.length > 0 ? (
              <div className=" flex flex-row justify-around w-full">
                <button
                  onClick={goHome}
                  className="p-2 bg-black text-gray-light font-extrabold  text-3xl rounded-full cursor-pointer hover:bg-deep-blue hover:text-white transition-colors duration-500"
                >
                  <HiHome />
                </button>
                <button
                  onClick={goBack}
                  className=" px-4 bg-black text-gray-light font-extrabold  text-3xl rounded-full cursor-pointer hover:bg-deep-blue hover:text-white transition-colors duration-500"
                >
                  <HiArrowLeft />
                </button>
                <button
                  onClick={goUser}
                  className=" p-2 bg-black text-gray-light font-extrabold  text-3xl rounded-md cursor-pointer hover:bg-deep-blue hover:text-white transition-colors duration-500"
                >
                  <HiUserCircle />
                </button>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={connectWallet}
                  className="py-3 px-6 bg-black  text-gray-light   font-extrabold tracking-tight md:text-3xl xs:text-3xl rounded-md cursor-pointer hover:bg-deep-blue hover:text-white transition-colors
              duration-500"
                >
                  Connect
                </button>
              </div>
            )}
            <div>
              {showModal && (
                <Modal
                  title="Install MetaMask"
                  content={
                    <div className=" flex flex-col justify-center items-center">
                      <p className="text-lg">
                        Your browser does not have MetaMask installed. You need
                        to install MetaMask to use this dApp.{" "}
                      </p>
                      <p className="mt-3">Do you want to install it now?</p>
                    </div>
                  }
                  cancelLabel="Cancel"
                  onModalClose={cancel}
                  agreeLabel="Install"
                  onAgreeClick={handleInstall}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
