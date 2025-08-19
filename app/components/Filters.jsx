import React from "react";
import { useTodoList } from "../context/TodoListContext";
import { CiShoppingTag } from "react-icons/ci";

const Filters = () => {
  const { todoListArray, setTodoListArray, activeFilter, setActiveFilter } =
    useTodoList(); // Task list & active tag filter
  const { tags, setTags, tagColorMap } = useTodoList(); // Tag list & colors
  return (
    <header className="h-12 md:h-10 w-full md:w-[98%] flex gap-3 overflow-x-auto no-scrollbar px-2 whitespace-nowrap rounded-2xl">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => setActiveFilter(tag)} // Switch filter to clicked tag
          className={`shrink-0 px-5 py-1 rounded-full text-white transition-all duration-200 flex justify-center items-center gap-1 cursor-pointer
                ${activeFilter === tag ? "bg-white/30" : "bg-white/10"}`}
        >
          {/* Tag icon with dynamic color */}
          <CiShoppingTag className={`stroke-[1]  ${tagColorMap[tag]}`} />
          <span className="font-semibold">{tag}</span>
        </button>
      ))}
    </header>
  );
};

export default Filters;
