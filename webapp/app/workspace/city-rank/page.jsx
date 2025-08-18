"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MapPin, Star, MessageCircle } from "lucide-react"
import AIChatInterface from "./components/ai-chat-interface"

export default function CityRankPage() {
    const router = useRouter()
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(true)

    // Load cities from backend API
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/cities', { cache: 'no-store' })
                const data = await res.json()
                if (data?.success && Array.isArray(data.data)) {
                    const mapped = data.data.map((c) => ({
                        id: c.cityId || c.city_id || c.id,
                        name: c.name,
                        slug: c.slug,
                        image: c.firstImageUrl || (Array.isArray(c.imageUrls) ? c.imageUrls[0] : c.image) || "/placeholder.svg",
                        rating: c.overallRating ?? c.rating ?? 0,
                        description: c.description ?? "",
                        rank: c.rankPosition ?? c.rank ?? 0,
                    }))
                    setCities(mapped)
                } else {
                    setCities([])
                }
            } catch (error) {
                console.error('Error fetching cities:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCities()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600">Loading cities...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-8 py-6">
                {/* Header Section */}
                <div className="mb-8 text-left">
                    <h1 className="text-3xl font-semibold tracking-tight text-black">Where Should You Be in Sri Lanka? 🤔</h1>
                    <p className="text-gray-600 mt-1">Discover cities through community rankings, ratings, and hidden stories..</p>

                </div>

                {/* Cities Grid Section */}
                <div className="space-y-6">
                    {/* Action Bar */}
                    <div className="flex justify-start">
                        <Button
                            onClick={() => router.push("/workspace/city-rank/add-city")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-primary-foreground"
                        >
                            Add New City
                        </Button>
                    </div>

                    {/* Cities Grid */}
                    {cities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {cities.map((city, index) => (
                                <div
                                    key={city.id}
                                    className="cursor-pointer group"
                                    onClick={() => router.push(`/workspace/city-rank/${city.slug}`)}
                                >
                                    <div className="relative rounded-lg overflow-hidden">
                                        <img
                                            src={city.image || "/placeholder.svg"}
                                            alt={city.name}
                                            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>

                                    <div className="pt-3 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900">
                                                {city.name}
                                            </h3>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-current text-gray-900" />
                                                <span className="text-sm font-medium">{city.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm truncate">
                                            {city.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cities yet</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Start building your city database by adding the first city. Share your experiences and help others discover amazing places.
                            </p>
                            <Button
                                onClick={() => router.push("/workspace/city-rank/add-city")}
                                className="bg-primary text-primary-foreground px-6 py-3"
                            >
                                <MapPin className="h-4 w-4 mr-2" />
                                Add Your First City
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Chat Interface */}
            <AIChatInterface />
        </div>
    )
}