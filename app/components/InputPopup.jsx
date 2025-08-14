import { useTodoList } from "@/app/context/TodoListContext";
import { useState } from "react";

const InputPopup = ({ newTaskPopup, setNewTaskPopup }) => {
  // Get todoListArray and its setter function from the global context (for managing main task list)
  const { todoListArray, setTodoListArray } = useTodoList();

  // Get tags array and its setter function from the global context (for managing global tags)
  const { tags, setTags } = useTodoList();

  // Local state for storing input values when creating a new task
  const [newTaskInputs, setNewTaskInputs] = useState({
    title: "", // Task title
    shortDescription: "", // Short description for the task
    taskTag: "all", // Tag/category assigned to task (default: "all")
    taskColor: "", // Optional color for tag/task
    taskDone: false, // Completion status of task
  });

  // Handle input change for new task form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target; // Get field name and value
    setNewTaskInputs((prev) => ({
      ...prev, // Keep existing values
      [name]: value, // Update changed field
    }));
  };

  // Handle submission of new task form
  const handleNewTaskSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const newTag = newTaskInputs.taskTag.trim().toLowerCase(); // Normalize tag text

    // 1. Add the new task object to the main todo list
    setTodoListArray((prev) => [...prev, newTaskInputs]);

    // 2. If a tag is provided and doesn't already exist in the tags array, add it
    if (newTag && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag]);
    }

    // 3. Close the new task popup and reset form inputs to defaults
    setNewTaskPopup(false);
    setNewTaskInputs({
      title: "",
      shortDescription: "",
      taskTag: "",
      taskColor: "",
      taskDone: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        className="bg-zinc-800/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-700"
        onSubmit={handleNewTaskSubmit}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-bold">Create New Task</h2>
            <button
              type="button"
              onClick={() => setNewTaskPopup(false)}
              className="text-zinc-400 hover:text-white transition-colors p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTaskInputs.title}
              onChange={handleInputChange}
              placeholder="Enter task title..."
              className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 
             border border-zinc-600 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* Short Description Input */}
          <div className="mb-6">
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows="3"
              value={newTaskInputs.shortDescription}
              onChange={handleInputChange}
              placeholder="Enter short description..."
              className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 
             border border-zinc-600 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
            />
          </div>

          {/* Tag Name Input */}
          <div className="mb-6">
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Tag
            </label>
            <input
              type="text"
              id="taskTag"
              name="taskTag"
              value={newTaskInputs.taskTag}
              onChange={handleInputChange}
              placeholder="Enter tag name..."
              className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 
             border border-zinc-600 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setNewTaskPopup(false)}
              className="flex-1 px-6 py-3 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 
             transition-colors duration-200 font-medium border border-zinc-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 
             transition-colors duration-200 font-medium shadow-lg"
            >
              Create Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputPopup;
