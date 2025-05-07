import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NewLevelModalProps {
  level: number;
  timeLimit: number;
  onStartLevel: () => void;
}

const NewLevelModal: React.FC<NewLevelModalProps> = ({ 
  level, 
  timeLimit, 
  onStartLevel 
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-11/12 max-w-sm text-center"
      >
        <div className="w-16 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-arrow-up-line text-primary text-3xl"></i>
        </div>
        <h2 className="text-xl font-bold mb-2">Level {level}</h2>
        <p className="text-gray-600 mb-4">
          {level === 2 
            ? "Good job! Ready for more challenging words?" 
            : level === 3 
              ? "Great progress! The challenge increases!" 
              : level >= 4 
                ? "Expert level! These will be tough!" 
                : "Get ready for more challenging words!"}
        </p>
        <div className="mb-4 py-2 px-4 bg-gray-100 rounded-lg inline-block">
          <span className="text-sm text-gray-500">Time per round: </span>
          <span className="font-medium">{timeLimit} seconds</span>
        </div>
        <Button
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium"
          onClick={onStartLevel}
        >
          Start Level
        </Button>
      </motion.div>
    </div>
  );
};

export default NewLevelModal;
