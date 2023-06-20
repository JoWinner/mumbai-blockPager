import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import axios from "axios";
import { HiEye, HiArrowLeft } from "react-icons/hi";
import { polygonToken1 } from "../../images";
import { EditorTools } from "../constants/EditorTools";
import { useLocation, Link, useNavigate } from "react-router-dom";

const ReadPublic = () => {
  const location = useLocation();
  const { content, contentData, currentSlide } = location.state;
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const isEditorReady = useRef(false);
  const [page, setPage] = useState(null);


useEffect(() => {
  if (content && contentData) {
   async function loadPage() {
     try {
       const meta = await axios.get(content);

       const data = {
         price: meta.data.price,
         image: meta.data.image,
         title: meta.data.title,
         category: meta.data.category,
         description: meta.data.description,
         editorData: meta.data.editorData,
         creator: contentData.creator,
         numViews: contentData.numViews,
         date: contentData.date,
       };

       setPage(data);
     } catch (error) {
     }
   }
   loadPage();
  } else if (currentSlide) {

    const data = {
      price: currentSlide.price,
      image: currentSlide.image,
      title: currentSlide.title,
      category: currentSlide.category,
      description: currentSlide.description,
      editorData: currentSlide.editorData,
      creator: currentSlide.creator,
      numViews: currentSlide.numViews,
      date: currentSlide.date,
    };

    setPage(data);
  }
}, [content, contentData, currentSlide]);



  useEffect(() => {
    if (!isEditorReady.current && page) {
      const editor = new EditorJS({
        holder: "editorjs",
        tools: EditorTools,
        data: page.editorData,
        autofocus: true,
      });

      editorRef.current = editor;
      isEditorReady.current = true;
    }
  }, [page]);


  const goBack = () => {
    navigate(-1);
  };


  return (
    <div className="mx-auto mb-32 px-3 xs:w-11/12 md:w-5/6 min-h-full">
      {page && (
        <div>
          <div className="space-x-8 flex md:justify-end justify-start md:mt-0 py-5  ">
            <button
              onClick={goBack}
              className="text-white px-6 py-1  bg-blue hover:bg-deep-blue  group rounded-md inline-block font-medium transition-colors duration-500"
            >
              <HiArrowLeft className=" transform group-hover:-translate-x-5 duration-500 text-3xl transition-transform" />
            </button>
          </div>
          <div className="my-24 grid place-items-center ">
            <div className="bg-white rounded-md shadow-lg">
              <div className="md:flex px-4 leading-none max-w-4xl">
                <div className="flex-none ">
                  <img
                    src={page?.image}
                    alt={page?.title}
                    className="h-52 w-56 rounded-md transform -translate-y-4 border-4 border-blue shadow-lg"
                  />
                </div>

                <div className="flex-col ">
                  <p className="pt-4 px-4 flex justify-start text-xl font-bold border-b-2 text-gray-dark border-blue hover:text-blue transition-colors duration-500">
                    <Link
                      to={`/creator/${page.id}/${content.creatorAddress}/${page.creator}`}
                      state={{ content: page }}
                    >
                      {page?.creator}
                    </Link>
                  </p>

                  <div className="text-md flex flex-row justify-between items-center px-4  my-2">
                    <div className="flex items-center text-gray-dark justify-start space-x-2">
                      <HiEye className=" w-5 h-5" />
                      <span>{page?.numViews}</span>
                    </div>
                    <span className=" text-gray-dark">{page?.date}</span>
                    <span className="font-bold"></span>
                  </div>

                  <p className="hidden md:block px-4 my-2 text-justify text-gray-dark font-medium text-base">
                    {page?.description}
                  </p>

                  <div className="flex text-md px-4 my-6 ">
                    <img src={polygonToken1} className="w-4 mr-1" />{" "}
                    {page?.price}
                    <span className="font-bold px-2 text-blue">|</span>
                    <h1>{page?.category}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-[#fff9f9] shadow-card hover:shadow-cardhover transition-colors duration-500 rounded ">
        <div className="border-b text-center">
          <h2 className="md:text-3xl xs:text-2xl p-3 uppercase insetshadow ">
            {page ? page.title : "PAGER"}
          </h2>
        </div>
        <div
          id="editorjs"
          className="overflow-y-auto  min-h-full h-screen p-4 custom-scroll  overflow-x-hidden"
        ></div>
      </div>
    </div>
  );
};

export default ReadPublic;

