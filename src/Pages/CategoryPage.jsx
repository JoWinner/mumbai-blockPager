import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContents, provideContract } from "../constants/ContentFetch";

import {
  PublishedCard,
  CategoryTab,
  Carousel,
  Table,
  HorizontalCard,
  Loader,
} from "../components";

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
    </div>
  );
};

export default CategoryPage;
