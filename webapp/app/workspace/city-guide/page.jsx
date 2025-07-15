"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Paperclip,
  ArrowRightCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";

const destinations = [
  {
    id: "colombo",
    name: "Colombo",
    description: "Commercial capital, colonial heritage",
    image: "/images/cmb.avif",
  },
  {
    id: "kurunegala",
    name: "Kurunegala",
    description: "Ancient kingdom, elephant rock",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "kandy",
    name: "Kandy",
    description: "Cultural capital, sacred temple",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "galle",
    name: "Galle",
    description: "Dutch fort, coastal charm",
    image: "/placeholder.svg?height=200&width=300",
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [chatResponse, setChatResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSheetOpen(true);
    setIsLoading(true);
    setChatResponse("");

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: searchQuery.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message || "Failed to get response");
      }

      // Format the response to be more informative like Perplexity AI
      const formattedResponse = formatPerplexityResponse(data, searchQuery);
      setChatResponse(formattedResponse);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setChatResponse(`Sorry, I encountered an error while processing your request: "${searchQuery}". Please try again later.

Error details: ${error.message}

In the meantime, here are some general travel tips:
• Check visa requirements for your destination
• Research local customs and etiquette
• Consider travel insurance
• Pack according to the climate and activities planned`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpSearch = async () => {
    if (!followUpQuery.trim()) return;

    setIsLoading(true);
    const currentFollowUp = followUpQuery.trim();
    setFollowUpQuery("");

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentFollowUp,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message || "Failed to get response");
      }

      // Format the response
      const formattedResponse = formatPerplexityResponse(data, currentFollowUp);
      setChatResponse(formattedResponse);

      // Update current query display
      setSearchQuery(currentFollowUp);
    } catch (error) {
      console.error("Error fetching follow-up response:", error);
      setChatResponse(`Sorry, I encountered an error while processing your follow-up question: "${currentFollowUp}". Please try again.

Error details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPerplexityResponse = (data, query) => {
    // Extract and format the response data similar to Perplexity AI style
    let formattedText = "";

    if (data.answer) {
      formattedText = data.answer;
    } else if (data.content) {
      formattedText = data.content;
    } else if (data.response) {
      formattedText = data.response;
    } else {
      formattedText = JSON.stringify(data, null, 2);
    }

    // Return the formatted text as is, since it's already well-structured
    return formattedText;
  };

  const renderFormattedText = (text) => {
    // Split text into lines and process each line
    const lines = text.split("\n");

    return lines.map((line, index) => {
      // Handle different line types
      if (line.trim() === "") {
        return <br key={index} />;
      }

      // Process bold text (**text**)
      const processedLine = line.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      );

      // Handle bullet points and list items
      if (line.trim().startsWith("- **")) {
        return (
          <div key={index} className="mb-4">
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: processedLine }}
            />
          </div>
        );
      } else if (line.trim().startsWith("- ")) {
        return (
          <div key={index} className="mb-2 ml-4">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: processedLine }}
            />
          </div>
        );
      } else if (line.trim().startsWith("•")) {
        return (
          <div key={index} className="mb-2 ml-4">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: processedLine }}
            />
          </div>
        );
      } else {
        return (
          <div key={index} className="mb-2">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: processedLine }}
            />
          </div>
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-2xl font-normal text-gray-900">
              City Guide
            </span>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search Input */}
            <div className="mb-12">
              <div className="relative max-w-2xl">
                <div className="relative border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors">
                  <Input
                    placeholder="Ask anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-16 py-5 text-base border-0 rounded-xl focus:ring-0 focus:border-0 bg-transparent"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />

                  {/* Left Icons */}
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Right Icons */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={handleSearch}
                      className="w-8 h-8 p-0 bg-black hover:bg-black hover:cursor-pointer text-white rounded-lg"
                    >
                      <ArrowRight className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Destinations */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-gray-900">
                  Trending Destinations
                </h2>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {destinations.map((destination) => (
                  <Link
                    key={destination.id}
                    href={`/workspace/city-guide/${destination.id}`}
                  >
                    <motion.div className="flex-shrink-0 w-64 cursor-pointer group">
                      <div className="relative overflow-hidden rounded-lg mb-3 aspect-square">
                        <Image
                          src={destination.image || "/placeholder.svg"}
                          alt={destination.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover "
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {destination.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {destination.description}
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Chat Sheet */}{" "}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[2800px] lg:w-[2800px] overflow-y-auto border-l px-4 py-2 scrollbar-w-1 scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300"
        >
          <SheetHeader className="border-b pb-4 mb-2">
            <SheetTitle className="flex items-center space-x-2 text-left">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span>Travel Assistant</span>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-1 space-y-6 pb-8">
            <div className="p-4 bg-orange-200 rounded-lg">
              <p className="text-gray-700 font-semibold">{searchQuery}</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              chatResponse && (
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="text-sm">
                      {renderFormattedText(chatResponse)}
                    </div>
                  </div>

                  {/* Follow-up Question Input */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-3">
                        Ask a follow-up question
                      </p>
                      <div className="relative">
                        <div className="relative border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors">
                          <Input
                            placeholder="Ask anything else..."
                            value={followUpQuery}
                            onChange={(e) => setFollowUpQuery(e.target.value)}
                            className="w-full pl-4 pr-12 py-3 text-sm border-0 rounded-lg focus:ring-0 focus:border-0 bg-transparent"
                            onKeyPress={(e) => e.key === "Enter" && handleFollowUpSearch()}
                            disabled={isLoading}
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <Button
                              size="sm"
                              onClick={handleFollowUpSearch}
                              disabled={isLoading || !followUpQuery.trim()}
                              className="w-7 h-7 p-0 bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-md transition-colors"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFollowUpQuery("Tell me more about this")}
                        disabled={isLoading}
                        className="text-xs px-3 py-1 h-auto border-gray-300 hover:bg-gray-50"
                      >
                        Tell me more
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFollowUpQuery("What are the opening hours?")}
                        disabled={isLoading}
                        className="text-xs px-3 py-1 h-auto border-gray-300 hover:bg-gray-50"
                      >
                        Opening hours
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFollowUpQuery("How do I get there?")}
                        disabled={isLoading}
                        className="text-xs px-3 py-1 h-auto border-gray-300 hover:bg-gray-50"
                      >
                        Directions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFollowUpQuery("What's the price range?")}
                        disabled={isLoading}
                        className="text-xs px-3 py-1 h-auto border-gray-300 hover:bg-gray-50"
                      >
                        Price range
                      </Button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
