import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WordData, QuizResult } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

const wordAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    phonetics: {
      type: Type.OBJECT,
      properties: {
        ipa: { type: Type.STRING, description: "Standard IPA transcription" },
        syllables: { type: Type.STRING, description: "Word broken by syllables, e.g., am-BIG-yu-us" },
        tip: { type: Type.STRING, description: "Pronunciation tip in English, e.g., Rhymes with..." }
      },
      required: ["ipa", "syllables", "tip"]
    },
    etymology: {
      type: Type.OBJECT,
      properties: {
        rootAnalysis: { type: Type.STRING, description: "Prefix + Root + Suffix breakdown" },
        story: { type: Type.STRING, description: "The origin story in SIMPLIFIED CHINESE. Engaging, storytelling style." }
      },
      required: ["rootAnalysis", "story"]
    },
    cognates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          connection: { type: Type.STRING, description: "Brief explanation of connection in SIMPLIFIED CHINESE" }
        },
        required: ["word", "connection"]
      }
    },
    usage: {
      type: Type.OBJECT,
      properties: {
        synonyms: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              context: { type: Type.STRING, description: "Usage context in SIMPLIFIED CHINESE" }
            },
            required: ["word", "context"]
          }
        },
        antonyms: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        examples: {
          type: Type.OBJECT,
          properties: {
            literature: { 
              type: Type.OBJECT,
              properties: {
                quote: { type: Type.STRING, description: "Quote from classic literature in English" },
                author: { type: Type.STRING, description: "Name of the author" },
                source: { type: Type.STRING, description: "Title of the book/work" }
              },
              required: ["quote", "author", "source"]
            },
            modern: { 
              type: Type.OBJECT,
               properties: {
                quote: { type: Type.STRING, description: "Quote from movie/TV/song in English" },
                source: { type: Type.STRING, description: "Title of the movie/show/song" }
              },
              required: ["quote", "source"]
            }
          },
          required: ["literature", "modern"]
        }
      },
      required: ["synonyms", "antonyms", "examples"]
    }
  },
  required: ["word", "phonetics", "etymology", "cognates", "usage"]
};

const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isCorrect: { type: Type.BOOLEAN },
    feedback: { type: Type.STRING, description: "Feedback in SIMPLIFIED CHINESE regarding the meaning." },
    etymologyNote: { type: Type.STRING, description: "Etymological explanation in SIMPLIFIED CHINESE." }
  },
  required: ["isCorrect", "feedback", "etymologyNote"]
};

export const analyzeWord = async (word: string): Promise<WordData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the English word: "${word}". 
      You are LexiconMaster, an expert English tutor.
      
      REQUIREMENTS:
      1. Explanations must be in SIMPLIFIED CHINESE (简体中文).
      2. Tone: Engaging, academic but accessible.
      3. Examples and IPA must be in ENGLISH.
      4. For Literature examples, you MUST provide the specific Author and Book Title.
      5. Follow the strict JSON schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: wordAnalysisSchema,
        temperature: 0.3,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as WordData;
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Error analyzing word:", error);
    throw error;
  }
};

export const evaluateQuizAnswer = async (targetWord: string, userAnswer: string): Promise<QuizResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The target word is "${targetWord}". The user defined it as: "${userAnswer}".
      Evaluate if the user understands the core meaning.
      Provide feedback in SIMPLIFIED CHINESE (简体中文).
      Crucial: Use the word's etymology (roots) to explain why they are right or wrong.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizResult;
    }
    throw new Error("No evaluation returned");
  } catch (error) {
    console.error("Error evaluating quiz:", error);
    throw error;
  }
};