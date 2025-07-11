"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Paperclip, ArrowUp, ChevronRight } from "lucide-react";
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSheetOpen(true);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setChatResponse(`Based on your query about "${searchQuery}", here are some travel recommendations:

Barcelona is an excellent destination for travelers interested in unique architecture, vibrant culture, and Mediterranean cuisine. The city offers a perfect blend of historic charm and modern amenities.

Key highlights include:
• Sagrada Familia - Gaudí's masterpiece cathedral
• Park Güell - Whimsical mosaic park with city views  
• Las Ramblas - Famous pedestrian street
• Gothic Quarter - Medieval streets and architecture
• Barceloneta Beach - Urban beach experience

Best time to visit: May-June and September-October for pleasant weather and fewer crowds.`);
      setIsLoading(false);
    }, 2000);
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
                    className="w-full pl-12 pr-16 py-4 text-base border-0 rounded-xl focus:ring-0 focus:border-0 bg-transparent"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />

                  {/* Left Icons */}
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Right Icons */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <Button
                      size="sm"
                      onClick={handleSearch}
                      className="w-6 h-6 p-0 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded"
                    >
                      <ArrowUp className="w-3 h-3" />
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
      </div>

      {/* Chat Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[600px] overflow-y-auto border-l"
        >
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="flex items-center space-x-2 text-left">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span>Travel Assistant</span>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900 mb-2">Your Question:</p>
              <p className="text-gray-700">"{searchQuery}"</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              chatResponse && (
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed text-sm">
                      {chatResponse}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-900 mb-3">
                      Sources:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-blue-600">
                            1
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Barcelona Travel Guide
                          </p>
                          <p className="text-xs text-gray-600">Lonely Planet</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-blue-600">
                            2
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Barcelona Tourism Board
                          </p>
                          <p className="text-xs text-gray-600">
                            Official Guide
                          </p>
                        </div>
                      </div>
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
