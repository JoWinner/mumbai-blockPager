import { useState} from "react";
import { Link } from "react-router-dom";
import Card from "./Card";

const PublishedCard = ({ heading, creatorAddress,creator, publishedPagers }) => {
  const [pagerCount, setPagerCount] = useState(6);



  const handleLoadMore = () => {
    setPagerCount((prevCount) => prevCount + 6);
  };

  return (
    <div className="my-16">
      <header className="px-14 text-2xl">
        <h2 className="font-semibold text-gray-dark">{heading}</h2>
      </header>

      <div className="p-8 grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {publishedPagers.slice(0, pagerCount).map((content) => (
          <div key={content?.id}>
            <Card
              image={content?.image}
              title={
                <Link
                  to={`/published-item/${content.id}/${encodeURIComponent(
                    content.title
                  )}/${encodeURIComponent(content.category)}`}
                  state={{ content: content }}
                >
                  {content?.title}
                </Link>
              }
              description={content?.description}
              category={content?.category}
              creator={
                <Link
                  to={`/creator/${content.id}/${content.creatorAddress}/${content.creator}`}
                  state={{ content: content }}
                >
                  {content?.creator}
                </Link>
              }
              numViews={content?.numViews}
              price={content?.price}
              date={content?.date.toLocaleString()}
            />
          </div>
        ))}
      </div>

      {publishedPagers.length > pagerCount && ( // Render "Load more" button if there are more pagers to load
        <div className="flex flex-col my-5 text-white items-center">
          <button
            className="cursor-pointer bg-blue rounded-md px-4 py-3 hover:bg-deep-blue transition-colors 
              duration-500"
            onClick={handleLoadMore}
          >
            <span>Load more pagers</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PublishedCard;

