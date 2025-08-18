"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Trash2, Edit, Eye, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

const API_BASE_URL = "http://localhost:8080";

export default function ManagePlacesPage() {
    const router = useRouter();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [placeToDelete, setPlaceToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch places from API
    const fetchPlaces = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_BASE_URL}/api/places`);
            const data = await response.json();

            if (response.ok) {
                if (data.success && data.data) {
                    setPlaces(data.data);
                } else {
                    setError(data.message || "No places data received");
                }
            } else {
                setError(data.message || "Failed to fetch places");
            }
        } catch (err) {
            setError("Network error: Unable to fetch places");
            console.error("Error fetching places:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load places on component mount
    useEffect(() => {
        fetchPlaces();
    }, []);

    // Delete place
    const handleDeletePlace = async () => {
        if (!placeToDelete) return;

        try {
            setDeleting(true);
            const response = await fetch(`${API_BASE_URL}/api/places/${placeToDelete.placeId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Remove the place from the list
                setPlaces(prev => prev.filter(place => place.placeId !== placeToDelete.placeId));
                setDeleteDialogOpen(false);
                setPlaceToDelete(null);
            } else {
                setError(data.message || "Failed to delete place");
            }
        } catch (err) {
            setError("Network error: Unable to delete place");
            console.error("Error deleting place:", err);
        } finally {
            setDeleting(false);
        }
    };

    const openDeleteDialog = (place) => {
        setPlaceToDelete(place);
        setDeleteDialogOpen(true);
    };

    // Format currency
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency || "USD",
        }).format(amount);
    };

    // Filter places based on search
    const filteredPlaces = places.filter((place) =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600">Loading places...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/workspace/places" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Places
                    </Link>
                    <h1 className="text-3xl font-semibold text-gray-900">Manage Places</h1>
                    <p className="text-gray-600 mt-2">View and manage your created places</p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search places..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Places Table */}
                {filteredPlaces.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Place Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Types</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPlaces.map((place) => (
                                    <TableRow key={place.placeId}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium text-gray-900">{place.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-900">{place.location}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-900">
                                                {formatCurrency(place.pricing.price, place.pricing.currency)} per {place.pricing.billing}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-900">{place.capacity}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {place.workspaceTypes.slice(0, 2).map((type) => (
                                                    <Badge
                                                        key={type}
                                                        variant="secondary"
                                                        className="text-xs bg-blue-100 text-blue-800"
                                                    >
                                                        {type}
                                                    </Badge>
                                                ))}
                                                {place.workspaceTypes.length > 2 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs bg-gray-100 text-gray-600"
                                                    >
                                                        +{place.workspaceTypes.length - 2} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Link href={`/workspace/places/${place.placeId}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(place)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? "No places found" : "No places yet"}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm
                                ? "Try adjusting your search terms"
                                : "Create your first place to get started"
                            }
                        </p>
                        {!searchTerm && (
                            <Link href="/workspace/places/create">
                                <Button>Create Place</Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Place</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{placeToDelete?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeletePlace}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
