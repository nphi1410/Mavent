import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import EventBanner from "../components/EventBanner";
import Description from "../components/Description";
import MapGuide from "../components/MapGuide";
import EventTime from "../components/EventTime";
import TagsList from "../components/TagsList";
import OrganizerContact from "../components/OrganizerContact";
import RelevantEvent from "../components/RelevantEvent";

const EventDetails = () => {
  const imageUrls = [
    "/images/codefest.png",
    "/images/f-camp.png",
    "/images/fptu-showcase.png",
    "/images/gameshow.png",
    "/images/petty-gone.png",
    "/images/soul-note.png",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <EventBanner bannerUrl={imageUrls[1]} />

        <section className="flex flex-col lg:flex-row justify-between gap-8 px-4 sm:px-6 lg:px-12 py-8">
          <div className="w-full lg:w-1/2">
            <Description />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <EventTime />
            <MapGuide />
          </div>
        </section>

        <section className="flex flex-col lg:flex-row justify-between gap-8 px-4 sm:px-6 lg:px-12 py-8">
          <div className="w-full lg:w-1/2">
            <OrganizerContact />
          </div>
          <div className="w-full lg:w-1/2">
            <TagsList />
          </div>
        </section>
        <RelevantEvent />
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;
