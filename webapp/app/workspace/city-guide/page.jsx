"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useChat } from "@/lib/useChat";
import { SearchInput, ChatSheet } from "@/lib/chatComponents";
import { destinations } from "@/lib/cityGuideData";

export default function HomePage() {
  const {
    searchQuery,
    setSearchQuery,
    isSheetOpen,
    setIsSheetOpen,
    chatResponse,
    isLoading,
    followUpQuery,
    setFollowUpQuery,
    handleSearch,
    handleFollowUpSearch,
  } = useChat();

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
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />

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
      <ChatSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        searchQuery={searchQuery}
        chatResponse={chatResponse}
        isLoading={isLoading}
        followUpQuery={followUpQuery}
        setFollowUpQuery={setFollowUpQuery}
        onFollowUpSearch={handleFollowUpSearch}
      />
    </div>
  );
}
