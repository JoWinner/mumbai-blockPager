import Header from "@editorjs/header";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
// import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Raw from "@editorjs/raw";
import Underline from "@editorjs/underline";
import Paragraph from "editorjs-paragraph-with-alignment";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
// import Image from "@editorjs/image";
import SimpleImage from "@editorjs/simple-image";
import SimpleImg from "./simple-image";
import AnyButton from "editorjs-button";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
import Alert from "editorjs-alert";
import Tooltip from "editorjs-tooltip";
// import Layout from "editorjs-layout";
import SocialPost from "editorjs-social-post-plugin";


export const EditorTools = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: "Enter a header",
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 1,
    },
  },
  socialPost: { class: SocialPost, inlineToolbar: true },

  linkTool: LinkTool,
  // layout: {
  //   class: Layout,
  //   inlineToolbar: true,
  // },
  alert: {
    class: Alert,
    inlineToolbar: true,
  },
  embed: {
    class: Embed,
    inlineToolbar: true,
    config: {
      services: {
        youtube: true,
        coub: true,
        twitter: true,
        codepen: true,
        instagram: true,
        " twitch-video": true,
        "twitch-channel": true,
        vimeo: true,
        imgur: true,
        pinterest: true,
        aparat: true,
        gfycat: true,
        "yandex-music-track": true,
        "yandex-music-album ": true,
        "yandex-music-playlist ": true,
        miro: true,
      },
    },
  },
  table: {
    class: Table,
    inlineToolbar: true,
  },
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: "ordered",
    },
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
  },
  code: {
    class: Code,
    inlineToolbar: true,
  },
  // linkTool: {
  //   class: LinkTool,
  //   inlineToolbar: true,
  //   config: {
  //     //TODO: Need an endpoint server to upload images and attachments
  //     //endpoint: "http://localhost:8008/fetchUrl", // backend endpoint for url data fetching,
  //   },
  // },
  raw: {
    class: Raw,
    inlineToolbar: true,
  },
  underline: {
    class: Underline,
    inlineToolbar: true,
  },
  tooltip: {
    class: Tooltip,
    config: {
      location: "left",
      highlightColor: "#FFEFD5",
      underline: true,
      backgroundColor: "#154360",
      textColor: "#FDFEFE",
    },
  },
  paragraph: { class: Paragraph, inlineToolbar: true },
  AnyButton: {
    class: AnyButton,
    inlineToolbar: true,
    // config: {
    //   css: {
    //     btnColor: "btn--blue",
    //   },
    // },
  },
  quote: { class: Quote, inlineToolbar: true },
  marker: { class: Marker, inlineToolbar: true },
  checklist: { class: CheckList, inlineToolbar: true },
  delimiter: { class: Delimiter, inlineToolbar: true },
  inlineCode: { class: InlineCode, inlineToolbar: true },

  //TODO: Need to know that this "SimpleImage"
  //TODO:originally allows image drag and drop
 image: {
    class: SimpleImage,
    inlineToolbar: true,
    config: {
      placeholder: "Drag and drop an image",
    },
  },
  //FIXME: Settle on one of these two image //FIXME:classes becox they might cause problems with
  //TODO: Know that this "Simpleimg" allows to paste img url
  simpleimg: {
    class: SimpleImg,
    inlineToolbar: true,
    config: {
      placeholder: "Paste image URL",
    },
  },
  //TODO: Need an endpoint server to upload images and attachments
  //   attaches: {
  //     class: AttachesTool,
  //     config: {
  //       //   endpoint: 'http://localhost:8008/uploadFile'
  //     },
  //   },

  onReady: () => {
    new Undo({ EditorJS });
    new DragDrop(EditorJS);
  },
};
