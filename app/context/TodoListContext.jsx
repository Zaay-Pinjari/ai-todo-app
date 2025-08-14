"use client";
// Next.js directive: ensures this file runs on the client side

import { createContext, useContext, useEffect, useState } from "react";

// Create a Context object for sharing todo list state across the app
const TodoListContext = createContext();

// Provider component that wraps children and supplies todo-related state
export const TodoListProvider = ({ children }) => {
  // State for which filter is currently active (e.g., "all", "work")
  const [activeFilter, setActiveFilter] = useState("all");

  // Object that maps each tag to a Tailwind text color class
  const [tagColorMap, setTagColorMap] = useState({});

  // Predefined list of possible text colors for tags
  const tagColorsList = [
    "text-blue-300",
    "text-green-300",
    "text-yellow-300",
    "text-pink-300",
    "text-purple-300",
    "text-red-300",
    "text-orange-300",
  ];

  // Main array storing all todo tasks
  const [todoListArray, setTodoListArray] = useState([]);

  // Array of all tags (categories) used in tasks
  const [tags, setTags] = useState(["all", "work", "personal", "academic"]);

  // Flag to ensure localStorage-related updates only happen after initial load
  const [isLoaded, setIsLoaded] = useState(false);

  // Assign a unique color to each tag based on its index
  useEffect(() => {
    const newMap = {};
    tags.forEach((tag, index) => {
      newMap[tag] = tagColorsList[index % tagColorsList.length]; // Loop colors if tags exceed color list length
    });
    setTagColorMap(newMap);
  }, [tags]);

  // Default tasks for first-time users or when localStorage is empty
  const defaultTasks = [
    {
      title: "Get Started With Ducking-Todo",
      shortDescription: "Best Simple But Helpful Todo Out There",
      taskTag: "all",
      taskDone: false,
    },
  ];

  // Load todo list from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("todoListArray");
    if (saved) {
      // If saved data exists, use it
      setTodoListArray(JSON.parse(saved));
    } else {
      // If no saved data, set default tasks and save them
      setTodoListArray(defaultTasks);
      localStorage.setItem("todoListArray", JSON.stringify(defaultTasks));
    }
    setIsLoaded(true); // Mark as loaded so future updates are allowed
  }, []);

  // Save todo list to localStorage whenever it changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todoListArray", JSON.stringify(todoListArray));
    }
  }, [todoListArray, isLoaded]);

  // Load saved tags from localStorage on first render
  useEffect(() => {
    const savedTags = localStorage.getItem("tags");
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
  }, []);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  return (
    // Provide state and functions to all components in the tree
    <TodoListContext.Provider
      value={{
        todoListArray,
        setTodoListArray,
        tags,
        setTags,
        tagColorMap,
        setTagColorMap,
        activeFilter,
        setActiveFilter,
      }}
    >
      {/* Only render children after data has been loaded */}
      {isLoaded && children}
    </TodoListContext.Provider>
  );
};

// Custom hook to use the TodoList context in other components
export const useTodoList = () => useContext(TodoListContext);
