import React from "react";
import { motion } from "framer-motion";
import LetterTile from "./LetterTile";

interface ScrambledLettersProps {
  availableLetters: { letter: string; visible: boolean }[];
  onLetterClick: (index: number) => void;
}

const ScrambledLetters: React.FC<ScrambledLettersProps> = ({
  availableLetters,
  onLetterClick
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
      <h2 className="text-center text-sm text-gray-500 mb-4">Available Letters</h2>
      
      <div className="flex flex-wrap justify-center gap-3">
        {availableLetters.map((item, index) => (
          item.visible && (
            <motion.div
              key={`scrambled-${index}`}
              whileTap={{ scale: 0.95 }}
              className="touch-manipulation"
              onClick={() => onLetterClick(index)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05, type: "spring" }}
            >
              <LetterTile letter={item.letter} />
            </motion.div>
          )
        ))}
      </div>
    </div>
  );
};

export default ScrambledLetters;
