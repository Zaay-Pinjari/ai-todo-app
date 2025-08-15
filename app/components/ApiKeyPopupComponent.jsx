import React, { useState } from "react";

const ApiKeyPopupComponent = ({ setApiKeyPopup, setApiKey }) => {
  const [inputKey, setInputKey] = useState("");

  const handleSaveApiKey = () => {
    if (inputKey.trim()) {
      localStorage.setItem("userGeminiApiKey", inputKey);
      setApiKey(inputKey);
      setApiKeyPopup(false);
    } else {
      alert("Please enter a valid API key.");
    }
  };

  return (
    <div
      onClick={() => setApiKeyPopup(false)}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-800 text-white rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-4">
          Enter Your Gemini API Key
        </h2>
        <input
          type="text"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="Enter your API key"
          className="w-full p-2 mb-4 bg-zinc-700 text-white rounded-lg"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setApiKeyPopup(false)}
            className="px-4 py-2 bg-zinc-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveApiKey}
            className="px-4 py-2 bg-green-600 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPopupComponent;
