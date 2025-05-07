import React, { useState, useEffect } from "react";
import GameHeader from "./GameHeader";
import TimerBar from "./TimerBar";
import WordDisplay from "./WordDisplay";
import ScrambledLetters from "./ScrambledLetters";
import GameControls from "./GameControls";
import HintsArea from "./HintsArea";
import SuccessModal from "./modals/SuccessModal";
import GameOverModal from "./modals/GameOverModal";
import NewLevelModal from "./modals/NewLevelModal";
import HintModal from "./modals/HintModal";
import QuizModal from "./modals/QuizModal";
import QuizResultModal from "./modals/QuizResultModal";
import { useWordGame } from "@/hooks/useWordGame";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GameContainerProps {
  goToMenu: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ goToMenu }) => {
  const {
    gameState,
    arrangedLetters,
    availableLetters,
    timeRemaining,
    resetArrangedLetters,
    onLetterSelect,
    onLetterUnselect,
    submitWord,
    nextRound,
    startLevel,
    restartGame,
    showHint,
    closeHint,
    // Quiz-related functions
    submitQuizAnswer,
    skipQuiz,
    closeQuizResult
  } = useWordGame();

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [musicVolume, setMusicVolume] = useState(70);
  const [sfxVolume, setSfxVolume] = useState(80);
  const [showHints, setShowHints] = useState(true);
  const [vibration, setVibration] = useState(true);

  // Timer bar percentage
  const timerPercentage = (timeRemaining / gameState.timeLimit) * 100;
  
  // Handle new game
  const handleNewGame = () => {
    restartGame();
  };
  
  // Handle opening settings
  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto px-4 py-6 relative">
      <GameHeader 
        score={gameState.score} 
        round={gameState.round} 
        totalRounds={gameState.totalRounds}
        timeRemaining={timeRemaining}
        onGoToMenu={goToMenu}
        onNewGame={handleNewGame}
        onOpenSettings={handleOpenSettings}
      />
      
      <TimerBar percentage={timerPercentage} />
      
      <div className="text-center mb-4 text-sm text-gray-600 animate-slide-in">
        <p>Unscramble the letters to form a valid word</p>
      </div>
      
      <WordDisplay 
        arrangedLetters={arrangedLetters} 
        onLetterClick={onLetterUnselect} 
      />
      
      <ScrambledLetters 
        availableLetters={availableLetters} 
        onLetterClick={onLetterSelect} 
      />
      
      <GameControls 
        onReset={resetArrangedLetters} 
        onSubmit={submitWord} 
      />
      
      <HintsArea onShowHint={() => showHint()} />
      
      {/* Modals */}
      {gameState.showSuccessModal && (
        <SuccessModal 
          score={gameState.lastRoundScore}
          onNextRound={nextRound}
        />
      )}
      
      {gameState.showGameOverModal && (
        <GameOverModal 
          score={gameState.score}
          word={gameState.currentWord}
          correctAnswersCount={gameState.correctAnswersCount}
          incorrectAnswersCount={gameState.incorrectAnswersCount}
          onPlayAgain={restartGame}
          onGoToMenu={goToMenu}
        />
      )}
      
      {gameState.showNewLevelModal && (
        <NewLevelModal 
          level={gameState.level}
          timeLimit={gameState.timeLimit}
          onStartLevel={startLevel}
        />
      )}
      
      {gameState.showHintModal && (
        <HintModal 
          hint={gameState.currentHint}
          onClose={closeHint}
        />
      )}

      {/* Quiz Modals */}
      {gameState.showQuizModal && (
        <QuizModal
          question={gameState.currentQuizQuestion}
          options={gameState.currentQuizOptions}
          onAnswer={submitQuizAnswer}
          onSkip={skipQuiz}
        />
      )}

      {gameState.showQuizResultModal && (
        <QuizResultModal
          isCorrect={gameState.isQuizAnswerCorrect}
          correctAnswer={gameState.correctQuizAnswer}
          selectedAnswer={gameState.selectedQuizAnswer}
          earnedPoints={gameState.quizEarnedPoints}
          onContinue={closeQuizResult}
        />
      )}
      
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Game Settings</DialogTitle>
            <DialogDescription>
              Customize your gameplay experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-gray-500">AUDIO</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="music">Music Volume</Label>
                  <span className="text-sm text-gray-500">{musicVolume}%</span>
                </div>
                <Slider 
                  id="music" 
                  min={0} 
                  max={100} 
                  step={1}
                  value={[musicVolume]}
                  onValueChange={(value) => setMusicVolume(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sfx">Sound Effects</Label>
                  <span className="text-sm text-gray-500">{sfxVolume}%</span>
                </div>
                <Slider 
                  id="sfx" 
                  min={0} 
                  max={100} 
                  step={1}
                  value={[sfxVolume]}
                  onValueChange={(value) => setSfxVolume(value[0])}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-gray-500">GAMEPLAY</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="hints">Show Hints</Label>
                <Switch 
                  id="hints" 
                  checked={showHints}
                  onCheckedChange={setShowHints}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="vibration">Vibration</Label>
                <Switch 
                  id="vibration" 
                  checked={vibration}
                  onCheckedChange={setVibration}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setShowSettings(false)}
              className="w-full"
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameContainer;
