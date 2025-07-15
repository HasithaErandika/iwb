"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, MapPin, Calendar, Clock, DollarSign, Loader2, XCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

const API_BASE_URL = 'http://localhost:8080';

export default function EventsListing() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Fetch meetups from API
  const fetchMeetups = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_BASE_URL}/api/meetups`)
      const data = await response.json()

      if (response.ok) {
        // Handle the API response structure: {success: true, message: "", data: [...]}
        if (data.success && data.data) {
          setEvents(data.data)
        } else {
          setError(data.message || 'No meetups data received')
        }
      } else {
        setError(data.message || 'Failed to fetch meetups')
      }
    } catch (err) {
      setError('Network error: Unable to fetch meetups')
      console.error('Error fetching meetups:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load meetups on component mount
  useEffect(() => {
    fetchMeetups()
  }, [])

  // Extract unique cities and create categories from event data
  const cities = Array.from(new Set(events.map((event) => event.venueName).filter(Boolean)))
  const categories = ["Workshop", "Networking", "Social", "Tech", "Business"] // Common meetup categories

  // Format date and time
  const formatDateTime = (date, time) => {
    try {
      const datetime = new Date(`${date}T${time}`)
      return {
        date: datetime.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        time: datetime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      }
    } catch {
      return { date: date, time: time }
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Filter events based on selections
  const filteredEvents = events.filter((event) => {
    const cityMatch = selectedCity === "all" || event.venueName === selectedCity
    // For category filtering, we would need to add category field to the API or derive it from event name/description
    const categoryMatch = selectedCategory === "all" // For now, show all since we don't have category in API
    return cityMatch && categoryMatch
  })

  // Calculate estimated attendees (since we don't have actual attendee count)
  const getEstimatedAttendees = (event) => {
    if (event.hasLimitedCapacity && event.eventCapacity) {
      // Simulate 60-80% capacity for limited events
      return Math.floor(event.eventCapacity * (0.6 + Math.random() * 0.2))
    }
    // Random number for unlimited events
    return Math.floor(Math.random() * 50) + 10
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading meetups...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
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
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Explore Meetups</h1>
          <p className="text-gray-600">Discover and join events in your city</p>
        </div>
        <Link href="/workspace/meetups/create">
          <Button className="bg-black hover:bg-black/90 text-white">Create Meetup</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full sm:w-48 border-black/20 focus:border-black">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Venues</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48 border-black/20 focus:border-black">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={fetchMeetups}
          variant="outline"
          className="border-black/20 text-black hover:bg-black/5"
        >
          Refresh
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const { date, time } = formatDateTime(event.eventStartDate, event.eventStartTime)
          const estimatedAttendees = getEstimatedAttendees(event)

          return (
            <Card key={event.eventId} className="bg-gray-50 border-black/10 rounded-xl overflow-hidden">
              <div className="aspect-video relative">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl || "/placeholder.svg"}
                    alt={event.eventName}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-black text-lg mb-3 line-clamp-2 leading-tight">{event.eventName}</h3>
                {/* Event badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {event.isPaidEvent && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {formatCurrency(event.eventCost)}
                    </Badge>
                  )}
                  {event.hasLimitedCapacity && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                      Limited ({event.eventCapacity} max)
                    </Badge>
                  )}
                  {event.requireApproval && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      Approval Required
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-black/60" />
                    {event.venueName}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-black/60" />
                      {date}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="w-4 h-4 mr-2 text-black/60" />
                      {time}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No meetups found</h3>
          <p className="text-gray-500 mb-4">
            {selectedCity !== "all" || selectedCategory !== "all"
              ? "Try adjusting your filters or check back later for new events."
              : "Check back later for upcoming events!"}
          </p>
          {(selectedCity !== "all" || selectedCategory !== "all") && (
            <Button
              onClick={() => {
                setSelectedCity("all")
                setSelectedCategory("all")
              }}
              variant="outline"
              className="mr-2"
            >
              Clear Filters
            </Button>
          )}
          <Button onClick={fetchMeetups} variant="outline">
            Refresh
          </Button>
        </div>
      )}
    </div>
  )
}
