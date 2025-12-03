import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL_FLASH, ALL_CATEGORIES } from '../constants';
import { AICategorizationResult } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const categoryNames = ALL_CATEGORIES.map(c => c.name).join(', ');

// Helper to clean JSON string if model returns markdown blocks
const cleanJsonString = (text: string) => {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  return clean;
};

export const parseNaturalLanguageTransaction = async (text: string): Promise<AICategorizationResult | null> => {
  try {
    const prompt = `
      Analyze the following transaction text and extract structured data.
      Available Categories: ${categoryNames}.
      If the category is not clear, choose '其他' (Other).
      Current Date: ${new Date().toISOString().split('T')[0]}.
      
      Text: "${text}"
      
      Return a JSON object strictly.
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['expense', 'income'] },
            date: { type: Type.STRING, description: "YYYY-MM-DD format" }
          },
          required: ["amount", "category", "type", "description"]
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) return null;
    return JSON.parse(jsonStr) as AICategorizationResult;
  } catch (error) {
    console.error("Error parsing NL transaction:", error);
    return null;
  }
};

export const analyzeReceiptImage = async (base64Image: string): Promise<AICategorizationResult | null> => {
  try {
    const prompt = `
      Analyze this receipt image. Extract the total amount, guess the category based on items, and provide a short description (e.g., merchant name).
      Available Categories: ${categoryNames}.
      Default to 'expense' type.
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['expense', 'income'] },
            date: { type: Type.STRING, description: "YYYY-MM-DD format, infer from receipt or use today" }
          },
          required: ["amount", "category", "type", "description"]
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) return null;
    return JSON.parse(jsonStr) as AICategorizationResult;
  } catch (error) {
    console.error("Error analyzing receipt:", error);
    return null;
  }
};

export const getFinancialAdvice = async (transactions: any[]): Promise<string> => {
  try {
    // Limit transactions to save tokens if list is huge
    const recentTx = transactions.slice(0, 50);
    const prompt = `
      You are a financial assistant for the app "文须记".
      Analyze these recent transactions and provide brief, friendly, encouraging, or cautionary advice in Chinese (Simpified).
      Keep it under 100 words.
      
      Transactions: ${JSON.stringify(recentTx)}
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: prompt,
    });

    return response.text || "暂无建议";
  } catch (error) {
    console.error("Error getting advice:", error);
    return "无法获取建议，请稍后再试。";
  }
};
