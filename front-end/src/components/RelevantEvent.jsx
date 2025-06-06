import React, { useEffect, useState } from "react";
import CardRelevant from "./card/CardMedium";
import { getTags } from "../services/tagService";
import { getFilterEvents } from "../services/eventService";

const RelevantEvent = ({ eventData }) => {
  const [tagIds, setTagIds] = useState([]);
  const [relevantEvents, setRelevantEvents] = useState([]);

  // Step 1: Fetch tags when eventData.eventId changes
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await getTags({ eventId: eventData.eventId });
        setTagIds(fetchedTags.map((tag) => tag.tagId));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, [eventData.eventId]);
  useEffect(() => {
    if (tagIds.length === 0) return; // Don't fetch if no tags

    const fetchRelevantEvents = async () => {
      try {
        const data = await getFilterEvents({
          // type: "ongoing",
          tagIds: tagIds,
          page: 0,
          size: 8,
        });
        setRelevantEvents(data.content);
      } catch (error) {
        console.error("Error fetching relevant events:", error);
      }
    };
    fetchRelevantEvents();
  }, [tagIds]);

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-12 border-t-2 border-gray-200 bg-gray-100">
      {relevantEvents.length > 0 && (
        <h2 className="text-2xl font-semibold mb-6">
          Other Events You May Like
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {relevantEvents.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">
            No similar events found.
          </p>
        ) : (
          relevantEvents.map((event) => (
            <CardRelevant key={event.eventId} event={event} />
          ))
        )}
      </div>
    </section>
  );
};

export default RelevantEvent;
