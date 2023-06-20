import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { polygonToken1 } from "../../images";
import { categoryList } from "../utils/categoryList";
import { toast } from "react-toastify";
import EditorJS from "@editorjs/editorjs";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { signContract } from "../constants/ContentFetch";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { EditorTools } from "../constants/EditorTools";
import { HiChevronDoubleDown, HiChevronDoubleUp } from "react-icons/hi";
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

const PublicEditor = () => {
  const editorRef = useRef(null);
  const isEditorReady = useRef(false);
  const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
  });

  function validateForm() {
    const { title, description, price, category } = formInput;
    const errors = {};

    // Validate title
    if (!title.trim()) {
      errors.title = "*Title is required";
    } else if (title.length > 70) {
      errors.title = "*Title should be less than 70 characters";
    }

    // Validate description
    if (!description.trim()) {
      errors.description = "*Description is required";
    } else if (description.length > 400) {
      errors.description = "*Description should be less than 400 characters";
    }

    // Validate price
    if (!price) {
      errors.price = "*Price is required";
    } else if (Number(price) < 0.06) {
      errors.price = "*Price is invalid(It must be > 0.05)";
    }

    // Validate category
    if (!category || category == "--Select Category--") {
      errors.category = "*Category is required";
    }

    setFormErrors(errors);
  }

  useEffect(() => {
    if (!isEditorReady.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        tools: EditorTools,
        placeholder: "Start creating an awesome pager and publish!",

        data: {       
          version: "2.18.0",
        },
        autofocus: true,
      });

      editorRef.current = editor;
      isEditorReady.current = true;
    }
  }, []);

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://block-pager.infura-ipfs.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      // console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { title, description, price, category } = formInput;
    if (
      !editorRef.current ||
      !title ||
      !description ||
      !price ||
      !fileUrl ||
      !category
    )
      return;

    try {
      const editorData = await editorRef.current.save();

      const data = JSON.stringify({
        title,
        description,
        image: fileUrl,
        price,
        category,
        editorData,
      });

      const added = await client.add(data);
      const url = `https://block-pager.infura-ipfs.io/ipfs/${added.path}`;

      return url; // return the URL
    } catch (error) {
      // console.log("Error uploading file: ", error);
    }
  }

  async function createFeatured() {
    const { title, description, price, category } = formInput;

    // Validate form input
    validateForm();

    // Check if the form is valid
    if (Object.keys(formErrors).length === 0) {
      const url = await uploadToIPFS();

      try {
        /* next, create the item */
        const price = ethers.utils.parseUnits(formInput.price, "ether");
       
        let fee = await signContract.getFees();
        let featuredFee = fee[1].toString();
        let transaction = await signContract.createFeaturedItem(url, price, {
          value: featuredFee,
        });
        await transaction.wait();

        navigate("/user-dashboard");
      } catch (error) {
        const errorMessage =
          "Failed to create Pager." || error.reason;
        toast.error(errorMessage);
      }
    }
  }

  async function createPublic() {
    const { title, description, price, category } = formInput;

    // Validate form input
    validateForm();

    // Check if the form is valid
    if (Object.keys(formErrors).length === 0) {
      const url = await uploadToIPFS();
      
      try {
        /* next, create the item */
        const price = ethers.utils.parseUnits(formInput.price, "ether");    

        let transaction = await signContract.createPublicItem(url, price);
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

  const handleShowForm = () => {
    setShowForm(!showForm);
  };


  return (
    <div className="mx-auto xs:w-11/12 md:w-5/6 min-h-full">
      <div className="bg-[#fffafa] shadow-card hover:shadow-cardhover transition-colors duration-500 rounded-md mt-36 mb-64">
        <div className="border-b text-center">
          <h2 className="md:text-3xl xs:text-2xl p-3 uppercase insetshadow ">
            Public Editor
          </h2>
        </div>
        <div
          id="editorjs"
          className="overflow-y-auto min-h-full h-screen custom-scroll p-4  overflow-x-hidden"
        ></div>
        <div className="flex w-full p-4 justify-center gap-10 border-t border-black">
          <div className="w-full max-w-xl">
            <form
              className={`space-y-4 font-medium text-dark-black  ${
                showForm
                  ? "translate-y-0 transform duration-500 transition-transform"
                  : "h-0 overflow-hidden -translate-y-40 transform duration-500 transition-transform"
              }`}
            >
              <div className="grid grid-cols-1 gap-4 ">
                <div className="pt-5">
                  <div className="text-red text-sm flex w-full items-center justify-end ">
                    {formErrors.title && (
                      <p className=" flex-1">{formErrors.title}</p>
                    )}
                    {formErrors.price && (
                      <p className=" flex w-1/4">{formErrors.price}</p>
                    )}
                  </div>
                  <div className="flex w-full items-center justify-center ">
                    <textarea
                      className={`flex-1 py-3 border rounded-md border-gray mr-3 text-base  ${
                        formErrors.title ? "border-red" : ""
                      }`}
                      rows="2"
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

                    <div
                      className={`flex w-1/4 justify-between items-center border border-l border-t-0 border-b-0 border-gray rounded-md bg-black gap-1 focus:outline-blue ${
                        formErrors.price ? "border-red" : ""
                      }`}
                    >
                      <img src={polygonToken1} className="w-6 ml-1 " />
                      <input
                        type="number"
                        className={` w-4/5 items-center border border-gray  rounded-r-md flex justify-center text-sm py-3 ${
                          formErrors.price ? "border-red" : ""
                        }`}
                        placeholder="Set Price"
                        name="price"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            [e.target.name]: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-2">
                  {formErrors.description && (
                    <p className="text-sm text-red">{formErrors.description}</p>
                  )}
                  <textarea
                    placeholder="Description"
                    rows="4"
                    className={`border border-gray rounded-md p-4 ${
                      formErrors.description ? "border-red" : ""
                    }`}
                    name="description"
                    // maxLength={400}
                    onChange={(e) =>
                      updateFormInput({
                        ...formInput,
                        [e.target.name]: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="my-3 flex flex-col justify-start ">
                  <p className="text-sm text-deep-blue">
                    Upload image(*jpg,png&gif) and wait for the thumbnail
                    preview
                  </p>
                  <div className=" flex flex-row justify-center space-x-2 items-start px-6 py-2 rounded-md border  border-dashed border-gray">
                    <input
                      type="file"
                      className="text-sm text-gray-dark focus:outline-none
                   file:py-3 file:px-5
                  file:rounded-md file:border-0
                  file:font-semibold
                   file:bg-gray-light file:text-blue  cursor-pointer px-4 pt-2 pb-2"
                      name="Asset"
                      onChange={onChange}
                      required
                    />
                    {fileUrl && (
                      <img
                        className="rounded-md w-14 h-14 my-1"
                        src={fileUrl}
                      />
                    )}
                  </div>
                  <div className="my-4 flex flex-col justify-start">
                    {formErrors.category && (
                      <p className="text-sm text-red">{formErrors.category}</p>
                    )}
                    <select
                      className={`block w-full px-3 py-3 text-black bg-white border border-gray rounded-md  focus:outline-none ${
                        formErrors.category ? "border-red" : ""
                      } `}
                      name="category"
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option>--Select Category--</option>
                      {categoryList.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </form>
            <div className="flex gap-4 justify-around">
              <button
                type="button"
                onClick={createPublic}
                className="px-6 py-2 bg-black text-white rounded-md cursor-pointer inline-block  hover:bg-dark-black transition-colors duration-500 "
              >
                Public
              </button>
              <button
                type="button"
                onClick={createFeatured}
                className="px-6 py-2 bg-blue text-white inline-block rounded-md cursor-pointer hover:bg-deep-blue transition-colors
              duration-500"
              >
                Featured
              </button>
              <div>
                <button
                  type="button"
                  onClick={handleShowForm}
                  className="px-3 py-3 bg-black text-white rounded-full cursor-pointer inline-block group  hover:bg-dark-black transition-colors duration-500 "
                >
                  {showForm ? (
                    <HiChevronDoubleUp className="group-hover:-translate-y-2 translate-y-0 transform duration-500 text-lg transition-transform" />
                  ) : (
                    <HiChevronDoubleDown className="group-hover:translate-y-2 translate-y-0 transform duration-500 text-lg transition-transform" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEditor;
