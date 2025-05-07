import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameControlsProps {
  onReset: () => void;
  onSubmit: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onReset, onSubmit }) => {
  return (
    <div className="flex gap-3 justify-center mt-2">
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          className="py-3 px-6 bg-gray-200 rounded-full text-gray-700 font-medium shadow-md hover:bg-gray-300 flex items-center gap-2"
          onClick={onReset}
        >
          <i className="ri-refresh-line"></i>
          Reset
        </Button>
      </motion.div>
      
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          className="py-3 px-8 bg-primary text-white rounded-full font-medium shadow-md hover:bg-indigo-600 flex items-center gap-2"
          onClick={onSubmit}
        >
          Submit
          <i className="ri-arrow-right-line"></i>
        </Button>
      </motion.div>
    </div>
  );
};

export default GameControls;
