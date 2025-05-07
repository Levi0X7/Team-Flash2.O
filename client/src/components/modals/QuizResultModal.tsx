import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface QuizResultModalProps {
  isCorrect: boolean;
  correctAnswer: string;
  selectedAnswer: string;
  earnedPoints: number;
  onContinue: () => void;
}

const QuizResultModal: React.FC<QuizResultModalProps> = ({ 
  isCorrect, 
  correctAnswer,
  selectedAnswer,
  earnedPoints,
  onContinue 
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-11/12 max-w-sm text-center"
      >
        {isCorrect ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-correct text-3xl"></i>
            </div>
            <h2 className="text-xl font-bold mb-2">Correct!</h2>
            <p className="text-gray-600 mb-4">That's the right answer.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-close-line text-incorrect text-3xl"></i>
            </div>
            <h2 className="text-xl font-bold mb-2">Not Quite!</h2>
            <p className="text-gray-600 mb-2">You answered: <span className="font-semibold">{selectedAnswer}</span></p>
            <p className="text-gray-600 mb-4">Correct answer: <span className="font-semibold text-correct">{correctAnswer}</span></p>
          </>
        )}
        
        <div className="mb-6">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5 }}
            className={`font-bold text-2xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
          >
            {isCorrect ? `+${earnedPoints}` : '-10'}
          </motion.div>
          <p className="text-sm text-gray-500">points</p>
        </div>
        
        <Button
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium"
          onClick={onContinue}
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};

export default QuizResultModal;