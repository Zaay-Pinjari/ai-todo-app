"use client"; // Marks this as a client-side component in Next.js

import React, { useEffect, useState } from "react";
import { CiShoppingTag } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { useTodoList } from "../context/TodoListContext";

const TodoList = ({ taskDetails, idx }) => {
  // Accessing global state & actions from context
  const {
    todoListArray, // Full list of todos
    setTodoListArray, // Setter to update todo list
    activeFilter, // Current active tag filter
    setActiveFilter, // Setter to change filter
    tagColorMap, // Mapping of tags → colors
  } = useTodoList();

  // Local component states
  const [showEditPopup, setShowEditPopup] = useState(false); // Controls visibility of edit popup
  const [isChecked, setIsChecked] = useState(false); // Not actually used (taskDetails.isTaskDone is used instead)
  const [editedDetails, setEditedDetails] = useState({
    title: taskDetails.title,
    shortDescription: taskDetails.shortDescription,
  });

  // Tags management from context
  const { tags, setTags } = useTodoList();

  /**
   * ✅ Toggle task completion (done/undone)
   */
  const handleCheck = () => {
    const updatedArray = todoListArray.map((task, taskIdx) => {
      if (taskIdx === idx) {
        return { ...task, isTaskDone: !task.isTaskDone };
      }
      return task;
    });
    setTodoListArray(updatedArray);
  };

  /**
   * ✏️ Update local state while editing task title/description
   */
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedDetails((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * 💾 Save edited task details
   */
  const handleSubmitEdit = () => {
    let newUpdatedArray = todoListArray.map((currTask, currIdx) => {
      if (currIdx === idx) {
        return {
          ...currTask,
          title: editedDetails.title,
          shortDescription: editedDetails.shortDescription,
        };
      } else {
        return currTask;
      }
    });

    setTodoListArray(newUpdatedArray);
    setShowEditPopup(false); // Close popup after saving
  };

  /**
   * 🗑 Delete task & clean up unused tags
   */
  const handleTaskDelete = (deleteIdx) => {
    const deletedTag = todoListArray[deleteIdx].taskTag;

    // Remove the selected task
    const newUpdatedArray = todoListArray.filter((_, idx) => idx !== deleteIdx);
    setTodoListArray(newUpdatedArray);

    // Check if any other tasks still use the deleted tag
    const stillUsed = newUpdatedArray.some(
      (task) => task.taskTag === deletedTag
    );

    // If tag is unused & not 'all', remove it from global tag list
    if (!stillUsed && deletedTag !== "all") {
      setTags((prev) => prev.filter((tag) => tag !== deletedTag));
    }

    // If the deleted task's tag was the active filter and no tasks remain with it → reset to "all"
    const remainingWithTag = newUpdatedArray.some(
      (task) => task.taskTag?.toLowerCase() === activeFilter
    );

    if (!remainingWithTag && activeFilter !== "all") {
      setActiveFilter("all");
    }
  };

  return (
    <>
      {/* 📝 Edit Task Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="z-[9999] bg-zinc-800 p-4 rounded-xl shadow-xl w-72">
            {/* Title input */}
            <input
              type="text"
              name="title"
              placeholder="enter new task"
              value={editedDetails.title}
              onChange={handleEditChange}
              className="w-full mb-2 p-2 rounded bg-zinc-700 text-white"
            />
            {/* Description input */}
            <textarea
              name="shortDescription"
              value={editedDetails.shortDescription}
              placeholder="enter new task short descriptions"
              onChange={handleEditChange}
              className="w-full mb-2 p-2 rounded bg-zinc-700 text-white"
              rows={2}
            />
            {/* Save button */}
            <button
              onClick={handleSubmitEdit}
              className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-600 w-full"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* 📋 Task Item */}
      <li
        onClick={handleCheck}
        className={`min-h-20 w-full shrink-0 py-2 px-6 rounded-3xl 
        bg-zinc-800 border border-white/10
        flex justify-between items-center task-item cursor-pointer 
        duration-100 transition-all ease-in-out
        active:scale-98`}
      >
        <div className="flex gap-4 items-center">
          <div className="task-content">
            {/* Task Title */}
            <h2
              className={`flex items-center gap-2 text-xl font-semibold 
            text-white  ${
              taskDetails.isTaskDone ? "line-through decoration-black" : ""
            }`}
            >
              {taskDetails.title || "Get Started With Ducking-Todo"}
            </h2>

            {/* Task Description */}
            <h4
              className={`text-sm font-normal text-white/70 mb-2 w-[75%] md:w-[100%]  
                ${
                taskDetails.isTaskDone ? "line-through decoration-black" : ""
              } `}
            >
              {taskDetails.shortDescription || "Simple But Helpful Todo"}
            </h4>

            {/* Tag & Action Buttons */}
            <div className="bottomSide flex gap-4 items-center justify-start">
              {/* Tag Badge */}
              <div className="w-fit flex justify-between items-center px-3 gap-1 bg-black/85 rounded-full">
                <CiShoppingTag
                  className={`stroke-[1] ${
                    tagColorMap[taskDetails.taskTag] || "text-white/50"
                  }`}
                />
                <span className={`text-sm font-semibold text-white/50`}>
                  {taskDetails.taskTag || "Random Tag"}
                </span>
              </div>

              {/* Edit & Delete Buttons */}
              <div className="editOptions flex gap-2 items-center justify-center rounded-full">
                <button
                  onClick={(e) => {
                    // Prevent click from propagating to the li
                    e.stopPropagation();
                    // Toggle edit popup visibility
                    setShowEditPopup(!showEditPopup);
                  }}
                >
                  <FaPencil className="text-blue-400 text-[15px] cursor-pointer active:scale-95" />
                </button>
                <button
                  onClick={(e) => {
                    // Prevent click from propagating to the li
                    e.stopPropagation();
                    // Handle task deletion
                    handleTaskDelete(idx);
                  }}
                >
                  <MdOutlineDeleteOutline className="text-red-400 text-[21px] cursor-pointer active:scale-95" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Check/Complete Button */}
        <button
          onClick={handleCheck}
          className={`w-9 h-9 shrink-0 flex items-center justify-center 
      border-3 ${
        !taskDetails.isTaskDone && "border-white/50"
      }   rounded-full task-check ${
            taskDetails.isTaskDone &&
            "bg-green-500" +
              " " +
              "shadow-[0_0_10px_2px_rgba(34,197,94,0.9)]" +
              " " +
              "border-white/50"
          } cursor-pointer active:scale-95 
       transition-all duration-300 `}
        ></button>
      </li>
    </>
  );
};

export default TodoList;
