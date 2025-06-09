import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import Banner from "../components/Banner";
import Footer from "../components/common/Footer";
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
          const urls = data.map((img) =>
            convertToUrl(img.content, img.contentType)
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
      <Header />
      {/*ongoing trending events */}
      <Banner />
      <NavBar />
      <Content />
      <Video />
      <Gallery imageUrls={bannerUrls} />
      <Footer />
    </div>
  );
};

export default HomePage;
