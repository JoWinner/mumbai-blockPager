import { HiCheckCircle, HiExclamation, HiX } from 'react-icons/hi';

const Toast = () => {
  return (
    <div>
      <div className="flex w-96 shadow-lg rounded-lg mb-2">
        <div className="bg-green py-4 px-5 rounded-l-lg flex items-center">
          <HiCheckCircle className="text-white w-8 h-8" />
        </div>
        <div className="px-4 py-4 bg-black rounded-r-lg flex justify-between items-center w-full border-2 border-l-transparent text-white border-gray-light">
          <div>Success alert</div>
          <button>
            <HiX className="text-xl" />
          </button>
        </div>
      </div>

      <div className="flex w-96 shadow-lg rounded-lg">
        <div className="bg-red py-4 px-5 rounded-l-lg flex items-center">
          <HiExclamation className="text-white w-8 h-8" />
        </div>
        <div className="px-4 py-4 bg-black rounded-r-lg flex justify-between items-center w-full border-2 border-l-transparent text-white border-gray-light">
          <div >Danger alert</div>
          <button>
            <HiX className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast