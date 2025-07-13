"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  Calendar,
  Users,
  X,
  Bookmark,
  DollarSign,
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
import Image from "next/image";

const filters = [
  {
    id: "positionType",
    label: "Position Type",
    icon: Briefcase,
    options: [
      { value: "Full Time", label: "Full Time" },
      { value: "Part Time", label: "Part Time" },
      { value: "Contract", label: "Contract" },
    ],
  },
  {
    id: "category",
    label: "Category",
    icon: Users,
    options: [
      { value: "Development", label: "Development" },
      { value: "Design", label: "Design" },
      { value: "Marketing", label: "Marketing" },
      { value: "Sales", label: "Sales" },
      { value: "Management", label: "Management" },
      { value: "Customer Success", label: "Customer Success" },
      { value: "Human Resources", label: "Human Resources" },
      { value: "Finance", label: "Finance" },
      { value: "Administration", label: "Administration" },
      { value: "Consulting", label: "Consulting" },
      { value: "Education", label: "Education" },
      { value: "Healthcare", label: "Healthcare" },
      { value: "Legal", label: "Legal" },
      { value: "System Administration", label: "System Administration" },
      { value: "Writing", label: "Writing" },
    ],
  },
  {
    id: "remote",
    label: "Remote",
    icon: MapPin,
    options: [
      { value: "remote", label: "Remote Only" },
      { value: "hybrid", label: "Hybrid" },
      { value: "onsite", label: "On-site" },
    ],
  },
];

export default function JobListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    positionType: "all",
    category: "all",
    remote: "all",
    minSalary: "",
    maxSalary: "",
  });
  const [savedJobs, setSavedJobs] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        if (activeFilters.positionType && activeFilters.positionType !== "all")
          params.append("positionType", activeFilters.positionType);
        if (activeFilters.category && activeFilters.category !== "all")
          params.append("category", activeFilters.category);
        if (activeFilters.minSalary)
          params.append("minSalary", activeFilters.minSalary);
        if (activeFilters.maxSalary)
          params.append("maxSalary", activeFilters.maxSalary);

        const queryString = params.toString();
        const url = `http://localhost:8080/api/jobs${
          queryString ? `?${queryString}` : ""
        }`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const jobsData = await response.json();
        setJobs(jobsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [activeFilters]);

  const updateFilter = (filterId, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      positionType: "all",
      category: "all",
      remote: "all",
      minSalary: "",
      maxSalary: "",
    });
  };

  const toggleSaveJob = (jobUrl) => {
    setSavedJobs((prev) =>
      prev.includes(jobUrl)
        ? prev.filter((url) => url !== jobUrl)
        : [...prev, jobUrl]
    );
  };

  // Filter jobs based on search query and client-side filters
  const filteredJobs = jobs.filter((job) => {
    // Text search filter
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Remote filter (client-side since API doesn't support it)
    const matchesRemote =
      !activeFilters.remote ||
      activeFilters.remote === "all" ||
      (activeFilters.remote === "remote" &&
        job.location.toLowerCase().includes("remote")) ||
      (activeFilters.remote === "hybrid" &&
        job.location.toLowerCase().includes("hybrid")) ||
      (activeFilters.remote === "onsite" &&
        !job.location.toLowerCase().includes("remote") &&
        !job.location.toLowerCase().includes("hybrid"));

    return matchesSearch && matchesRemote;
  });

  // Extract skills from tags
  const getSkillsFromTags = (tags) => {
    if (!tags) return [];
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .slice(0, 5);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return `Posted ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    } catch {
      return dateString;
    }
  };

  // Clean HTML content from description
  const cleanHtmlContent = (htmlString) => {
    if (!htmlString) return "";

    // Remove HTML tags and decode HTML entities
    const cleanText = htmlString
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ") // Replace &nbsp; with spaces
      .replace(/&amp;/g, "&") // Replace &amp; with &
      .replace(/&lt;/g, "<") // Replace &lt; with <
      .replace(/&gt;/g, ">") // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();

    return cleanText;
  };

  // Generate company logo placeholder
  const getCompanyLogo = (companyName) => {
    const colors = [
      "bg-orange-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
    ];
    const colorIndex = companyName.length % colors.length;
    return colors[colorIndex];
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Find the Remote Job That Fits Your Life
          </h1>
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading jobs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Find the Remote Job That Fits Your Life
          </h1>
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-red-500 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Find the Remote Job That Fits Your Life
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search Jobs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-base bg-white border-gray-200"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const currentValue = activeFilters[filter.id];
            return (
              <Select
                key={filter.id}
                value={currentValue}
                onValueChange={(value) => updateFilter(filter.id, value)}
              >
                <SelectTrigger className="w-40 h-10 bg-white border-gray-200">
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={filter.label} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter.label}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}

          {/* Salary Range Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="number"
                placeholder="Min Salary"
                value={activeFilters.minSalary}
                onChange={(e) => updateFilter("minSalary", e.target.value)}
                className="w-32 h-10 bg-white border-gray-200 pl-10"
              />
            </div>
            <span className="text-gray-400">to</span>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="number"
                placeholder="Max Salary"
                value={activeFilters.maxSalary}
                onChange={(e) => updateFilter("maxSalary", e.target.value)}
                className="w-32 h-10 bg-white border-gray-200 pl-10"
              />
            </div>
          </div>

          {Object.entries(activeFilters).some(
            ([key, value]) => value !== "" && value !== "all"
          ) && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="h-10 px-4 text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters (
              {
                Object.entries(activeFilters).filter(
                  ([key, value]) => value !== "" && value !== "all"
                ).length
              }
              )
            </Button>
          )}

          <div className="ml-auto text-sm text-gray-600">
            {filteredJobs.length} jobs found
          </div>
        </div>

        {/* Header with Sort */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Search Listings
          </h1>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-white border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Sort by: Newest</SelectItem>
              <SelectItem value="oldest">Sort by: Oldest</SelectItem>
              <SelectItem value="salary-high">
                Sort by: Salary (High to Low)
              </SelectItem>
              <SelectItem value="salary-low">
                Sort by: Salary (Low to High)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Listings */}
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Card
              key={job.url}
              className="bg-white border-gray-200 transition-all duration-500 hover:border-orange-500"
            >
              <CardContent className="px-6 py-4">
                <div className="flex items-start justify-between mb-3">
                  {/* Left side - Company info */}
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {job.company_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h2>
                      <p className="text-gray-600 text-base mb-2">
                        {job.company_name}
                      </p>
                      <p className="text-gray-500 text-base">
                        {job.category_name}
                      </p>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(job.url);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Bookmark
                        className={`h-5 w-5 transition-colors ${
                          savedJobs.includes(job.url)
                            ? "fill-current text-blue-600"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      />
                    </Button>
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 text-base font-semibold transition-all duration-200 hover:shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(job.url, "_blank");
                      }}
                    >
                      Apply →
                    </Button>
                  </div>
                </div>

                {/* Job details row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="text-sm font-normal border-gray-300"
                      >
                        <Briefcase className="h-4 w-4 mr-1" />
                        Full-Time
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-sm font-normal border-gray-300"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Remote
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-sm font-normal border-gray-300"
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Posted on {formatDate(job.pub_date).replace("Posted ", "")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && !loading && (
          <div className="text-center py-12 px-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters to find more
                opportunities.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
