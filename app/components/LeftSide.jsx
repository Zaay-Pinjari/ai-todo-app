import React, { useEffect, useState } from "react";
import { BsChatQuote } from "react-icons/bs";
import { FaRegLightbulb } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoMdKey } from "react-icons/io";
import { useTodoList } from "@/app/context/TodoListContext";
import { FaPlus } from "react-icons/fa";
import InputPopup from "./InputPopup";
import ApiKeyPopupComponent from "./ApiKeyPopupComponent";

const LeftSide = () => {
  // API KEY FOR USER
  const [apiKey, setApiKey] = useState("");
  const [apiKeyPopup, setApiKeyPopup] = useState(false);

  // CHECK IF USER IS ONLINE OR OFFLINE
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // STATE VARIABLES FOR UI COMPONENTS AND POPUPS
  const [newTaskPopup, setNewTaskPopup] = useState(false);
  const [generatingPlanLoading, setGeneratingPlanLoading] = useState(false);
  const [planPopup, setPlanPopup] = useState(false);

  // STATE VARIABLES FOR QUOTES FUNCTIONALITY
  const [quotes, setQuotes] = useState([]);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // STATE VARIABLES FOR TIPS FUNCTIONALITY
  const [tips, setTips] = useState([]);
  const [tipIdx, setTipIdx] = useState(0);

  // STATE VARIABLE FOR GENERATED PLAN DATA
  const [quickPlan, setQuickPlan] = useState(null);

  // GET TODO LIST FROM CUSTOM HOOK
  const { todoListArray, setTodoListArray } = useTodoList();

  // CHECK ONLINE STATUS ON MOUNT AND ON CHANGE
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // LOAD API KEY FROM LOCAL STORAGE ON COMPONENT MOUNT
  useEffect(() => {
    const storedApiKey = localStorage.getItem("userGeminiApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  // LOAD TIPS FROM LOCAL STORAGE ON COMPONENT MOUNT
  useEffect(() => {
    const tipsFromLocalStorage = localStorage.getItem("tips");
    if (tipsFromLocalStorage) {
      setTips(JSON.parse(tipsFromLocalStorage));
    }
  }, []);

  // LOAD QUOTES FROM LOCAL STORAGE ON COMPONENT MOUNT
  useEffect(() => {
    const quotesFromStorage = localStorage.getItem("quotes");
    if (quotesFromStorage) {
      setQuotes(JSON.parse(quotesFromStorage));
    }
  }, []);

  // AUTO-ROTATE TIPS EVERY 10 SECONDS
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIdx((prev) => {
        if (tips.length === 0) return 0;
        return (prev + 1) % tips.length; // wraps around automatically
      });
    }, 10000);

    return () => clearInterval(interval); // Clean up on unmount
  }, [tips]); // Re-run if tips change

  // AUTO-ROTATE QUOTES EVERY 10 SECONDS
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) =>
        quotes.length === 0 ? 0 : (prev + 1) % quotes.length
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [quotes]);

  // MY API INITIALIZE GEMINI AI API WITH API KEY FROM ENVIRONMENT VARIABLES
  // const Api = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  // INITIALIZE GEMINI AI API WITH USER'S API KEY
  const Api = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  // what new does
  // this do? it initializes the Gemini AI API with the user's API key, allowing the app to use Gemini's generative capabilities.

  // FUNCTION TO GENERATE PRODUCTIVITY TIPS USING GEMINI AI
  const generateTip = async () => {
    // CHECK IF USER IS ONLINE BEFORE GENERATING TIPS
    if (!isOnline) {
      alert("You are offline. Please check your internet connection.");
      return;
    }

    // CHECK IF API KEY IS SET AND API INSTANCE IS AVAILABLE
    if (!apiKey || !Api) {
      alert("Please enter a valid Gemini API key to use AI features.");
      setApiKeyPopup(true);
      return;
    }

    // GENERATE TIP BASED ON TASKS
    try {
      // GET GEMINI MODEL INSTANCE
      const model = Api.getGenerativeModel({ model: "gemini-2.5-flash" });

      // SEND PROMPT TO GEMINI TO GENERATE TIPS BASED ON TODO LIST
      const result = await model.generateContent(
        `Give me short useful 3 lines must productivity tips based on the tasks using this todo list : ${JSON.stringify(
          todoListArray
        )}.
        i will use it in my app so Respond ONLY with a clean JSON array of objects like this:
        [
          { "tip": "Break your big tasks into small steps. It'll make them feel less scary." },
          { "tip": "Use timers to stay focused and avoid distractions." }
        ]. (no extra text, no explanations, no markdown, no code blocks, just the JSON array)(give me new tips every time if sended again)`
      );
      let responseText = await result.response.text();

      // CONVERT RESPONSE TEXT TO JSON OBJECT
      responseText = JSON.parse(responseText);

      // REMOVE OLD TIPS FROM LOCAL STORAGE
      localStorage.removeItem("tips");

      // SAVE NEW TIPS TO LOCAL STORAGE AND UPDATE STATE
      if (responseText) {
        localStorage.setItem("tips", JSON.stringify(responseText));
        setTips(responseText);
      }
    } catch (error) {
      // SHOW ERROR MESSAGE TO USER AND LOG ERROR
      alert(
        "Failed to generate tips. Please try again or check your internet connection."
      );
      console.error("Tip generation failed:", error);
    }
  };

  // FUNCTION TO GENERATE MOTIVATIONAL QUOTES USING GEMINI AI
  const generateQuotes = async () => {
    // CHECK IF USER IS ONLINE BEFORE GENERATING TIPS
    if (!isOnline) {
      alert("You are offline. Please check your internet connection.");
      return;
    }

    // CHECK IF API KEY IS SET AND API INSTANCE IS AVAILABLE
    if (!apiKey || !Api) {
      alert("Please enter a valid Gemini API key to use AI features.");
      setApiKeyPopup(true);
      return;
    }

    try {
      // GET GEMINI MODEL INSTANCE
      const model = Api.getGenerativeModel({ model: "gemini-2.5-flash" });

      // SEND PROMPT TO GEMINI TO GENERATE QUOTES BASED ON TODO LIST
      const result = await model.generateContent(
        `Give me 1-2 line motivational quotes that are short, insightful, and productivity-focused specially based on this tasks ${JSON.stringify(
          todoListArray
        )}.
    Respond ONLY with a clean JSON array of objects like this so i can use it in my app:
    [
      { "quote": "Discipline equals freedom.", "author": "Jocko Willink" },
      { "quote": "You don't need more time, you just need to decide.", "author": "Seth Godin" }
    ].
    (no extra text, no explanations, no markdown, no code blocks, just the JSON array)(give me new tips every time if sended again)`
      );

      let responseText = await result.response.text();
      // PARSE THE RESPONSE TO JSON
      const parsedQuotes = JSON.parse(responseText);

      // REMOVE OLD QUOTES FROM LOCAL STORAGE
      localStorage.removeItem("quotes");

      // SAVE NEW QUOTES TO LOCAL STORAGE AND UPDATE STATE
      if (parsedQuotes) {
        localStorage.setItem("quotes", JSON.stringify(parsedQuotes));
        setQuotes(parsedQuotes);
      }
    } catch (error) {
      // SHOW ERROR MESSAGE TO USER AND LOG ERROR
      alert(
        "Failed to generate quotes. Please try again or check your internet connection."
      );
      console.error("Quote generation failed:", error);
    }
  };

  // FUNCTION TO GENERATE A STRUCTURED PRODUCTIVITY PLAN USING GEMINI AI
  const generatePlan = async () => {
    // CHECK IF USER IS ONLINE BEFORE GENERATING TIPS
    if (!isOnline) {
      alert("You are offline. Please check your internet connection.");
      return;
    }

    // CHECK IF API KEY IS SET AND API INSTANCE IS AVAILABLE
    if (!apiKey || !Api) {
      alert("Please enter a valid Gemini API key to use AI features.");
      setApiKeyPopup(true);
      return;
    }

    // SET LOADING STATE TO TRUE WHILE GENERATING PLAN
    setGeneratingPlanLoading(true);
    try {
      // GET GEMINI MODEL INSTANCE
      const model = Api.getGenerativeModel({ model: "gemini-2.5-flash" });

      // SEND PROMPT TO GEMINI TO GENERATE STRUCTURED PLAN BASED ON TODO LIST
      const result = await model.generateContent(
        `Create a structured quick productivity plan based on this todo list: ${JSON.stringify(
          todoListArray
        )}.
  The plan should have:
  - A short overview (2-3 lines)
  - 3-5 clear steps with actionable tasks
  - 2-3 extra productivity tips
  Respond ONLY in clean JSON format like this:
  {
    "overview": "Short summary here",
    "steps": [
      "Step 1 here",
      "Step 2 here",
      "Step 3 here"
    ],
    "tips": [
      "Tip 1 here",
      "Tip 2 here"
    ]
  }`
      );

      let responseText = await result.response.text();

      // CLEAN UP RESPONSE TEXT BY REMOVING MARKDOWN CODE BLOCKS IF PRESENT
      responseText = responseText.replace(/```json|```/g, "").trim();

      // PARSE THE CLEANED RESPONSE TO JSON
      const parsedPlan = JSON.parse(responseText);

      // UPDATE STATE WITH GENERATED PLAN AND SHOW POPUP
      setQuickPlan(parsedPlan);
      setGeneratingPlanLoading(false);
      setPlanPopup(true);
    } catch (error) {
      // SHOW ERROR MESSAGE TO USER AND LOG ERROR
      alert(
        "Failed to generate plan. Please try again or check your internet connection."
      );
      console.error("Plan generation failed:", error, responseText);
      // SET LOADING STATE TO FALSE ON ERROR
      setGeneratingPlanLoading(false);
    }
  };
  return (
    <div
      // LEFT-hand side container of the app
      className="app-lhs h-full w-full md:w-[25%]  
          py-3 px-2 flex flex-col justify-between gap-2
          rounded-3xl border-1 border-zinc-700 "
    >
      {/* BUTTON PART */}
      <div className="buttonPart">
        {/* Popup for adding new task - visible when newTaskPopup is true */}
        {newTaskPopup && (
          <InputPopup
            newTaskPopup={newTaskPopup}
            setNewTaskPopup={setNewTaskPopup}
          />
        )}

        {/* ADD NEW TASK BUTTON */}
        <div className="">
          <button
            onClick={() => setNewTaskPopup((val) => !val)} // Toggles the new task popup
            className="w-full h-12 flex items-center justify-center gap-2 bg-white cursor-pointer rounded-full active:scale-95 transition-all ease-in-out"
          >
            <FaPlus />
            <span className="font-extrabold text-black/80">New Task</span>
          </button>
        </div>
      </div>

      {/* ==================== AI PART ==================== */}
      <div className="AiPart">
        {/* AI Mode Header */}
        <div className="Ai-Mode-Header w-full h-12 flex items-center justify-between px-2 ">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 px-2">
            <GoDotFill
              className={`pt-1 transition-all duration-200 
                ${
                  isOnline
                    ? "text-green-500" +
                      " " +
                      "[filter:drop-shadow(0_0_5px_#00ff00)] "
                    : "text-red-500" +
                      " " +
                      "[filter:drop-shadow(0_0_5px_#ff0000)]"
                }`}
            />
            <span>Ai Mode</span>
          </h2>
        </div>

        {/* AI Features Section */}
        <div className="aiFeatures">
          {/* Generate Plan Button */}
          <div className="w-full mb-3">
            <button
              disabled={generatingPlanLoading} // Disabled while plan is being generated
              onClick={generatePlan} // Function to generate complete plan
              title="Generate Complete Plan based on your tasks"
              className={`w-full h-12 flex items-center justify-center gap-2 
              rounded-2xl transition-all
               ${
                 generatingPlanLoading
                   ? "bg-zinc-800 text-white/40 opacity-50 cursor-not-allowed active:scale-100"
                   : "bg-zinc-800 text-white hover:border border-zinc-700 hover:bg-zinc-800 active:scale-95"
               }`}
            >
              <span className="text-zinc-300 font-semibold">
                {generatingPlanLoading ? "Working..." : "Generate Plan"}
              </span>
            </button>
          </div>
        </div>

        {/* ==================== AI Tips Section ==================== */}
        <div
          className="Ai-Tip-Container h-auto w-full my-auto flex flex-col  gap-2 mb-3 transition-all ease-in-out duration-300 
        bg-zinc-800 text-white rounded-3xl py-6 px-3 overflow-y-auto no-scrollbar"
        >
          {/* Tips Header with Generate Button */}
          <div className="px-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold">
              <FaRegLightbulb className="text-white" />
              <span className="cursor-pointer active:scale-75">Tips</span>
            </div>
            <button
              title="Generate AI-powered tips based on your tasks"
              onClick={generateTip}
              className="rounded-lg cursor-pointer px-3
            bg-zinc-700 border border-zinc-700 
            hover:bg-zinc-800 active:scale-95 transition-all duration-200"
            >
              <span className="text-white/90 text-xs">Generate</span>
            </button>
          </div>

          {/* Tips Display */}
          <p className="px-2 text-sm text-zinc-400 ">
            {tips.length > 0 && tips[tipIdx]
              ? tips[tipIdx].tip
              : "Enjoy The Process! Lorem ipsum dolor sit amet consectetur adipisicing elit."}
          </p>
        </div>

        {/* ==================== AI Quotes Section ==================== */}
        <div
          className="Ai-Quote-Container h-auto w-full my-auto flex flex-col gap-2
        bg-zinc-800 text-white rounded-3xl py-6 px-4 overflow-y-auto no-scrollbar"
        >
          {/* Quotes Header with Generate Button */}
          <div className="px-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold">
              <BsChatQuote className="text-white" />
              <span className="cursor-pointer active:scale-75">Quotes</span>
            </div>
            <button
              title="Generate AI-powered quotes based on your tasks"
              onClick={generateQuotes}
              className="rounded-lg cursor-pointer px-3
            bg-zinc-700 border border-zinc-700 
            hover:bg-zinc-800 active:scale-95 transition-all duration-200"
            >
              <span className="text-white/90 text-xs ">Generate</span>
            </button>
          </div>

          {/* Quotes Display */}
          <p className="px-2 text-sm text-zinc-400 italic">
            {quotes.length > 0 && quotes[quoteIdx]
              ? `"${quotes[quoteIdx].quote}" — ${quotes[quoteIdx].author}`
              : "“Motivation gets you going, but discipline keeps you growing.”"}
          </p>
        </div>
      </div>

      {/* API Section */}
      <div className="API-Section">
        <button
          title="Enter your Gemini API Key"
          onClick={() => setApiKeyPopup(true)}
          className="w-full h-12 flex items-center justify-center gap-2 
      rounded-2xl transition-all bg-zinc-800 text-white hover:border border-zinc-700 hover:bg-zinc-800 active:scale-95"
        >
          <IoMdKey className="text-xl" />
          <span className="text-zinc-300 font-semibold">Api Key</span>
        </button>
      </div>

      {/* ==================== API KEY POPUP ==================== */}
      {apiKeyPopup && (
        <ApiKeyPopupComponent
          setApiKeyPopup={setApiKeyPopup}
          setApiKey={setApiKey}
        />
      )}

      {/* ==================== POPUP FOR GENERATE PLAN ==================== */}
      {planPopup && (
        <div
          onClick={() => setPlanPopup(false)} // Clicking outside closes popup
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-3 py-5"
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevent popup close when clicking inside
            className="bg-zinc-800 text-white rounded-2xl p-6 w-full max-w-3xl h-full md:h-auto md:max-h-[90%] overflow-y-auto shadow-lg"
          >
            {/* Popup Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Quick Plan</h2>
              <button
                onClick={() => {
                  if (quickPlan) {
                    navigator.clipboard.writeText(
                      JSON.stringify(quickPlan, null, 2) // Copy plan to clipboard
                    );
                  }
                }}
                className="bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded-lg text-xs"
              >
                Copy
              </button>
            </div>

            {/* Popup Content */}
            {quickPlan ? (
              <div className="space-y-4">
                {/* Overview */}
                <p className="text-zinc-300 text-sm">{quickPlan.overview}</p>

                {/* Steps List */}
                <div>
                  <h3 className="font-semibold mb-2">Steps</h3>
                  <ul className="list-decimal list-inside space-y-1 text-zinc-300 text-sm">
                    {quickPlan.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                {/* Tips List */}
                <div>
                  <h3 className="font-semibold mb-2">Tips</h3>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300 text-sm">
                    {quickPlan.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              // Loading state while fetching quickPlan
              <p className="text-zinc-400 text-sm">Loading...</p>
            )}
          </div>
        </div>
      )}

      {/* ==================== RHS ENDS ==================== */}
    </div>
  );
};

export default LeftSide;
