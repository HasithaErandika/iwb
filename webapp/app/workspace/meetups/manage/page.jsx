"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle2,
  SortAsc,
  SortDesc
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import Image from "next/image"

// Mock data for events
const mockEvents = [
  {
    id: "1",
    name: "Tech Conference 2024",
    description:
      "Annual technology conference featuring the latest innovations",
    date: new Date("2024-03-15"),
    endDate: new Date("2024-03-17"),
    startTime: "09:00",
    endTime: "18:00",
    venue: "Convention Center",
    address: "123 Main St, San Francisco, CA",
    coverImage: "/placeholder.svg?height=200&width=300",
    isPaid: true,
    price: 299,
    capacity: 500,
    registered: 342,
    status: "published",
    requireApproval: false,
    createdAt: new Date("2024-01-15")
  },
  {
    id: "2",
    name: "Design Workshop",
    description: "Hands-on workshop for UI/UX designers",
    date: new Date("2024-02-28"),
    endDate: new Date("2024-02-28"),
    startTime: "10:00",
    endTime: "16:00",
    venue: "Design Studio",
    address: "456 Creative Ave, New York, NY",
    coverImage: "/placeholder.svg?height=200&width=300",
    isPaid: true,
    price: 149,
    capacity: 30,
    registered: 28,
    status: "published",
    requireApproval: true,
    createdAt: new Date("2024-01-20")
  },
  {
    id: "3",
    name: "Startup Networking",
    description: "Connect with fellow entrepreneurs and investors",
    date: new Date("2024-04-10"),
    endDate: new Date("2024-04-10"),
    startTime: "18:00",
    endTime: "21:00",
    venue: "Innovation Hub",
    address: "789 Startup Blvd, Austin, TX",
    coverImage: "/placeholder.svg?height=200&width=300",
    isPaid: false,
    price: 0,
    capacity: 100,
    registered: 67,
    status: "draft",
    requireApproval: false,
    createdAt: new Date("2024-02-01")
  },
  {
    id: "4",
    name: "Photography Masterclass",
    description: "Learn advanced photography techniques from professionals",
    date: new Date("2024-03-25"),
    endDate: new Date("2024-03-26"),
    startTime: "09:00",
    endTime: "17:00",
    venue: "Photo Studio",
    address: "321 Art District, Los Angeles, CA",
    coverImage: "/placeholder.svg?height=200&width=300",
    isPaid: true,
    price: 199,
    capacity: 25,
    registered: 23,
    status: "published",
    requireApproval: true,
    createdAt: new Date("2024-01-10")
  }
]

export default function EventsDashboard() {
  const [events, setEvents] = useState(mockEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filterStatus, setFilterStatus] = useState("all")
  const [deleteEventId, setDeleteEventId] = useState(null)

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        filterStatus === "all" || event.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison = a.date.getTime() - b.date.getTime()
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "created":
          comparison = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case "registered":
          comparison = a.registered - b.registered
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  const handleDeleteEvent = eventId => {
    setEvents(events.filter(event => event.id !== eventId))
    setDeleteEventId(null)
  }

  const handleDuplicateEvent = event => {
    const duplicatedEvent = {
      ...event,
      id: Date.now().toString(),
      name: `${event.name} (Copy)`,
      status: "draft",
      registered: 0,
      createdAt: new Date()
    }
    setEvents([duplicatedEvent, ...events])
  }

  const getStatusColor = status => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCapacityStatus = (registered, capacity) => {
    const percentage = (registered / capacity) * 100
    if (percentage >= 90) return { color: "text-red-600", icon: AlertCircle }
    if (percentage >= 70) return { color: "text-yellow-600", icon: Clock }
    return { color: "text-green-600", icon: CheckCircle2 }
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className= " bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">Events</h1>
              <p className="text-gray-600 mt-1">Manage and track your events</p>
            </div>
            <Link href="/create-event">
              <Button className="bg-black hover:bg-gray-800 text-white font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-gray-300 focus:border-black focus:ring-black/10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 hover:border-black bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {filterStatus === "all"
                    ? "All Status"
                    : filterStatus.charAt(0).toUpperCase() +
                      filterStatus.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("published")}>
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("draft")}>
                  Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 hover:border-black bg-transparent"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4 mr-2" />
                  ) : (
                    <SortDesc className="w-4 h-4 mr-2" />
                  )}
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("date")
                    setSortOrder("asc")
                  }}
                >
                  Date (Earliest)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("date")
                    setSortOrder("desc")
                  }}
                >
                  Date (Latest)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("name")
                    setSortOrder("asc")
                  }}
                >
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("registered")
                    setSortOrder("desc")
                  }}
                >
                  Most Registered
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Events Grid/List */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first event"}
            </p>
            <Link href="/create-event">
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map(event => {
              const capacityStatus = getCapacityStatus(
                event.registered,
                event.capacity
              )
              const CapacityIcon = capacityStatus.icon

              return (
                <Card
                  key={event.id}
                  className="border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={event.coverImage || "/placeholder.svg"}
                            alt={event.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold text-black text-base truncate">
                              {event.name}
                            </h3>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                            {event.description}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {format(event.date, "MMM d, yyyy")}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.venue}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span className={capacityStatus.color}>
                                {event.registered}/{event.capacity}
                              </span>
                            </div>
                            {event.isPaid && (
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />$
                                {event.price}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 hover:border-black bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 hover:border-black bg-transparent"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 hover:border-red-500 bg-transparent text-red-600 hover:text-red-700"
                          onClick={() => setDeleteEventId(event.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteEventId}
        onOpenChange={() => setDeleteEventId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be
              undone and all registered attendees will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEventId && handleDeleteEvent(deleteEventId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
