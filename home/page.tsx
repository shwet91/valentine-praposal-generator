import React, { useState } from "react";
import SuccessModal from "@/components/Success";
import { Loader } from "lucide-react";

const LandingPage: React.FC = () => {
  const [loveName, setLoveName] = useState("");
  const [gender, setGender] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Your API call logic here


    try {
      if (isLoading) return; // Prevent multiple submissions
      setIsLoading(true);

      const apiCall = await fetch("/api/generatePraposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: loveName, gender }),
      });

      const data = await apiCall.json();
      if (!apiCall.ok) {
        throw new Error(data.message || "Failed to generate proposal");
      }

      setGeneratedUrl(`https://www.doless.lol/generate/${data.user.userId}`);

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to generate proposal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-gradient-valentine overflow-x-hidden selection:bg-primary/20">
      <main className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-primary/10 border border-primary/10 p-8 md:p-12 w-full flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
          {/* GIF at the top */}
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl opacity-60"></div>
            <img
              src="./gif/loving.gif"
              alt="Love"
              className="w-36 h-36 md:w-44 md:h-44 object-contain rounded-2xl relative z-10"
            />
          </div>

          {/* Title */}
          <h1 className="text-primary text-2xl md:text-3xl font-black leading-snug tracking-tight text-center mb-8">
            Create Your Valentine's Proposal 💕
          </h1>

          {/* Name Input */}
          <div className="w-full mb-5">
            <label className="block text-slate-700 font-bold mb-2 text-sm">
              Name of your partner
            </label>
            <input
              type="text"
              value={loveName}
              onChange={(e) => setLoveName(e.target.value)}
              placeholder="Enter their name..."
              className="w-full px-5 py-3 rounded-xl border-2 border-primary/20 focus:border-primary/60 focus:outline-none text-lg font-medium text-slate-700 placeholder:text-slate-400 bg-white/80 transition-colors"
            />
          </div>

          {/* Gender Input */}
          <div className="w-full mb-8">
            <label className="block text-slate-700 font-bold mb-3 text-sm">
              Gender of your partner
            </label>
            <div className="flex flex-col gap-3">
              {["Male", "Female"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGender(option.toLowerCase())}
                  className={`
                    w-full px-5 py-3 rounded-xl border-2 text-lg font-medium transition-all duration-300
                    ${
                      gender === option.toLowerCase()
                        ? "border-primary bg-primary/10 text-primary shadow-md shadow-primary/20"
                        : "border-primary/20 bg-white/80 text-slate-700 hover:border-primary/40 hover:bg-primary/5"
                    }
                  `}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                      ${
                        gender === option.toLowerCase()
                          ? "border-primary"
                          : "border-slate-300"
                      }
                    `}
                    >
                      {gender === option.toLowerCase() && (
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                      )}
                    </span>
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleSubmit}
            disabled={!loveName.trim() || !gender || isLoading}
            className="w-full py-4 rounded-xl bg-primary text-white text-lg font-black shadow-lg shadow-primary/30 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader className="animate-spin w-5 h-5 mx-auto" /> : "Generate Proposal 💖"}
          </button>
        </div>
      </main>

      {/* Success Modal */}
      <SuccessModal
        isVisible={showSuccessModal}
        generatedUrl={generatedUrl}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default LandingPage;
