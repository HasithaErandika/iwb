'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Search,
  ImageIcon,
  ArrowLeft
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

export default function MeetupPage() {
  const [meetups, setMeetups] = useState([]);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch all meetups
  const fetchMeetups = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/api/meetups`);
      const data = await response.json();

      if (response.ok) {
        // Handle both array response and object with meetups array
        const meetupsList = Array.isArray(data) ? data : (data.meetups || []);
        setMeetups(meetupsList);
      } else {
        setError(data.message || 'Failed to fetch meetups');
      }
    } catch (err) {
      setError('Network error: Unable to fetch meetups');
      console.error('Error fetching meetups:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific meetup details
  const fetchMeetupDetails = async (eventId) => {
    try {
      setLoadingDetail(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/api/meetups/${eventId}`);
      const data = await response.json();

      if (response.ok) {
        setSelectedMeetup(data);
      } else {
        setError(data.message || 'Failed to fetch meetup details');
      }
    } catch (err) {
      setError('Network error: Unable to fetch meetup details');
      console.error('Error fetching meetup details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Load meetups on component mount
  useEffect(() => {
    fetchMeetups();
  }, []);

  // Format date and time
  const formatDateTime = (date, time) => {
    try {
      const datetime = new Date(`${date}T${time}`);
      return datetime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return `${date} at ${time}`;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Filter meetups based on search term
  const filteredMeetups = meetups.filter(meetup =>
    meetup.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meetup.eventDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meetup.venueName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle going back to list view
  const handleBackToList = () => {
    setSelectedMeetup(null);
    setError('');
  };

  // Render meetup detail view
  if (selectedMeetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Meetups
          </Button>

          {loadingDetail ? (
            <Card className="shadow-lg">
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                <span>Loading meetup details...</span>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Event Image */}
                  {selectedMeetup.imageUrl && (
                    <div className="md:w-1/3">
                      <img
                        src={selectedMeetup.imageUrl}
                        alt={selectedMeetup.eventName}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{selectedMeetup.eventName}</CardTitle>
                    <CardDescription className="text-lg mb-4">
                      {selectedMeetup.eventDescription}
                    </CardDescription>

                    {/* Event Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedMeetup.isPaidEvent && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Paid Event
                        </Badge>
                      )}
                      {selectedMeetup.hasLimitedCapacity && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          <Users className="w-3 h-3 mr-1" />
                          Limited Capacity
                        </Badge>
                      )}
                      {selectedMeetup.requireApproval && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approval Required
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Event Info - Compact Layout */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {/* Date & Time - Single Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-sm">Starts:</span>
                      <span className="text-sm">{formatDateTime(selectedMeetup.eventStartDate, selectedMeetup.eventStartTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span className="font-medium text-sm">Ends:</span>
                      <span className="text-sm">{formatDateTime(selectedMeetup.eventEndDate, selectedMeetup.eventEndTime)}</span>
                    </div>
                  </div>

                  {/* Venue & Maps - Single Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-1">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-sm">{selectedMeetup.venueName}</span>
                    </div>
                    {selectedMeetup.venueGoogleMapsUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={selectedMeetup.venueGoogleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Maps
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Price & Capacity - Inline */}
                {(selectedMeetup.isPaidEvent || selectedMeetup.hasLimitedCapacity) && (
                  <div className="flex flex-wrap gap-4">
                    {selectedMeetup.isPaidEvent && (
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-green-700">{formatCurrency(selectedMeetup.eventCost)}</span>
                        <span className="text-xs text-green-600">per person</span>
                      </div>
                    )}

                    {selectedMeetup.hasLimitedCapacity && (
                      <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span className="font-bold text-orange-700">{selectedMeetup.eventCapacity}</span>
                        <span className="text-xs text-orange-600">max attendees</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Event Actions */}
                <div className="flex gap-3 pt-2">
                  <Button size="lg" className="flex-1 bg-black hover:bg-gray-800">
                    {selectedMeetup.requireApproval ? 'Request to Join' : 'Join Event'}
                  </Button>
                  <Button variant="outline" size="lg" className="px-6">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    );
  }

  // Render meetup list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Meetups & Events</h1>
          <p className="text-lg text-gray-600">Discover and join amazing events in your community</p>
        </div>

        {/* Search Bar */}
        <Card className="shadow-lg mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search meetups by name, description, or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="shadow-lg">
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading meetups...</span>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert className="border-red-200 bg-red-50 mb-6">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Meetups Grid */}
        {!loading && filteredMeetups.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetups.map((meetup) => (
              <Card
                key={meetup.eventId}
                className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => fetchMeetupDetails(meetup.eventId)}
              >
                <CardHeader className="pb-3">
                  {meetup.imageUrl ? (
                    <img
                      src={meetup.imageUrl}
                      alt={meetup.eventName}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-gray-400" />
                    </div>
                  )}

                  <CardTitle className="line-clamp-2 text-lg leading-tight">{meetup.eventName}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {meetup.eventDescription} description
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 px-4 pb-4">
                  {/* Date & Venue - Combined Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="font-medium">{formatDateTime(meetup.eventStartDate, meetup.eventStartTime)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span className="truncate font-medium">{meetup.venueName}</span>
                    </div>
                  </div>

                  {/* Badges - More Compact */}
                  <div className="flex flex-wrap gap-1 min-h-[20px]">
                    {meetup.isPaidEvent && (
                      <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 font-medium px-1.5 py-0.5">
                        <DollarSign className="w-2.5 h-2.5 mr-0.5" />
                        {formatCurrency(meetup.eventCost)}
                      </Badge>
                    )}
                    {meetup.hasLimitedCapacity && (
                      <Badge variant="secondary" className="text-[10px] bg-orange-100 text-orange-700 font-medium px-1.5 py-0.5">
                        <Users className="w-2.5 h-2.5 mr-0.5" />
                        {meetup.eventCapacity} max
                      </Badge>
                    )}
                    {meetup.requireApproval && (
                      <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700 font-medium px-1.5 py-0.5">
                        <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                        Approval
                      </Badge>
                    )}
                  </div>

                  <Button className="w-full mt-3 bg-black hover:bg-gray-800 text-white font-medium text-sm py-2">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMeetups.length === 0 && meetups.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No meetups found</h3>
              <p className="text-gray-500">Check back later for upcoming events!</p>
              <Button
                onClick={fetchMeetups}
                variant="outline"
                className="mt-4"
              >
                Refresh
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No Search Results */}
        {!loading && filteredMeetups.length === 0 && meetups.length > 0 && searchTerm && (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
              <Button
                onClick={() => setSearchTerm('')}
                variant="outline"
                className="mt-4"
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}