
const Modal = ({
  title,
  content,
  cancelLabel,
  onModalClose,
  agreeLabel,
  onAgreeClick,
  formElements,
}) => {
  return (
    <div className="fixed left-0 top-0 z-[1055] h-full w-full  overflow-x-hidden outline-none backdrop-blur-sm bg-black/30 scroll-none ">
      <div className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:min-h-[calc(100%-3.5rem)] min-[576px]:max-w-[500px] ">
        <div className="pointer-events-auto flex w-full flex-col rounded-md    ">
          <div className="flex flex-col  gap-2 p-6 rounded-md shadow-md bg-black justify-center items-center text-gray-light">
            <h1 className="text-xl font-semibold leading-tight tracking-wide">
              {title}
            </h1>
            <div className="flex-1 text-lg text-gray">
              {content}
             
            </div>
            <div>
            <form className="flex flex-col gap-4 w-full">{formElements}</form>
            </div><div className="flex  justify-center gap-3 mt-6">
              <button
                className="px-6 py-2 rounded-md border-2 border-blue"
                onClick={onModalClose}
              >
                {cancelLabel}
              </button>
              <button
                className="px-6 py-2 rounded-md shadow-sm bg-blue text-white"
                onClick={onAgreeClick}
              >
                {agreeLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
