"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Upload, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getAuthHeaders } from "@/lib/api";

const API_BASE_URL = "http://localhost:8080";

export default function CreateMeetupPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventStartDate: "",
    eventStartTime: "",
    eventEndDate: "",
    eventEndTime: "",
    venueName: "",
    venueGoogleMapsUrl: "",
    isPaidEvent: false,
    eventCost: "",
    hasLimitedCapacity: false,
    eventCapacity: "",
    requireApproval: false,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === "isPaidEvent" || key === "hasLimitedCapacity" || key === "requireApproval") {
          formDataToSend.append(key, formData[key].toString());
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (imageFile) {
        formDataToSend.append("photo", imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/meetups`, {
        method: "POST",
        headers: getAuthHeaders(session),
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess("Meetup created successfully!");
        setTimeout(() => {
          router.push("/workspace/meetups");
        }, 2000);
      } else {
        setError(result.message || "Failed to create meetup");
      }
    } catch (err) {
      setError("Network error: Unable to create meetup");
      console.error("Error creating meetup:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/workspace/meetups" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Meetups
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Create a New Meetup</h1>
          <p className="text-gray-600 mt-2">Share your event with the community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="eventName">Event Name *</Label>
                    <Input
                      id="eventName"
                      value={formData.eventName}
                      onChange={(e) => handleInputChange("eventName", e.target.value)}
                      placeholder="Enter event name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="eventDescription">Description *</Label>
                    <Textarea
                      id="eventDescription"
                      value={formData.eventDescription}
                      onChange={(e) => handleInputChange("eventDescription", e.target.value)}
                      placeholder="Describe your event"
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Date and Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventStartDate">Start Date *</Label>
                      <Input
                        id="eventStartDate"
                        type="date"
                        value={formData.eventStartDate}
                        onChange={(e) => handleInputChange("eventStartDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventStartTime">Start Time *</Label>
                      <Input
                        id="eventStartTime"
                        type="time"
                        value={formData.eventStartTime}
                        onChange={(e) => handleInputChange("eventStartTime", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventEndDate">End Date *</Label>
                      <Input
                        id="eventEndDate"
                        type="date"
                        value={formData.eventEndDate}
                        onChange={(e) => handleInputChange("eventEndDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventEndTime">End Time *</Label>
                      <Input
                        id="eventEndTime"
                        type="time"
                        value={formData.eventEndTime}
                        onChange={(e) => handleInputChange("eventEndTime", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Venue Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="venueName">Venue Name *</Label>
                    <Input
                      id="venueName"
                      value={formData.venueName}
                      onChange={(e) => handleInputChange("venueName", e.target.value)}
                      placeholder="Enter venue name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="venueGoogleMapsUrl">Google Maps URL *</Label>
                    <Input
                      id="venueGoogleMapsUrl"
                      value={formData.venueGoogleMapsUrl}
                      onChange={(e) => handleInputChange("venueGoogleMapsUrl", e.target.value)}
                      placeholder="https://maps.google.com/..."
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing and Capacity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPaidEvent"
                      checked={formData.isPaidEvent}
                      onCheckedChange={(checked) => handleInputChange("isPaidEvent", checked)}
                    />
                    <Label htmlFor="isPaidEvent">This is a paid event</Label>
                  </div>

                  {formData.isPaidEvent && (
                    <div>
                      <Label htmlFor="eventCost">Event Cost ($) *</Label>
                      <Input
                        id="eventCost"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.eventCost}
                        onChange={(e) => handleInputChange("eventCost", e.target.value)}
                        placeholder="0.00"
                        required={formData.isPaidEvent}
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasLimitedCapacity"
                      checked={formData.hasLimitedCapacity}
                      onCheckedChange={(checked) => handleInputChange("hasLimitedCapacity", checked)}
                    />
                    <Label htmlFor="hasLimitedCapacity">Limited capacity</Label>
                  </div>

                  {formData.hasLimitedCapacity && (
                    <div>
                      <Label htmlFor="eventCapacity">Maximum Capacity *</Label>
                      <Input
                        id="eventCapacity"
                        type="number"
                        min="1"
                        value={formData.eventCapacity}
                        onChange={(e) => handleInputChange("eventCapacity", e.target.value)}
                        placeholder="50"
                        required={formData.hasLimitedCapacity}
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requireApproval"
                      checked={formData.requireApproval}
                      onCheckedChange={(checked) => handleInputChange("requireApproval", checked)}
                    />
                    <Label htmlFor="requireApproval">Require approval for attendees</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <Label htmlFor="image" className="cursor-pointer">
                        <span className="text-sm text-gray-600">Click to upload image</span>
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Meetup"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        {error && (
          <Alert className="mt-6 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
