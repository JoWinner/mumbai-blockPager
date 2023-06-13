import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EditorTools } from "../constants/EditorTools";


 const ReadPrivate = ({ title, data }) => {
  const editorRef = useRef(null);
  const isEditorReady = useRef(false);

  useEffect(() => {
    if (!isEditorReady.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        tools: EditorTools,
        data,
        autofocus: true,
      });

      editorRef.current = editor;
      isEditorReady.current = true;
    }
  }, [data]);


  return (
    <div className="mx-auto  xs:w-11/12 md:w-11/12 min-h-full">
      <div className="bg-[#fff9f9] shadow-card hover:shadow-cardhover transition-colors duration-500 rounded ">
        <div className="border-b text-center">
          <h2 className="md:text-3xl xs:text-2xl p-3 uppercase insetshadow ">
            {title}
          </h2>
        </div>
        <div
          id="editorjs"
          className="overflow-y-auto h-screen p-4 min-h-full custom-scroll  overflow-x-hidden"
        ></div>
      </div>
    </div>
  );
};

export default ReadPrivate;
