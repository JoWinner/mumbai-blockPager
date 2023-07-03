import Header from "@editorjs/header";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
// import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
// import LinkTool from "@editorjs/link";
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
import SimpleLink from "./SimpleLink";
import AnyButton from "editorjs-button";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
import Alert from "editorjs-alert";
import Tooltip from "editorjs-tooltip";
import * as EditorJSLayout from "editorjs-layout";
import SocialPost from "editorjs-social-post-plugin";
import * as EditorJSInlineStyle from "editorjs-style";
import EditorJS from "@editorjs/editorjs";

const editorJSConfig={};


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

  linkTool: {
    class: SimpleLink,
    inlineToolbar: true,
  },
  layout: {
    class: EditorJSLayout.LayoutBlockTool,
    config: {
      EditorJS,
      editorJSConfig,
      enableLayoutEditing: false,
      enableLayoutSaving: true,
      initialData: {
        itemContent: {
          1: {
            blocks: [],
          },
        },
        layout: {
          type: "container",
          id: "",
          className: "",
          style: "border: 1px solid #f5f1f1;border-radius: 0.3rem; ",
          children: [
            {
              type: "item",
              id: "",
              className: "",
              style:
                "border: 1px solid #d3dce6; display: inline-block;border-radius: 0.3rem;padding: 16px; ",
              itemContentId: "1",
            },
          ],
        },
      },
    },
  },
  twoColumns: {
    class: EditorJSLayout.LayoutBlockTool,
    config: {
      EditorJS,
      editorJSConfig:{},
      enableLayoutEditing: false,
      enableLayoutSaving: false,
      initialData: {
        itemContent: {
          1: {
            blocks: [],
          },
          2: {
            blocks: [],
          },
        },
        layout: {
          type: "container",
          id: "1",
          className: "",
          style:
            "border: 1px solid #f5f1f1; display: flex; justify-content: space-around; padding: 16px; border-radius: 0.3rem;",
          children: [
            {
              type: "item",
              id: "2",
              className: "",
              style:
                "border: 1px solid #d3dce6; padding: 8px; border-radius: 0.3rem;",
              itemContentId: "1",
            },
            {
              type: "item",
              id: "3",
              className: "",
              style:
                "border: 1px solid #d3dce6; padding: 8px; border-radius: 0.3rem;",
              itemContentId: "2",
            },
          ],
        },
      },
    },
    shortcut: "CMD+2",
    toolbox: {
      icon: `
              <svg xmlns='http://www.w3.org/2000/svg' width="16" height="16" viewBox='0 0 512 512'>
                <rect x='128' y='128' width='336' height='336' rx='57' ry='57' fill='none' stroke='currentColor' stroke-linejoin='round' stroke-width='32'/>
                <path d='M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/>
              </svg>
            `,
      title: "2 columns",
    },
  },
  style: EditorJSInlineStyle.StyleInlineTool,

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
  },
  quote: { class: Quote, inlineToolbar: true },
  marker: { class: Marker, inlineToolbar: true },
  checklist: { class: CheckList, inlineToolbar: true },
  delimiter: { class: Delimiter, inlineToolbar: true },
  inlineCode: { class: InlineCode, inlineToolbar: true },

  // Need to know that this "SimpleImage"
  //originally allows image drag and drop
  image: {
    class: SimpleImage,
    inlineToolbar: true,
    config: {
      placeholder: "Drag and drop an image",
    },
  },

  // Know that this "Simpleimg" allows to paste img url
  simpleimg: {
    class: SimpleImg,
    inlineToolbar: true,
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
