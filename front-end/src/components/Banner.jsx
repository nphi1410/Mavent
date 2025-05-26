import React, { useEffect, useRef, useState } from "react";
import "../style/banner.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getImages } from "../services/documentService";

const Banner = () => {
  const [bannerUrls, setBannerUrls] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getImages(); // [{ content, contentType }]
        const urls = response.data.map((img) =>
          convertToUrl(img.content, img.contentType)
        );
        setBannerUrls(urls);

        // Restart autoplay if Swiper is ready
        if (swiperRef.current?.swiper)  {
          swiperRef.current.swiper.autoplay.start();
        }
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
    <div className="max-w-full p-4 m-4 rounded-lg overflow-hidden border border-gray-300 shadow-lg">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="h-64 sm:h-96 md:h-[400px] lg:h-[600px] xl:h-[800px]"
      >
        {bannerUrls.map((bannerUrl, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <img
                src={bannerUrl}
                alt={`slide-${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Overlay for subtle darkening */}
              <div className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm rounded-lg"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
