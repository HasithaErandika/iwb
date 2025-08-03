"use client";

import { SignOutButton } from "@/components/sign-out-button";
import { SessionProvider } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, MapPin, Users, Briefcase, Calendar, TrendingUp, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signInAction, signUpAction } from "./actions";
import { useState } from "react";

export default function HomeClient({ session }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Statistics data
  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "2,847", change: "+12%" },
    { icon: MapPin, label: "Places Listed", value: "156", change: "+8%" },
    { icon: Users, label: "Nomads", value: "1,234", change: "+15%" },
    { icon: Calendar, label: "Meetups", value: "89", change: "+23%" },
  ];

  // Featured destinations
  const featuredDestinations = [
    {
      name: "Colombo",
      description: "Commercial capital with modern coworking spaces",
      image: "/images/cmb.avif",
      rating: 4.8,
      jobs: 456,
    },
    {
      name: "Kandy",
      description: "Cultural hub with scenic mountain views",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.6,
      jobs: 234,
    },
    {
      name: "Galle",
      description: "Coastal charm with historic Dutch fort",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.7,
      jobs: 189,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to workspace with search query
      window.location.href = `/workspace?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Join 1,234+ digital nomads in Sri Lanka
                </motion.div>

                <motion.h1
                  className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Work from Paradise,{" "}
                  <span className="text-blue-600">Explore Sri Lanka</span>
                </motion.h1>

                <motion.p
                  className="text-gray-700 text-xl leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Your all-in-one digital nomad hub. Find remote jobs, discover amazing places to work, connect with the community, and plan your perfect Sri Lankan adventure.
                </motion.p>

                {/* Search Bar */}
                <motion.form
                  onSubmit={handleSearch}
                  className="relative max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search jobs, places, or destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                    />
                    <Button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      Search
                    </Button>
                  </div>
                </motion.form>

                {/* Authentication buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  {!session ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <form action={signInAction}>
                        <Button
                          variant="ghost"
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 text-lg rounded-xl transition-colors duration-200"
                        >
                          Sign In
                        </Button>
                      </form>
                      <form action={signUpAction}>
                        <Button
                          variant="outline"
                          type="submit"
                          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-8 py-4 text-lg rounded-xl transition-colors duration-200"
                        >
                          Sign Up
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={() => (window.location.href = "/workspace")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 text-lg rounded-xl transition-colors duration-200"
                      >
                        Go to Workspace
                      </Button>
                      <SignOutButton />
                    </div>
                  )}
                </motion.div>
              </motion.div>

              {/* Right Content - Hero Image */}
              <motion.div
                className="relative flex justify-center lg:justify-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <div className="relative w-96 h-96 lg:w-[500px] lg:h-[500px]">
                  <Image
                    src="/images/hero.avif"
                    alt="Paradise landscape"
                    fill
                    className="object-cover rounded-2xl shadow-2xl"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <motion.section
          className="py-16 bg-white"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Growing Community
              </h2>
              <p className="text-gray-600 text-lg">
                Join thousands of digital nomads discovering Sri Lanka
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 mb-1">{stat.label}</div>
                  <div className="text-green-600 text-sm font-medium">
                    {stat.change}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Featured Destinations */}
        <motion.section
          className="py-16 bg-gray-50"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Destinations
              </h2>
              <p className="text-gray-600 text-lg">
                Discover the best cities for digital nomads in Sri Lanka
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDestinations.map((destination, index) => (
                <motion.div
                  key={destination.name}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
                >
                  <div className="relative h-48">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {destination.name}
                      </h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-600 ml-1">
                          {destination.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{destination.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {destination.jobs} jobs available
                      </span>
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        onClick={() => window.location.href = `/workspace/city-guide/${destination.name.toLowerCase()}`}
                      >
                        Explore
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Quick Actions Section */}
        <motion.section
          className="py-16 bg-white"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get Started
              </h2>
              <p className="text-gray-600 text-lg">
                Everything you need to start your digital nomad journey
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Find Remote Jobs</h3>
                <p className="text-gray-600 mb-6">
                  Browse curated remote job opportunities from companies actively hiring in Sri Lanka
                </p>
                <Button
                  onClick={() => window.location.href = "/workspace/jobs"}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Browse Jobs
                </Button>
              </motion.div>

              <motion.div
                className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Discover Places</h3>
                <p className="text-gray-600 mb-6">
                  Find the best coworking spaces, cafes, and accommodation for digital nomads
                </p>
                <Button
                  onClick={() => window.location.href = "/workspace/places"}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Explore Places
                </Button>
              </motion.div>

              <motion.div
                className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9, duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Join Community</h3>
                <p className="text-gray-600 mb-6">
                  Connect with fellow nomads, attend meetups, and build your network
                </p>
                <Button
                  onClick={() => window.location.href = "/workspace/meetups"}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Join Meetups
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-8 px-6 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
                <span className="text-gray-300">
                  Built for{" "}
                  <a
                    href="https://innovatewithballerina.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Innovate with Ballerina 2025
                  </a>
                </span>
                <span className="text-gray-300">
                  Source code on{" "}
                  <a
                    href="https://github.com/chamals3n4/iwb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Github
                  </a>
                </span>
              </div>
              <div className="text-gray-400 text-sm">
                © 2025 CeylonNomad. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SessionProvider>
  );
}
