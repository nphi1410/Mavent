import "../style/banner.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";
import { getFilterEvents } from "../services/eventService";

const Banner = ({ bannerUrls }) => {
  const swiperRef = useRef(null);
  const [trendingOnGoingEvents, setTrendingOnGoingEvents] = useState([]);

  useEffect(() => {
    async function fetchTrendingOngoing() {
      const data = await getFilterEvents({
        page: 0,
        size: 5,
        isTrending: true,
        type: "ongoing",
        sortType: "END_DATE_ASC",
      });
      if (data) {
        setTrendingOnGoingEvents(data.content || []);
      }
    }

    fetchTrendingOngoing();
  }, []);

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.autoplay.start();
      swiperRef.current.swiper.activeIndex = 0;
    }
  }, [bannerUrls]);
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
        loop={trendingOnGoingEvents.length > 1}
        className="h-64 sm:h-96 md:h-[400px] lg:h-[600px]"
      >
        {trendingOnGoingEvents.map((event, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <img
                src={event.bannerUrl}
                alt={event.name}
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
