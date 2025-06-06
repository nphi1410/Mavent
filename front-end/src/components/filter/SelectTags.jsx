import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { getTags } from "../../services/tagService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const SelectTags = ({ selectedTags = [], onChange }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTags({ eventId: null });
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const addTag = (tag) => {
    if (!selectedTags.find((t) => t.tagId === tag.tagId)) {
      onChange([...selectedTags, tag]);
    }
  };

  const removeTag = (tag) => {
    onChange(selectedTags.filter((t) => t.tagId !== tag.tagId));
  };

  const availableTags = tags.filter(
    (tag) => !selectedTags.find((t) => t.tagId === tag.tagId)
  );

  return (
    <div className="relative col-span-2">
      <div className="border border-gray-300 rounded-lg px-4 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 flex-1 overflow-y-auto h-[41.8px] pr-2">
          {selectedTags.length === 0 && (
            <span className="text-gray-400 select-none whitespace-nowrap">
              No tags selected
            </span>
          )}
          {selectedTags.map((tag) => (
            <div
              key={tag.id}
              className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center space-x-2 whitespace-nowrap shadow-sm"
            >
              <span className="truncate max-w-xs">{tag.name}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-white font-semibold hover:text-blue-300 focus:outline-none"
                type="button"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="ml-2 shrink-0 text-blue-600 font-semibold hover:text-blue-700 transition">
            Add Tag <FontAwesomeIcon icon={faArrowDown} className="w-4 h-4 inline" />
          </MenuButton>
          <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-56 overflow-y-auto">
            {availableTags.length === 0 ? (
              <div className="p-3 text-gray-400 text-center italic">
                No tags available
              </div>
            ) : (
              availableTags.map((tag) => (
                <MenuItem key={tag.id}>
                  {({ active }) => (
                    <button
                      onClick={() => addTag(tag)}
                      className={`${
                        active ? "bg-blue-100" : ""
                      } w-full text-left px-4 py-2 text-sm text-gray-700`}
                    >
                      {tag.name}
                    </button>
                  )}
                </MenuItem>
              ))
            )}
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default SelectTags;
