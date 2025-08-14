"use client";
// This file runs on the client side (Next.js directive)

import { TodoListProvider } from "./TodoListContext";
// Import the global context provider for managing todo list state

// Providers component wraps the entire app (or certain parts) with global state
export function Providers({ children }) {
  return (
    // Wrap all children components inside TodoListProvider
    // This makes the todo list state available anywhere in the component tree
    <TodoListProvider>{children}</TodoListProvider>
  );
}