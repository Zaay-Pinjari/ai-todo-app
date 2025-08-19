"use client"; // Marks this component as client-side in Next.js

// COMPONENTS
import TodoList from "./components/TodoList"; // Renders each individual task
import { useTodoList } from "./context/TodoListContext"; // Global state management for todos & tags
import { CiShoppingTag } from "react-icons/ci"; // Tag icon
import LeftSide from "./components/LeftSide"; // Left panel (buttons, AI tools, etc.)
import Filters from "./components/Filters";

const page = () => {
  // ✅ Accessing global state & setters from context
  const { tags, setTags, tagColorMap } = useTodoList(); // Tag list & colors
  const { todoListArray, setTodoListArray, activeFilter, setActiveFilter } =
    useTodoList(); // Task list & active tag filter

  return (
    <main className="app-container min-h-screen md:h-screen w-[100%] p-4">
      {/* 📌 Full-screen container with padding */}

      <div
        className="app h-full w-full items-center justify-center gap-2 
        max-w-[1200px] mx-auto overflow-hidden rounded-xl 
        flex flex-col md:flex-row"
      >
        {/* ⬅️ LEFT SIDE PANEL (Buttons, AI, extra features) */}
        <LeftSide />

        {/* 📝 CENTER SECTION → Task list & filters */}
        <div className="app-centerSide flex flex-col gap-4 justify-between items-center h-full w-full lg:w-[80%] rounded-2xl pt-2 overflow-visible overflow-x-auto no-scrollbar">
          {/* 🔍 TAG FILTER BUTTONS */}
          <Filters />

          {/* 📋 TO-DO LIST */}
          <ul
            className="list-container h-full w-full md:w-[98%] flex flex-col gap-2 z-[40] 
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
