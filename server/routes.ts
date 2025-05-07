import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameWordSchema, submitWordSchema, roundSettingsSchema, submitQuizAnswerSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get a new word for the game
  app.get("/api/word", async (req, res) => {
    try {
      // Get difficulty from query params, default to 1
      const difficulty = parseInt(req.query.difficulty as string) || 1;
      
      // Get exclude words parameter (comma-separated list of words to exclude)
      const excludeParam = req.query.exclude as string;
      const excludeWords = excludeParam ? excludeParam.split(',').map(w => w.trim()) : [];
      
      // Get a random word from storage with exclusions
      const gameWord = await storage.getRandomWordByDifficulty(difficulty, excludeWords);
      
      // Return the word data
      res.json(gameWord);
    } catch (error) {
      console.error("Error getting random word:", error);
      res.status(500).json({ message: "Failed to get a word" });
    }
  });

  // API route to get a quiz question
  app.get("/api/quiz-question", async (req, res) => {
    try {
      // Get difficulty from query params, default to 1
      const difficulty = parseInt(req.query.difficulty as string) || 1;
      
      // Get a random quiz question from storage
      const quizQuestion = await storage.getRandomQuizQuestion(difficulty);
      
      // Return the quiz question data
      res.json(quizQuestion);
    } catch (error) {
      console.error("Error getting quiz question:", error);
      res.status(500).json({ message: "Failed to get a quiz question" });
    }
  });

  // API route to validate a quiz answer
  app.post("/api/validate-quiz-answer", async (req, res) => {
    try {
      const { question, answer } = req.body;
      
      if (!question || !answer) {
        return res.status(400).json({ message: "Question and answer are required" });
      }
      
      // Validate the answer
      const isCorrect = await storage.validateQuizAnswer(question, answer);
      
      // Find the correct answer for feedback
      let correctAnswer = "";
      for (const difficulty in storage["quizQuestionsByDifficulty"]) {
        const questionData = storage["quizQuestionsByDifficulty"][Number(difficulty)].find(
          item => item.question === question
        );
        if (questionData) {
          correctAnswer = questionData.correctAnswer;
          break;
        }
      }
      
      // Calculate points based on difficulty 
      // (we'll get the difficulty from the same lookup we did for the correct answer)
      let earnedPoints = 0;
      if (isCorrect) {
        const difficultyBonus = {
          1: 10,  // Easy
          2: 20,  // Medium
          3: 30,  // Hard
        };
        
        for (const difficulty in storage["quizQuestionsByDifficulty"]) {
          const questionData = storage["quizQuestionsByDifficulty"][Number(difficulty)].find(
            item => item.question === question
          );
          if (questionData) {
            earnedPoints = difficultyBonus[Number(difficulty) as keyof typeof difficultyBonus] || 10;
            break;
          }
        }
      }
      
      // Return validation result
      res.json({ 
        isCorrect,
        correctAnswer,
        earnedPoints
      });
    } catch (error) {
      console.error("Error validating quiz answer:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // API route to validate a word
  app.post("/api/validate", async (req, res) => {
    try {
      // Validate request body
      const { word } = submitWordSchema.parse(req.body);
      
      // Check if the word is valid
      const isValid = await storage.validateWord(word);
      
      // Return validation result
      res.json({ isValid });
    } catch (error) {
      console.error("Error validating word:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // API route to get a hint for a word
  app.get("/api/hint", async (req, res) => {
    try {
      // Get word from query params
      const word = req.query.word as string;
      
      if (!word) {
        return res.status(400).json({ message: "Word parameter is required" });
      }
      
      // Get hint for the word
      const hint = await storage.getWordHint(word);
      
      if (!hint) {
        return res.status(404).json({ message: "No hint found for this word" });
      }
      
      // Return the hint
      res.json({ hint });
    } catch (error) {
      console.error("Error getting hint:", error);
      res.status(500).json({ message: "Failed to get hint" });
    }
  });

  // API route to get game settings for a specific level
  app.get("/api/settings", (req, res) => {
    try {
      // Get level from query params, default to 1
      const level = parseInt(req.query.level as string) || 1;
      
      // Define settings based on level
      const settings = {
        level,
        timeLimit: 60 - (level * 5), // Decrease time as level increases
        wordCount: 5 + level, // Increase word count as level increases
      };
      
      // Validate settings with schema
      const validatedSettings = roundSettingsSchema.parse(settings);
      
      // Return the settings
      res.json(validatedSettings);
    } catch (error) {
      console.error("Error getting game settings:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
