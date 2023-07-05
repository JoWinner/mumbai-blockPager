import { useNavigate } from "react-router-dom";

const ErrorFallback = ({ resetErrorBoundary }) => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
  return (
    <div
      role="alert"
      className=" bg-gradient-to-bl from-neutral-800 h-screen via-sky-700 to-current "
    >
      <div className="items-center py-20 px-10 flex flex-col ">
        <h1 className="insetshadow text-[50px] font-bold  bg-transparent tracking-widest leading-10 py-10">
          Something went wrong:
        </h1>
        <h3 className="my-10 text-xl text-black font-semibold">
          There seems to be an error, reload or go back home!
        </h3>
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="py-3 px-6 bg-black  text-gray-light   font-extrabold tracking-tight md:text-3xl xs:text-3xl rounded-md cursor-pointer hover:text-deep-blue transition-colors
              duration-500"
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
