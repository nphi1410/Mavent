import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import NavBar from "./../components/NavBar";
import Content from "../components/Content";
import Video from "../components/visual/Video";
import Gallery from "../components/visual/Gallery";
import { getImages } from "../services/documentService";
import { convertToUrl } from "./../utils/ConvertFile";

const HomePage = () => {
  const [bannerUrls, setBannerUrls] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getImages();
        if (data) {
          console.log("document:", data);

          const urls = data.map(
            (img) =>
              // convertToUrl(img.content, img.contentType)
              img.filePath
          );
          setBannerUrls(urls);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="w-full">
      <Banner />
      <NavBar />
      <Content />
      <Video />
      <Gallery imageUrls={bannerUrls} />
    </div>
  );
};

export default HomePage;
