"use client";
import { SectionCards } from "@/components/section-cards";
import { withProtectedRoute } from "@/components/with-protected-component";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Page = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to appropriate section based on search
      const query = searchQuery.toLowerCase();
      if (query.includes("job") || query.includes("work") || query.includes("career")) {
        window.location.href = `/workspace/jobs?search=${encodeURIComponent(searchQuery)}`;
      } else if (query.includes("place") || query.includes("cafe") || query.includes("coworking")) {
        window.location.href = `/workspace/places?search=${encodeURIComponent(searchQuery)}`;
      } else if (query.includes("meetup") || query.includes("event") || query.includes("community")) {
        window.location.href = `/workspace/meetups?search=${encodeURIComponent(searchQuery)}`;
      } else {
        // Default to city guide for general queries
        window.location.href = `/workspace/city-guide?search=${encodeURIComponent(searchQuery)}`;
      }
    }
  };

  const quickActions = [
    {
      title: "Find Jobs",
      description: "Browse remote job opportunities",
      icon: Briefcase,
      href: "/workspace/jobs",
      color: "blue",
    },
    {
      title: "Discover Places",
      description: "Find coworking spaces and cafes",
      icon: MapPin,
      href: "/workspace/places",
      color: "green",
    },
    {
      title: "Join Meetups",
      description: "Connect with the community",
      icon: Users,
      href: "/workspace/meetups",
      color: "purple",
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-6 md:gap-8 md:py-8">
      {/* Search Section */}
      {searchQuery && (
        <div className="px-8 py-4 bg-blue-50 rounded-lg mx-8">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Search Results for: "{searchQuery}"
            </h3>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Refine your search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                Search
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <div
                key={action.title}
                className={`bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
                onClick={() => window.location.href = action.href}
              >
                <div className={`w-12 h-12 bg-${action.color}-600 rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 mb-4">{action.description}</p>
                <Button
                  variant="outline"
                  className={`text-${action.color}-600 border-${action.color}-600 hover:bg-${action.color}-50`}
                >
                  Explore
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <SectionCards />
    </div>
  );
};

export default withProtectedRoute(Page);
