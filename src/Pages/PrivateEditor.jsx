import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import { Buffer } from "buffer";
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
  });

  function validateForm() {
    const { title } = formInput;
    const errors = {};

    // Validate title
    if (!title.trim()) {
      errors.title = "*Title is required";
    } else if (title.length > 70) {
      errors.title = "*Title should be less than 70 characters";
    }
    setFormErrors(errors);
  }

  useEffect(() => {
    if (!isEditorReady.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        tools: EditorTools,
        placeholder: "Create something private in this pager!",

        data: {
          blocks: [
            {
              type: "simpleImage",
              data: {
                url: "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
                caption: "Roadster // tesla.com",
                withBorder: false,
                withBackground: false,
                stretched: true,
              },
            },
            {
              type: "paragraph",
              data: {
                text: 'Hello There, it is a test post related to <a href="https://google.com">Google</a> which is the <b>biggest</b> search engine!',
              },
            },
            {
              type: "header",
              data: {
                text: "Google's attributes",
                level: 3,
              },
            },
            {
              type: "quote",
              data: {
                text: "If your access to health care involves your leaving work and driving somewhere and parking and waiting for a long time, that's not going to promote healthiness.",
                caption: "Larry Page",
                alignment: "left",
              },
            },
            {
              type: "table",
              data: {
                content: [
                  ["Blue", "Green", "Red"],
                  ["White", "Bounce", "Bat"],
                ],
              },
            },
            {
              type: "code",
              data: {
                code: 'const path = require("path");\nconst cookieParser = require("cookie-parser");\nconst rateLimiter = require("express-rate-limit");\nconst helmet = require("helmet");\nconst mongoSanitize = require("express-mongo-sanitize");\nconst xss = require("xss-clean");\nconst hpp = require("hpp");\nconst express = require("express");',
              },
            },
            {
              type: "embed",
              data: {
                service: "youtube",
                source: "https://www.youtube.com/watch?v=1z6sLQJHbP0",
                embed: "https://www.youtube.com/embed/1z6sLQJHbP0",
                width: 580,
                height: 320,
                caption: "This is a Youtube video!<br>",
              },
            },
            {
              type: "embed",
              data: {
                service: "twitter",
                source:
                  "https://twitter.com/elonmusk/status/1310001082278371328",
                embed:
                  "https://twitframe.com/show?url=https://twitter.com/elonmusk/status/1310001082278371328",
                width: 600,
                height: 300,
                caption: "This is a twitter embed!<br>",
              },
            },
            {
              type: "warning",
              data: {
                title: "Watch Out!!!<br>",
                message: "This is a test WARNING!<br>",
              },
            },
            {
              type: "delimiter",
            },

            {
              type: "checklist",
              data: {
                items: [
                  {
                    text: "I'm a Developer",
                    checked: true,
                  },
                  {
                    text: "I'm an introvert",
                    checked: true,
                  },
                  {
                    text: "I love science!",
                    checked: false,
                  },
                ],
              },
            },
            {
              type: "embed",
              data: {
                service: "codepen",
                source: "https://codepen.io/traversbray/pen/NWNZwPq",
                embed:
                  "https://codepen.io/traversbray/embed/NWNZwPq?height=300&amp;theme-id=0&amp;default-tab=css,result&amp;embed-version=2",
                width: 600,
                height: 300,
                caption: "",
              },
            },
            {
              type: "code",
              data: {
                code: "<div id='app'><div class='btn-holder'><button @click.prevent='openSideElement()'>Open side element</button></div><transition name='fade'><div v-if='open' class='overlay'  @click.prevent='close()'></div></transition><div class='side-element' :class='open ? 'show-element' : '''><span class='close-btn' @click.prevent='close()'>x</span><div class='content'><h2>Hi!</h2><p>I'm the element coming from the right of the browser.</p><p>Click the close icon or anywhere on the overlay to close me.</p></div></div></div>",
              },
            },
            {
              type: "embed",
              data: {
                service: "twitter",
                source: "https://twitter.com/SpaceX/status/1310962850601545728",
                embed:
                  "https://twitframe.com/show?url=https://twitter.com/SpaceX/status/1310962850601545728",
                width: 600,
                height: 300,
                caption: "",
              },
            },
            {
              type: "embed",
              data: {
                service: "instagram",
                source: "https://www.instagram.com/p/CFuMV9MhwlL",
                embed: "https://www.instagram.com/p/CFuMV9MhwlL/embed",
                width: 400,
                height: 505,
                caption: "",
              },
            },
            {
              type: "raw",
              data: {
                html: '<blockquote class="imgur-embed-pub" lang="en" data-id="a/Vd1xADQ"  ><a href="//imgur.com/a/Vd1xADQ">Dark arts and crafts!</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>',
              },
            },
            {
              id: "RDB6MHutIC",
              data: {
                url: "https://cdn.pixabay.com/photo/2022/08/09/16/19/sea-7375377_960_720.jpg",
                caption: "Check my designs",
                stretched: false,
                withBorder: false,
                withBackground: false,
              },
              type: "simpleimg",
            },
            {
              id: "qvlrLvgUAO",
              data: {
                link: "https://www.freepik.com/",
                meta: {
                  image: {
                    URL: "https://freepik.cdnpk.net/img/logo-fb-en.png",
                  },
                  title: "Free Vectors, Stock Photos & PSD Downloads | Freepik",
                  description:
                    "Millions of Free Graphic Resources. ✓ Vectors ✓ Stock Photos ✓ PSD ✓ Icons ✓ All that you need for your Creative Projects",
                },
              },
              type: "linkTool",
            },
          ],
          version: "2.18.0",
        },
        autofocus: false,
      });

      editorRef.current = editor;
      isEditorReady.current = true;
    }
  }, []);

  async function uploadToIPFS() {
    const { title } = formInput;
    if (!editorRef.current || !title) return;

    try {
      const editorData = await editorRef.current.save();
      const data = JSON.stringify({ title, editorData });
      const added = await client.add(data);
      const url = `https://block-pager.infura-ipfs.io/ipfs/${added.path}`;
      setDataUrl(url);

      return url; // return the URL
    } catch (error) {
      // console.log("Error uploading file: ", error);
    }
  }

  async function createPager() {
    const { title } = formInput;

    // Validate form input
    validateForm();

    // Check if the form is valid
    if (Object.keys(formErrors).length === 0) {
      const url = await uploadToIPFS();
      
      try {
        
        let fee = await signContract.getFees();
        let personalFee = fee[0].toString();
        let transaction = await signContract.createPrivateContent(url, {
          value: personalFee,
        });
        await transaction.wait();

        navigate("/user-dashboard");
      } catch (error) {
        const errorMessage =
          "Failed to create Pager. Your profile is incomplete." || error.reason;
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
        <div className="flex flex-1 p-4 justify-center gap-10 border-t  border-black">
          <div className="w-full max-w-sm">
            <form>
              <div className="flex items-center justify-center border-b border-black">
                <textarea
                  className=" appearance-none bg-transparent border-none w-full text-dark-black mr-3 text-base font-medium focus:outline-none focus:ring-0 "
                  type="text"
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
              </div>
              {formErrors.title && (
                <p className="text-sm text-red">{formErrors.title}</p>
              )}
            </form>
          </div>
          <div>
            <button
              type="button"
              onClick={createPager}
              className="px-6 py-2 my-2 bg-blue text-white inline-block w-full rounded-md cursor-pointer hover:bg-deep-blue transition-colors
              duration-500"
            >
              Create
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2 my-2 bg-black text-white rounded cursor-pointer inline-block w-full hover:bg-dark-black transition-colors duration-500 "
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateEditor;
