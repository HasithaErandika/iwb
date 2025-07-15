"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  SortDesc,
  Loader2,
  XCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const API_BASE_URL = 'http://localhost:8080';

export default function EventsDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filterStatus, setFilterStatus] = useState("all")
  const [deleteEventId, setDeleteEventId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

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

  // Calculate estimated attendees (since we don't have actual attendee count)
  const getEstimatedAttendees = (event) => {
    if (event.hasLimitedCapacity && event.eventCapacity) {
      // Simulate 60-80% capacity for limited events
      return Math.floor(event.eventCapacity * (0.6 + Math.random() * 0.2))
    }
    // Random number for unlimited events
    return Math.floor(Math.random() * 50) + 10
  }

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch =
        event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.eventDescription && event.eventDescription.toLowerCase().includes(searchQuery.toLowerCase()))

      // For status filtering, we can simulate published/draft based on event dates
      const eventDate = new Date(event.eventStartDate)
      const now = new Date()
      const status = eventDate > now ? 'published' : 'past'

      const matchesStatus = filterStatus === "all" ||
        (filterStatus === 'published' && status === 'published') ||
        (filterStatus === 'past' && status === 'past')

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison = new Date(a.eventStartDate).getTime() - new Date(b.eventStartDate).getTime()
          break
        case "name":
          comparison = a.eventName.localeCompare(b.eventName)
          break
        case "created":
          // Use eventId as proxy for creation order since we don't have createdAt
          comparison = a.eventId.localeCompare(b.eventId)
          break
        case "registered":
          const aAttendees = getEstimatedAttendees(a)
          const bAttendees = getEstimatedAttendees(b)
          comparison = aAttendees - bAttendees
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  // Delete event function
  const handleDeleteEvent = async (eventId) => {
    try {
      setDeleteLoading(true)

      const response = await fetch(`${API_BASE_URL}/api/meetups/${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the event from the local state
        setEvents(events.filter(event => event.eventId !== eventId))
        setDeleteEventId(null)
        setError('')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to delete meetup')
      }
    } catch (err) {
      setError('Network error: Unable to delete meetup')
      console.error('Error deleting meetup:', err)
    } finally {
      setDeleteLoading(false)
    }
  }

  const getStatusColor = (event) => {
    const eventDate = new Date(event.eventStartDate)
    const now = new Date()
    const status = eventDate > now ? 'published' : 'past'

    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "past":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCapacityStatus = (registered, capacity) => {
    if (!capacity) return { color: "text-gray-600", icon: Users }

    const percentage = (registered / capacity) * 100
    if (percentage >= 90) return { color: "text-red-600", icon: AlertCircle }
    if (percentage >= 70) return { color: "text-yellow-600", icon: Clock }
    return { color: "text-green-600", icon: CheckCircle2 }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-black">Manage Meetups</h1>
                <p className="text-gray-600 mt-1">Manage and track your meetups</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading meetups...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">Manage Meetups</h1>
              <p className="text-gray-600 mt-1">Manage and track your meetups</p>
            </div>
            <Link href="/workspace/meetups/create">
              <Button className="bg-black hover:bg-gray-800 text-white font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Create Meetup
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Alert className="border-red-200 bg-red-50 mb-6">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search meetups..."
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
                  Upcoming
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("past")}>
                  Past
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

            {/* Refresh Button */}
            <Button
              onClick={fetchMeetups}
              variant="outline"
              className="border-gray-300 hover:border-black bg-transparent"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Events Grid/List */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No meetups found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first meetup"}
            </p>
            <Link href="/workspace/meetups/create">
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Meetup
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map(event => {
              const { date, time } = formatDateTime(event.eventStartDate, event.eventStartTime)
              const estimatedAttendees = getEstimatedAttendees(event)
              const capacity = event.hasLimitedCapacity ? event.eventCapacity : null
              const capacityStatus = getCapacityStatus(estimatedAttendees, capacity)
              const CapacityIcon = capacityStatus.icon

              return (
                <Card
                  key={event.eventId}
                  className="border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          {event.imageUrl ? (
                            <Image
                              src={event.imageUrl}
                              alt={event.eventName}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold text-black text-base truncate">
                              {event.eventName}
                            </h3>
                            <Badge className={getStatusColor(event)}>
                              {new Date(event.eventStartDate) > new Date() ? 'Upcoming' : 'Past'}
                            </Badge>
                            {event.isPaidEvent && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {formatCurrency(event.eventCost)}
                              </Badge>
                            )}
                            {event.hasLimitedCapacity && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                Limited ({event.eventCapacity} max)
                              </Badge>
                            )}
                            {event.requireApproval && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Approval Required
                              </Badge>
                            )}
                          </div>
                          {event.eventDescription && (
                            <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                              {event.eventDescription}
                            </p>
                          )}
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.venueName}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span className={capacityStatus.color}>
                                {estimatedAttendees}{capacity ? `/${capacity}` : ''}
                              </span>
                            </div>
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
                          onClick={() => setDeleteEventId(event.eventId)}
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
            <AlertDialogTitle>Delete Meetup</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this meetup? This action cannot be
              undone and all registered attendees will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEventId && handleDeleteEvent(deleteEventId)}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Meetup'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
