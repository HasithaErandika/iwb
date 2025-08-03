import { useState } from "react";
import { sendChatMessage, formatPerplexityResponse, generateErrorResponse } from "./chat.js";

/**
 * Custom hook for managing chat functionality
 * @returns {Object} - Chat state and functions
 */
export function useChat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [chatResponse, setChatResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState("");

  /**
   * Handle the main search functionality
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSheetOpen(true);
    setIsLoading(true);
    setChatResponse("");

    try {
      const data = await sendChatMessage(searchQuery);
      const formattedResponse = formatPerplexityResponse(data, searchQuery);
      setChatResponse(formattedResponse);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      const errorResponse = generateErrorResponse(searchQuery, error.message);
      setChatResponse(errorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle follow-up questions
   */
  const handleFollowUpSearch = async () => {
    if (!followUpQuery.trim()) return;

    setIsLoading(true);
    const currentFollowUp = followUpQuery.trim();
    setFollowUpQuery("");

    try {
      const data = await sendChatMessage(currentFollowUp);
      const formattedResponse = formatPerplexityResponse(data, currentFollowUp);
      setChatResponse(formattedResponse);
      setSearchQuery(currentFollowUp);
    } catch (error) {
      console.error("Error fetching follow-up response:", error);
      const errorResponse = generateErrorResponse(currentFollowUp, error.message);
      setChatResponse(errorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset chat state
   */
  const resetChat = () => {
    setSearchQuery("");
    setChatResponse("");
    setFollowUpQuery("");
    setIsLoading(false);
    setIsSheetOpen(false);
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    isSheetOpen,
    setIsSheetOpen,
    chatResponse,
    setChatResponse,
    isLoading,
    setIsLoading,
    followUpQuery,
    setFollowUpQuery,
    
    // Functions
    handleSearch,
    handleFollowUpSearch,
    resetChat,
  };
} 