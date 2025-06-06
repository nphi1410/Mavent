import React, { useEffect, useState } from "react";
import Tag from "./card/Tag";
import { getTags } from "../services/tagService";

const TagsList = ({eventData}) => {
  const [tags, setTags] = useState([]);
  useEffect(() => {
      const fetchTags = async () => {
        try {
          const fetchedTags = await getTags({ eventId: eventData.eventId });
          setTags(fetchedTags);
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      };
  
      fetchTags();
    }, [eventData.eventId]);

  return (
    <section className="w-full max-w-2xl px-4 md:px-6 py-8 text-gray-900">
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h2 className="text-3xl font-semibold tracking-tight">🏷️ Tags</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag, index) => (
          <Tag
            key={index}
            topic={tag.name}
          />
        ))}
      </div>
    </section>
  );
};

export default TagsList;
