import React from "react";

const Teasing: React.FC<{ isTeasingHidden: boolean }> = ({
    isTeasingHidden = false,
}) => {
  return (
    <div className={"flex flex-col items-center text-center " + (isTeasingHidden ? " hidden" : "")}>
      <div className="bg-white/90 backdrop-blur-md px-6 py-5 rounded-[2rem] shadow-2xl shadow-primary/5 border border-primary/5 relative">
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-50"></div>

        <div className="relative mb-3">
          <div className="bg-white p-3 rounded-[2rem] border-4 border-dashed border-primary/20 shadow-inner inline-block">
            <img
              src="/gif/teasing.gif"
              alt="Teasing"
              className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-2xl"
            />
          </div>
        </div>

        <h2 className="text-primary text-lg md:text-xl font-black leading-tight tracking-tight relative z-10">
          I will not let you say No !!
        </h2>
      </div>
    </div>
  );
};

export default Teasing;
