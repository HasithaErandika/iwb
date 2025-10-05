import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Wifi, Users, Thermometer, Droplets, Coffee, MapPin, Star, Clock, Heart } from "lucide-react"

const getCityData = (selectedCity) => ({
    totalScore: selectedCity?.rating || "N/A",
    rank: selectedCity?.rank || 0,
    population: selectedCity?.population || 0,
    temperature: selectedCity?.temperature || 0,
    costOfLiving: selectedCity?.costOfLiving || 0,
    category: selectedCity?.category || "Unknown",
    description: selectedCity?.description || "No description available",
    amenities: selectedCity?.amenities || [],
    scores: [
        {
            label: "Cost of Living",
            value: selectedCity?.costOfLiving ? `$${selectedCity.costOfLiving}/mo` : "N/A",
            color: "bg-green-500",
            icon: DollarSign
        },
        {
            label: "Internet Speed",
            value: selectedCity?.internetSpeed || "N/A",
            color: "bg-green-500",
            icon: Wifi
        },
        {
            label: "Quality of Life",
            value: selectedCity?.qualityOfLife || "N/A",
            color: "bg-green-500",
            icon: Coffee
        },
        {
            label: "Safety",
            value: selectedCity?.safety || "N/A",
            color: "bg-green-500",
            icon: Users
        },
        {
            label: "Climate",
            value: selectedCity?.temperature ? `${selectedCity.temperature}°C Average` : "N/A",
            color: "bg-blue-500",
            icon: Thermometer
        },
        {
            label: "Population",
            value: selectedCity?.population ? `${(selectedCity.population / 1000).toFixed(0)}K People` : "N/A",
            color: "bg-purple-500",
            icon: Users
        },
        {
            label: "Fun & Entertainment",
            value: selectedCity?.entertainment || "N/A",
            color: "bg-green-500",
            icon: Heart
        },
        {
            label: "Walkability",
            value: selectedCity?.walkability || "N/A",
            color: "bg-yellow-500",
            icon: MapPin
        },
    ],
})

export default function CityOverview({ selectedCity }) {
    const cityData = getCityData(selectedCity)

    return (
        <div className="space-y-6">
            {/* City Description Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-left">About This City</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold text-lg">{cityData.category}</h3>
                            <p className="text-muted-foreground leading-relaxed">{cityData.description}</p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <h4 className="font-semibold mb-3 text-base">Key Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                            {cityData.amenities.map((amenity, index) => (
                                <Badge key={index} variant="outline" className="text-sm">
                                    {amenity}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Overall Rating */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-left">Overall Rating</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Star className="w-8 h-8 fill-current text-amber-500" />
                            <span className="text-3xl font-bold">{cityData.totalScore}/5</span>
                        </div>
                        <div>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 mb-1">
                                Rank #{cityData.rank}
                            </Badge>
                            <p className="text-sm text-muted-foreground">Based on traveler reviews</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-left">Detailed Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cityData.scores.map((score, index) => {
                            const IconComponent = score.icon
                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <IconComponent className="w-5 h-5 text-primary" />
                                        <span className="font-medium text-base">{score.label}</span>
                                    </div>
                                    <Badge className={`${score.color} text-white font-medium`}>{score.value}</Badge>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
