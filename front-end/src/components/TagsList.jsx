import React from "react";
import Tag from "./card/Tag";

const TagsList = () => {
  const tags = [
    { topic: "Technology", dotColor: "bg-blue-500", bgColor: "bg-blue-100", textColor: "text-blue-800" },
    { topic: "Networking", dotColor: "bg-green-500", bgColor: "bg-green-100", textColor: "text-green-800" },
    { topic: "Innovation", dotColor: "bg-purple-500", bgColor: "bg-purple-100", textColor: "text-purple-800" },
    { topic: "Education", dotColor: "bg-yellow-500", bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
    { topic: "AI & ML", dotColor: "bg-red-500", bgColor: "bg-red-100", textColor: "text-red-800" },
  ];

  return (
    <section className="w-full max-w-2xl px-4 md:px-6 py-8 text-gray-900">
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h2 className="text-3xl font-semibold tracking-tight">🏷️ Tags</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag, index) => (
          <Tag
            key={index}
            dotColor={tag.dotColor}
            bgColor={tag.bgColor}
            textColor={tag.textColor}
            topic={tag.topic}
          />
        ))}
      </div>
    </section>
  );
};

export default TagsList;
