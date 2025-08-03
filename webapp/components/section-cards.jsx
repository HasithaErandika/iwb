import { Search, MapPin, Map, Briefcase, Users, Calendar, TrendingUp, Star } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export function SectionCards() {
  const sections = [
    {
      title: "Search for Jobs",
      description: "Browse curated remote job opportunities from companies actively hiring in Sri Lanka. We vet all listings to ensure quality.",
      icon: Briefcase,
      href: "/workspace/jobs",
      stats: "2,847+ jobs",
      color: "blue",
      features: ["Remote positions", "Vetted companies", "Competitive salaries", "Flexible schedules"]
    },
    {
      title: "Find Places to Work",
      description: "Discover the best coworking spaces, cafes, and accommodation options for digital nomads across Sri Lanka.",
      icon: MapPin,
      href: "/workspace/places",
      stats: "156+ places",
      color: "green",
      features: ["Coworking spaces", "Cafes with WiFi", "Accommodation", "Reviews & ratings"]
    },
    {
      title: "City Guide & AI Assistant",
      description: "Get personalized recommendations and insights about Sri Lankan cities. Powered by advanced AI technology.",
      icon: Map,
      href: "/workspace/city-guide",
      stats: "AI-powered",
      color: "purple",
      features: ["Travel tips", "Local insights", "Cost estimates", "Interactive chat"]
    },
    {
      title: "Join Meetups & Community",
      description: "Connect with fellow digital nomads, attend events, and build your network in Sri Lanka.",
      icon: Users,
      href: "/workspace/meetups",
      stats: "89+ events",
      color: "orange",
      features: ["Networking events", "Skill sharing", "Social activities", "Community support"]
    }
  ];

  return (
    <div className="px-8 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-12">
          {/* Header Section */}
          <div className="text-left lg:w-1/3 mb-8 lg:mb-0 lg:pr-8 pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-600">Growing Community</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                CeylonNomad
              </h1>
              <p className="text-xl text-gray-700 mb-4">
                Start your Nomad Journey
              </p>
              <p className="text-gray-600 text-base mt-0 pt-0">
                Your comprehensive platform for discovering remote work opportunities, finding the perfect places to work, and connecting with the digital nomad community in Sri Lanka.
              </p>
            </motion.div>
          </div>

          {/* Stats Section */}
          <div className="lg:w-2/3">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2,847+</div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">156+</div>
                <div className="text-sm text-gray-600">Places Listed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">1,234+</div>
                <div className="text-sm text-gray-600">Nomads</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">89+</div>
                <div className="text-sm text-gray-600">Meetups</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-${section.color}-100 rounded-lg flex items-center justify-center`}>
                    <section.icon className={`w-6 h-6 text-${section.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{section.stats}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {section.description}
              </p>

              {/* Features List */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-2">
                  {section.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 bg-${section.color}-400 rounded-full`}></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className={`w-full bg-white border-2 border-${section.color}-200 hover:border-${section.color}-400 text-${section.color}-600 font-medium py-3 px-4 rounded-xl hover:bg-${section.color}-50 transition-all duration-200`}
                onClick={() => window.location.href = section.href}
              >
                Explore {section.title}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of digital nomads who have already discovered the perfect work-life balance in Sri Lanka. 
            Start exploring today and find your ideal remote work setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = "/workspace/jobs"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-xl"
            >
              Find Your Next Job
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/workspace/places"}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg rounded-xl"
            >
              Discover Places
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
