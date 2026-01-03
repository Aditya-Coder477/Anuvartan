"use client"

import { Button, cn } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Paperclip, Send } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

type Message = {
  id: string
  role: "bot" | "user"
  content: string
  type: "text" | "image"
  imageUrl?: string
}

export function ChatInterface() {
  // Manual Identity State (Restored)
  const [isIdentified, setIsIdentified] = useState(false)
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! Please say 'Hi' to start your daily check-in.",
      type: "text",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleIdentification = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userName.trim()) return;

      // Use a consistent ID generation or ask for ID. 
      // For demo, we can generate one or let them type it.
      // Let's use name-based generation for simplicity or just a random one.
      // User might want to match seeded data (P-2026-001 etc)
      // We will assume they type their name, and we generate a session ID.
      // ideally we should let them pick a patient ID for the demo context.
      
      const generatedId = `patient-${Date.now()}`;
      setUserId(generatedId);
      setIsIdentified(true);
      
      // Register/Login with Backend
      try {
          await fetch("/api/patient/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  userId: generatedId,
                  name: userName,
                  age: 40, 
                  condition: "General Checkup" 
              })
          });
      } catch (err) {
          console.error("Login sync failed", err);
      }
  }


  const handleSendMessage = async (text: string, file?: File) => {
    if ((!text.trim() && !file) || isLoading) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      type: file ? "image" : "text",
      imageUrl: file ? URL.createObjectURL(file) : undefined,
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("userId", userId) // Use manual ID
      formData.append("message", text || (file ? "Uploaded image" : ""))
      if (file) {
        formData.append("image", file)
      }

      const res = await fetch("/api/chat/message", {
        method: "POST",
        body: formData,
      })
      
      const data = await res.json()
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.response || "Sorry, I didn't understand that.",
        type: "text",
      }
      
      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "Sorry, connection error. Please try again.",
          type: "text",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage(input)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSendMessage("", e.target.files[0])
    }
  }

  if (!isIdentified) {
      return (
          <div className="flex flex-col h-screen max-w-md mx-auto bg-white p-6 shadow-xl justify-center">
              <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 rounded-full bg-teal-600 animate-pulse" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800">Welcome to Anuvartan</h1>
                  <p className="text-slate-500">Please identify yourself to connect with your doctor.</p>
              </div>
              <form onSubmit={handleIdentification} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <Input 
                        placeholder="e.g. Aditi Sharma" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full"
                        autoFocus
                      />
                  </div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg" disabled={!userName.trim()}>
                      Start Check-in
                  </Button>
                  {/* Text Removed */}
              </form>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 border-x border-slate-200 shadow-xl">
      {/* Header */}
      <div className="bg-teal-600 p-4 text-white shadow-md z-10 flex justify-between items-center">
        <div>
            <h1 className="text-lg font-semibold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            MediBot Assistant
            </h1>
            <p className="text-teal-100 text-xs">Helping {userName}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3 shadow-sm",
                msg.role === "user"
                  ? "bg-teal-600 text-white rounded-br-none"
                  : "bg-white text-slate-800 rounded-bl-none border border-slate-100",
                msg.type === "image" && "p-1 overflow-hidden"
              )}
            >
              {msg.type === "image" && msg.imageUrl ? (
                <img
                  src={msg.imageUrl}
                  alt="User upload"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <p className="leading-relaxed">{msg.content}</p>
              )}
              
              {/* Status Card Overlay */}
              {msg.role === 'bot' && msg.content.includes("Risk Score") && (
                <div className={`mt-3 p-3 rounded-lg border-l-4 ${msg.content.includes("High Protocol") || msg.content.includes("Status: High") ? "bg-red-50 border-red-500" : "bg-green-50 border-green-500"}`}>
                   <h4 className={`font-bold text-sm ${msg.content.includes("High") ? "text-red-700" : "text-green-700"}`}>
                      {msg.content.includes("High Protocol") || msg.content.includes("Status: High") ? "⚠️ High Risk Detected" : "✅ Condition Stable"}
                   </h4>
                   <p className="text-xs text-slate-600 mt-1">
                      {msg.content.includes("High") 
                        ? "Doctor has been notified. Please stay calm." 
                        : "No immediate issues found. Keep monitoring."}
                   </p>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 shadow-sm rounded-bl-none flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
              <span className="text-slate-500 text-sm">Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 border-t border-slate-200 flex items-center gap-2">
         <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileSelect}
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-teal-600"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-full bg-slate-100 border-none focus-visible:ring-1 focus-visible:ring-teal-600"
          disabled={isLoading}
        />
        <Button
          variant="default"
          size="icon"
          className="bg-teal-600 hover:bg-teal-700 rounded-full"
          onClick={() => handleSendMessage(input)}
          disabled={isLoading || !input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
