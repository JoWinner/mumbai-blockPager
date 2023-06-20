import { useState, lazy } from "react";
import { HiMenu, HiExclamation } from "react-icons/hi";
import { signContract } from "../constants/ContentFetch";
import { PagerActions, Modal } from "../components";
import axios from "axios";
import { toast } from "react-toastify";

const ReadPrivate = lazy(() => import("../components/ReadPrivate"));

const Sidebar = ({ pagers }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPager, setSelectedPager] = useState(null);
  const [userPage, setUserPage] = useState(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    content: null,
  });

  const handleRead = async () => {
    try {
      setModalConfig({
        isOpen: false,
        title: "",
        content: null,
      });

      let content = await signContract.readContent(selectedPager.id);
      content = await signContract.tokenURI(selectedPager.id);
      const meta = await axios.get(content);

      const data = {
        title: meta.data.title,
        editorData: meta.data.editorData,
      };

      setUserPage(data);
      toast.success("Signing confirmed. Loading pager!");
    } catch (error) {
      const errorMessage =
        error.reason || "Pager is burning! Maximum(6) reads reached";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const readModal = async (pager) => {
    setSelectedPager(pager);
    setModalConfig({
      isOpen: true,
      title: "Read Pager",
      content: (
        <>
          <h1 className="text-lg mb-4">
            You are about to read:{" "}
            <p className="uppercase pt-2">{pager?.title}</p>
          </h1>

          <span className="text-sm text-orange-500 flex ">
            <HiExclamation className="text-yellow-400 text-2xl mr-2" /> This
            pager has {pager?.maxReads} maximum reads. It has been read{" "}
            {pager?.numReads}/{pager?.maxReads}.
          </span>
        </>
      ),
    });
  };

  const handleAlert = async () => {
    try {
      setModalConfig({
        isOpen: false,
        title: "",
        content: null,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const alertModal = (pager) => {
    setSelectedPager(pager);
    setModalConfig({
      isOpen: true,
      title: "Pager Status",
      content: (
        <>
          <div className="flex flex-col ">
            <h2 className="text-base uppercase"> {pager?.title}</h2>
            <div className="flex flex-row justify-between items-center mt-2 align-middle border border-solid border-blue   py-1 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold ">
              <h2>{pager?.creator}</h2>
              <p>@ {pager?.date}</p>
            </div>
          </div>
          <p>
            Reads: {pager?.numReads}{" "}
            <span className="text-blue text-lg mx-3">|</span>
            Transfer: {pager?.numTransfers}
          </p>
          <span className="text-sm text-orange-500 flex flex-row  items-center">
            <HiExclamation className="text-yellow-400 text-2xl mr-1" />
            {pager?.maxReads} maximum reads and only 1 transfer allowed.
          </span>
        </>
      ),
    });
  };

  const handleBurn = async () => {
    try {
      await signContract.burnContent(selectedPager.id);
      setModalConfig({
        isOpen: false,
        title: "",
        content: null,
      });
      toast.success("Signing confirmed. Burning pager!");
    } catch (error) {
      const errorMessage =
        "Only owner can burn this pager or pager already burned!" ||
        error.reason;
      toast.error(errorMessage); // Error message
      console.error(error);
    }
  };
  const burnModal = async (pager) => {
    setSelectedPager(pager);
    setModalConfig({
      isOpen: true,
      title: "Burn Pager",
      content: (
        <>
          <h1 className="text-lg mb-4">
            Permanently delete the pager and all associated content.
          </h1>

          <span className="text-sm text-orange-500 flex ">
            <HiExclamation className="text-yellow-400 text-2xl mr-2" /> This
            action cannot be undone! Please confirm to proceed with burning the
            pager.
          </span>
        </>
      ),
    });
  };

  const handleTransfer = async () => {
    try {
      const addressField = document.getElementById("address");
      const recipient = addressField.value;

      await signContract.transferContent(recipient, selectedPager.id);
      setModalConfig({
        isOpen: false,
        title: "",
        content: null,
      });
      toast.success("Signing confirmed. Transferring pager!");
    } catch (error) {
      const errorMessage =
        "You cannot transfer this pager. Transfer is only once!" ||
        error.reason;
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const transferModal = async (pager) => {
    setSelectedPager(pager);
    setModalConfig({
      isOpen: true,
      title: "Transfer Pager",
      content: (
        <>
          <h1 className="text-lg mb-3">
            Enter the address of the recipient you want to transfer this pager
            to.
          </h1>

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
              This pager can only be transferred once
            </span>
          </form>
        </>
      ),
    });
  };

  const handleConfirm = () => {
    if (modalConfig.title === "Read Pager") {
      handleRead();
    } else if (modalConfig.title === "Pager Status") {
      handleAlert();
    } else if (modalConfig.title === "Burn Pager") {
      handleBurn();
    } else if (modalConfig.title === "Transfer Pager") {
      handleTransfer();
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
    <section className="flex">
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
      <div
        className={`bg-white overflow-y-auto h-screen shadow-card rounded-r-md hover:-translate-y-6   ${
          isOpen ? "w-72 whitespace-normal" : "w-16 "
        }  duration-500 text-gray-dark`}
      >
        <div className={` py-3 flex justify-end px-4`}>
          <HiMenu
            size={26}
            className="cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        <div
          className="mt-4 flex flex-col gap-4 
        "
        >
          {pagers?.map((pager) => (
            <div key={pager?.id} className="">
              <div
                className={`${
                  pager?.title && "mt-5"
                } bg-slate-200 group flex items-center text-medium gap-3.5 font-semibold p-4 hover:bg-gray-light rounded-md overflow-hidden`}
              >
                <div className={`${isOpen && "hidden"} text-3xl uppercase `}>
                  {pager.title.charAt(0)}
                </div>
                <div>
                  <h2
                    style={{ transition: `${pager.id + 3}00ms` }}
                    className={`whitespace-normal duration-500 ${
                      !isOpen &&
                      "opacity-0 translate-x-28 whitespace-pre overflow-hidden "
                    }`}
                  >
                    {pager?.title}
                  </h2>

                  <div className={`${!isOpen && "hidden"} text-5xl uppercase `}>
                    <PagerActions
                      onClick={(button) => {
                        if (button === "view") readModal(pager);
                        if (button === "alert") alertModal(pager);
                        if (button === "burn") burnModal(pager);
                        if (button === "transfer") transferModal(pager);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 ">
        {userPage ? (
          <ReadPrivate title={userPage?.title} data={userPage?.editorData} />
        ) : (
          <div className=" ml-36 mt-52 animate-bounce text-3xl font-bold text-gray-dark">
            Select a pager to view
          </div>
        )}
      </div>
    </section>
  );
};

export default Sidebar;
