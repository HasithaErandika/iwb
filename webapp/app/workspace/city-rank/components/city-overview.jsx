import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  Wifi, 
  Users, 
  Thermometer, 
  Coffee, 
  MapPin, 
  Star, 
  Heart,
  Shield,
  Car,
  Utensils,
  Moon,
  Walk,
  Building,
  TrendingUp,
  Calendar,
  Globe
} from "lucide-react"

const getCityData = (selectedCity) => {
  // Use ratingsBreakdown if available, otherwise fall back to individual properties
  const ratings = selectedCity?.ratingsBreakdown || selectedCity || {}
  
  return {
    totalScore: selectedCity?.rating || "N/A",
    rank: selectedCity?.rank || 0,
    population: selectedCity?.population || 0,
    temperature: selectedCity?.temperature || 0,
    costOfLiving: selectedCity?.costOfLiving || 0,
    category: selectedCity?.category || "Unknown",
    description: selectedCity?.description || "No description available",
    amenities: selectedCity?.amenities || [],
    totalRatings: selectedCity?.totalRatings || 0, // Fixed this line
    scores: [
      {
        label: "Cost of Living",
        value: ratings.costOfLivingAvg ? `${ratings.costOfLivingAvg.toFixed(1)}/5` : (selectedCity?.costOfLiving ? `$${selectedCity.costOfLiving}/mo` : "N/A"),
        color: "bg-green-500",
        icon: DollarSign,
        detail: "Affordability rating"
      },
      {
        label: "Internet Speed",
        value: ratings.internetSpeedAvg ? `${ratings.internetSpeedAvg.toFixed(1)}/5` : "N/A",
        color: "bg-blue-500",
        icon: Wifi,
        detail: "Connectivity quality"
      },
      {
        label: "Safety",
        value: ratings.safetyAvg ? `${ratings.safetyAvg.toFixed(1)}/5` : (selectedCity?.safety || "N/A"),
        color: "bg-green-500",
        icon: Shield,
        detail: "Security level"
      },
      {
        label: "Transportation",
        value: ratings.transportationAvg ? `${ratings.transportationAvg.toFixed(1)}/5` : (selectedCity?.transportation || "N/A"),
        color: "bg-blue-500",
        icon: Car,
        detail: "Public transit"
      },
      {
        label: "Healthcare",
        value: ratings.healthcareAvg ? `${ratings.healthcareAvg.toFixed(1)}/5` : (selectedCity?.healthcare || "N/A"),
        color: "bg-green-500",
        icon: Users,
        detail: "Medical services"
      },
      {
        label: "Food Quality",
        value: ratings.foodAvg ? `${ratings.foodAvg.toFixed(1)}/5` : (selectedCity?.food || "N/A"),
        color: "bg-green-500",
        icon: Utensils,
        detail: "Cuisine & safety"
      },
      {
        label: "Nightlife",
        value: ratings.nightlifeAvg ? `${ratings.nightlifeAvg.toFixed(1)}/5` : (selectedCity?.nightlife || "N/A"),
        color: "bg-purple-500",
        icon: Moon,
        detail: "Entertainment"
      },
      {
        label: "Culture",
        value: ratings.cultureAvg ? `${ratings.cultureAvg.toFixed(1)}/5` : (selectedCity?.culture || "N/A"),
        color: "bg-green-500",
        icon: Coffee,
        detail: "Arts & heritage"
      },
      {
        label: "Outdoor Activities",
        value: ratings.outdoorActivitiesAvg ? `${ratings.outdoorActivitiesAvg.toFixed(1)}/5` : (selectedCity?.outdoorActivities || "N/A"),
        color: "bg-green-500",
        icon: Heart,
        detail: "Recreation"
      },
    ],
  }
}

export default function CityOverview({ selectedCity }) {
  const cityData = getCityData(selectedCity)

  // Render star ratings
  const renderStars = (rating) => {
    const numericRating = parseFloat(rating);
    if (isNaN(numericRating)) return null;
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= numericRating ? "fill-current text-amber-500" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* City Description Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-left">About {selectedCity?.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {cityData.category}
                <Badge variant="secondary" className="text-xs">
                  {cityData.totalRatings} reviews
                </Badge>
              </h3>
              <p className="text-muted-foreground leading-relaxed">{cityData.description}</p>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="font-semibold mb-3 text-base">Key Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {cityData.amenities.length > 0 ? (
                cityData.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {amenity}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No amenities listed</p>
              )}
            </div>
          </div>
          
          {/* City Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Rank</span>
              </div>
              <p className="text-lg font-bold">#{cityData.rank}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Rating</span>
              </div>
              <p className="text-lg font-bold">{cityData.totalScore}/5</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Population</span>
              </div>
              <p className="text-lg font-bold">
                {cityData.population > 0 ? `${(cityData.population / 1000000).toFixed(1)}M` : "N/A"}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Thermometer className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Climate</span>
              </div>
              <p className="text-lg font-bold">
                {cityData.temperature > 0 ? `${cityData.temperature}°C` : "N/A"}
              </p>
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
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <span className="text-3xl font-bold">{cityData.totalScore}/5</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Rank #{cityData.rank}
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="mb-2">
                {renderStars(cityData.totalScore)}
              </div>
              <p className="text-muted-foreground">
                Based on {cityData.totalRatings} community reviews
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This city is rated {cityData.totalScore >= 4 ? "excellent" : cityData.totalScore >= 3 ? "good" : "fair"} by travelers
              </p>
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
              const numericValue = parseFloat(score.value)
              const isValidNumber = !isNaN(numericValue) && numericValue >= 1 && numericValue <= 5
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium text-base">{score.label}</span>
                      <p className="text-xs text-muted-foreground">{score.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isValidNumber ? (
                      <>
                        <span className="text-lg font-bold">{numericValue.toFixed(1)}</span>
                        <Badge className={`${score.color} text-white font-medium`}>
                          {score.value}
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="outline" className="font-medium">
                        N/A
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}