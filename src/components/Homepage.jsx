"use client";

import { useState } from "react";
import { LuBotMessageSquare } from "react-icons/lu";

export default function Homepage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); 

  const toggleChat = () => 
  {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async () => 
  {
    if (!input.trim())
    {
      return; 
    }

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try 
    {
      const response = await fetch("/api/chat", 
      {
        method: "POST",
        headers: 
        {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (response.ok) 
      {
        const aiMessage = { text: data.reply, sender: "ai" };
        setMessages((prev) => [...prev, aiMessage]);
      }
      else 
      {
        const errorMessage = 
        {
          text: data.error || "Failed to get a response. Please try again.",
          sender: "ai",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } 
    catch (error) 
    {
      console.error("Error sending message:", error);
      const errorMessage = 
      {
        text: "Something went wrong. Please try again later.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 flex flex-col items-center justify-center p-4 sm:p-6 relative">

      <div className="text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">Welcome to Our Astrology Hub</h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">Your cosmic guide is here to help with zodiac insights, horoscope tips, or astrological queries! Tap the chat icon to explore the stars!</p>
      </div>

      {isChatOpen 
      && 
      (
        <div className="fixed bottom-20 right-6 w-80 sm:w-[400px] h-[450px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-pop-up">

          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-2xl">
            <h2 className="text-lg font-semibold">Cosmic Guide</h2>
            <button onClick={toggleChat} className="text-white hover:text-gray-200 focus:outline-none">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
            {messages.length === 0 
            ? 
            (
              <p className="text-gray-500 text-sm text-center">
                Ask about zodiac signs, horoscopes, or astrological tips!
              </p>
            ) 
            : 
            (
              messages.map((msg, index) => 
              (
                <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl ${ msg.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800" }`}>{msg.text}</div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Ask about zodiac signs, compatibility, or cosmic tips!" className="flex-1 p-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-gray-800" />
              <button onClick={handleSendMessage} className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200" >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" >
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>

        </div>
      )}

      <button onClick={toggleChat} className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 z-50" >
        <LuBotMessageSquare style={{ height: "30px", width: "30px" }} />
      </button>
      
    </div>
  );
}