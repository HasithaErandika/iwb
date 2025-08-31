"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getAuthHeaders } from "@/lib/api"
import { useSession } from "next-auth/react"

const ratingCategories = [
    { id: "cost", label: "Cost of Living", emoji: "💰", description: "Overall affordability" },
    { id: "internet", label: "Internet Speed", emoji: "📶", description: "Connection quality" },
    { id: "fun", label: "Fun & Entertainment", emoji: "🎉", description: "Activities and nightlife" },
    { id: "safety", label: "Safety", emoji: "🛡️", description: "General security" },
    { id: "safeWomen", label: "Safe for Women", emoji: "👩", description: "Women safety level" },
    { id: "safeLGBTQ", label: "Safe for LGBTQ+", emoji: "🌈", description: "LGBTQ+ friendliness" },
    { id: "foodSafety", label: "Food Safety", emoji: "🤮", description: "Food hygiene standards" },
    { id: "crime", label: "Lack of Crime", emoji: "👮‍♀️", description: "Low crime rates" },
    { id: "racism", label: "Lack of Racism", emoji: "🤝", description: "Racial tolerance" },
    { id: "education", label: "Education Level", emoji: "🎓", description: "Educational standards" },
    { id: "powerGrid", label: "Power Grid", emoji: "⚡️", description: "Electricity reliability" },
    { id: "climate", label: "Climate Resilience", emoji: "🌊", description: "Climate change vulnerability" },
    { id: "income", label: "Income Level", emoji: "💰", description: "Average income" },
    { id: "english", label: "English Speaking", emoji: "🙊", description: "English proficiency" },
    { id: "density", label: "People Density", emoji: "😤", description: "Population density" },
    { id: "walkability", label: "Walkability", emoji: "🚶", description: "Walking friendliness" },
    { id: "traffic", label: "Traffic Safety", emoji: "🚦", description: "Road safety" },
    { id: "airline", label: "Airline Scores", emoji: "✈️", description: "Airport quality" },
    { id: "luggage", label: "Lost Luggage", emoji: "🧳", description: "Baggage handling" },
    { id: "happiness", label: "Happiness", emoji: "😄", description: "General happiness" },
    { id: "nightlife", label: "Nightlife", emoji: "🍸", description: "Night entertainment" },
    { id: "wifi", label: "Free WiFi", emoji: "📶", description: "WiFi availability" },
    { id: "workspace", label: "Work Spaces", emoji: "🖥", description: "Coworking options" },
    { id: "climate_control", label: "A/C or Heating", emoji: "❄️", description: "Climate control" },
    { id: "foreigners", label: "Friendly to Foreigners", emoji: "😁", description: "Foreigner friendliness" },
    { id: "speech", label: "Freedom of Speech", emoji: "🗯", description: "Expression freedom" },
    { id: "startup", label: "Startup Score", emoji: "🎅", description: "Startup ecosystem" },
]

const ratingLabels = ["Bad", "Okay", "Good", "Great", "Amazing"]

export default function ComprehensiveRatingForm({ cityName = "Colombo", selectedCity, userId = "guest-user" }) {
    const [ratings, setRatings] = useState({})
    const [review, setReview] = useState("")
    const { data: session } = useSession()
    const displayCityName = selectedCity?.name || cityName

    const handleRatingChange = (categoryId, rating) => {
        setRatings((prev) => ({ ...prev, [categoryId]: rating }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedCity?.cityId) return

        // Map UI ratings to backend schema
        const payload = {
            userId: userId,
            ratings: {
                costOfLiving: Number(ratings.cost || 3),
                safety: Number(ratings.safety || 3),
                transportation: Number(ratings.transport || 3),
                healthcare: Number(ratings.education || 3),
                food: Number(ratings.foodSafety || 3),
                nightlife: Number(ratings.nightlife || ratings.fun || 3),
                culture: Number(ratings.happiness || 3),
                outdoorActivities: Number(ratings.walkability || 3),
            },
            reviewText: review || undefined,
        }

        try {
            const res = await fetch(`http://localhost:8080/api/cities/${selectedCity.cityId}/ratings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders(session) },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            if (res.ok && data?.success) {
                setRatings({})
                setReview("")
                alert('Thanks for rating!')
            } else {
                alert(data?.message || 'Failed to submit rating')
            }
        } catch (e) {
            console.error('Failed to submit rating', e)
            alert('Failed to submit rating')
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="px-12 pt-8">
                <CardTitle className="text-3xl font-bold text-left">Rate {displayCityName}</CardTitle>
                <p className="text-lg text-muted-foreground text-left">Share your experience and help other travelers</p>
            </CardHeader>
            <CardContent className="px-12 pb-8">
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-8">
                        {ratingCategories.map((category) => (
                            <div key={category.id} className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl mt-1">{category.emoji}</span>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold mb-1">{category.label}</h4>
                                        <p className="text-base text-muted-foreground leading-relaxed">{category.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-12">
                                    {ratingLabels.map((label, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleRatingChange(category.id, index + 1)}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${ratings[category.id] === index + 1
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background hover:bg-muted border-border"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 pt-4">
                        <label className="text-lg font-semibold">Additional Comments</label>
                        <Textarea
                            placeholder="Share your detailed experience about living in or visiting this city..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="min-h-[120px] text-base"
                        />
                    </div>

                    <Button type="submit" className="w-full text-lg py-3 mt-8">
                        Submit Rating
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
