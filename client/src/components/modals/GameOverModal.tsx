import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameOverModalProps {
  score: number;
  word: string;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  onPlayAgain: () => void;
  onGoToMenu?: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, word, correctAnswersCount, incorrectAnswersCount, onPlayAgain, onGoToMenu }) => {
  const handleShareResults = () => {
    // Create share text with quiz statistics
    const totalQuizAnswers = correctAnswersCount + incorrectAnswersCount;
    const shareText = `I scored ${score} points in Word Scramble Challenge! Quiz results: ${correctAnswersCount}/${totalQuizAnswers} correct answers. Can you beat my score?`;
    
    // Implement sharing functionality
    if (navigator.share) {
      navigator.share({
        title: 'Word Scramble Challenge',
        text: shareText,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Score copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-11/12 max-w-sm text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-time-line text-incorrect text-3xl"></i>
        </div>
        <h2 className="text-xl font-bold mb-2">Time's Up!</h2>
        <p className="text-gray-600 mb-2">The correct word was:</p>
        <p className="text-2xl font-bold text-primary mb-4">{word}</p>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Final Score</p>
          <p className="text-3xl font-bold text-secondary">{score}</p>
        </div>
        
        {/* Quiz Statistics */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Quiz Results</h3>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Correct Answers:</span>
            <span className="font-bold text-green-500">{correctAnswersCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Incorrect Answers:</span>
            <span className="font-bold text-red-500">{incorrectAnswersCount}</span>
          </div>
        </div>
        {/* Buttons */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium"
              onClick={handleShareResults}
            >
              Share <i className="ri-share-line ml-1"></i>
            </Button>
            <Button
              className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-medium"
              onClick={onPlayAgain}
            >
              Try Again
            </Button>
          </div>
          
          {onGoToMenu && (
            <Button
              variant="outline"
              className="w-full py-3 px-4 border-gray-300 text-gray-700 rounded-lg font-medium"
              onClick={onGoToMenu}
            >
              Menu
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GameOverModal;
