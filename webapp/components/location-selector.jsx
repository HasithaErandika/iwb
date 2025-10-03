"use client";
import { useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl from "mapbox-gl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, X } from "lucide-react";
import { useSession } from "next-auth/react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export default function LocationSelector({ onLocationSet, currentLocation }) {
  const [userLocation, setUserLocation] = useState(currentLocation || null);
  const { data: session } = useSession();

  const handleLocationSelect = (result) => {
    const { coordinates } = result.features[0].geometry;
    const location = {
      cityName: result.features[0].place_name,
      latitude: coordinates[1],
      longitude: coordinates[0],
    };
    setUserLocation(location);
  };

  const saveLocation = async () => {
    if (!userLocation || !session?.user?.id) return;

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cityName: userLocation.cityName,
          cityLatitude: userLocation.latitude,
          cityLongitude: userLocation.longitude,
        }),
      });

      if (response.ok) {
        onLocationSet?.(userLocation);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to save location:", error);
    }
  };

  return (
    <div className="relative z-0">
      <Card className="relative overflow-hidden p-4 space-y-3 bg-card border">
        {/* soft light gradient only in light mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:hidden" />
        <div className="relative flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Set Your Location</h3>
        </div>

        <div className="relative w-full">
          <SearchBox
            accessToken={mapboxgl.accessToken}
            onRetrieve={handleLocationSelect}
            placeholder="Search for your city..."
            options={{
              country: "LK",
              types: "place,locality",
              language: ["en"],
              limit: 8
            }}
          />
        </div>

        <div className="relative space-y-2">
          {userLocation && (
            <div className="p-2 bg-muted rounded text-sm">
              <p className="font-medium text-foreground">{userLocation.cityName}</p>
              <p className="text-xs text-muted-foreground">
                {userLocation.latitude.toFixed(4)},{" "}
                {userLocation.longitude.toFixed(4)}
              </p>
            </div>
          )}
          <Button onClick={saveLocation} className="w-full" disabled={!userLocation}>
            {userLocation ? "Save Location" : "Search a city to save"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
