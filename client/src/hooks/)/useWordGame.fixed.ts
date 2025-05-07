import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, QueryClient, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GameWord, GameQuizQuestion } from "@shared/schema";

interface GameState {
  level: number;
  round: number;
  totalRounds: number;
  score: number;
  lastRoundScore: number;
  currentWord: string;
  currentHint: string;
  timeLimit: number;
  showSuccessModal: boolean;
  showGameOverModal: boolean;
  showNewLevelModal: boolean;
  showHintModal: boolean;
  // Quiz-related state
  showQuizModal: boolean;
  showQuizResultModal: boolean;
  currentQuizQuestion: string;
  currentQuizOptions: string[];
  selectedQuizAnswer: string;
  correctQuizAnswer: string;
  isQuizAnswerCorrect: boolean;
  quizEarnedPoints: number;
}

export function useWordGame() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    round: 1,
    totalRounds: 10,
    score: 0,
    lastRoundScore: 0,
    currentWord: "",
    currentHint: "",
    timeLimit: 60,
    showSuccessModal: false,
    showGameOverModal: false,
    showNewLevelModal: false,
    showHintModal: false,
    // Quiz-related state
    showQuizModal: false,
    showQuizResultModal: false,
    currentQuizQuestion: "",
    currentQuizOptions: [],
    selectedQuizAnswer: "",
    correctQuizAnswer: "",
    isQuizAnswerCorrect: false,
    quizEarnedPoints: 0,
  });
  
  // Letters state
  const [availableLetters, setAvailableLetters] = useState<{ letter: string; visible: boolean }[]>([]);
  const [arrangedLetters, setArrangedLetters] = useState<string[]>([]);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(gameState.timeLimit);
  const [timerActive, setTimerActive] = useState(false);

  // Function to fetch a word
  const fetchWord = useCallback(async () => {
    try {
      const response = await fetch(`/api/word?difficulty=${gameState.level}`);
      if (!response.ok) {
        throw new Error('Failed to fetch a word');
      }
      
      const data: GameWord = await response.json();
      
      // Process the word data
      const scrambledLetters = data.scrambled.map(letter => ({
        letter: letter.toUpperCase(),
        visible: true
      }));
      
      setGameState(prev => ({
        ...prev,
        currentWord: data.word.toUpperCase(),
        currentHint: data.hint,
      }));
      
      setAvailableLetters(scrambledLetters);
      setArrangedLetters([]);
      setTimeRemaining(gameState.timeLimit);
      setTimerActive(true);
      
      return data;
    } catch (error) {
      console.error('Error fetching word:', error);
      toast({
        title: "Error",
        description: "Failed to load a new word. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [gameState.level, gameState.timeLimit, toast]);

  // Function to fetch a quiz question
  const fetchQuizQuestion = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz-question?difficulty=${gameState.level}`);
      if (!response.ok) {
        throw new Error('Failed to fetch a quiz question');
      }
      
      const data = await response.json();
      
      // Update the state with the question data
      setGameState(prev => ({
        ...prev,
        currentQuizQuestion: data.question,
        currentQuizOptions: data.options,
        showQuizModal: true,
      }));
      
      return data;
    } catch (error) {
      console.error('Error fetching quiz question:', error);
      toast({
        title: "Error",
        description: "Failed to load a quiz question. Continuing to next round.",
        variant: "destructive",
      });
      
      // If fetching the quiz fails, continue to the next word
      fetchWord();
      throw error;
    }
  }, [gameState.level, fetchWord, toast]);

  // Validate word submission
  const validateWord = useCallback(async (word: string) => {
    try {
      const response = await apiRequest("POST", "/api/validate", { word });
      const data = await response.json();
      
      if (data.isValid) {
        // Calculate score based on word length and remaining time
        const baseScore = word.length * 5;
        const timeBonus = Math.floor(timeRemaining / 2);
        const roundScore = baseScore + timeBonus;
        
        setGameState(prev => ({
          ...prev,
          score: prev.score + roundScore,
          lastRoundScore: roundScore,
          showSuccessModal: true,
        }));
        
        setTimerActive(false);
      } else {
        toast({
          title: "Invalid Word",
          description: "The word you formed is not valid. Try again!",
          variant: "destructive",
        });
        
        // Visual feedback for invalid word
        setTimeout(() => {
          resetArrangedLetters();
        }, 300);
      }
      
      return data;
    } catch (error) {
      console.error('Error validating word:', error);
      toast({
        title: "Error",
        description: "Failed to validate the word. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [timeRemaining, toast]);

  // Validate quiz answer
  const validateQuizAnswer = useCallback(async (answer: string) => {
    try {
      const response = await apiRequest("POST", "/api/validate-quiz-answer", { 
        question: gameState.currentQuizQuestion, 
        answer 
      });
      const data = await response.json();
      
      setGameState(prev => ({
        ...prev,
        showQuizModal: false,
        showQuizResultModal: true,
        selectedQuizAnswer: answer,
        correctQuizAnswer: data.correctAnswer,
        isQuizAnswerCorrect: data.isCorrect,
        quizEarnedPoints: data.earnedPoints,
        score: prev.score + (data.isCorrect ? data.earnedPoints : 0)
      }));
      
      return data;
    } catch (error) {
      console.error('Error validating quiz answer:', error);
      toast({
        title: "Error",
        description: "Failed to validate your answer. Continuing to next round.",
        variant: "destructive",
      });
      
      // If validating the answer fails, continue to the next word
      fetchWord();
      throw error;
    }
  }, [gameState.currentQuizQuestion, fetchWord, toast]);

  // Handle selecting a letter from available letters
  const onLetterSelect = useCallback((index: number) => {
    // Add letter to arranged letters
    setArrangedLetters(prev => [
      ...prev,
      availableLetters[index].letter,
    ]);
    
    // Mark letter as used (not visible)
    setAvailableLetters(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        visible: false,
      };
      return updated;
    });
  }, [availableLetters]);

  // Handle removing a letter from arranged letters
  const onLetterUnselect = useCallback((index: number) => {
    const letterToReturn = arrangedLetters[index];
    
    // Remove from arranged letters
    setArrangedLetters(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    // Make letter available again
    setAvailableLetters(prev => {
      const letterIndex = prev.findIndex(
        item => item.letter === letterToReturn && !item.visible
      );
      
      if (letterIndex !== -1) {
        const updated = [...prev];
        updated[letterIndex] = {
          ...updated[letterIndex],
          visible: true,
        };
        return updated;
      }
      
      return prev;
    });
  }, [arrangedLetters]);

  // Reset arranged letters (return all to available)
  const resetArrangedLetters = useCallback(() => {
    // Clear arranged letters
    setArrangedLetters([]);
    
    // Make all letters available again
    setAvailableLetters(prev => 
      prev.map(letter => ({ ...letter, visible: true }))
    );
  }, []);

  // Submit the current word
  const submitWord = useCallback(() => {
    const word = arrangedLetters.join('');
    
    // Validation
    if (word.length < 2) {
      toast({
        title: "Word too short",
        description: "Please form a longer word",
      });
      return;
    }
    
    validateWord(word);
  }, [arrangedLetters, validateWord, toast]);

  // Proceed to next round
  const nextRound = useCallback(() => {
    // Check if we've completed all rounds for the current level
    const isLevelComplete = gameState.round % (gameState.level * 2) === 0;
    
    if (isLevelComplete && gameState.level < 4) {
      // Level up
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        round: prev.round + 1,
        showSuccessModal: false,
        showNewLevelModal: true,
        timeLimit: Math.max(30, 60 - (prev.level * 5)), // Decrease time as level increases
      }));
    } else if (gameState.round >= gameState.totalRounds) {
      // Game complete
      setGameState(prev => ({
        ...prev,
        showSuccessModal: false,
        showGameOverModal: true,
      }));
    } else {
      // Next round in same level
      setGameState(prev => ({
        ...prev,
        round: prev.round + 1,
        showSuccessModal: false,
      }));
      
      // Fetch a new word for the next round
      fetchWord();
    }
  }, [gameState.round, gameState.level, gameState.totalRounds, fetchWord]);

  // Determine if we should show a quiz or continue to next round
  const handleRoundCompletion = useCallback(() => {
    // Check if it's time to show a quiz (every 2 rounds)
    const shouldShowQuiz = gameState.round % 2 === 0;
    
    if (shouldShowQuiz) {
      // Fetch a quiz question
      fetchQuizQuestion();
    } else {
      // Original nextRound logic
      nextRound();
    }
  }, [gameState.round, fetchQuizQuestion, nextRound]);

  // Start a new level
  const startLevel = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showNewLevelModal: false,
    }));
    
    // Fetch a word for the new level
    fetchWord();
  }, [fetchWord]);

  // Restart the game
  const restartGame = useCallback(() => {
    setGameState({
      level: 1,
      round: 1,
      totalRounds: 10,
      score: 0,
      lastRoundScore: 0,
      currentWord: "",
      currentHint: "",
      timeLimit: 60,
      showSuccessModal: false,
      showGameOverModal: false,
      showNewLevelModal: false,
      showHintModal: false,
      // Quiz-related state
      showQuizModal: false,
      showQuizResultModal: false,
      currentQuizQuestion: "",
      currentQuizOptions: [],
      selectedQuizAnswer: "",
      correctQuizAnswer: "",
      isQuizAnswerCorrect: false,
      quizEarnedPoints: 0,
    });
    
    // Fetch a new word for the first round
    setTimeout(() => {
      fetchWord();
    }, 100);
  }, [fetchWord]);

  // Show hint
  const showHint = useCallback(() => {
    // Deduct points for using a hint
    if (gameState.score >= 10) {
      setGameState(prev => ({
        ...prev,
        score: prev.score - 10,
        showHintModal: true,
      }));
    } else {
      toast({
        title: "Not enough points",
        description: "You need at least 10 points to get a hint.",
      });
    }
  }, [gameState.score, toast]);

  // Close hint modal
  const closeHint = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showHintModal: false,
    }));
  }, []);

  // Submit quiz answer
  const submitQuizAnswer = useCallback((answer: string) => {
    validateQuizAnswer(answer);
  }, [validateQuizAnswer]);

  // Skip quiz
  const skipQuiz = useCallback(() => {
    // Skip quiz but don't award any points
    setGameState(prev => ({
      ...prev,
      showQuizModal: false
    }));
    
    // Continue to next word
    fetchWord();
  }, [fetchWord]);

  // Close quiz result and continue
  const closeQuizResult = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showQuizResultModal: false
    }));
    
    // Continue to next word
    fetchWord();
  }, [fetchWord]);

  // Timer effect
  useEffect(() => {
    let timerId: number | null = null;
    
    if (timerActive && timeRemaining > 0) {
      timerId = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up
            setTimerActive(false);
            setGameState(prev => ({
              ...prev,
              showGameOverModal: true,
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerActive, timeRemaining]);

  // Initialize game
  useEffect(() => {
    // Start the game by fetching the first word
    if (gameState.round === 1 && gameState.currentWord === "") {
      fetchWord();
    }
  }, [gameState.round, gameState.currentWord, fetchWord]);

  return {
    gameState,
    arrangedLetters,
    availableLetters,
    timeRemaining,
    resetArrangedLetters,
    onLetterSelect,
    onLetterUnselect,
    submitWord,
    nextRound: handleRoundCompletion, // Use the modified version that may show quizzes
    startLevel,
    restartGame,
    showHint,
    closeHint,
    // Quiz related functions
    submitQuizAnswer,
    skipQuiz,
    closeQuizResult
  };
}