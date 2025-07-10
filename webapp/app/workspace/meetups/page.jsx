"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, MapPin, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for events
const mockEvents = [
  {
    id: 1,
    title: "Digital Nomad Coffee Meetup",
    city: "Lisbon",
    date: "Dec 15, 2024",
    time: "10:00 AM",
    attendees: 12,
    image: "/placeholder.svg?height=200&width=300",
    category: "Networking",
    isGoing: false,
  },
  {
    id: 2,
    title: "Remote Work & Productivity Workshop",
    city: "Barcelona",
    date: "Dec 18, 2024",
    time: "2:00 PM",
    attendees: 25,
    image: "/placeholder.svg?height=200&width=300",
    category: "Workshop",
    isGoing: true,
  },
  {
    id: 3,
    title: "Startup Founders Dinner",
    city: "Berlin",
    date: "Dec 20, 2024",
    time: "7:00 PM",
    attendees: 8,
    image: "/placeholder.svg?height=200&width=300",
    category: "Social",
    isGoing: false,
  },
  {
    id: 4,
    title: "Coworking Space Tour & Networking",
    city: "Amsterdam",
    date: "Dec 22, 2024",
    time: "11:00 AM",
    attendees: 18,
    image: "/placeholder.svg?height=200&width=300",
    category: "Networking",
    isGoing: false,
  },
  {
    id: 5,
    title: "Tech Talk: AI for Remote Teams",
    city: "Prague",
    date: "Dec 25, 2024",
    time: "4:00 PM",
    attendees: 35,
    image: "/placeholder.svg?height=200&width=300",
    category: "Tech",
    isGoing: true,
  },
  {
    id: 6,
    title: "Freelancer Tax Workshop",
    city: "Budapest",
    date: "Dec 28, 2024",
    time: "1:00 PM",
    attendees: 22,
    image: "/placeholder.svg?height=200&width=300",
    category: "Workshop",
    isGoing: false,
  },
]

export default function EventsListing() {
  const [events, setEvents] = useState(mockEvents)
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const cities = Array.from(new Set(mockEvents.map((event) => event.city)))
  const categories = Array.from(new Set(mockEvents.map((event) => event.category)))

  const filteredEvents = events.filter((event) => {
    const cityMatch = selectedCity === "all" || event.city === selectedCity
    const categoryMatch = selectedCategory === "all" || event.category === selectedCategory
    return cityMatch && categoryMatch
  })

  const toggleGoing = (eventId) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            isGoing: !event.isGoing,
            attendees: event.isGoing ? event.attendees - 1 : event.attendees + 1,
          }
        }
        return event
      }),
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
        <Link href="/create">
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
            <SelectItem value="all">All Cities</SelectItem>
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
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="bg-gray-50 border-black/10 rounded-xl overflow-hidden">
            <div className="aspect-video relative">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
            </div>
            <CardContent className="p-5">
              <h3 className="font-bold text-black text-lg mb-3 line-clamp-2 leading-tight">{event.title}</h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-black/60" />
                  {event.city}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-black/60" />
                  {event.date} • {event.time}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Users className="w-4 h-4 mr-2 text-black/60" />
                  {event.attendees} going
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => toggleGoing(event.id)}
                  variant={event.isGoing ? "default" : "outline"}
                  className={
                    event.isGoing
                      ? "bg-black hover:bg-black/90 text-white flex-1"
                      : "border-black text-black hover:bg-black hover:text-white flex-1"
                  }
                >
                  {event.isGoing ? "Going" : "Join"}
                </Button>
                <Button variant="outline" className="border-black/20 text-black hover:bg-black/5 bg-transparent">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No events found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
