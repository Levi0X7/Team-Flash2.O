import React from "react";
import { motion } from "framer-motion";
import LetterTile from "./LetterTile";

interface WordDisplayProps {
  arrangedLetters: string[];
  onLetterClick: (index: number) => void;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ 
  arrangedLetters, 
  onLetterClick 
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white p-4 rounded-xl shadow-lg w-full">
        <div className="flex justify-center gap-2 min-h-[80px] items-center flex-wrap">
          {arrangedLetters.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              Tap letters below to form a word
            </p>
          ) : (
            arrangedLetters.map((letter, index) => (
              <motion.div
                key={`arranged-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="cursor-pointer"
                onClick={() => onLetterClick(index)}
              >
                <LetterTile letter={letter} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WordDisplay;
