import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { toast } from "react-toastify";
import { signContract } from "../constants/ContentFetch";
import { banner } from "../../images/index";
import { Buffer } from "buffer";
import { create as ipfsHttpClient } from "ipfs-http-client";
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

const EditProfile = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [formInput, updateFormInput] = useState({
    name: "",
    email: "",
    link: "",
    bio: "",
  });
  function validateForm() {
    const { name, email, link, bio } = formInput;
    const errors = {};

    // Validate name
    if (!name.trim()) {
      errors.name = "*Name is required";
    } else if (name.length > 40) {
      errors.name = "*Name should be less than 40 characters";
    }

    // Validate bio
    if (!bio.trim()) {
      errors.bio = "*Bio is required";
    } else if (bio.length > 700) {
      errors.bio = "*Bio should be less than 700 characters";
    }

    // Validate category
    if (!link) {
      errors.link = "*Please don't leave it empty";
    }

    // Validate category
    if (!email) {
      errors.email = "*Please don't leave it empty";
    }
    setFormErrors(errors);
  }

  async function uploadToIPFS() {
    const { name, email, link, bio } = formInput;
    if (!name || !email || !link || !bio) return;

    try {
      const data = JSON.stringify({ name, email, link, bio });
      const added = await client.add(data);
      const url = `https://block-pager.infura-ipfs.io/ipfs/${added.path}`;

      return url; // return the URL
    } catch (error) {
      const errorMessage = error.reason;
      toast.error(errorMessage);
    }
  }

  async function updateProfile() {
    const { name, bio, link, email } = formInput;

    // Validate form input
    validateForm();

    // Check if the form is valid
    if (Object.keys(formErrors).length === 0) {
      const url = await uploadToIPFS();

      try {
        let transaction = toast.promise(
          signContract.createOrUpdateAccount(url),
          {
            pending: "Processing transaction...",
            success: "Transaction signed!",
          }
        );
        await transaction;

        navigate("/user-dashboard");
      } catch (error) {
        const errorMessage =
          "Failed to update profile. There was an error." ||
          error.reason;
          console.error(error);
        toast.error(errorMessage);
      }
    }
  }

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://block-pager.infura-ipfs.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      const errorMessage = error.reason;
      toast.error(errorMessage);
    }
  }

  async function uploadPicture() {
    if (!fileUrl) return;

    try {
      const data = JSON.stringify({
        image: fileUrl,
      });

      const added = await client.add(data);
      const url = `https://block-pager.infura-ipfs.io/ipfs/${added.path}`;

      return url; // return the URL
    } catch (error) {
      const errorMessage = error.reason;
      toast.error(errorMessage);
    }
  }
  async function updatePicture() {
    const url = await uploadPicture();

    try {

      let transaction = toast.promise(signContract.updatePicture(url), {
        pending: "Processing transaction...",
        success: "Transaction signed!",
      });
      await transaction;

      navigate("/user-dashboard");
    } catch (error) {
      const errorMessage =
        "Error updating image" || error.reason;
      toast.error(errorMessage);
    }
  }

  const goBack = () => {
    navigate(-1);
  };

  return (
    <section className="bg-gradient-to-r from-teal-100 via-violet-200 to-purple-200">
      <form>
        <div className=" flex flex-col">
          <div className="w-full h-[300px]">
            {fileUrl ? (
              <img src={fileUrl} className="w-full h-full object-cover" />
            ) : (
              <img src={banner} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="px-8 py-3 space-x-4 flex bg-white items-center">
            <label>
              <input
                type="file"
                name="Asset"
                className="text-sm text-gray-dark focus:outline-none
                  file:mr-4 file:py-3 file:px-5
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                   file:bg-gray-light file:text-blue w-60 cursor-pointer
                "
                onChange={onChange}
                required
              />
            </label>
            <button
              type="button"
              onClick={updatePicture}
              className="inline-block w-full rounded-md bg-black hover:bg-dark-black px-2 md:px-4 py-2 font-semibold text-white sm:w-auto transition-colors duration-500 "
            >
              Save photo
            </button>
          </div>
        </div>
      </form>

      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
          <div className="lg:col-span-2 lg:py-12">
            <div className="flex flex-col gap-3 text-black">
              <p className="max-w-xl text-lg  ">
                <strong className="text-red text-2xl">-</strong>Update your
                profile and image separately. You can only add an image if your
                profile is updated.
              </p>
              <p className="max-w-xl text-lg  ">
                <strong className="text-red text-2xl">-</strong>Easily update
                and customize your profile to reflect your latest information
                and preferences.
              </p>
              <p className="max-w-xl text-lg  ">
                <strong className="text-red text-2xl">-</strong>Select any photo
                perfect for your profile.
              </p>
              <p className="max-w-xl text-lg ">
                <strong className="text-red text-2xl">-</strong>Add name with
                some details and a little bio.
              </p>

              <strong className=" text-xl">
                Don't forget to click "Save" or "Update" and confirm on from
                your wallet!
              </strong>

              <button
                className="bg-red text-white text-xl py-2 px-6 group rounded-md flex items-center w-1/3"
                onClick={goBack}
              >
                <HiArrowLeft className=" transform group-hover:-translate-x-5 duration-500 text-3xl pt-1 transition-transform" />
                <span>Back</span>
              </button>
            </div>
          </div>

          <div className="rounded-md bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
            <form action="" className="space-y-4">
              <div>
                {formErrors.name && (
                  <p className="text-sm text-red">{formErrors.name}</p>
                )}
                <label className="sr-only" htmlFor="name">
                  Name
                </label>
                <input
                  className={`w-full rounded-md border-gray border p-3 text-base ${
                    formErrors.name ? "border-red" : ""
                  }`}
                  placeholder="Name"
                  type="text"
                  name="name"
                  // maxLength={40}
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      [e.target.name]: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <div className="hidden gap-4 w-full sm:flex justify-between">
                  {formErrors.email && (
                    <p className="text-sm text-red w-1/2">{formErrors.email}</p>
                  )}
                  {formErrors.link && (
                    <p className="text-sm text-red w-1/2 flex ">
                      {formErrors.link}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                  <div className="">
                    {formErrors.email && (
                      <p className="text-sm text-red sm:hidden">
                        {formErrors.email}
                      </p>
                    )}

                    <label className="sr-only" htmlFor="email">
                      Email
                    </label>
                    <input
                      className={`w-full rounded-md border-gray border p-3 text-base ${
                        formErrors.email ? "border-red" : ""
                      }`}
                      placeholder="Email address"
                      type="email"
                      name="email"
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="">
                    {formErrors.link && (
                      <p className="text-sm text-red sm:hidden">
                        {formErrors.link}
                      </p>
                    )}
                    <label className="sr-only" htmlFor="link">
                      Link
                    </label>
                    <input
                      className={`w-full rounded-md border-gray border p-3 text-base ${
                        formErrors.link ? "border-red" : ""
                      }`}
                      placeholder="Any Link?"
                      type="tel"
                      name="link"
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

              <div>
                {formErrors.bio && (
                  <p className="text-sm text-red *">
                    {formErrors.bio}
                  </p>
                )}
                <label className="sr-only" htmlFor="bio">
                  Bio
                </label>

                <textarea
                  className={`w-full rounded-md border-gray border p-3 text-base ${
                        formErrors.bio ? "border-red" : ""
                      }`}
                  placeholder="A brief bio "
                  rows="5"
                  // maxLength={700}
                  name="bio"
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      [e.target.name]: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={updateProfile}
                  className="inline-block w-full rounded-md bg-black hover:bg-dark-black px-5 py-3 font-semibold text-white sm:w-auto transition-colors duration-500"
                >
                  Update profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;
