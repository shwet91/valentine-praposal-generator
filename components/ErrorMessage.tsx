import React from "react";

const ErrorMessage: React.FC<{
  isVisible: boolean;
  onDismiss?: () => void;
}> = ({ isVisible = false, onDismiss }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-md px-6 py-5 rounded-[2rem] shadow-2xl shadow-primary/5 border border-primary/5 relative max-w-sm w-full mx-4">
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-50"></div>

        <div className="relative mb-3 flex justify-center">
          <div className="bg-white p-3 rounded-[2rem] border-4 border-dashed border-primary/20 shadow-inner inline-block">
            <img
              src="/gif/angry2.gif"
              alt="Not Allowed"
              className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-2xl"
            />
          </div>
        </div>

        <h2 className="text-primary text-lg md:text-xl font-black leading-tight tracking-tight relative z-10 text-center">
          You are not allowed to enter 🚫
        </h2>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="mt-4 w-full py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors relative z-10"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
