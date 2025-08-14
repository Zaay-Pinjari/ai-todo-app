"use client"; // Marks this component as client-side in Next.js

// COMPONENTS
import TodoList from "./components/TodoList"; // Renders each individual task
import { useTodoList } from "./context/TodoListContext"; // Global state management for todos & tags
import { CiShoppingTag } from "react-icons/ci"; // Tag icon
import LeftSide from "./components/LeftSide"; // Left panel (buttons, AI tools, etc.)

const page = () => {
  // ✅ Accessing global state & setters from context
  const { tags, setTags, tagColorMap } = useTodoList(); // Tag list & colors
  const { todoListArray, setTodoListArray, activeFilter, setActiveFilter } =
    useTodoList(); // Task list & active tag filter

  return (
    <main className="app-container h-screen w-[100%] p-4">
      {/* 📌 Full-screen container with padding */}

      <div
        className="app h-full w-full flex items-center justify-center gap-2 
      max-w-[1200px] mx-auto overflow-hidden rounded-xl"
      >
        {/* ⬅️ LEFT SIDE PANEL (Buttons, AI, extra features) */}
        <LeftSide />

        {/* 📝 CENTER SECTION → Task list & filters */}
        <div className="app-centerSide flex flex-col gap-4 justify-between items-center h-full w-[80%] rounded-2xl pt-2 overflow-visible overflow-x-auto no-scrollbar">
          {/* 🔍 TAG FILTER BUTTONS */}
          <header className="h-10 w-[98%] flex gap-3 overflow-x-auto no-scrollbar px-2 whitespace-nowrap rounded-2xl">
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

          {/* 📋 TO-DO LIST */}
          <ul
            className="list-container h-full w-[98%] flex flex-col gap-2 z-[40] 
          rounded-t-3xl rounded-b-3xl"
          >
            {todoListArray
              .map((task, idx) => ({ task, idx })) // Add index for identifying tasks
              .filter(({ task }) => {
                // Filtering based on active tag
                if (activeFilter === "all") return true; // Show all if "all" is active
                return task.taskTag?.toLowerCase() === activeFilter; // Match active tag
              })
              .map(({ task, idx }) => (
                // Render each task using TodoList component
                <TodoList key={idx} taskDetails={task} idx={idx} />
              ))}
          </ul>
        </div>

        {/* App ends here */}
      </div>
    </main>
  );
};

export default page;
