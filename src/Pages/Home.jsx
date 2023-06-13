import { useState, useEffect } from "react";
import {
  getContents,
  provideContract,
} from "../constants/ContentFetch";

import {
  FeaturedSection2,
  FeaturedSection1,
  PublishedCard,
  CategoryTab,
  Categories,
  Table,
} from "../components";

const Home = () => {
  const [featuredPagers, setFeaturedPagers] = useState([]);
  const [featuredPager1, setFeaturedPager1] = useState([]);
  const [featuredPager2, setFeaturedPager2] = useState([]);
  const [userData, setUserData] = useState({});
  const [currentContents, setCurrentContents] = useState([]);
  const [publishedPagers, setPublishedPagers] = useState([]);
  const tableHeading = "Top pagers from all categories ";
  const publishedCardHeading = "Pagers to read today";

  useEffect(() => {
    loadFeaturedPagers();
    loadPublishedPagers();
  }, []);

  async function loadFeaturedPagers() {
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
  }

  async function loadPublishedPagers() {
    const publishedData = await provideContract.fetchAllContents();
    const contents = await getContents(publishedData, setUserData);
    setPublishedPagers(contents);
  }



  return (
    <div>
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
    </div>
  );
};

export default Home;
