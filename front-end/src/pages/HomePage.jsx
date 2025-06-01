import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import Banner from "../components/Banner";
import Footer from "../components/common/Footer";
import NavBar from "./../components/NavBar";
import Content from "../components/Content";
import Video from "../components/visual/Video";
import Gallery from "../components/visual/Gallery";
import { getImages } from "../services/documentService";

const HomePage = () => {
  const images = [
    "/images/codefest.png",
    "/images/f-camp.png",
    "/images/fptu-showcase.png",
    "/images/gameshow.png",
    "/images/petty-gone.png",
    "/images/soul-note.png",
  ];

  const [bannerUrls, setBannerUrls] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getImages(); // [{ content, contentType }]
        const urls = response.data.map((img) =>
          convertToUrl(img.content, img.contentType)
        );
        setBannerUrls(urls);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImages();
  }, []);

  const convertToUrl = (base64Content, contentType) => {
    return `data:${contentType};base64,${base64Content}`;
  };

  return (
    <div className="w-full">
      <Header />
      <Banner bannerUrls={bannerUrls} />
      <NavBar />
      <Content imageUrl={bannerUrls[0]}/>
      <Video />
      <Gallery imageUrls={bannerUrls}/>
      <Footer />
    </div>
  );
};

export default HomePage;
