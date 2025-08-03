import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Send, Bot, User, MapPin, Clock, Star, TrendingUp, MessageCircle, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { renderFormattedText } from "./chat.js";
import { useState, useEffect, useRef } from "react";

/**
 * Advanced Search Input Component with AI suggestions
 */
export function AdvancedSearchInput({ 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  placeholder = "Ask about Sri Lankan destinations..." 
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    "Best places to work in Colombo",
    "Cost of living in Kandy",
    "Digital nomad visa requirements",
    "Best time to visit Galle",
    "Coworking spaces in Sri Lanka",
    "Local food recommendations",
    "Transportation options",
    "Safety tips for travelers"
  ];

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    onSearch();
  };

  return (
    <div className="mb-12">
      <div className="relative max-w-2xl mx-auto">
        {/* Main Search Input */}
        <div className="relative border-2 border-gray-200 rounded-2xl bg-white hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="flex items-center p-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <Input
                placeholder={placeholder}
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                className="flex-1 text-lg border-0 focus:ring-0 focus:border-0 bg-transparent placeholder-gray-400"
                onKeyPress={(e) => e.key === "Enter" && onSearch()}
              />
            </div>
            <Button
              size="lg"
              onClick={onSearch}
              disabled={!searchQuery.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              <Send className="w-5 h-5 mr-2" />
              Ask AI
            </Button>
          </div>
        </div>

        {/* AI Suggestions */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50"
            >
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Popular questions</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm text-gray-600 hover:text-gray-900"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-full left-0 mt-2 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>AI is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Advanced Chat Sheet Component with better UI
 */
export function AdvancedChatSheet({
  isOpen,
  onOpenChange,
  searchQuery,
  chatResponse,
  isLoading,
  followUpQuery,
  setFollowUpQuery,
  onFollowUpSearch,
  title = "Sri Lanka Travel Assistant",
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatResponse]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[800px] lg:w-[900px] overflow-hidden border-l bg-gray-50"
      >
        {/* Header */}
        <SheetHeader className="border-b bg-white px-6 py-4">
          <SheetTitle className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-900">{title}</span>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Real-time
                </span>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* User Message */}
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-end"
            >
              <div className="max-w-[80%] bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">You</span>
                </div>
                <p className="text-sm">{searchQuery}</p>
              </div>
            </motion.div>
          )}

          {/* AI Response */}
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </motion.div>
          ) : (
            chatResponse && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">AI Assistant</span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>AI Powered</span>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {renderFormattedText(chatResponse)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Follow-up Input */}
        <AdvancedFollowUpInput
          followUpQuery={followUpQuery}
          setFollowUpQuery={setFollowUpQuery}
          onFollowUpSearch={onFollowUpSearch}
          isLoading={isLoading}
        />
      </SheetContent>
    </Sheet>
  );
}

/**
 * Advanced Follow-up Input Component
 */
export function AdvancedFollowUpInput({
  followUpQuery,
  setFollowUpQuery,
  onFollowUpSearch,
  isLoading,
}) {
  const quickActions = [
    { text: "Tell me more about this", icon: MessageCircle },
    { text: "What are the opening hours?", icon: Clock },
    { text: "How do I get there?", icon: MapPin },
    { text: "What's the price range?", icon: TrendingUp },
    { text: "Show me photos", icon: Star },
    { text: "Best time to visit", icon: Clock },
  ];

  return (
    <div className="border-t bg-white px-6 py-4">
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Ask a follow-up question
        </p>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              onClick={() => setFollowUpQuery(action.text)}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <action.icon className="w-3 h-3" />
              {action.text}
            </motion.button>
          ))}
        </div>

        {/* Input Field */}
        <div className="relative">
          <div className="relative border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 transition-colors">
            <Input
              placeholder="Ask anything else about Sri Lanka..."
              value={followUpQuery}
              onChange={(e) => setFollowUpQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 text-sm border-0 rounded-xl focus:ring-0 focus:border-0 bg-transparent"
              onKeyPress={(e) => e.key === "Enter" && onFollowUpSearch()}
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button
                size="sm"
                onClick={onFollowUpSearch}
                disabled={isLoading || !followUpQuery.trim()}
                className="w-8 h-8 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-300 text-white rounded-lg transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced Loading Spinner Component
 */
export function EnhancedLoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-8 h-8 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
} 