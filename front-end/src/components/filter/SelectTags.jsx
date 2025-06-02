import React, { useState, useRef, useEffect } from "react";

const SelectTags = ({ selectedTags = [], onChange }) => {
  const tags = [
    { id: 1, name: "football" },
    { id: 2, name: "coding" },
    { id: 3, name: "math" },
    { id: 4, name: "music" },
    { id: 5, name: "travel" },
    { id: 6, name: "photography" },
    { id: 7, name: "cooking" },
    { id: 8, name: "gaming" },
    { id: 9, name: "health" },
    { id: 10, name: "science" },
    { id: 11, name: "finance" },
    { id: 12, name: "history" },
    { id: 13, name: "art" },
    { id: 14, name: "technology" },
    { id: 15, name: "education" },
    { id: 16, name: "movies" },
    { id: 17, name: "books" },
    { id: 18, name: "nature" },
    { id: 19, name: "fitness" },
    { id: 20, name: "politics" },
    { id: 21, name: "fashion" },
    { id: 22, name: "cars" },
    { id: 23, name: "space" },
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags);

  useEffect(() => {
    setLocalSelectedTags(selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tag) => {
    if (!localSelectedTags.find((t) => t.id === tag.id)) {
      const updated = [...localSelectedTags, tag];
      setLocalSelectedTags(updated);
      onChange(updated);
    }
    setDropdownOpen(false);
  };

  const removeTag = (tag) => {
    const updated = localSelectedTags.filter((t) => t.id !== tag.id);
    setLocalSelectedTags(updated);
    onChange(updated);
  };

  const availableTags = tags.filter(
    (tag) => !localSelectedTags.find((t) => t.id === tag.id)
  );

  return (
    <div className="relative col-span-2" ref={containerRef}>
      <div className="border border-gray-300 rounded-lg px-4 col-span-2 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 flex-1 overflow-y-auto h-[41.8px] pr-2">
          {localSelectedTags.length === 0 && (
            <span className="text-gray-400 select-none whitespace-nowrap">
              No tags selected
            </span>
          )}
          {localSelectedTags.map((tag) => (
            <div
              key={tag.id}
              className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center space-x-2 whitespace-nowrap shadow-sm"
            >
              <span className="truncate max-w-xs">{tag.name}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-white font-semibold hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-white rounded"
                aria-label={`Remove ${tag.name}`}
                type="button"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          ref={buttonRef}
          onClick={() => setDropdownOpen((open) => !open)}
          type="button"
          className="ml-2 shrink-0 text-blue-600 font-semibold hover:text-blue-700 transition whitespace-nowrap"
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
        >
          {dropdownOpen ? "Close" : "Add Tag"}
        </button>
      </div>

      {dropdownOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-56 overflow-y-auto z-50 w-max focus:outline-none"
        >
          {availableTags.length === 0 ? (
            <li className="p-3 text-gray-400 select-none text-center italic">
              No tags available
            </li>
          ) : (
            availableTags.map((tag) => (
              <li
                key={tag.id}
                role="option"
                tabIndex={0}
                className="cursor-pointer px-4 py-2 whitespace-nowrap hover:bg-blue-100 focus:bg-blue-200 focus:outline-none transition-colors"
                onClick={() => addTag(tag)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    addTag(tag);
                  }
                }}
              >
                {tag.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SelectTags;
