"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Upload,
  MapPin,
  Users,
  DollarSign,
  CalendarIcon,
  Clock,
  X,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import Image from "next/image"

export default function CreateEvent() {
  // Basic event information
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [date, setDate] = useState()
  const [endDate, setEndDate] = useState()
  const [startTime, setStartTime] = useState("10:00")
  const [endTime, setEndTime] = useState("11:00")

  // Location information
  const [venueName, setVenueName] = useState("")
  const [venueGoogleMapsUrl, setVenueGoogleMapsUrl] = useState("")

  // Image handling - store both preview and file
  const [coverImagePreview, setCoverImagePreview] = useState("")
  const [imageFile, setImageFile] = useState(null)

  // Event settings
  const [isPaid, setIsPaid] = useState(false)
  const [eventCost, setEventCost] = useState("")
  const [hasLimit, setHasLimit] = useState(false)
  const [eventCapacity, setEventCapacity] = useState("")
  const [requireApproval, setRequireApproval] = useState(false)

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleImageUpload = event => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          image: "Image size must be less than 10MB"
        }))
        return
      }

      // Store the file object for FormData
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = e => {
        setCoverImagePreview(e.target?.result)
        setFormErrors(prev => ({ ...prev, image: "" }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const errors = {}

    // Required fields validation
    if (!eventName.trim()) errors.eventName = "Event name is required"
    if (!eventDescription.trim()) errors.eventDescription = "Event description is required"
    if (!date) errors.eventStartDate = "Start date is required"
    if (!endDate) errors.eventEndDate = "End date is required"
    if (!venueName.trim()) errors.venueName = "Venue name is required"
    if (!venueGoogleMapsUrl.trim()) errors.venueGoogleMapsUrl = "Address or online link is required"

    // Date validation
    if (date && endDate && endDate < date) {
      errors.eventEndDate = "End date cannot be before start date"
    }

    // Time validation (if same date)
    if (date && endDate &&
      date.toDateString() === endDate.toDateString() &&
      endTime <= startTime) {
      errors.eventEndTime = "End time must be after start time"
    }

    // Conditional validations
    if (isPaid && (!eventCost || parseFloat(eventCost) <= 0)) {
      errors.eventCost = "Event cost is required for paid events"
    }

    if (hasLimit && (!eventCapacity || parseInt(eventCapacity) <= 0)) {
      errors.eventCapacity = "Event capacity is required when limiting capacity"
    }

    return errors
  }

  const formatDateForBackend = (date) => {
    if (!date) return ""
    return date.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormErrors({})

    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    try {
      // Create FormData object
      const formData = new FormData()

      // Add required fields
      formData.append('eventName', eventName.trim())
      formData.append('eventDescription', eventDescription.trim())
      formData.append('eventStartDate', formatDateForBackend(date))
      formData.append('eventStartTime', startTime)
      formData.append('eventEndDate', formatDateForBackend(endDate))
      formData.append('eventEndTime', endTime)
      formData.append('venueName', venueName.trim())
      formData.append('venueGoogleMapsUrl', venueGoogleMapsUrl.trim())
      formData.append('isPaidEvent', isPaid.toString())
      formData.append('hasLimitedCapacity', hasLimit.toString())
      formData.append('requireApproval', requireApproval.toString())

      // Add conditional fields
      if (isPaid && eventCost) {
        formData.append('eventCost', eventCost.toString())
      }

      if (hasLimit && eventCapacity) {
        formData.append('eventCapacity', eventCapacity.toString())
      }

      // Add image if present
      if (imageFile) {
        formData.append('image', imageFile)
      }

      // Make API call
      const response = await fetch('http://localhost:8080/event/create', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setSubmitSuccess(true)
        console.log('Event created successfully:', result.data)

        // Optional: redirect to event page or show success message
        // router.push(`/workspace/meetups/${result.data.eventId}`)
      } else {
        throw new Error(result.message || 'Failed to create event')
      }

    } catch (error) {
      console.error('Error creating event:', error)
      setFormErrors({
        submit: error.message || 'Failed to create event. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeCoverImage = () => {
    setCoverImagePreview("")
    setImageFile(null)
  }

  const completedSections = [
    coverImagePreview ? 1 : 0,
    eventName ? 1 : 0,
    date ? 1 : 0,
    venueName ? 1 : 0
  ].reduce((a, b) => a + b, 0)

  const totalSections = 4
  const progress = (completedSections / totalSections) * 100

  // Show success message if form was submitted successfully
  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-2">Event Created!</h2>
            <p className="text-gray-600 mb-6">Your event has been successfully created.</p>
            <Link href="/workspace/meetups">
              <Button className="w-full">Back to Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="sticky top-[calc(var(--header-height))] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/workspace/meetups"
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors duration-200 text-sm font-medium group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back to events
            </Link>

            {/* Progress indicator */}
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-xs text-gray-500 font-medium">
                {completedSections} of {totalSections} completed
              </span>
              <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-black mb-3">
                Create Event
              </h1>
              <p className="text-gray-600 text-lg">
                Design an experience that brings people together
              </p>
            </div>

            {/* Global form error */}
            {formErrors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">{formErrors.submit}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Cover Image */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold text-black">
                    Cover Image
                  </Label>
                  {coverImagePreview && (
                    <Badge variant="secondary" className="bg-black text-white">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Added
                    </Badge>
                  )}
                </div>

                {coverImagePreview ? (
                  <div className="relative group">
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-gray-200">
                      <Image
                        src={coverImagePreview || "/placeholder.svg"}
                        alt="Event cover"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={removeCoverImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all duration-300 group"
                    onClick={() =>
                      document.getElementById("cover-upload")?.click()
                    }
                  >
                    <div className="p-4 rounded-full bg-gray-100 group-hover:bg-black group-hover:text-white transition-all duration-300 mb-4">
                      <Upload className="w-8 h-8 text-gray-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      Upload cover image
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}

                {formErrors.image && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {formErrors.image}
                  </div>
                )}

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="cover-upload"
                />
              </div>

              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="eventName"
                      className="text-sm font-medium text-black"
                    >
                      Event Name *
                    </Label>
                    <Input
                      id="eventName"
                      value={eventName}
                      onChange={e => setEventName(e.target.value)}
                      placeholder="Enter event name"
                      className="h-12 border-gray-300 focus:border-black focus:ring-black/10 transition-all duration-200"
                      required
                    />
                    {formErrors.eventName && (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {formErrors.eventName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-black"
                    >
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={eventDescription}
                      onChange={e => setEventDescription(e.target.value)}
                      placeholder="What makes your event special?"
                      rows={4}
                      className="resize-none border-gray-300 focus:border-black focus:ring-black/10 transition-all duration-200"
                      required
                    />
                    {formErrors.eventDescription && (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {formErrors.eventDescription}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">
                    Date & Time
                  </h3>
                  {date && (
                    <Badge variant="secondary" className="bg-black text-white">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Set
                    </Badge>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Event starts *
                    </Label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="justify-start text-left font-normal h-12 border-gray-300 hover:border-black bg-white transition-all duration-200 w-full"
                            >
                              <CalendarIcon className="mr-3 h-4 w-4 text-gray-500" />
                              {date ? format(date, "MMM d, yyyy") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {formErrors.eventStartDate && (
                          <div className="flex items-center text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {formErrors.eventStartDate}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          type="time"
                          value={startTime}
                          onChange={e => setStartTime(e.target.value)}
                          className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black/10 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Event ends *
                    </Label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="justify-start text-left font-normal h-12 border-gray-300 hover:border-black bg-white transition-all duration-200 w-full"
                            >
                              <CalendarIcon className="mr-3 h-4 w-4 text-gray-500" />
                              {endDate
                                ? format(endDate, "MMM d, yyyy")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {formErrors.eventEndDate && (
                          <div className="flex items-center text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {formErrors.eventEndDate}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            type="time"
                            value={endTime}
                            onChange={e => setEndTime(e.target.value)}
                            className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black/10 transition-all duration-200"
                            required
                          />
                        </div>
                        {formErrors.eventEndTime && (
                          <div className="flex items-center text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {formErrors.eventEndTime}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">Location</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Venue name *
                    </Label>
                    <Input
                      value={venueName}
                      onChange={e => setVenueName(e.target.value)}
                      placeholder="Enter venue name"
                      className="h-12 border-gray-300 focus:border-black focus:ring-black/10 transition-all duration-200"
                      required
                    />
                    {formErrors.venueName && (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {formErrors.venueName}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Address or online link *
                    </Label>
                    <Input
                      value={venueGoogleMapsUrl}
                      onChange={e => setVenueGoogleMapsUrl(e.target.value)}
                      placeholder="Full address or meeting link"
                      className="h-12 border-gray-300 focus:border-black focus:ring-black/10 transition-all duration-200"
                      required
                    />
                    {formErrors.venueGoogleMapsUrl && (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {formErrors.venueGoogleMapsUrl}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">
                  Event Settings
                </h3>

                <div className="space-y-4">
                  {/* Paid Event */}
                  <div className="rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <DollarSign className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <div className="font-medium text-black">
                            Paid Event
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Charge attendees for tickets
                          </div>
                        </div>
                      </div>
                      <Switch checked={isPaid} onCheckedChange={setIsPaid} />
                    </div>

                    {isPaid && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                          <Label
                            htmlFor="price"
                            className="text-sm font-medium text-gray-700"
                          >
                            Ticket Price ($) *
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            value={eventCost}
                            onChange={e => setEventCost(e.target.value)}
                            placeholder="0.00"
                            className="w-32 h-10 border-gray-300 focus:border-black focus:ring-black/10 transition-all duration-200"
                            min="0"
                            step="0.01"
                            required
                          />
                          {formErrors.eventCost && (
                            <div className="flex items-center text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              {formErrors.eventCost}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Require Approval */}
                  <div className="flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <Users className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <div className="font-medium text-black">
                          Require Approval
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Manually approve each attendee
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={requireApproval}
                      onCheckedChange={setRequireApproval}
                    />
                  </div>

                  {/* Capacity Limit */}
                  <div className="rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Users className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <div className="font-medium text-black">
                            Limit Capacity
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Set maximum number of attendees
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={hasLimit}
                        onCheckedChange={setHasLimit}
                      />
                    </div>

                    {hasLimit && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                          <Label
                            htmlFor="capacity"
                            className="text-sm font-medium text-gray-700"
                          >
                            Maximum Attendees *
                          </Label>
                          <Input
                            id="capacity"
                            type="number"
                            value={eventCapacity}
                            onChange={e => setEventCapacity(e.target.value)}
                            placeholder="50"
                            className="w-32 h-10 border-gray-300 focus:border-black focus:ring-black/10 transition-all duration-200"
                            min="1"
                            required
                          />
                          {formErrors.eventCapacity && (
                            <div className="flex items-center text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              {formErrors.eventCapacity}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-black hover:bg-gray-800 text-white font-semibold text-base transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      Creating Event...
                    </div>
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Preview Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-black">Preview</h3>
                    <Badge variant="outline" className="text-xs">
                      Live
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      {coverImagePreview ? (
                        <Image
                          src={coverImagePreview || "/placeholder.svg"}
                          alt="Event preview"
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-black text-lg">
                        {eventName || "Your Event Name"}
                      </h4>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {date ? format(date, "MMM d, yyyy") : "Date not set"}
                          {startTime && ` at ${startTime}`}
                        </div>

                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {venueName || "Venue not set"}
                        </div>

                        {isPaid && (
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            {eventCost ? `$${eventCost}` : "Paid Event"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Info className="w-5 h-5 mr-2 text-gray-600" />
                    <h3 className="font-semibold text-black">Tips</h3>
                  </div>

                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0" />
                      Use high-quality images to attract more attendees
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0" />
                      Write clear, compelling descriptions
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0" />
                      Set precise start and end times
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0" />
                      Include complete venue information
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
