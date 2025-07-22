import React, { useEffect, useState } from "react";
import { getSponsorByEventId } from "../../services/SponsorService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import SponsorCard from "./SponsorCard";

const EventSponsors = ({ eventId }) => {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await getSponsorByEventId(eventId);
        setSponsors(data);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };
    if (eventId) fetchSponsors();
  }, [eventId]);

  return (
    <div className="w-full px-4 md:px-6 text-gray-900">
      <div className="mb-6 border-b border-gray-300 pb-3">
        <h2 className="text-4xl font-bold tracking-tight">🌟 Our Sponsors</h2>
      </div>

      {sponsors === null || sponsors.length === 0 ? (
        <p className="text-gray-500 text-center">No sponsors yet</p>
      ) : (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={sponsors.length > 3 ? 3 : sponsors.length}
          slidesPerGroup={1}
          loop={sponsors.length > 3}
          autoplay={{ delay: 3000 }}
          className="h-full"
        >
          {sponsors.map((sponsor) => (
            <SwiperSlide key={sponsor.sponsorId} className="h-full flex">
              <SponsorCard sponsor={sponsor} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default EventSponsors;
