import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Game schema for storing words and their difficulties
export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  word: text("word").notNull().unique(),
  hint: text("hint").notNull(),
  difficulty: integer("difficulty").notNull(), // 1-easy, 2-medium, 3-hard
});

export const insertWordSchema = createInsertSchema(words).pick({
  word: true,
  hint: true,
  difficulty: true,
});

export type InsertWord = z.infer<typeof insertWordSchema>;
export type Word = typeof words.$inferSelect;

// Quiz question schema
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // Array of options
  correctAnswer: text("correct_answer").notNull(),
  difficulty: integer("difficulty").notNull(), // 1-easy, 2-medium, 3-hard
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  question: true,
  options: true,
  correctAnswer: true,
  difficulty: true,
});

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;

// Game state schema
export const gameWordSchema = z.object({
  word: z.string(),
  hint: z.string(),
  scrambled: z.array(z.string()),
});

export type GameWord = z.infer<typeof gameWordSchema>;

// Quiz question schema for API responses
export const quizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  difficulty: z.number(),
});

export type GameQuizQuestion = z.infer<typeof quizQuestionSchema>;

// Validation schema for word submission
export const submitWordSchema = z.object({
  word: z.string(),
});

// Validation schema for quiz answer submission
export const submitQuizAnswerSchema = z.object({
  questionId: z.number(),
  answer: z.string(),
});

// Round settings schema
export const roundSettingsSchema = z.object({
  level: z.number().min(1).max(5),
  timeLimit: z.number().min(10).max(120),
  wordCount: z.number().min(1).max(20),
});

export type RoundSettings = z.infer<typeof roundSettingsSchema>;
