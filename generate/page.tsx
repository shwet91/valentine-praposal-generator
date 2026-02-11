import React, { useState, useEffect } from "react";

import Header from "@/components/Header";
import Proposal from "@/components/Proposal";
import ErrorMessage from "@/components/ErrorMessage";
import MobileBlocker from "@/components/MobileBlocker";
import LoadingScreen from "@/components/LoadingScreen";
import { useImagePreloader, ALL_APP_IMAGES } from "@/hooks/useImagePreloader";
import { useParams } from "react-router-dom";

const App: React.FC = () => {
  const { imagesLoaded, progress } = useImagePreloader(ALL_APP_IMAGES);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [showError, setShowError] = useState(false);
  const { userId } = useParams();
  const [apiLoading, setApiLoading] = useState(true);
  const [realName, setRealName] = useState("");
  const [realGender, setRealGender] = useState("");

  useEffect(() => {
    console.log("User ID from URL:", userId);
    const fetchProposalStatus = async () => {
      if (!userId) {
        setApiLoading(false);
        return;
      }

      setApiLoading(true);
      try {
        const apiCall = await fetch("/api/fetchUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const response = await apiCall.json();
        if (!apiCall.ok) {
          throw new Error(
            response.message || "Failed to fetch proposal status",
          );
        }

        setRealName(response.user.name);
        setRealGender(response.user.gender);

        console.log("Fetched proposal status:", response);
      } catch (error) {
        console.error("Error fetching proposal status:", error);
      } finally {
        setApiLoading(false);
      }
    };

    fetchProposalStatus();
  }, [userId]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNoThirdClick = async () => {
    console.log("No selected!!");
  };

  const handleAccept = async () => {
    setAccepted(true);
  };

  const handleAuthenticate = async () => {
    const value = nameInput.trim().toLowerCase();

    // checks if "rainy" appears anywhere
    if (value.includes(`${realName.toLowerCase()}`)) {
      setIsAuthenticated(true);
    } else {
      setShowError(true);
    }
  };

  // Show loading screen until BOTH images and API are loaded
  // Calculate combined progress: 50% for images, 50% for API
  const combinedProgress = !imagesLoaded
    ? Math.floor(progress * 0.5) // Images are 0-50%
    : apiLoading
      ? 50 + 25 // API loading is 50-75% (showing intermediate state)
      : 100; // Both complete = 100%

  if (!imagesLoaded || apiLoading) {
    return <LoadingScreen progress={combinedProgress} />;
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-gradient-valentine overflow-x-hidden selection:bg-primary/20">
      <Header onSendLove={() => setShowModal(true)} />

      <MobileBlocker isVisible={isMobile} />

      <ErrorMessage
        isVisible={showError}
        onDismiss={() => {
          setShowError(false);
          setNameInput("");
        }}
      />

      <main className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {!isAuthenticated ? (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-primary/10 border border-primary/10 p-8 md:p-12 max-w-md w-full flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl opacity-60"></div>
              <img
                src="/gif/no.gif"
                alt="Stop"
                className="w-36 h-36 md:w-44 md:h-44 object-contain rounded-2xl relative z-10"
              />
            </div>
            <h1 className="text-primary text-xl md:text-2xl font-black leading-snug tracking-tight text-center mb-6">
              Maine ye website sirf
              <span>
                {realGender === "male"
                  ? "apne pasandida mard"
                  : "apni pasandida aurat"}
              </span>{" "}
              ke liye banaya hai. Don't you dare to enter otherwise I'll kill
              you.
            </h1>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nameInput.trim()) handleAuthenticate();
              }}
              placeholder="Enter your name..."
              className="w-full px-5 py-3 rounded-xl border-2 border-primary/20 focus:border-primary/60 focus:outline-none text-lg font-medium text-slate-700 placeholder:text-slate-400 bg-white/80 transition-colors mb-5"
            />
            <button
              onClick={handleAuthenticate}
              disabled={!nameInput.trim()}
              className="w-full py-3 rounded-xl bg-primary text-white text-lg font-black shadow-lg shadow-primary/30 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Let me in 💕
            </button>
          </div>
        ) : !accepted ? (
          <Proposal
            onAccept={handleAccept}
            onNoThirdClick={handleNoThirdClick}
            realName={realName}
          />
        ) : (
          <div className="text-center animate-in zoom-in duration-500 py-20">
            <div className="relative mb-10">
              <div className="absolute -inset-10 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
              <img
                alt="Happy Character"
                className="w-64 h-64 mx-auto rounded-3xl object-contain relative z-10 scale-125"
                src="/gif/rotating.gif"
              />
            </div>
            <h1 className="text-primary text-6xl md:text-8xl font-black mb-6 drop-shadow-sm">
              Yaii! ❤️
            </h1>
            <p className="text-slate-600 text-2xl font-bold">
              I knew you'd say yes! I'm so happy! 🥰
            </p>
            <button
              onClick={() => setAccepted(false)}
              className="mt-10 text-primary/60 font-bold hover:text-primary transition-colors flex items-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined"></span> See proposal
              again
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
