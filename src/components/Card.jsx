import { HiEye } from "react-icons/hi";
import { polygonToken1} from "../../images";

const Card = ({
  image,
  title,
  description,
  category,
  numViews,
  price,
  creator,
  date,
}) => {
  return (
    <div className="rounded overflow-hidden shadow-lg bg-white">
      <div className="flex md:flex-row  justify-start bg-gradient-to-br from-slate-900 via-slate-900 to-black">
        <img className="w-24 h-24 " src={image} alt={title} />
        <div className="flex flex-col px-2">
          <h3 className="font-semibold leading-5 hover:text-cyan-500 transition-colors duration-500 text-lg text-gray-light pt-1">
            {title}
          </h3>
          <div className="mt-auto ">
            <p className="hover:underline text-cyan-600 truncate ">
              <span className="text-gray-light ">by</span> {creator}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2 p-3">
        <p
          rel="noopener noreferrer"
          href="#"
          className="text-gray-dark mt-auto text-normal text-justify line-clamp-3"
        >
          {description}
        </p>
        <div className="flex flex-row text-sm mt-auto justify-between items-center text-gray-400">
          <span className="inline-block bg-slate-200 rounded-full px-3 py-1 text-slate-700 ">
            {category}
          </span>
          <div className="flex space-x-1 items-center text-gray-dark ">
            <HiEye className="text-lg" />
            <span>{numViews}</span>
          </div>
          <div className=" px-3 flex justify-center w-max gap-1  ">
            <img src={polygonToken1} className="w-4 " />
            <h2 className="    text-gray-dark">
              {price}
            </h2>
          </div>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
