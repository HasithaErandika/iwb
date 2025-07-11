"use client";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const destinationData = {
  colombo: {
    name: "Colombo, Sri Lanka",
    description:
      "Colombo is Sri Lanka's vibrant commercial capital and largest city, known for its unique blend of colonial architecture, modern skyscrapers, and rich cultural heritage. The city offers a dynamic mix of historic neighborhoods, world-class cuisine, bustling markets, and iconic landmarks like the Gangaramaya Temple and Galle Face Green waterfront promenade.",
    image: "/placeholder.svg?height=400&width=800",
    published: "May 15, 2025",
    readTime: "6 min read",
    views: "34,526",
    likes: "2,134",
    whenToVisit: {
      primeVisitingSeason:
        "December to March offer ideal conditions with temperatures in the mid-70s to low-80s°F and minimal rainfall during the dry season throughout the city.",
      budgetFriendlyOption:
        "April to June provides more affordable accommodation while maintaining pleasant weather perfect for sightseeing architectural landmarks and enjoying coastal activities.",
      weatherConsiderations:
        "Colombo's climate is generally warm and humid suitable for both city exploration and beach relaxation, with the dry season offering the best balance of comfortable temperatures and fewer crowds.",
    },
    highlights: [
      "Gangaramaya Temple - Sacred Buddhist temple complex",
      "Galle Face Green - Historic oceanfront urban park",
      "Pettah Market - Bustling traditional bazaar",
      "National Museum - Colonial-era artifacts and history",
      "Independence Memorial Hall - National monument",
      "Viharamahadevi Park - Largest park in Colombo",
    ],
    sidebar: [
      {
        title: "When to Visit Colombo",
        content: "December-March for dry weather",
      },
      { title: "7-Day Itinerary", content: "Complete Colombo city experience" },
      {
        title: "Accommodation Options",
        content: "From guesthouses to luxury hotels",
      },
      { title: "Getting Around", content: "Tuk-tuks, buses, and trains" },
      {
        title: "Sri Lankan Culinary Delights",
        content: "Rice & curry, hoppers, kottu",
      },
      {
        title: "Cultural Etiquette",
        content: "Temple visits and local customs",
      },
    ],
    sources: [
      {
        name: "Colombo Travel Guide & Tips",
        author: "lonelyplanet",
        type: "Lonely Planet Sri Lanka",
      },
      {
        name: "Tourist Attractions Colombo",
        author: "srilanka.travel",
        type: "Official Tourism Board",
      },
      {
        name: "Colombo City Guide: 25 Best Things to Do",
        author: "earthtrekkers",
        type: "Earth Trekkers Travel Blog",
      },
      {
        name: "Colombo Districts & Overview of the City",
        author: "colombopage",
        type: "Colombo Telegraph",
      },
      {
        name: "Sri Lanka Travel Information",
        author: "roughguides",
        type: "Rough Guides",
      },
      {
        name: "Colombo Weather & Climate Guide",
        author: "weatherbase",
        type: "Weather Statistics",
      },
    ],
    contact: {
      touristHotline: "+94 11 243 8059",
      email: "info@srilanka.travel",
      website: "www.srilanka.travel",
      emergencyServices: "119 (Police), 110 (Fire)",
    },
  },
  kurunegala: {
    name: "Kurunegala, Sri Lanka",
    description:
      "Kurunegala is a historic city in Sri Lanka's North Western Province, renowned for its ancient rock formations and rich cultural heritage. Known as the 'City of Rocks,' it features the iconic Elephant Rock (Ethagala) and served as a medieval capital. The city offers visitors ancient temples, colonial architecture, and stunning panoramic views from its rocky outcrops.",
    image: "/placeholder.svg?height=400&width=800",
    published: "May 12, 2025",
    readTime: "5 min read",
    views: "18,432",
    likes: "892",
    whenToVisit: {
      primeVisitingSeason:
        "December to February offer ideal conditions with temperatures in the mid-70s°F and clear skies perfect for rock climbing and temple visits throughout the region.",
      budgetFriendlyOption:
        "March to May provides more affordable accommodation while maintaining pleasant weather perfect for exploring ancient ruins and enjoying cultural landmarks.",
      weatherConsiderations:
        "Kurunegala's climate is generally warm and dry suitable for both historical exploration and outdoor activities, with the dry season offering the best balance of comfortable temperatures and clear visibility.",
    },
    highlights: [
      "Elephant Rock (Ethagala) - Iconic rock formation",
      "Ridi Viharaya - Ancient silver temple",
      "Kurunegala Lake - Scenic urban lake",
      "Athugala Rock - Panoramic city views",
      "Dolukanda Temple - Historic Buddhist site",
      "Kurunegala Clock Tower - Colonial landmark",
    ],
    sidebar: [
      {
        title: "When to Visit Kurunegala",
        content: "December-February for clear weather",
      },
      {
        title: "4-Day Itinerary",
        content: "Ancient sites and rock formations",
      },
      {
        title: "Accommodation Options",
        content: "Local guesthouses and hotels",
      },
      { title: "Getting Around", content: "Local buses and three-wheelers" },
      { title: "Local Cuisine", content: "Traditional rice & curry varieties" },
      { title: "Rock Climbing Tips", content: "Safety and best viewing spots" },
    ],
    sources: [
      {
        name: "Kurunegala Travel Guide",
        author: "srilankatourism",
        type: "Sri Lanka Tourism Board",
      },
      {
        name: "Ancient Capitals of Sri Lanka",
        author: "archaeology.lk",
        type: "Department of Archaeology",
      },
      {
        name: "Kurunegala Rock Formations Guide",
        author: "wonderlanka",
        type: "Wonder Lanka Travel",
      },
      {
        name: "North Western Province Travel",
        author: "exploresrilanka",
        type: "Explore Sri Lanka",
      },
    ],
    contact: {
      touristHotline: "+94 37 222 2661",
      email: "kurunegala@srilanka.travel",
      website: "www.nwp.gov.lk",
      emergencyServices: "119 (Police), 110 (Fire)",
    },
  },
  kandy: {
    name: "Kandy, Sri Lanka",
    description:
      "Kandy is Sri Lanka's cultural capital and a UNESCO World Heritage Site, nestled in the central highlands. Home to the sacred Temple of the Sacred Tooth Relic (Sri Dalada Maligawa), Kandy is considered the heart of Sri Lankan Buddhism. The city offers visitors ancient temples, colonial architecture, the beautiful Kandy Lake, and the famous Royal Botanical Gardens in nearby Peradeniya.",
    image: "/placeholder.svg?height=400&width=800",
    published: "May 10, 2025",
    readTime: "7 min read",
    views: "42,156",
    likes: "3,045",
    whenToVisit: {
      primeVisitingSeason:
        "December to April offer ideal conditions with temperatures in the low-70s°F and minimal rainfall during the dry season, perfect for temple visits and cultural festivals.",
      budgetFriendlyOption:
        "May to July provides more affordable accommodation while maintaining pleasant weather perfect for exploring the botanical gardens and enjoying highland scenery.",
      weatherConsiderations:
        "Kandy's climate is generally cooler than coastal areas and suitable for both cultural exploration and nature walks, with the dry season offering the best balance of comfortable temperatures and clear mountain views.",
    },
    highlights: [
      "Temple of the Sacred Tooth Relic - Most sacred Buddhist site",
      "Kandy Lake - Artificial lake in city center",
      "Royal Botanical Gardens - 147-acre garden paradise",
      "Kandy Cultural Show - Traditional dance performances",
      "Udawattakele Sanctuary - Forest reserve above the city",
      "Bahirawakanda Vihara Buddha Statue - Giant white Buddha",
    ],
    sidebar: [
      { title: "When to Visit Kandy", content: "December-April for festivals" },
      { title: "5-Day Itinerary", content: "Temples, gardens, and culture" },
      {
        title: "Accommodation Options",
        content: "Heritage hotels and guesthouses",
      },
      { title: "Getting Around", content: "Walking and local transport" },
      {
        title: "Cultural Experiences",
        content: "Temple visits and ceremonies",
      },
      { title: "Day Trips", content: "Tea plantations and waterfalls" },
    ],
    sources: [
      {
        name: "Kandy UNESCO World Heritage Guide",
        author: "unesco.org",
        type: "UNESCO World Heritage",
      },
      {
        name: "Temple of the Tooth Official Guide",
        author: "daladalmaligawa.lk",
        type: "Sri Dalada Maligawa",
      },
      {
        name: "Kandy Cultural Triangle",
        author: "culturaltriangle.gov.lk",
        type: "Cultural Triangle",
      },
      {
        name: "Royal Botanical Gardens Peradeniya",
        author: "botanicgardens.gov.lk",
        type: "Department of Botanic Gardens",
      },
      {
        name: "Kandy Travel Comprehensive Guide",
        author: "lonelyplanet",
        type: "Lonely Planet",
      },
    ],
    contact: {
      touristHotline: "+94 81 222 2661",
      email: "kandy@srilanka.travel",
      website: "www.kandy.lk",
      emergencyServices: "119 (Police), 110 (Fire)",
    },
  },
  galle: {
    name: "Galle, Sri Lanka",
    description:
      "Galle is a historic coastal city in southern Sri Lanka, famous for its well-preserved Dutch colonial architecture and the iconic Galle Fort, a UNESCO World Heritage Site. Built by the Portuguese and later fortified by the Dutch, the fort area features cobblestone streets, colonial buildings, boutique hotels, and stunning ocean views. The city perfectly blends historical charm with modern coastal tourism.",
    image: "/placeholder.svg?height=400&width=800",
    published: "May 8, 2025",
    readTime: "6 min read",
    views: "38,892",
    likes: "2,567",
    whenToVisit: {
      primeVisitingSeason:
        "December to March offer ideal conditions with temperatures in the low-80s°F and minimal rainfall during the dry season, perfect for fort exploration and beach activities.",
      budgetFriendlyOption:
        "April to June provides more affordable accommodation while maintaining pleasant weather perfect for exploring colonial architecture and enjoying coastal dining.",
      weatherConsiderations:
        "Galle's climate is generally warm and coastal suitable for both historical exploration and beach relaxation, with the dry season offering the best balance of comfortable temperatures and calm seas.",
    },
    highlights: [
      "Galle Fort - UNESCO World Heritage Dutch fort",
      "Galle Lighthouse - Historic lighthouse within the fort",
      "Dutch Reformed Church - 18th-century colonial church",
      "Galle National Museum - Maritime and colonial history",
      "Unawatuna Beach - Nearby pristine beach",
      "Stilt Fishermen - Traditional fishing method",
    ],
    sidebar: [
      {
        title: "When to Visit Galle",
        content: "December-March for beach weather",
      },
      { title: "4-Day Itinerary", content: "Fort, beaches, and culture" },
      {
        title: "Accommodation Options",
        content: "Boutique hotels in the fort",
      },
      { title: "Getting Around", content: "Walking the fort, tuk-tuks" },
      {
        title: "Coastal Cuisine",
        content: "Fresh seafood and Dutch influences",
      },
      { title: "Beach Activities", content: "Swimming, snorkeling, surfing" },
    ],
    sources: [
      {
        name: "Galle Fort UNESCO Guide",
        author: "unesco.org",
        type: "UNESCO World Heritage",
      },
      {
        name: "Dutch Colonial Heritage Galle",
        author: "archaeology.gov.lk",
        type: "Department of Archaeology",
      },
      {
        name: "Galle Tourism Official Guide",
        author: "srilanka.travel",
        type: "Sri Lanka Tourism",
      },
      {
        name: "Southern Province Travel Guide",
        author: "southernprovince.gov.lk",
        type: "Southern Province",
      },
      {
        name: "Galle Fort Walking Tour Guide",
        author: "gallefort.org",
        type: "Galle Heritage Foundation",
      },
    ],
    contact: {
      touristHotline: "+94 91 223 4059",
      email: "galle@srilanka.travel",
      website: "www.gallefort.org",
      emergencyServices: "119 (Police), 110 (Fire)",
    },
  },
};

export default function DestinationPage({ params }) {
  const { id } = params;
  const destination = destinationData[id];

  if (!destination) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">
            Destination not found
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-medium text-gray-900 mb-6">
              {destination.name}
            </h1>

            <p className="text-gray-700 leading-relaxed mb-8 text-base">
              {destination.description}
            </p>

            {/* Author Info */}
            <div className="flex items-center space-x-4 mb-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Curated by perplexity.travel</span>
              </div>
              <span>{destination.readTime}</span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Published {destination.published}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{destination.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{destination.likes}</span>
              </div>
            </div>

            {/* Source Links */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {destination.sources.slice(0, 4).map((source, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {source.name}
                      </p>
                      <p className="text-xs text-gray-600">{source.author}</p>
                      <p className="text-xs text-gray-500">{source.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-lg mb-8">
              <Image
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                width={800}
                height={400}
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-4 right-4">
                <Badge
                  variant="secondary"
                  className="bg-black/70 text-white text-xs"
                >
                  srilanka.travel
                </Badge>
              </div>
            </div>

            {/* When to Visit Section */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                When to Visit {destination.name.split(",")[0]}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    • Prime Visiting Season:
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4">
                    {destination.whenToVisit.primeVisitingSeason}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    • Budget-Friendly Option:
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4">
                    {destination.whenToVisit.budgetFriendlyOption}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    • Weather Considerations:
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4">
                    {destination.whenToVisit.weatherConsiderations}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center"
                      >
                        <span className="text-xs">{i}</span>
                      </div>
                    ))}
                  </div>
                  <span>{destination.sources.length} sources</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Tourist Hotline: {destination.contact.touristHotline}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Email: {destination.contact.email}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Website: {destination.contact.website}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-4 h-4 text-red-500 font-bold text-center">
                    !
                  </span>
                  <span className="text-sm">
                    Emergency: {destination.contact.emergencyServices}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* All Sources */}
            <div className="border-t pt-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">
                All Sources
              </h3>
              <div className="space-y-3">
                {destination.sources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 text-sm"
                  >
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900">{source.name}</p>
                      <p className="text-gray-600">{source.author}</p>
                      <p className="text-gray-500">{source.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {destination.sidebar.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <h4 className="font-medium text-gray-900 mb-2 text-sm">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.content}</p>
              </div>
            ))}

            {/* Key Highlights */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 text-sm">
                Key Highlights
              </h4>
              <ul className="space-y-2">
                {destination.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-xs text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
