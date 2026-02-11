import React from "react";

const MobileBlocker: React.FC<{ isVisible: boolean }> = ({
  isVisible = false,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-md px-6 py-5 rounded-[2rem] shadow-2xl shadow-primary/5 border border-primary/5 relative max-w-sm w-full mx-4">
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-50"></div>

        <div className="relative mb-3 flex justify-center">
          <div className="bg-white p-3 rounded-[2rem] border-4 border-dashed border-primary/20 shadow-inner inline-block">
            <img
              src="/gif/medicine.gif"
              alt="No Mobile"
              className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-2xl"
            />
          </div>
        </div>

        <h2 className="text-primary text-lg md:text-xl font-black leading-tight tracking-tight relative z-10 text-center">
          This website is only accessible on laptop, not from mobiles 💻
        </h2>
      </div>
    </div>
  );
};

export default MobileBlocker;
