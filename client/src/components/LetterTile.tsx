import React from "react";
import { cn } from "@/lib/utils";

interface LetterTileProps {
  letter: string;
  state?: "inactive" | "active" | "correct" | "incorrect";
  className?: string;
}

const LetterTile: React.FC<LetterTileProps> = ({
  letter,
  state = "inactive",
  className
}) => {
  const stateStyles = {
    inactive: "bg-white",
    active: "bg-slate-300",
    correct: "bg-emerald-400 text-white",
    incorrect: "bg-red-400 text-white"
  };

  return (
    <div
      className={cn(
        "letter-tile w-12 h-12 flex items-center justify-center rounded-lg shadow-md text-2xl font-bold cursor-pointer touch-manipulation",
        stateStyles[state],
        className
      )}
    >
      {letter}
    </div>
  );
};

export default LetterTile;
