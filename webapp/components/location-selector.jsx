"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";

// Load Google Maps JS API with Places library
function loadGoogleMapsPlaces() {
  const existing = document.querySelector('script[data-google-maps-places-loader="true"]');
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.google?.maps?.places) return resolve(window.google);
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", reject);
    });
  }
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set");
    return Promise.reject(new Error("Missing Google Maps API key"));
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-google-maps-places-loader", "true");
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function LocationSelector({ onLocationSet, currentLocation }) {
  const [userLocation, setUserLocation] = useState(currentLocation || null);
  const { data: session } = useSession();
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Log component mount and session data
  useEffect(() => {
    console.log("🏗️ LocationSelector component mounted");
    console.log("  Current location:", currentLocation);
    console.log("  Session exists:", !!session);
    console.log("  Session user:", session?.user);
    console.log("  Access token exists:", !!session?.access_token);
  }, [session, currentLocation]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    let isMounted = true;
    if (!inputRef.current) return;
    loadGoogleMapsPlaces()
      .then((google) => {
        if (!isMounted || !inputRef.current) return;
        const options = {
          types: ["(cities)"],
          componentRestrictions: { country: "LK" },
          fields: ["formatted_address", "geometry", "name"],
        };
        const ac = new google.maps.places.Autocomplete(inputRef.current, options);
        autocompleteRef.current = ac;
        ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          if (!place?.geometry?.location) return;
          const cityName = place.formatted_address || place.name || "";
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          setUserLocation({ cityName, latitude, longitude });
        });
      })
      .catch((err) => console.error("Failed to load Google Places:", err));
    return () => {
      isMounted = false;
      autocompleteRef.current = null;
    };
  }, []);

  const saveLocation = async () => {
    console.log("=== LOCATION SAVER START ===");
    console.log("User location:", userLocation);
    console.log("Session access token exists:", !!session?.access_token);

    if (!userLocation || !session?.access_token) {
      console.log("❌ Missing required data - userLocation:", !!userLocation, "access_token:", !!session?.access_token);
      return;
    }

    // Check if cityName is missing and provide a fallback
    if (!userLocation.cityName) {
      console.log("⚠️ City name is missing, using coordinates as fallback");
      userLocation.cityName = `Location (${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)})`;
      console.log("📍 Updated city name:", userLocation.cityName);
    }

    try {
      // Decode the JWT token to get the user ID (sub field)
      console.log("🔍 Decoding JWT token...");
      const tokenPayload = JSON.parse(atob(session.access_token.split('.')[1]));
      const userId = tokenPayload.sub;
      console.log("✅ User ID extracted:", userId);

      const requestData = {
        cityName: userLocation.cityName,
        cityLatitude: userLocation.latitude,
        cityLongitude: userLocation.longitude,
      };

      console.log("📤 Sending request to backend:");
      console.log("  URL: http://localhost:8080/api/users/" + userId);
      console.log("  Method: PUT");
      console.log("  Data:", JSON.stringify(requestData, null, 2));
      console.log("  Headers:", {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + session.access_token.substring(0, 20) + "..."
      });
      console.log("🔍 Debugging user ID:");
      console.log("  JWT sub (user ID):", userId);
      console.log("  JWT full payload:", JSON.stringify(tokenPayload, null, 2));

      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(requestData),
      });

      console.log("📥 Backend response received:");
      console.log("  Status:", response.status);
      console.log("  Status Text:", response.statusText);
      console.log("  OK:", response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ Location saved successfully!");
        console.log("  Response data:", JSON.stringify(responseData, null, 2));
        onLocationSet?.(userLocation);
      } else {
        const errorData = await response.text();
        console.log("❌ Failed to save location:");
        console.log("  Status:", response.status);
        console.log("  Error response:", errorData);
      }
    } catch (error) {
      console.log("💥 Error occurred while saving location:");
      console.log("  Error type:", error.constructor.name);
      console.log("  Error message:", error.message);
      console.log("  Full error:", error);
    }

    console.log("=== LOCATION SAVER END ===");
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
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for your city..."
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
            aria-label="Search for your city"
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
          <Button
            onClick={() => {
              console.log("🔘 Save Location button clicked");
              console.log("  User location:", userLocation);
              console.log("  Session:", !!session);
              saveLocation();
            }}
            className="w-full"
            disabled={!userLocation}
          >
            {userLocation ? "Save Location" : "Search a city to save"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
