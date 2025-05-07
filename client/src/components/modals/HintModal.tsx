import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HintModalProps {
  hint: string;
  onClose: () => void;
}

const HintModal: React.FC<HintModalProps> = ({ hint, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-11/12 max-w-sm text-center"
      >
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-lightbulb-line text-yellow-500 text-3xl"></i>
        </div>
        <h2 className="text-xl font-bold mb-2">Hint</h2>
        <p className="text-gray-600 mb-4">{hint}</p>
        <p className="mb-4 text-sm text-red-500">-10 points used</p>
        <Button
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium"
          onClick={onClose}
        >
          Got it
        </Button>
      </motion.div>
    </div>
  );
};

export default HintModal;
