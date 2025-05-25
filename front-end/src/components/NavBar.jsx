import React, { useRef } from "react";
import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const NavBar = () => {
  const topics = Array.from({ length: 30 }, (_, i) => `Topic ${i + 1}`);
  const swiperRef = useRef(null);

  return (
    <div className="flex items-center border border-gray-300 rounded-lg m-3 px-10 py-2 max-w-full">
      <div className="flex-1 overflow-hidden">
        <Swiper
          modules={[Mousewheel, Navigation]}
          spaceBetween={30}
          slidesPerView="auto"
          slidesPerGroup={3}
          mousewheel
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="!overflow-visible"
        >
          {topics.map((topic, index) => (
            <SwiperSlide
              key={index}
              className="!w-auto cursor-pointer select-none rounded-md px-4 py-2 hover:bg-blue-100 transition"
            >
              <span className="text-base font-semibold whitespace-nowrap">
                {topic}
              </span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NavBar;
