import { useState, useEffect, lazy, Suspense } from "react";
import { getContents, provideContract } from "../constants/ContentFetch";

import { Loader } from "../components";

const Categories = lazy(() => import("../components/Categories"));
const FeaturedSection1 = lazy(() => import("../components/FeaturedSection1"));
const FeaturedSection2 = lazy(() => import("../components/FeaturedSection2"));
const Table = lazy(() => import("../components/Table"));
const PublishedCard = lazy(() => import("../components/PublishedCard"));
const CategoryTab = lazy(() => import("../components/CategoryTab"));

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredPagers, setFeaturedPagers] = useState([]);
  const [featuredPager1, setFeaturedPager1] = useState(null);
  const [featuredPager2, setFeaturedPager2] = useState(null);
  const [userData, setUserData] = useState({});
  const [currentContents, setCurrentContents] = useState([]);
  const [publishedPagers, setPublishedPagers] = useState([]);
  const tableHeading = "Top pagers from all categories";
  const publishedCardHeading = "Pagers to read today";

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);

    try {
      const featuredData = await provideContract.fetchFeaturedItems();
      const contents = await getContents(featuredData, setUserData);
      const randomIndex1 = Math.floor(Math.random() * contents.length);
      const randomIndex2 = Math.floor(Math.random() * contents.length);
      const featuredPager1 = contents[randomIndex1];
      const featuredPager2 = contents[randomIndex2];
      setFeaturedPager1(featuredPager1);
      setFeaturedPager2(featuredPager2);
      const filteredContents = contents.filter(
        (pager) =>
          pager.id !== featuredPager1.id && pager.id !== featuredPager2.id
      );
      setFeaturedPagers(filteredContents);
      setCurrentContents(contents.slice(0, 3));

      const publishedData = await provideContract.fetchAllContents();
      const publishedContents = await getContents(publishedData, setUserData);
      setPublishedPagers(publishedContents);
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
        <Categories />
        <FeaturedSection1
          currentContents={currentContents}
          featuredPager={featuredPager1}
        />
        <FeaturedSection2
          featuredPagers={featuredPagers}
          featuredPager={featuredPager2}
        />
        <Table publishedPagers={publishedPagers} heading={tableHeading} />

        <PublishedCard
          publishedPagers={publishedPagers}
          heading={publishedCardHeading}
        />

        <CategoryTab publishedPagers={publishedPagers} />
      </Suspense>
    </div>
  );
};

export default Home;
