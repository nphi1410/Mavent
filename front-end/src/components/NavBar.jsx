import React, { useEffect, useRef, useState } from "react";
import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { getTags } from "./../services/tagService";
import { useNavigate, useSearchParams } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [searchParam] = useSearchParams();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await getTags({ eventId: null });
        setTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleNavigate = (tagId) => {
    const newParams = new URLSearchParams(searchParam);
    newParams.set("tagId", tagId);
    navigate(`/events?${newParams.toString()}`);
  };

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
          {tags.map((tag) => (
            <SwiperSlide
              key={tag.tagId}
              className="!w-auto cursor-pointer select-none rounded-md px-4 py-2 hover:bg-blue-100 transition"
              onClick={() => handleNavigate(tag.tagId)}
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
