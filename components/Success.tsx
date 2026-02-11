import React, { useState } from "react";

interface Props {
  isVisible: boolean;
  generatedUrl: string;
  onClose: () => void;
}

const SuccessModal: React.FC<Props> = ({ isVisible, generatedUrl, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md animate-in zoom-in slide-in-from-top-4 duration-500">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-primary/20 border border-primary/10 p-8 md:p-12 w-full flex flex-col items-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
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

          {/* GIF at the top */}
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <img
              src="/gif/rotating.gif"
              alt="Success"
              className="w-36 h-36 md:w-44 md:h-44 object-contain rounded-2xl relative z-10"
            />
          </div>

          {/* Success Message */}
          <h1 className="text-primary text-2xl md:text-3xl font-black leading-snug tracking-tight text-center mb-4">
            Your Website is Ready! 🎉
          </h1>
          
          <p className="text-slate-600 text-base font-medium text-center mb-8">
            Here is the link to your Valentine's proposal
          </p>

          {/* URL Display */}
          <div className="w-full mb-6 p-4 rounded-xl bg-primary/5 border-2 border-primary/20">
            <p className="text-slate-700 font-mono text-sm break-all text-center">
              {generatedUrl}
            </p>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyLink}
            className={`
              w-full py-4 rounded-xl text-white text-lg font-black shadow-lg transition-all duration-300
              ${
                copied
                  ? "bg-green-500 shadow-green-500/30 scale-[1.03]"
                  : "bg-primary shadow-primary/30 hover:scale-[1.03] active:scale-95"
              }
            `}
          >
            {copied ? "Copied to your clipboard! ✓" : "Click to copy 📋"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;