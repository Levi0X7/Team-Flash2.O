import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface QuizModalProps {
  question: string;
  options: string[];
  onAnswer: (answer: string) => void;
  onSkip: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ 
  question, 
  options, 
  onAnswer,
  onSkip
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(selectedOption);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-11/12 max-w-sm"
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-question-line text-primary text-3xl"></i>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">General Knowledge</h2>
        <p className="text-gray-700 mb-6 text-center">{question}</p>
        
        <div className="space-y-3 mb-6">
          {options.map((option, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedOption === option 
                  ? 'border-primary bg-primary bg-opacity-10' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  selectedOption === option 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium"
            onClick={onSkip}
          >
            Skip
          </Button>
          <Button
            className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-medium"
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Submit
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizModal;