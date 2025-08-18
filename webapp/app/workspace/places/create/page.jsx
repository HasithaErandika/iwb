"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, XCircle, Upload, X } from "lucide-react";
import Link from "next/link";

const API_BASE_URL = "http://localhost:8080";

const workspaceTypes = [
    "Flexible Workspace",
    "Creative Studio",
    "Private Office",
    "Meeting Room",
    "Tech Workspace",
    "Eco-Friendly"
];

const amenities = [
    "High-Speed WiFi",
    "Meeting Rooms",
    "Parking",
    "Coffee Bar",
    "24/7 Access",
    "Gym",
    "Printing",
    "Kitchen",
    "Rooftop Terrace",
    "Phone Booths",
    "3D Printing",
    "Workshop Area",
    "Art Supplies",
    "Photography Studio",
    "Garden Area",
    "Bike Storage"
];

export default function CreatePlacePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        googleMapsUrl: "",
        price: "",
        currency: "USD",
        billing: "daily",
        capacity: "",
        workspaceTypes: [],
        amenities: [],
        phone: "",
        email: "",
        website: "",
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayChange = (field, value, checked) => {
        setFormData(prev => ({
            ...prev,
            [field]: checked
                ? [...prev[field], value]
                : prev[field].filter(item => item !== value)
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images];
        const newPreviews = [...imagePreviews];

        files.forEach((file, index) => {
            if (newImages.length < 3) {
                newImages.push(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    setImagePreviews([...newPreviews]);
                };
                reader.readAsDataURL(file);
            }
        });

        setImages(newImages);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (formData.workspaceTypes.length === 0) {
            setError("Please select at least one workspace type");
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === "workspaceTypes" || key === "amenities") {
                    formDataToSend.append(key, formData[key].join(","));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            images.forEach((image, index) => {
                formDataToSend.append(`photo${index + 1}`, image);
            });


            console.log("Form data being sent:", {
                ...formData,
                workspaceTypes: formData.workspaceTypes.join(","),
                amenities: formData.amenities.join(","),
                imageCount: images.length
            });

            const response = await fetch(`${API_BASE_URL}/api/places`, {
                method: "POST",
                body: formDataToSend,
            });

            const result = await response.json();
            console.log("Backend response:", result);

            if (response.ok && result.success) {
                setSuccess("Place created successfully!");
                setTimeout(() => {
                    router.push("/workspace/places");
                }, 2000);
            } else {
                setError(result.message || "Failed to create place");
            }
        } catch (err) {
            setError("Network error: Unable to create place");
            console.error("Error creating place:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/workspace/places" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Places
                    </Link>
                    <h1 className="text-3xl font-semibold text-gray-900">Add a New Place</h1>
                    <p className="text-gray-600 mt-2">Share your workspace with the community</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Place Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            placeholder="Enter place name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="location">Location *</Label>
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange("location", e.target.value)}
                                            placeholder="City, State or Address"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="googleMapsUrl">Google Maps URL *</Label>
                                        <Input
                                            id="googleMapsUrl"
                                            value={formData.googleMapsUrl}
                                            onChange={(e) => handleInputChange("googleMapsUrl", e.target.value)}
                                            placeholder="https://maps.google.com/..."
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pricing Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pricing Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="price">Price *</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={formData.price}
                                                onChange={(e) => handleInputChange("price", e.target.value)}
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="currency">Currency</Label>
                                            <select
                                                id="currency"
                                                value={formData.currency}
                                                onChange={(e) => handleInputChange("currency", e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            >
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                                <option value="CAD">CAD</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="billing">Billing Period</Label>
                                            <select
                                                id="billing"
                                                value={formData.billing}
                                                onChange={(e) => handleInputChange("billing", e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            >
                                                <option value="hourly">Hourly</option>
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Capacity and Types */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Capacity and Types</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="capacity">Capacity *</Label>
                                        <Input
                                            id="capacity"
                                            value={formData.capacity}
                                            onChange={(e) => handleInputChange("capacity", e.target.value)}
                                            placeholder="e.g., 1-50 people"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Workspace Types *</Label>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {workspaceTypes.map((type) => (
                                                <label key={type} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.workspaceTypes.includes(type)}
                                                        onChange={(e) => handleArrayChange("workspaceTypes", type, e.target.checked)}
                                                        className="rounded border-gray-300 text-black focus:ring-black"
                                                    />
                                                    <span className="text-sm">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                placeholder="Phone number"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                placeholder="Email address"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            value={formData.website}
                                            onChange={(e) => handleInputChange("website", e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Image Upload */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Images (Optional)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-1 gap-3">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 h-6 w-6 p-0"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {imagePreviews.length < 3 && (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <Label htmlFor="images" className="cursor-pointer">
                                                <span className="text-sm text-gray-600">
                                                    Click to upload images ({imagePreviews.length}/3)
                                                </span>
                                            </Label>
                                            <Input
                                                id="images"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Amenities */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Amenities</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {amenities.map((amenity) => (
                                        <label key={amenity} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.amenities.includes(amenity)}
                                                onChange={(e) => handleArrayChange("amenities", amenity, e.target.checked)}
                                                className="rounded border-gray-300 text-black focus:ring-black"
                                            />
                                            <span className="text-sm">{amenity}</span>
                                        </label>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
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
                                            "Create Place"
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>

                {/* Error/Success Messages */}
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
