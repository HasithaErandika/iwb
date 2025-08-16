"use client";

import { motion } from "framer-motion";
import { ChevronRight, Sparkles, MapPin, Clock, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useChat } from "@/lib/useChat";
import { AdvancedSearchInput, AdvancedChatSheet } from "@/lib/advancedChatComponents";
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

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Advanced AI assistant for personalized recommendations"
    },
    {
      icon: MapPin,
      title: "Local Insights",
      description: "Discover hidden gems and local favorites"
    },
    {
      icon: Clock,
      title: "Real-time Info",
      description: "Get up-to-date information about destinations"
    },
    {
      icon: Star,
      title: "Curated Content",
      description: "Hand-picked recommendations from experts"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Sri Lanka City Guide
              </span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover the perfect destinations for digital nomads in Sri Lanka.
            Get personalized recommendations, local insights, and everything you need to plan your adventure.
          </motion.p>
        </div>

        {/* Advanced Search Input */}
        <AdvancedSearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Ask about Sri Lankan destinations, culture, or travel tips..."
        />

        {/* Features Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Trending Destinations */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Popular Destinations
              </h2>
              <p className="text-gray-600">
                Discover the most loved cities by digital nomads
              </p>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Trending</span>
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
        </Link>
      </motion.div>
            ))}
    </div>
        </motion.section >

    {/* Call to Action */ }
    < motion.section
  className = "text-center mt-16"
  initial = {{ opacity: 0, y: 40 }
}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.8, duration: 0.6 }}
        >
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
    <h2 className="text-3xl font-bold mb-4">
      Ready to Explore Sri Lanka?
    </h2>
    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
      Ask our AI assistant anything about Sri Lankan destinations, culture,
      travel tips, or digital nomad life. Get personalized recommendations
      tailored to your preferences.
    </p>
    <Button
      onClick={handleSearch}
      className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-200"
    >
      <Sparkles className="w-5 h-5 mr-2" />
      Start Your Journey
    </Button>
  </div>
        </motion.section >
      </div >

  {/* Advanced Chat Sheet */ }
  < AdvancedChatSheet
isOpen = { isSheetOpen }
onOpenChange = { setIsSheetOpen }
searchQuery = { searchQuery }
chatResponse = { chatResponse }
isLoading = { isLoading }
followUpQuery = { followUpQuery }
setFollowUpQuery = { setFollowUpQuery }
onFollowUpSearch = { handleFollowUpSearch }
title = "Sri Lanka Travel Assistant"
  />
    </div >
  );
}
