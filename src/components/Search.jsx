import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getContents, provideContract } from "../constants/ContentFetch";
import { polygonToken1 } from "../../images";
import { HiEye, HiX } from "react-icons/hi";
import { HiSearch } from "react-icons/hi";

const Search = () => {
  const [publishedPagers, setPublishedPagers] = useState([]);
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const searchKeys = ["creator", "title", "category", "description"];

  useEffect(() => {
    if (searchQuery !== "") {
      loadPublished();
    } else {
      setPublishedPagers([]);
    }
  }, [searchQuery]);

  async function loadPublished() {
    const data = await provideContract.fetchAllContents();
    // console.log("data:", data);
    let contents = await getContents(data, setUserData);
    setPublishedPagers(contents);
  }

  const clearInput = () => {
    setSearchQuery("");
  };

  const searchContent = publishedPagers.filter((content) =>
    searchKeys.some((key) =>
      content[key].toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="pt-2">
      <div className="max-w-md  md:w-[700px] mx-auto">
        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg border border-gray-light bg-white overflow-hidden">
          <input
            className="peer h-full w-full border-none text-sm text-gray-dark pl-2"
            type="text"
            id="search"
            placeholder="Search by creator/title/description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery.length > 0 ? (
            <div className="grid place-items-center bg-gray-light h-full w-12 text-slate-300">
              <button onClick={clearInput}>
                <HiX className="text-3xl text-blue" />
              </button>
            </div>
          ) : (
            <div className="grid place-items-center bg-gray-light h-full w-12 text-slate-300">
              <HiSearch className="text-3xl text-blue" />
            </div>
          )}
        </div>
        {/* Search results Table below */}
        {searchQuery.length > 0 && (
          <div className="relative  pt-2">
            {/* Table Section */}
            <section className="absolute  antialiased -right-[133px] -left-[85px] lg:-right-[310px] md:left-0 text-slate-600">
              <div className="flex justify-center h-full">
                {/* <!-- Table --> */}
                <div className="w-full p-4 rounded-lg bg-white shadow-lg border border-slate-200">
                  <div className="md:p-3">
                    <div className="overflow-x-hidden h-96 lg:w-[700px] custom-scroll">
                      <table className="table-auto w-full">
                        <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
                          <tr>
                            <th className="p-2 whitespace-nowrap w-[20%]">
                              <div className="font-semibold text-left">
                                Category
                              </div>
                            </th>
                            <th className="p-2 whitespace-nowrap w-[50%]">
                              <div className="font-semibold text-left">
                                Title
                              </div>
                            </th>
                            <th className="p-2 whitespace-nowrap w-[13%]">
                              <div className="font-semibold text-left">
                                Price
                              </div>
                            </th>
                            <th className="p-2 whitespace-nowrap w-[17%]">
                              <div className="font-semibold text-left">
                                Views
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100">
                          {searchContent.map((content, index) => (
                            <tr key={index}>
                              <td className="p-2 whitespace-normal">
                                <div className="font-semibold text-base text-gray-dark">
                                  {content.category}
                                </div>
                                <p className="text-blue hover:underline transition-colors duration-500">
                                  <Link
                                    to={`/creator/${content.id}/${content.creatorAddress}/${content.creator}`}
                                    state={{ content: content }}
                                    onClick={clearInput}
                                  >
                                    {content.creator}
                                  </Link>
                                </p>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <Link
                                  to={`/published-item/${
                                    content.id
                                  }/${encodeURIComponent(
                                    content.title
                                  )}/${encodeURIComponent(content.category)}`}
                                  state={{ content: content }}
                                  className=""
                                  onClick={clearInput}
                                >
                                  <div className="flex flex-col gap-2 text-gray-dark">
                                    <div className="text-left whitespace-normal font-semibold text-sm transition-colors duration-500">
                                      {content.title}
                                    </div>
                                    <div className="text-left hidden md:whitespace-normal md:max-w-md md:line-clamp-2 font-normal">
                                      {content.description}
                                    </div>
                                  </div>
                                </Link>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-left font-medium text-gray-dark text-sm flex flex-row">
                                  <img
                                    src={polygonToken1}
                                    className="hidden md:flex md:w-4 mr-1"
                                    alt=""
                                  />
                                  {content.price}
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-left font-medium text-gray-dark items-center text-sm flex flex-row gap-1">
                                  <HiEye className="hidden md:flex text-lg text-gray" />
                                  {content.numViews}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
