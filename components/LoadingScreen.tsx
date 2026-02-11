import React from "react";

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-valentine">
      {/* Pulsing heart */}
      <div className="relative mb-8">
        <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="text-7xl animate-bounce relative z-10">💕</div>
      </div>

      {/* Loading text */}
      <h2 className="text-primary text-2xl md:text-3xl font-black mb-6 tracking-tight">
        Loading something special...
      </h2>

      {/* Progress bar */}
      <div className="w-64 md:w-80 h-3 bg-primary/10 rounded-full overflow-hidden border border-primary/20">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="text-primary/60 text-sm font-bold mt-3">{progress}%</p>
    </div>
  );
};

export default LoadingScreen;
