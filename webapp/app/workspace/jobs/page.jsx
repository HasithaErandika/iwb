"use client"

import { useState } from "react"
import { Search, MapPin, Clock, Briefcase, Calendar, Users, X, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

const jobs = [
    {
        id: 1,
        company: "Hubspot",
        logo: "/hubspot-logo.png",
        title: "Full Stack Engineer",
        salary: "$90-120/hr",
        location: "Remote, South America",
        timezone: "BRT+2",
        hours: "Under 20 hrs/wk",
        skills: ["HTML5", "CSS3", "Angular", "Vue.js", "Bootstrap"],
        posted: "Posted Apr 7, 2025",
        saved: false,
    },
    {
        id: 2,
        company: "Atlassian",
        logo: "/atlassian-logo.png",
        title: "Product Manager",
        salary: "$90-120/hr",
        location: "Onsite, United States",
        timezone: "UTC-5",
        hours: "40 hrs/wk",
        skills: ["UX/UI", "Wireframing", "Tailwind CSS", "Typography"],
        posted: "Posted Apr 8, 2025",
        saved: false,
    },
    {
        id: 3,
        company: "Google",
        logo: "/placeholder.svg?height=40&width=40",
        title: "Senior Frontend Developer",
        salary: "$120-150/hr",
        location: "Remote, Global",
        timezone: "UTC-8",
        hours: "35 hrs/wk",
        skills: ["React", "TypeScript", "Next.js", "GraphQL"],
        posted: "Posted Apr 7, 2025",
        saved: true,
    },
]

const filters = [
    { id: "location", label: "Location", icon: MapPin },
    { id: "timezone", label: "Timezone", icon: Clock },
    { id: "jobType", label: "Job Type", icon: Briefcase },
    { id: "commitment", label: "Commitment", icon: Calendar },
    { id: "workModel", label: "Work Model", icon: Users },
]

export default function JobListingsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilters, setActiveFilters] = useState([])
    const [savedJobs, setSavedJobs] = useState([2])
    const [sortBy, setSortBy] = useState("newest")

    const toggleFilter = (filterId) => {
        setActiveFilters((prev) => (prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]))
    }

    const clearAllFilters = () => {
        setActiveFilters([])
    }

    const toggleSaveJob = (jobId) => {
        setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
    }

    return (
        <div className="min-h-screen  p-6">

            <div className="max-w-6xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold text-gray-900">Find the Remote Job That Fits Your Life</h1>

                {/* Search Bar */}
                <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search Jobs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10  text-base bg-white border-gray-200"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    {filters.map((filter) => {
                        const Icon = filter.icon
                        const isActive = activeFilters.includes(filter.id)
                        return (
                            <Button
                                key={filter.id}
                                variant={isActive ? "default" : "outline"}
                                onClick={() => toggleFilter(filter.id)}
                                className="h-10 px-4 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                                <Icon className="h-4 w-4 mr-2" />
                                {filter.label}
                            </Button>
                        )
                    })}

                    {activeFilters.length > 0 && (
                        <Button variant="ghost" onClick={clearAllFilters} className="h-10 px-4 text-gray-600 hover:text-gray-800">
                            <X className="h-4 w-4 mr-2" />
                            Clear Filters
                        </Button>
                    )}

                    <div className="ml-auto text-sm text-gray-600">21 jobs found</div>
                </div>


                {/* Header with Sort */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Search Listings</h1>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-48 bg-white border-gray-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Sort by: Newest</SelectItem>
                            <SelectItem value="oldest">Sort by: Oldest</SelectItem>
                            <SelectItem value="salary-high">Sort by: Salary (High to Low)</SelectItem>
                            <SelectItem value="salary-low">Sort by: Salary (Low to High)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>                {/* Job Listings */}
                <div className="space-y-3">
                    {jobs.map((job) => (
                        <Card key={job.id} className="bg-white border-gray-200 transition-shadow">
                            <CardContent className="p-4 py-2">
                                <div className="flex items-start justify-between mb-3">
                                    {/* Left side - Company info */}
                                    <div className="flex items-start space-x-4">
                                        <div className="w-15 h-15 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {job.company === "Hubspot" ? (
                                                <div className="w-8 h-8 bg-orange-500 rounded-full relative">
                                                    <div className="absolute inset-1 bg-white rounded-full"></div>
                                                    <div className="absolute top-1 left-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                                                    <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full"></div>
                                                </div>
                                            ) : job.company === "Atlassian" ? (
                                                <div
                                                    className="w-8 h-8 bg-blue-600"
                                                    style={{
                                                        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                                                    }}
                                                />
                                            ) : (
                                                <Image
                                                    src={job.logo || "/placeholder.svg"}
                                                    alt={`${job.company} logo`}
                                                    width={32}
                                                    height={32}
                                                    className="rounded"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">{job.company}</h2>
                                            <p className="text-gray-600 text-lg">{job.title}</p>
                                        </div>
                                    </div>

                                    {/* Right side - Salary and bookmark */}
                                    <div className="flex items-start space-x-4">
                                        <span className="text-lg font-semibold text-gray-900">{job.salary}</span>
                                        <Button variant="ghost" size="sm" onClick={() => toggleSaveJob(job.id)} className="p-2">
                                            <Bookmark
                                                className={`h-5 w-5 ${savedJobs.includes(job.id) ? "fill-current text-blue-600" : "text-gray-400"
                                                    }`}
                                            />
                                        </Button>
                                    </div>
                                </div>                                {/* Right side - Location, timezone, hours */}
                                <div className="flex justify-end mb-3">
                                    <div className="flex items-center space-x-4 text-md font-bo text-gray-500">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {job.timezone}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {job.hours}
                                        </div>
                                    </div>
                                </div>                                {/* Bottom row - Skills left, Posted date and View Job right */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1.5">                                        {job.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs py-0.5">
                                            {skill}
                                        </Badge>
                                    ))}
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-500">{job.posted}</span>
                                        <Button className="bg-gray-900 hover:bg-gray-800 text-white">View Job</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
