"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const API_BASE_URL = "http://localhost:8080";

export default function EventsListing() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Fetch meetups from API
  const fetchMeetups = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/meetups`);
      const data = await response.json();

      if (response.ok) {
        // Handle the API response structure: {success: true, message: "", data: [...]}
        if (data.success && data.data) {
          setEvents(data.data);
        } else {
          setError(data.message || "No meetups data received");
        }
      } else {
        setError(data.message || "Failed to fetch meetups");
      }
    } catch (err) {
      setError("Network error: Unable to fetch meetups");
      console.error("Error fetching meetups:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load meetups on component mount
  useEffect(() => {
    fetchMeetups();
  }, []);

  // Extract unique cities and create categories from event data
  const cities = Array.from(
    new Set(events.map((event) => event.venueName).filter(Boolean))
  );
  const categories = ["Workshop", "Networking", "Social", "Tech", "Business"]; // Common meetup categories

  // Format date and time
  const formatDateTime = (date, time) => {
    try {
      const datetime = new Date(`${date}T${time}`);
      return {
        date: datetime.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: datetime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
    } catch {
      return { date: date, time: time };
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  // Filter events based on selections
  const filteredEvents = events.filter((event) => {
    const cityMatch =
      selectedCity === "all" || event.venueName === selectedCity;
    const categoryMatch = selectedCategory === "all";

    // Search filter
    const searchMatch =
      searchTerm === "" ||
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.eventDescription &&
        event.eventDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    // Date filter
    const eventDate = new Date(event.eventStartDate);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    let dateMatch = true;
    if (dateFilter === "week") {
      dateMatch = eventDate <= nextWeek;
    } else if (dateFilter === "month") {
      dateMatch = eventDate <= nextMonth;
    }

    return cityMatch && categoryMatch && searchMatch && dateMatch;
  });
  // Calculate estimated attendees (since we don't have actual attendee count)
  const getEstimatedAttendees = (event) => {
    if (event.hasLimitedCapacity && event.eventCapacity) {
      // Simulate 60-80% capacity for limited events
      return Math.floor(event.eventCapacity * (0.6 + Math.random() * 0.2));
    }
    // Random number for unlimited events
    return Math.floor(Math.random() * 50) + 10;
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading meetups...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Alert className="border-red-200 bg-red-50 mb-6">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          <Button onClick={fetchMeetups} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">Upcoming Meetups</h1>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search meetups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-black focus:ring-black"
            />
          </div>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-200 focus:border-black focus:ring-black">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="week">Next 7 days</SelectItem>
              <SelectItem value="month">Next 30 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full sm:w-48 border-gray-200 focus:border-black focus:ring-black">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const { date, time } = formatDateTime(
              event.eventStartDate,
              event.eventStartTime
            );
            return (
              <Link
                key={event.eventId}
                href={`/workspace/meetups/${event.eventId}`}
              >
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-black transition-colors cursor-pointer">
                  <img
                    src={
                      event.imageUrl || "/placeholder.svg?height=200&width=400"
                    }
                    alt={event.eventName}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/placeholder.svg?height=200&width=400";
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-black mb-2">
                      {event.eventName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      {event.venueName}
                    </p>
                    <p className="text-gray-600 text-sm mb-3">
                      {formatDisplayDate(event.eventStartDate)} • {time}
                    </p>

                    {/* Event badges */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.isPaidEvent && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-800"
                        >
                          {formatCurrency(event.eventCost)}
                        </Badge>
                      )}
                      {event.hasLimitedCapacity && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-orange-100 text-orange-800"
                        >
                          Limited ({event.eventCapacity} max)
                        </Badge>
                      )}
                      {event.requireApproval && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-800"
                        >
                          Approval Required
                        </Badge>
                      )}
                    </div>

                    {event.eventDescription && (
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {event.eventDescription}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No meetups found matching your criteria.
            </p>
            {(searchTerm !== "" ||
              selectedCity !== "all" ||
              dateFilter !== "all") && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCity("all");
                  setDateFilter("all");
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
