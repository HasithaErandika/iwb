'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, X, Loader2 } from 'lucide-react'
import { useIncidents } from './use-incidents'
import { useSession } from 'next-auth/react'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

export default function IncidentMapPage() {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [selectedIncident, setSelectedIncident] = useState(null)
    const { data: session } = useSession()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [popoverIncident, setPopoverIncident] = useState(null)
    const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const markersRef = useRef({})

    // Use the incidents hook for API integration
    const { incidents, loading, error, totalCounts, createNewIncident } = useIncidents()

    const [formData, setFormData] = useState({
        type: '',
        description: '',
        latitude: '',
        longitude: ''
    })

    useEffect(() => {
        if (map.current) return

        if (!mapContainer.current) return

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [79.8612, 6.9271],
            zoom: 12
        })

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
        map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')
        map.current.addControl(new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserHeading: true,
        }), 'top-right')
        map.current.on('dblclick', (e) => {
            e.preventDefault()
            const { lng, lat } = e.lngLat
            console.log('Map double-clicked at:', { longitude: lng, latitude: lat })

            setFormData(prev => ({
                ...prev,
                latitude: lat.toFixed(8),
                longitude: lng.toFixed(8)
            }))

            setIsDialogOpen(true)
        })

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [])

    const addIncidentMarkers = useCallback(() => {
        if (!map.current) return

        Object.values(markersRef.current).forEach(marker => {
            if (marker) {
                marker.remove()
            }
        })

        markersRef.current = {}

        incidents.forEach(incident => {
            const markerEl = document.createElement('div')
            markerEl.className = 'incident-marker'
            markerEl.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="red" class="icon icon-tabler icons-tabler-filled icon-tabler-map-pin">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
                </svg>
            `
            const marker = new mapboxgl.Marker(markerEl)
                .setLngLat([incident.longitude, incident.latitude])
                .addTo(map.current)

            markersRef.current[incident.incidentId] = marker

            markerEl.addEventListener('click', (e) => {
                e.preventDefault()
                setSelectedIncident(incident)
                setPopoverIncident(incident)

                const mapContainer = map.current.getContainer()
                const rect = mapContainer.getBoundingClientRect()
                const markerRect = markerEl.getBoundingClientRect()

                setPopoverPosition({
                    x: markerRect.left - rect.left + markerRect.width / 2,
                    y: markerRect.top - rect.top - 10
                })
                setPopoverOpen(true)
            })
        })
    }, [incidents])

    useEffect(() => {
        if (map.current && map.current.isStyleLoaded()) {
            addIncidentMarkers()
        } else if (map.current) {
            map.current.on('style.load', addIncidentMarkers)
        }
    }, [incidents, addIncidentMarkers])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Validate coordinates
            const lat = Number(formData.latitude)
            const lng = Number(formData.longitude)

            if (isNaN(lat) || isNaN(lng)) {
                console.error('Invalid coordinates')
                return
            }

            // Create incident data for API
            const incidentData = {
                userId: "3f0c31a8-50a1-4c2a-9f3c-f1d19698b895", // Default user ID for demo
                type: formData.type,
                description: formData.description,
                latitude: lat,
                longitude: lng
            }

            console.log('Sending incident data:', incidentData)

            const result = await createNewIncident(incidentData)

            if (result.success) {
                // Reset form
                setFormData({
                    type: '',
                    description: '',
                    latitude: '',
                    longitude: ''
                })
                setIsDialogOpen(false)
            } else {
                console.error('Failed to create incident:', result.error)
                // You could add a toast notification here
            }
        } catch (error) {
            console.error('Error creating incident:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Show loading overlay only for incidents, not blocking the map
    const showLoadingOverlay = loading && incidents.length === 0;

    return (
        <div className="flex h-full gap-4 p-4">
            <div className="flex-1 relative">
                <div ref={mapContainer} className="w-full h-full rounded-lg" />

                {/* Loading overlay for incidents */}
                {showLoadingOverlay && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Loading incidents...</span>
                        </div>
                    </div>
                )}

                {/* Error overlay for incidents */}
                {error && (
                    <div className="absolute top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3 z-10 max-w-sm">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <p className="text-red-600 text-sm">Error loading incidents: {error}</p>
                        </div>
                    </div>
                )}

                {popoverOpen && popoverIncident && (
                    <div
                        className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80"
                        style={{
                            left: `${popoverPosition.x}px`,
                            top: `${popoverPosition.y}px`,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <h3 className="font-semibold text-sm">Incident #{popoverIncident.incidentId}</h3>
                                </div>
                                <button
                                    onClick={() => setPopoverOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-gray-900">{popoverIncident.incidentType}</p>
                                <p className="text-gray-600 mt-1">{popoverIncident.description}</p>
                            </div>
                            <div className="text-xs text-gray-500">
                                {new Date(popoverIncident.reportedAt).toLocaleDateString()} at {new Date(popoverIncident.reportedAt).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* right panel */}
            <div className="w-80">
                <Card className="h-full">
                    <div className="p-4 pt-0 border-b">
                        <h1 className="font-semibold text-lg mb-4">Active Incidents</h1>

                        <div className="space-y-2 mb-4">
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <div className="text-sm font-medium text-red-800">Power Cut</div>
                                <div className="text-lg font-bold text-red-600">{totalCounts.power_cut}</div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                <div className="text-sm font-medium text-yellow-800">Traffic Jam</div>
                                <div className="text-lg font-bold text-yellow-600">{totalCounts.traffic_jam}</div>
                            </div>
                            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                                <div className="text-sm font-medium text-orange-800">Safety Issue</div>
                                <div className="text-lg font-bold text-orange-600">{totalCounts.safety_issue}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                                <div className="text-sm font-medium text-gray-800">Other</div>
                                <div className="text-lg font-bold text-gray-600">{totalCounts.other}</div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => open && setIsDialogOpen(open)}>
                <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
                    <div className="absolute right-3 top-3 z-50">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsDialogOpen(false)}
                            className="h-8 w-8 rounded-full hover:bg-gray-100"
                            disabled={isSubmitting}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>
                    <DialogHeader>
                        <DialogTitle>Report New Incident</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="space-y-2 w-full">
                            <Label htmlFor="type">Incident Type</Label>
                            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))} className="w-full">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="w-full min-w-[200px]">
                                    <SelectItem value="power_cut">Power Cut</SelectItem>
                                    <SelectItem value="traffic_jam">Traffic Jam</SelectItem>
                                    <SelectItem value="safety_issue">Safety Issue</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the incident..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    placeholder="Latitude"
                                    value={formData.latitude}
                                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    placeholder="Longitude"
                                    value={formData.longitude}
                                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button className="bg-indigo-500 hover:bg-indigo-600" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Report Incident'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
