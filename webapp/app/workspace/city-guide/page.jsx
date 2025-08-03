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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/workspace/city-guide/${destination.id}`}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {destination.name}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <p className="text-gray-600 mb-4">
                        {destination.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Popular destination
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Year-round
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="text-center mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
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
        </motion.section>
      </div>

      {/* Advanced Chat Sheet */}
      <AdvancedChatSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        searchQuery={searchQuery}
        chatResponse={chatResponse}
        isLoading={isLoading}
        followUpQuery={followUpQuery}
        setFollowUpQuery={setFollowUpQuery}
        onFollowUpSearch={handleFollowUpSearch}
        title="Sri Lanka Travel Assistant"
      />
    </div>
  );
}
