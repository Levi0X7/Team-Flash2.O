import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const difficultyInfo = {
  1: { name: "EASY", color: "from-green-400 to-green-500", timeLimit: 60, description: "Simple 3-4 letter words" },
  2: { name: "MEDIUM", color: "from-yellow-400 to-yellow-500", timeLimit: 45, description: "Medium 4-5 letter words" },
  3: { name: "HARD", color: "from-red-400 to-red-500", timeLimit: 30, description: "Complex 5-6 letter words" }
};

const Home: React.FC = () => {
  const [, setLocation] = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [musicVolume, setMusicVolume] = useState(70);
  const [sfxVolume, setSfxVolume] = useState(80);
  const [showHints, setShowHints] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);
  
  const handlePlayClick = () => {
    setShowDifficultySelect(true);
  };
  
  const startGame = (difficulty: number) => {
    // Save difficulty level to localStorage
    localStorage.setItem('wordScramble_difficulty', difficulty.toString());
    localStorage.setItem('wordScramble_timeLimit', difficultyInfo[difficulty as keyof typeof difficultyInfo].timeLimit.toString());
    
    // Navigate to game
    setLocation("/game");
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-indigo-500 to-purple-600 px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Game Logo/Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-2 text-white tracking-tighter">
            <span className="text-yellow-300">Word</span>
            <span>Scramble</span>
          </h1>
          <p className="text-white text-opacity-80 text-lg">Unscramble words & test your knowledge!</p>
          <p className="text-white text-opacity-90 font-bold mt-3">MADE BY TEAM FLASH 2.O</p>
        </motion.div>
        
        {!showDifficultySelect ? (
          <>
            {/* Main Menu Buttons */}
            <div className="flex flex-col w-full gap-4 mb-12">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <Button 
                  onClick={handlePlayClick}
                  className="w-full py-6 text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 text-indigo-900 rounded-xl shadow-lg"
                >
                  PLAY NOW
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Button 
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  className="w-full py-5 text-lg font-medium bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30 rounded-xl"
                >
                  Settings
                </Button>
              </motion.div>
            </div>
            
            {/* Game Stats Preview */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="grid grid-cols-3 gap-3 w-full"
            >
              <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">15</div>
                <div className="text-xs text-white text-opacity-80">High Score</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-xs text-white text-opacity-80">Words Solved</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-xs text-white text-opacity-80">Best Level</div>
              </div>
            </motion.div>
            
            {/* Footer Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.5 }}
              className="mt-16 text-center text-white text-opacity-70 text-sm"
            >
              <p>Tap PLAY to start your word challenge!</p>
              <p className="mt-1">Answer GK questions for bonus points!</p>
            </motion.div>
          </>
        ) : (
          /* Difficulty Selection */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Select Difficulty
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((level) => {
                const difficulty = difficultyInfo[level as keyof typeof difficultyInfo];
                return (
                  <motion.div 
                    key={level}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: level * 0.1 }}
                    className="w-full"
                  >
                    <Button
                      onClick={() => startGame(level)}
                      className={`w-full py-8 text-xl font-bold bg-gradient-to-r ${difficulty.color} text-white rounded-xl shadow-lg flex flex-col items-center justify-center`}
                    >
                      <span className="text-2xl mb-1">{difficulty.name}</span>
                      <span className="text-xs font-normal opacity-80">{difficulty.description}</span>
                      <span className="text-xs mt-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        {difficulty.timeLimit}s per word
                      </span>
                    </Button>
                  </motion.div>
                );
              })}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={() => setShowDifficultySelect(false)}
                  variant="ghost"
                  className="w-full mt-4 text-white"
                >
                  Back to Menu
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
      
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
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-yellow-300 opacity-20 rounded-full"></div>
        <div className="absolute top-3/4 left-1/4 w-24 h-24 bg-indigo-300 opacity-10 rounded-full"></div>
      </div>
    </div>
  );
};

export default Home;