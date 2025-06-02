import React from "react";
import CardRelevant from "./card/CardMedium";

const events = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: "CODE FEST 2025",
  startDatetime: "2025-09-01T00:00:00Z",
  avgRating: 4.24,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...",
  imageUrl: "/images/f-camp.png",
}));

const RelevantEvent = () => {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-12 border-t-2 border-gray-200 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Other Events You May Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <CardRelevant key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
};

export default RelevantEvent;
