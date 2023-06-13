import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };
  return (
    <div className=" bg-gradient-to-bl from-neutral-800 h-screen via-sky-700 to-current ">
      <div className="items-center py-20 px-10 flex flex-col ">
        <h1 className="insetshadow text-[200px] font-bold  bg-transparent tracking-widest leading-10 py-10">
          404
        </h1>
        <h3 className="my-10 text-xl text-black font-semibold">
          Oops! The page/URL you are looking for doesn't exist.
        </h3>

        <button
          type="button"
          onClick={goHome}
          className="py-3 px-6 bg-black  text-gray-light   font-extrabold tracking-tight md:text-3xl xs:text-3xl rounded-md cursor-pointer hover:text-deep-blue transition-colors
              duration-500"
        >
          Let's Go Back Home
        </button>
      </div>
    </div>
  );
};

export default Page404;
