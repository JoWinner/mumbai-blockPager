import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContents, provideContract } from "../constants/ContentFetch";

import {
  PublishedCard,
  CategoryTab,
  Carousel,
  Table,
  HorizontalCard,
} from "../components";

const CategoryPage = () => {
  const [featuredPagers, setFeaturedPagers] = useState([]);
  const [publishedPagers, setPublishedPagers] = useState([]);
  const [noCategoryPagers, setNoCategoryPagers] = useState([]);
  const [topPagers, setTopPagers] = useState([]);
  const [userData, setUserData] = useState([]);
  const { label } = useParams();
  const category = label;
  const tableHeading = `Top ${category} pagers`;
  const horizCardHeading = `${category} pagers`;
  const publishedCardHeading = "Peak your interests";
  const catCardHeading = "Read more here";

  useEffect(() => {
    loadFeatured(category);
    loadPublished(category);
  }, [category]);

  async function loadFeatured(category) {
    const data = await provideContract.fetchFeaturedItems();
    let contents = await getContents(data, setUserData);
    if (category) {
      // Filter contents based on category if it is defined
      contents = contents.filter((content) => {
        return content.category === category;
      });
    }

    setFeaturedPagers(contents);
  }

  async function loadPublished(category) {
    const data = await provideContract.fetchAllContents();
    let contents = await getContents(data, setUserData);
    const generalContents = await getContents(data, setUserData);
    if (category) {
      // Filter contents based on category if it is defined
      contents = contents.filter((content) => {
        return content.category === category;
      });
    }
    setPublishedPagers(contents);
    setNoCategoryPagers(generalContents);
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
