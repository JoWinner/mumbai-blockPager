import { useState, useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { getContents, provideContract } from "../constants/ContentFetch";

import { Loader } from "../components";

const PublishedCard = lazy(() => import("../components/PublishedCard"));
const CategoryTab = lazy(() => import("../components/CategoryTab"));
const Carousel = lazy(() => import("../components/Carousel"));
const Table = lazy(() => import("../components/Table"));
const HorizontalCard = lazy(() => import("../components/HorizontalCard"));

const CategoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredPagers, setFeaturedPagers] = useState([]);
  const [publishedPagers, setPublishedPagers] = useState([]);
  const [noCategoryPagers, setNoCategoryPagers] = useState([]);
  const [userData, setUserData] = useState([]);
  const { label } = useParams();
  const category = label;
  const tableHeading = `Top ${category} pagers`;
  const horizCardHeading = `${category} pagers`;
  const publishedCardHeading = "Peak your interests";
  const catCardHeading = "Read more here";

  useEffect(() => {
    loadData(category);
  }, [category]);

  async function loadData(category) {
    setIsLoading(true);

    try {
      const featuredData = await provideContract.fetchFeaturedItems();
      let contents = await getContents(featuredData, setUserData);
      if (category) {
        // Filter contents based on category if it is defined
        contents = contents.filter((content) => content.category === category);
      }
      setFeaturedPagers(contents);

      const publishedData = await provideContract.fetchAllContents();
      let publishedContents = await getContents(publishedData, setUserData);
      let generalContents = await getContents(publishedData, setUserData);
      if (category) {
        // Filter contents based on category if it is defined
        publishedContents = publishedContents.filter(
          (content) => content.category === category
        );
      }
      setPublishedPagers(publishedContents);
      setNoCategoryPagers(generalContents);
    } catch (error) {
      console.error("Error while loading data:", error);
    }

    setIsLoading(false);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Suspense fallback={<Loader />}>
        <HorizontalCard
          featuredPagers={featuredPagers}
          heading={horizCardHeading}
        />
        <Table publishedPagers={publishedPagers} heading={tableHeading} />
        <Carousel slides={featuredPagers} />
        <PublishedCard
          publishedPagers={publishedPagers}
          heading={catCardHeading}
        />
        <CategoryTab publishedPagers={noCategoryPagers} />
        <PublishedCard
          publishedPagers={noCategoryPagers}
          heading={publishedCardHeading}
        />
      </Suspense>
    </div>
  );
};

export default CategoryPage;
