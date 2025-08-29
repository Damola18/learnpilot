import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Target,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  Mic,
  Paperclip,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: string;
  type: "user" | "mentor";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "mentor",
    content: "Hello Damola! 👋 I'm your AI learning mentor. I'm here to help you on your learning journey. I can see you're making great progress on your React Advanced Concepts path - you're 65% complete! How can I assist you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    suggestions: [
      "Help me understand React hooks better",
      "What should I learn next?",
      "Review my progress",
      "Suggest practice projects"
    ]
  },
  {
    id: "2",
    type: "user",
    content: "I'm struggling with useEffect and its dependencies. Can you help me understand when to include dependencies and when not to?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: "3",
    type: "mentor",
    content: "Great question! useEffect dependencies are crucial for preventing bugs and optimizing performance. Here's the key principle: **include every value from component scope that's used inside the effect**.\n\n**When to include dependencies:**\n• State variables (from useState)\n• Props\n• Functions defined in the component\n• Any computed values\n\n**Example:**\n```javascript\nconst [count, setCount] = useState(0);\nconst [name, setName] = useState('');\n\nuseEffect(() => {\n  // Using count, so include it in dependencies\n  document.title = `Count: ${count}`;\n}, [count]); // ✅ Correct\n```\n\nWould you like me to show you more examples or explain any specific scenarios you're facing?",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    suggestions: [
      "Show me more useEffect examples",
      "What about cleanup functions?",
      "Custom hooks with useEffect",
      "Common useEffect mistakes"
    ]
  }
];

const quickActions = [
  {
    icon: BookOpen,
    title: "Review Current Module",
    description: "Get help with React Hooks Deep Dive",
    action: "review-module"
  },
  {
    icon: Target,
    title: "Set Learning Goals",
    description: "Plan your next learning objectives",
    action: "set-goals"
  },
  {
    icon: TrendingUp,
    title: "Progress Insights",
    description: "Analyze your learning patterns",
    action: "progress-insights"
  },
  {
    icon: Lightbulb,
    title: "Get Recommendations",
    description: "Discover new learning paths",
    action: "recommendations"
  }
];

export default function Mentor() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const mentorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "mentor",
        content: "I understand your question! Let me provide you with a detailed explanation and some practical examples that will help clarify this concept. Based on your current progress and learning style, I think this approach will work best for you...",
        timestamp: new Date(),
        suggestions: [
          "Can you explain this further?",
          "Show me a practical example",
          "What's the next step?",
          "Quiz me on this topic"
        ]
      };
      setMessages(prev => [...prev, mentorResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      "review-module": "Can you help me review the current module I'm working on? I'd like to understand the key concepts better.",
      "set-goals": "I want to set some new learning goals. Can you help me plan what to learn next?",
      "progress-insights": "Can you analyze my learning progress and give me insights on how I'm doing?",
      "recommendations": "What would you recommend I learn next based on my current progress and interests?"
    };
    
    handleSendMessage(actionMessages[action as keyof typeof actionMessages] || "");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-muted/20 p-6 space-y-6">
        {/* Mentor Info */}
        <Card className="border-0 bg-primary text-white">
          <CardContent className="p-6 text-center dark:text-black">
            <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Learning Mentor</h3>
            <p className="text-sm opacity-90">
              Your personalized guide to mastering new skills
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Quick Actions</h4>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.action}
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-accent"
                onClick={() => handleQuickAction(action.action)}
              >
                <action.icon className="w-5 h-5 mr-3 text-primary" />
                <div className="text-left">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Current Context */}
        <Card className="border-0 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Active Path</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                React Advanced Concepts - Module 8/12
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Recent Activity</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Completed "React Hooks Deep Dive" 2 hours ago
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Learning Streak</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                7 days - Keep it up! 🔥
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-border p-4 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-primary text-white">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">AI Learning Mentor</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "mentor" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-primary text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] space-y-2 ${
                    message.type === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-lg p-4 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.type === "mentor" && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Quick replies:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {message.type === "user" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-accent">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-primary text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-background">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your mentor anything..."
                className="pr-12"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Your mentor remembers your learning progress and adapts to your style
          </p>
        </div>
      </div>
    </div>
  );
}