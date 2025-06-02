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

  const [bannerUrls, setBannerUrls] = useState([]);  useEffect(() => {
    // Just use local images directly since the API is not working
    setBannerUrls([
      '/images/fptu-showcase.png',
      '/images/f-camp.png',
      '/images/codefest.png',
      '/images/gameshow.png',
    ]);
    
    // This code is commented out until the backend API is fixed
    /*
    const fetchImages = async () => {
      try {
        const response = await getImages();
        
        if (response.data && response.data.length > 0 && response.data.some(img => img.content)) {
          const urls = response.data.map((img) => 
            convertToUrl(img.content, img.contentType)
          );
          setBannerUrls(urls);
        } else {
          useLocalImages();
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        useLocalImages();
      }
    };
    
    // Helper function to use local images
    const useLocalImages = () => {
      setBannerUrls([
        '/images/fptu-showcase.png',
        '/images/f-camp.png',
        '/images/codefest.png',
        '/images/gameshow.png',
      ]);
    };
    
    fetchImages();
    */
  }, []);  // This function is temporarily commented out as we're using local images directly
  /*
  const convertToUrl = (base64Content, contentType) => {
    if (!base64Content || base64Content.trim() === '') {
      return '/images/fptu-showcase.png';
    }
    return `data:${contentType};base64,${base64Content}`;
  };
  */

  return (
    <div className="w-full">
      <Header />
      <Banner bannerUrls={images} />
      <NavBar />
      <Content imageUrl={images[0]}/>
      <Video />
      <Gallery imageUrls={images}/>
      <Footer />
    </div>
  );
};

export default HomePage;
