import { words, type Word, type InsertWord, type GameWord, type GameQuizQuestion } from "@shared/schema";

// Dictionary of words by difficulty
const easyWords = [
  { word: "CAT", hint: "A small domesticated feline" },
  { word: "DOG", hint: "Man's best friend" },
  { word: "SUN", hint: "The star at the center of our solar system" },
  { word: "RUN", hint: "Move at a speed faster than walking" },
  { word: "HAT", hint: "A covering for the head" },
  { word: "BED", hint: "A piece of furniture for sleeping" },
  { word: "MAP", hint: "A visual representation of an area" },
  { word: "BOX", hint: "A container with a flat base and sides" },
  { word: "FUN", hint: "Enjoyment or playfulness" },
  { word: "ZIP", hint: "To close or secure quickly" },
];

const mediumWords = [
  { word: "PUZZLE", hint: "A game or toy that tests your ingenuity" },
  { word: "BEACH", hint: "Sandy shore by the ocean" },
  { word: "MUSIC", hint: "Vocal or instrumental sounds combined" },
  { word: "LAUGH", hint: "Expression of amusement" },
  { word: "FLAME", hint: "The visible part of fire" },
  { word: "PLANE", hint: "A flying vehicle with wings" },
  { word: "CLOUD", hint: "A visible mass of water droplets in the sky" },
  { word: "SHIRT", hint: "A garment for the upper body" },
  { word: "PAINT", hint: "Colored substance spread over a surface" },
  { word: "DANCE", hint: "Moving rhythmically to music" },
];

const hardWords = [
  { word: "WHISPER", hint: "Speaking very quietly" },
  { word: "JOURNEY", hint: "An act of traveling from one place to another" },
  { word: "GLACIER", hint: "A slowly moving mass of ice" },
  { word: "PHANTOM", hint: "A ghost or apparition" },
  { word: "MYSTERY", hint: "Something difficult to explain or understand" },
  { word: "BICYCLE", hint: "A vehicle with two wheels" },
  { word: "KINGDOM", hint: "A country ruled by a king or queen" },
  { word: "DOLPHIN", hint: "A marine mammal known for intelligence" },
  { word: "HIGHWAY", hint: "A main road connecting major towns" },
  { word: "QUANTUM", hint: "The smallest discrete unit of a phenomenon" },
];

const expertWords = [
  { word: "XYLOPHONE", hint: "A musical instrument with wooden bars" },
  { word: "SYMPOSIUM", hint: "A conference or meeting to discuss a topic" },
  { word: "QUIZZICAL", hint: "Indicating mild or amused puzzlement" },
  { word: "PNEUMONIA", hint: "An inflammatory condition of the lung" },
  { word: "JUXTAPOSE", hint: "To place side by side" },
  { word: "ZODIACAL", hint: "Relating to the zodiac" },
  { word: "KNAPSACK", hint: "A bag with shoulder straps" },
  { word: "WHIMSICAL", hint: "Playfully quaint or fanciful" },
  { word: "NIGHTFALL", hint: "The onset of darkness at the end of the day" },
  { word: "AUTHENTIC", hint: "Of undisputed origin; genuine" },
];

// Dictionary of quiz questions by difficulty
const easyQuizQuestions = [
  {
    question: "What is the capital of France?",
    options: ["Madrid", "Paris", "Rome"],
    correctAnswer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter"],
    correctAnswer: "Mars",
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen"],
    correctAnswer: "William Shakespeare",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean",
  },
  {
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Lion", "Elephant"],
    correctAnswer: "Lion",
  },
];

const mediumQuizQuestions = [
  {
    question: "In which year did World War II end?",
    options: ["1943", "1945", "1947"],
    correctAnswer: "1945",
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Au", "Ag"],
    correctAnswer: "Au",
  },
  {
    question: "Which famous scientist developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla"],
    correctAnswer: "Albert Einstein",
  },
  {
    question: "Which country is home to the Great Barrier Reef?",
    options: ["Brazil", "Australia", "Thailand"],
    correctAnswer: "Australia",
  },
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2"],
    correctAnswer: "2",
  },
];

const hardQuizQuestions = [
  {
    question: "Who was the first woman to win a Nobel Prize?",
    options: ["Marie Curie", "Rosalind Franklin", "Dorothy Hodgkin"],
    correctAnswer: "Marie Curie",
  },
  {
    question: "What is the name of the largest moon of Saturn?",
    options: ["Titan", "Europa", "Ganymede"],
    correctAnswer: "Titan",
  },
  {
    question: "In which year was the first human heart transplant performed?",
    options: ["1957", "1967", "1977"],
    correctAnswer: "1967",
  },
  {
    question: "Which element has the highest melting point?",
    options: ["Tungsten", "Platinum", "Titanium"],
    correctAnswer: "Tungsten",
  },
  {
    question: "Who composed the 'Moonlight Sonata'?",
    options: ["Mozart", "Beethoven", "Bach"],
    correctAnswer: "Beethoven",
  },
];

export interface IStorage {
  getRandomWordByDifficulty(difficulty: number, excludeWords?: string[]): Promise<GameWord>;
  validateWord(word: string): Promise<boolean>;
  getWordHint(word: string): Promise<string | null>;
  getRandomQuizQuestion(difficulty: number): Promise<GameQuizQuestion>;
  validateQuizAnswer(question: string, answer: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private wordsByDifficulty: { [key: number]: Array<{ word: string; hint: string }> };
  private quizQuestionsByDifficulty: { 
    [key: number]: Array<{ 
      question: string; 
      options: string[]; 
      correctAnswer: string; 
    }> 
  };

  constructor() {
    this.wordsByDifficulty = {
      1: easyWords,
      2: mediumWords,
      3: hardWords,
      4: expertWords,
    };

    this.quizQuestionsByDifficulty = {
      1: easyQuizQuestions,
      2: mediumQuizQuestions,
      3: hardQuizQuestions,
    };
  }

  // Get a random word based on difficulty level
  async getRandomWordByDifficulty(difficulty: number, excludeWords: string[] = []): Promise<GameWord> {
    // Ensure difficulty is valid
    const validDifficulty = Math.min(Math.max(difficulty, 1), 4);
    const wordsForDifficulty = this.wordsByDifficulty[validDifficulty];
    
    // Filter out excluded words (case insensitive comparison)
    const excludeWordsUpper = excludeWords.map(w => w.toUpperCase());
    const availableWords = wordsForDifficulty.filter(
      wordObj => !excludeWordsUpper.includes(wordObj.word.toUpperCase())
    );
    
    // If no words are available after filtering, use all words (avoids infinite loop)
    const wordPool = availableWords.length > 0 ? availableWords : wordsForDifficulty;
    
    // Get a random word from the available pool
    const randomIndex = Math.floor(Math.random() * wordPool.length);
    const selectedWord = wordPool[randomIndex];
    
    // Create scrambled version of the word
    const scrambled = this.scrambleWord(selectedWord.word);
    
    return {
      word: selectedWord.word,
      hint: selectedWord.hint,
      scrambled,
    };
  }

  // Get a random quiz question based on difficulty level
  async getRandomQuizQuestion(difficulty: number): Promise<GameQuizQuestion> {
    // Ensure difficulty is valid
    const validDifficulty = Math.min(Math.max(difficulty, 1), 3);
    const questionsForDifficulty = this.quizQuestionsByDifficulty[validDifficulty];
    const randomIndex = Math.floor(Math.random() * questionsForDifficulty.length);
    const selectedQuestion = questionsForDifficulty[randomIndex];
    
    return {
      question: selectedQuestion.question,
      options: selectedQuestion.options,
      difficulty: validDifficulty,
    };
  }

  // Validate if a word exists in our dictionary
  async validateWord(word: string): Promise<boolean> {
    const normalizedWord = word.toUpperCase();
    
    // Check if the word exists in any difficulty level
    for (const difficulty in this.wordsByDifficulty) {
      const found = this.wordsByDifficulty[Number(difficulty)].some(
        item => item.word === normalizedWord
      );
      if (found) return true;
    }
    return false;
  }

  // Validate if an answer is correct for a given question
  async validateQuizAnswer(question: string, answer: string): Promise<boolean> {
    // Search for the question in all difficulty levels
    for (const difficulty in this.quizQuestionsByDifficulty) {
      const questionData = this.quizQuestionsByDifficulty[Number(difficulty)].find(
        item => item.question === question
      );
      if (questionData) {
        return questionData.correctAnswer === answer;
      }
    }
    return false;
  }

  // Get the hint for a specific word
  async getWordHint(word: string): Promise<string | null> {
    const normalizedWord = word.toUpperCase();
    
    // Search for the word in all difficulty levels
    for (const difficulty in this.wordsByDifficulty) {
      const wordData = this.wordsByDifficulty[Number(difficulty)].find(
        item => item.word === normalizedWord
      );
      if (wordData) return wordData.hint;
    }
    return null;
  }

  // Helper function to scramble a word
  private scrambleWord(word: string): string[] {
    const letters = word.split('');
    
    // Fisher-Yates shuffle algorithm
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    // Make sure the scrambled word is not the same as the original
    if (letters.join('') === word) {
      return this.scrambleWord(word); // Try again recursively
    }
    
    return letters;
  }
}

export const storage = new MemStorage();
