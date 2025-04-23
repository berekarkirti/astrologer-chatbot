import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) 
{
  try 
  {
    const { message } = await req.json();

    if (!message) 
    {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const safePrompt = `
      You are an astrology information assistant for a website. Provide general, non-predictive information about astrology topics such as zodiac signs, horoscopes, astrological compatibility, planetary influences, or wellness tips inspired by astrology. When relevant, incorporate the following wellness tips: practice mindfulness through meditation or journaling to align with cosmic energies, maintain balance by spending time in nature, prioritize self-care to enhance emotional well-being, and stay open to universal signs through reflection. Do not provide personal predictions, life advice, or specific future outcomes. Ensure responses are clear, accurate, and suitable for a general audience. If the query is not astrology-related, politely redirect the user to ask an astrology question. User query: ${message}
    `;

    const result = await model.generateContent(safePrompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/(\*\*|__|\*|_)/g, "");

    return NextResponse.json({ reply: text });
  } 
  catch (error) 
  {
    console.error("Error in astrology API:", error);
    return NextResponse.json({ error: "Something went wrong while processing your request" },{ status: 500 }
    );
  }
}