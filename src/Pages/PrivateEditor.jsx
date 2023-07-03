import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import { Buffer } from "buffer";
import { toast } from "react-toastify";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { EditorTools } from "../constants/EditorTools";
import { signContract } from "../constants/ContentFetch";
const projectId = import.meta.env.VITE_IPFS_PROJECT_ID;
const projectSecret = import.meta.env.VITE_IPFS_API_KEY;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const PrivateEditor = () => {
  const editorRef = useRef(null);
  const isEditorReady = useRef(false);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [dataUrl, setDataUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    title: "",
    maxReads: "",
  });

  function validateForm() {
    const { title, maxReads } = formInput;
    const errors = {};

    // Validate title
    if (!title.trim()) {
      errors.title = "*Title is required";
    } else if (title.length > 70) {
      errors.title = "*Title should be less than 70 characters";
    }

    // Validate Max
    if (!maxReads) {
      errors.maxReads = "*Max Reads is required";
    } else if (Number(maxReads) === 0) {
      errors.maxReads = "*Max Reads is invalid(It must be > 0)";
    }

    setFormErrors(errors);
  }

  useEffect(() => {
    if (!isEditorReady.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        tools: EditorTools,
        placeholder: "Create and transfer private content on the blockchain!",

        data: {
          version: "2.18.0",
        },
        autofocus: false,
      });

      editorRef.current = editor;
      isEditorReady.current = true;
    }
  }, []);

  async function uploadToIPFS() {
        validateForm();

    const { title, maxReads } = formInput;
    if (!editorRef.current || !title || !maxReads) return;

    try {
      const editorData = await editorRef.current.save();
      const data = JSON.stringify({ title, maxReads, editorData });
      const added = await client.add(data);
      const url = `https://block-pager.infura-ipfs.io/ipfs/${added.path}`;
      setDataUrl(url);

      return url; // return the URL
    } catch (error) {
      // console.log("Error uploading file: ", error);
    }
  }

  async function createPager() {
    // Validate form input
    validateForm(); 
    
    const { title, maxReads } = formInput;


    // Check if the form is valid
    if (Object.keys(formErrors).length === 0) {
      const url = await uploadToIPFS();

      try {
        let fee = await signContract.getFees();
        let personalFee = fee[0].toString();
        let transaction = await signContract.createPrivateContent(
          url,
          maxReads,
          {
            value: personalFee,
          }
        );
        await transaction.wait();

        navigate("/user-dashboard");
      } catch (error) {
        const errorMessage =
          "Failed to create Pager." || error.reason;
        toast.error(errorMessage);
      }
    }
  }

  const handleClear = () => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.blocks.clear();
  };

  return (
    <div className="mx-auto xs:w-11/12 md:w-5/6 min-h-full">
      <div className="bg-[#fffafa] shadow-card hover:shadow-cardhover transition-colors duration-500 rounded mt-36 mb-64">
        <div className="border-b text-center">
          <h2 className="md:text-3xl xs:text-2xl p-3 uppercase insetshadow ">
            Private Editor
          </h2>
        </div>
        <div
          id="editorjs"
          className="overflow-y-auto  min-h-full h-screen p-4 custom-scroll  overflow-x-hidden"
        ></div>
        <div className="flex flex-col p-10 border-t  border-black">
          <form className="flex flex-row justify-center w-full gap-4">
            <div className="flex flex-col w-9/12">
              <textarea
                className=" appearance-none bg-transparent border-t-0 border-l-0 border-r-0 text-dark-black text-base font-medium focus:outline-none focus:ring-0 border-b border-gray "
                type="text"
                rows="1"
                placeholder="Title here"
                aria-label="Title"
                name="title"
                // maxLength={70}
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    [e.target.name]: e.target.value,
                  })
                }
                required
              />
              {formErrors.title && (
                <p className="text-sm text-red">{formErrors.title}</p>
              )}
            </div>
            <div className="w-1/4">
              <input
                type="number"
                className={`w-full appearance-none bg-transparent border-t-0 border-l-0 border-r-0  text-dark-black font-medium focus:outline-none focus:ring-0 border-b border-gray text-base  ${
                  formErrors.maxReads ? "border-red" : ""
                }`}
                placeholder="Set Max Reads"
                name="maxReads"
                defaultValue={6}
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    [e.target.name]: e.target.value,
                  })
                }
                required
              />
            </div>
          </form>
          <p
            className="text-sm text-deep-blue
          mb-4 mt-1"
          >
            A private pager burns after max reads is reached. Set your max reads
            or use default(6 max reads).
          </p>

          <div className="flex flex-row justify-center gap-4 ">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2 my-2 bg-black text-white rounded-md cursor-pointer inline-block  hover:bg-dark-black transition-colors duration-500 "
            >
              Clear
            </button>

            <button
              type="button"
              onClick={createPager}
              className="px-6 py-2 my-2 bg-blue text-white inline-block rounded-md cursor-pointer hover:bg-deep-blue transition-colors
              duration-500"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateEditor;
