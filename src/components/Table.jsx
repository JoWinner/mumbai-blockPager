import { Link } from "react-router-dom";

import { polygonToken1 } from "../../images";
import { HiEye } from "react-icons/hi";

const Table = ({ heading, publishedPagers }) => {
  const sortedPublishedPagers = [...publishedPagers];


  const quickSort = (arr, low, high) => {
    if (low < high) {
      const pivotIndex = partition(arr, low, high);
      quickSort(arr, low, pivotIndex - 1);
      quickSort(arr, pivotIndex + 1, high);
    }
  };


  const partition = (arr, low, high) => {
    const pivot = arr[high].numViews;
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j].numViews >= pivot) {
        i++;
        swap(arr, i, j);
      }
    }

    swap(arr, i + 1, high);
    return i + 1;
  };

  const swap = (arr, i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  };

  quickSort(sortedPublishedPagers, 0, sortedPublishedPagers.length - 1);

  const firstSection = sortedPublishedPagers.slice(0, 5);
  const secondSection = sortedPublishedPagers.slice(5,10);

  return (
    <div className="my-16">
      <section className="antialiased bg-slate-100  text-slate-600   ">
        <header className="px-14 py-4 text-2xl">
          <h2 className="font-semibold text-gray-dark">{heading}</h2>
        </header>
        <div className="flex  justify-center  h-full">
          {/* <!-- Table --> */}
          <div className="flex flex-col lg:flex-row">
            <div className="w-full  px-4 bg-white shadow-lg rounded-sm border border-slate-200">
              <div className="p-3">
                <div className="overflow-x-auto">
                  {/* First Section */}
                  <table className="table-auto w-full">
                    <thead className="text-xs  font-semibold uppercase text-slate-400 bg-slate-50">
                      <tr>
                        <th className="p-2 whitespace-nowrap w-[20%]">
                          <div className="font-semibold text-left">Name</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-[50%]">
                          <div className="font-semibold text-left">Title</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-[13%]">
                          <div className="font-semibold text-left">Price</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-[17%]">
                          <div className="font-semibold text-left">Views</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                      {firstSection.map((content, index) => (
                        <tr key={index}>
                          <td className="p-2 whitespace-normal">
                            <div className="flex  flex-col gap-2">
                              <h2 className="font-semibold text-sm leading-4 text-gray-dark  hover:underline transitions-all duration-500">
                                <Link
                                  to={`/creator/${content.id}/${content.creatorAddress}/${content.creator}`}
                                  state={{ content: content }}
                                >
                                  {content?.creator}
                                </Link>
                              </h2>
                              <div className="w-16 h-16 ">
                                <img
                                  className="rounded-md w-16 h-12 object-cover"
                                  src={content?.image}
                                  alt={content?.title}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap ">
                            <div className="flex flex-col gap-2 text-gray-dark">
                              <div className="text-left whitespace-normal  font-semibold md:font-bold hover:text-blue transition-colors duration-500">
                                <Link
                                  to={`/published-item/${
                                    content.id
                                  }/${encodeURIComponent(
                                    content.title
                                  )}/${encodeURIComponent(content.category)}`}
                                  state={{ content: content }}
                                >
                                  {content?.title}
                                </Link>
                              </div>
                              <div className="text-left hidden md:whitespace-normal md:max-w-md md:line-clamp-3">
                                {content?.description}
                              </div>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left font-medium text-gray-dark text-sm md:text-base flex flex-row">
                              <img
                                src={polygonToken1}
                                className="hidden md:flex md:w-4 mr-1"
                                alt=""
                              />
                              {content?.price}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left font-medium text-gray-dark items-center text-sm md:text-base flex flex-row gap-1">
                              <HiEye className="hidden md:flex md:text-lg text-gray " />

                              {content?.numViews}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Second Section */}
            <div className="w-full  px-4 bg-white shadow-lg rounded-sm border border-slate-200 ">
              <div className="p-3">
                <div className="overflow-x-auto">
                  <table className="table-fixed w-full">
                    <thead className="text-xs  font-semibold uppercase text-slate-400 bg-slate-50">
                      <tr>
                        <th className="p-2 whitespace-nowrap w-[20%]">
                          <div className="font-semibold text-left ">Name</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-[50%]">
                          <div className="font-semibold text-left">Title</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-[13%] ">
                          <div className="font-semibold text-left ">Price</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-[17%]">
                          <div className="font-semibold text-left">Views</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                      {secondSection.map((content, index) => (
                        <tr key={index}>
                          <td className="p-2 whitespace-normal">
                            <div className="flex  flex-col gap-2">
                              <div className="font-semibold text-sm leading-4 text-gray-dark">
                                {content?.creator}
                              </div>
                              <div className="w-16 h-16 ">
                                <img
                                  className="rounded-md w-16 h-12 object-cover"
                                  src={content?.image}
                                  alt={content?.creator}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap ">
                            <div className="flex flex-col gap-2 text-gray-dark">
                              <div className="text-left whitespace-normal  font-semibold md:font-bold hover:text-blue transition-colors duration-500">
                                <Link
                                  to={`/published-item/${
                                    content.id
                                  }/${encodeURIComponent(
                                    content.title
                                  )}/${encodeURIComponent(content.category)}`}
                                  state={{ content: content }}
                                >
                                  {content?.title}
                                </Link>
                              </div>
                              <div className="text-left hidden md:whitespace-normal md:max-w-md md:line-clamp-3">
                                {content?.description}
                              </div>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left font-medium text-gray-dark text-sm md:text-base flex flex-row">
                              <img
                                src={polygonToken1}
                                className="hidden md:flex md:w-4 mr-1"
                                alt=""
                              />
                              {content?.price}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left font-medium text-gray-dark items-center text-sm md:text-base flex flex-row gap-1">
                              <HiEye className="hidden md:flex md:text-lg text-gray " />

                              {content?.numViews}
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
        </div>
      </section>
    </div>
  );
};

export default Table;
