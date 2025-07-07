"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Users,
  X,
  Heart,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const coworkingSpaces = [
  {
    id: 1,
    name: "WeWork Downtown",
    location: "Manhattan, New York",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    reviews: 124,
    pricePerHour: 25,
    pricePerDay: 180,
    pricePerWeek: 900,
    pricePerMonth: 3200,
    capacity: "1-50 people",
    type: "Flexible Workspace",
    amenities: [
      "High-Speed WiFi",
      "Meeting Rooms",
      "Parking",
      "Coffee Bar",
      "24/7 Access",
    ],
    description:
      "Premium co-working space in the heart of Manhattan with stunning city views.",
    featured: true,
    saved: false,
  },
  {
    id: 2,
    name: "The Hive Collective",
    location: "Brooklyn, New York",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    reviews: 89,
    pricePerHour: 18,
    pricePerDay: 120,
    pricePerWeek: 600,
    pricePerMonth: 2100,
    capacity: "1-30 people",
    type: "Creative Studio",
    amenities: ["High-Speed WiFi", "Printing", "Kitchen", "Rooftop Terrace"],
    description:
      "Creative co-working space perfect for startups and freelancers.",
    featured: false,
    saved: true,
  },
  {
    id: 3,
    name: "TechHub Central",
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    reviews: 156,
    pricePerHour: 30,
    pricePerDay: 220,
    pricePerWeek: 1100,
    pricePerMonth: 4000,
    capacity: "1-100 people",
    type: "Tech Workspace",
    amenities: [
      "High-Speed WiFi",
      "Meeting Rooms",
      "Parking",
      "Gym",
      "24/7 Access",
      "Phone Booths",
    ],
    description:
      "State-of-the-art workspace designed for tech professionals and startups.",
    featured: true,
    saved: false,
  },
  {
    id: 4,
    name: "Green Space Co-work",
    location: "Austin, Texas",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    reviews: 92,
    pricePerHour: 20,
    pricePerDay: 140,
    pricePerWeek: 700,
    pricePerMonth: 2500,
    capacity: "1-40 people",
    type: "Eco-Friendly",
    amenities: ["High-Speed WiFi", "Garden Area", "Bike Storage", "Coffee Bar"],
    description:
      "Sustainable co-working space with a focus on environmental consciousness.",
    featured: false,
    saved: false,
  },
  {
    id: 5,
    name: "Innovation Lab",
    location: "Seattle, WA",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    reviews: 67,
    pricePerHour: 22,
    pricePerDay: 160,
    pricePerWeek: 800,
    pricePerMonth: 2800,
    capacity: "1-25 people",
    type: "Tech Workspace",
    amenities: [
      "High-Speed WiFi",
      "3D Printing",
      "Workshop Area",
      "Coffee Bar",
    ],
    description:
      "Modern workspace with cutting-edge technology and maker space facilities.",
    featured: false,
    saved: false,
  },
  {
    id: 6,
    name: "Creative Commons",
    location: "Los Angeles, CA",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.4,
    reviews: 78,
    pricePerHour: 19,
    pricePerDay: 130,
    pricePerWeek: 650,
    pricePerMonth: 2300,
    capacity: "1-35 people",
    type: "Creative Studio",
    amenities: [
      "High-Speed WiFi",
      "Art Supplies",
      "Photography Studio",
      "Kitchen",
    ],
    description:
      "Inspiring creative workspace for artists, designers, and content creators.",
    featured: false,
    saved: false,
  },
];

const durationOptions = [
  { value: "hourly", label: "Hourly", key: "pricePerHour" },
  { value: "daily", label: "Daily", key: "pricePerDay" },
  { value: "weekly", label: "Weekly", key: "pricePerWeek" },
  { value: "monthly", label: "Monthly", key: "pricePerMonth" },
];

const typeFilters = [
  "Flexible Workspace",
  "Creative Studio",
  "Private Office",
  "Meeting Room",
];

const amenityFilters = [
  "High-Speed WiFi",
  "Meeting Rooms",
  "Parking",
  "Coffee Bar",
  "24/7 Access",
  "Gym",
];

export default function CoworkingPlacesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("daily");
  const [budgetRange, setBudgetRange] = useState([0, 500]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [savedSpaces, setSavedSpaces] = useState([2]);
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleTypeFilter = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAmenityFilter = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setBudgetRange([0, 500]);
  };

  const toggleSaveSpace = (spaceId) => {
    setSavedSpaces((prev) =>
      prev.includes(spaceId)
        ? prev.filter((id) => id !== spaceId)
        : [...prev, spaceId]
    );
  };

  const getCurrentPrice = (space) => {
    const durationKey =
      durationOptions.find((d) => d.value === selectedDuration)?.key ||
      "pricePerDay";
    return space[durationKey];
  };

  const filteredSpaces = coworkingSpaces.filter((space) => {
    const matchesSearch =
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(space.type);
    const matchesAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => space.amenities.includes(amenity));
    const matchesBudget =
      getCurrentPrice(space) >= budgetRange[0] &&
      getCurrentPrice(space) <= budgetRange[1];

    return matchesSearch && matchesType && matchesAmenities && matchesBudget;
  });

  const activeFiltersCount =
    selectedTypes.length +
    selectedAmenities.length +
    (budgetRange[0] > 0 || budgetRange[1] < 500 ? 1 : 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Co-working Spaces
          </h1>
          <p className="text-gray-600 mt-1">Find your perfect workspace</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredSpaces.length} spaces available
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search spaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>

        <Select value={selectedDuration} onValueChange={setSelectedDuration}>
          <SelectTrigger className="w-32 bg-white border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {durationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="bg-white border-gray-200 relative"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-blue-600 text-white rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent className="w-[500px] p-0 overflow-y-auto">
            {" "}
            <div>
              <SheetHeader className="py-4 sm:py-6">
                <SheetTitle className="text-lg sm:text-xl">
                  Filter Workspaces
                </SheetTitle>
                <SheetDescription className="text-sm sm:text-base">
                  Refine your search to find the perfect co-working space
                </SheetDescription>
              </SheetHeader>
            </div>
            <div className="px-4 sm:px-6 pb-6 space-y-6 sm:space-y-8">
              {/* Budget Filter */}
              <div className="space-y-4">
                <label className="text-sm sm:text-base font-medium text-gray-900 block">
                  Budget Range: ${budgetRange[0]} - ${budgetRange[1]} per{" "}
                  {selectedDuration.replace("ly", "")}
                </label>
                <div className="px-2">
                  <Slider
                    value={budgetRange}
                    onValueChange={setBudgetRange}
                    max={500}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator />

              {/* Workspace Type */}
              <div className="space-y-4">
                <label className="text-sm sm:text-base font-medium text-gray-900 block">
                  Workspace Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {typeFilters.map((type) => (
                    <Button
                      key={type}
                      variant={
                        selectedTypes.includes(type) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => toggleTypeFilter(type)}
                      className="justify-start h-10 sm:h-9 text-sm px-3 py-2 w-full"
                    >
                      <span className="truncate">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <div className="space-y-4">
                <label className="text-sm sm:text-base font-medium text-gray-900 block">
                  Amenities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {amenityFilters.map((amenity) => (
                    <Button
                      key={amenity}
                      variant={
                        selectedAmenities.includes(amenity)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleAmenityFilter(amenity)}
                      className="justify-start h-10 sm:h-9 text-sm px-3 py-2 w-full"
                    >
                      <span className="truncate">{amenity}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="w-full h-11 text-sm sm:text-base"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters ({activeFiltersCount})
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40 bg-white border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {selectedTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="bg-blue-100 text-blue-800"
            >
              {type}
              <button
                onClick={() => toggleTypeFilter(type)}
                className="ml-1 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedAmenities.map((amenity) => (
            <Badge
              key={amenity}
              variant="secondary"
              className="bg-green-100 text-green-800"
            >
              {amenity}
              <button
                onClick={() => toggleAmenityFilter(amenity)}
                className="ml-1 hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {(budgetRange[0] > 0 || budgetRange[1] < 500) && (
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800"
            >
              ${budgetRange[0]}-${budgetRange[1]}
              <button
                onClick={() => setBudgetRange([0, 500])}
                className="ml-1 hover:text-purple-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Co-working Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredSpaces.map((space) => (
          <Card key={space.id} className="bg-white border-gray-200">
            <div className="relative">
              <Image
                src={space.image || "/placeholder.svg"}
                alt={space.name}
                width={300}
                height={300}
                className="w-full h-25 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSaveSpace(space.id)}
                className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full"
              ></Button>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {space.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {space.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      ${getCurrentPrice(space)}
                    </div>
                    <div className="text-sm text-gray-500">
                      per {selectedDuration.replace("ly", "")}
                    </div>
                  </div>
                </div>

                {/* Capacity */}
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {space.capacity}
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1">
                  {space.amenities.slice(0, 2).map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1"
                    >
                      {amenity}
                    </Badge>
                  ))}
                  {space.amenities.length > 2 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1"
                    >
                      +{space.amenities.length - 2} more
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white h-9 text-sm">
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-9 text-sm bg-transparent"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSpaces.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MapPin className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No spaces found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button onClick={clearAllFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
