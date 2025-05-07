import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SuccessModalProps {
  score: number;
  onNextRound: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ score, onNextRound }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-11/12 max-w-sm text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-check-line text-correct text-3xl"></i>
        </div>
        <h2 className="text-xl font-bold mb-2">Correct!</h2>
        <p className="text-gray-600 mb-4">Great job! You've unscrambled the word.</p>
        <p className="mb-4">
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5 }}
            className="font-bold text-2xl text-primary"
          >
            +{score}
          </motion.span> points added
        </p>
        <Button
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium"
          onClick={onNextRound}
        >
          Next Round
        </Button>
      </motion.div>
    </div>
  );
};

export default SuccessModal;
