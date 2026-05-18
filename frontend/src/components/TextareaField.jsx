import React from "react";

const TextareaField = ({ label, name, placeholder, onChange }) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      {/* Editorial Style Label */}
      <label className="text-[10px] md:text-xs font-black tracking-[0.3em] text-zinc-400 uppercase ml-1 transition-colors group-focus-within:text-yellow-600">
        {label}
      </label>
      
      <textarea
        name={name}
        rows="4"
        placeholder={placeholder}
        onChange={onChange}
        // Matching bottom-border style, removed large rounding
        className="w-full bg-transparent border-b-2 border-zinc-100 py-4 px-1 text-zinc-900 font-medium placeholder:text-zinc-300 focus:border-yellow-500 outline-none resize-none transition-all duration-300"
      />
    </div>
  );
};

export default TextareaField;