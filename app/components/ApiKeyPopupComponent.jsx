import React, { useState, useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";

const ApiKeyPopupComponent = ({ setApiKey, setApiKeyPopup }) => {
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  // Handle Enter key to save and Esc key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && inputKey.trim()) {
        handleSaveApiKey();
      } else if (e.key === "Escape") {
        setApiKeyPopup(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputKey]);

  const handleSaveApiKey = () => {
    if (!inputKey.trim()) {
      setError("Please enter a valid API key.");
      return;
    }
    setIsSaving(true);
    setError("");
    // Simulate async operation (e.g., future API key validation)
    setTimeout(() => {
      localStorage.setItem("userGeminiApiKey", inputKey.trim());
      setApiKey(inputKey.trim());
      setApiKeyPopup(false);
      setIsSaving(false);
    }, 500);
  };

  const handleResetApiKey = () => {
    localStorage.removeItem("userGeminiApiKey");
    setApiKey("");
    setInputKey("");
    setError("");
    alert("API key has been reset.");
  };

  return (
    <div
      onClick={() => setApiKeyPopup(false)}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      role="dialog"
      aria-labelledby="api-key-popup-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-800 text-white rounded-2xl p-6 w-full max-w-md shadow-lg"
      >
        <h2 id="api-key-popup-title" className="text-lg font-semibold mb-4">
          Enter Your Gemini API Key
        </h2>
        <p className="text-sm text-zinc-400 mb-4 flex items-center gap-2">
          <FaInfoCircle className="text-yellow-400" />
          Your API key is stored in your browser's local storage. Use a secure
          device and do not share it. click reset to delete it from local
          storage.
        </p>
        <input
          type="text"
          value={inputKey}
          onChange={(e) => {
            setInputKey(e.target.value);
            setError("");
          }}
          placeholder="Enter your API key"
          className={`w-full p-2 mb-2 bg-zinc-700 text-white rounded-lg border-2 ${
            error ? "border-red-500" : "border-transparent"
          } focus:outline-none focus:border-green-500`}
          aria-invalid={!!error}
          aria-describedby="api-key-error"
        />
        {error && (
          <p id="api-key-error" className="text-sm text-red-400 mb-2">
            {error}
          </p>
        )}
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="text-sm text-blue-400 hover:text-blue-300 mb-4"
        >
          {showSteps ? "Hide Steps" : "How to get a Gemini API key"}
        </button>
        {showSteps && (
          <div className="bg-zinc-900 p-4 rounded-lg mb-4 text-sm text-zinc-300">
            <h3 className="font-semibold mb-2">How to Get a Gemini API Key</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Visit{" "}
                <a
                  href="https://console.cloud.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Google Cloud Console
                </a>{" "}
                and sign in.
              </li>
              <li>Create a new project (e.g., "TodoAppAI").</li>
              <li>
                Go to "APIs & Services" then "Library," search for "Gemini API,"
                and enable it.
              </li>
              <li>
                In "Credentials," click "Create Credentials" then "API Key" and
                copy the key.
              </li>
              <li>
                Optionally, restrict the key to your app's domain for security.
              </li>
              <li>Paste the key here and click "Save."</li>
            </ol>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setApiKeyPopup(false)}
            className="px-4 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleResetApiKey}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition"
            aria-label="Reset API Key"
          >
            Reset
          </button>
          <button
            onClick={handleSaveApiKey}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg transition ${
              isSaving
                ? "bg-green-600/50 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500"
            }`}
            aria-label="Save API Key"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPopupComponent;
