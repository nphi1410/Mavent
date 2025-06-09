import React, { useEffect, useRef, useState } from "react";
import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { getTags } from './../services/tagService';

const NavBar = () => {
  const swiperRef = useRef(null);
  const [tags,setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await getTags({ eventId: null });
        setTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    fetchTags();
  }, []);

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
          {tags.map((tag, index) => (
            <SwiperSlide
              key={index}
              className="!w-auto cursor-pointer select-none rounded-md px-4 py-2 hover:bg-blue-100 transition"
            >
              <span className="text-base font-semibold whitespace-nowrap">
                {tag.name}
              </span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NavBar;
