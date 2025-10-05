"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Phone, Edit, Check, X, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export function MobileNumberCard() {
    const { data: session } = useSession();
    const [mobileNumber, setMobileNumber] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (session?.access_token && !hasFetched) {
            fetchMobileNumber();
        }
    }, [session?.access_token, hasFetched]);

    const fetchMobileNumber = async () => {
        try {
            setIsLoading(true);
            setError("");
            setHasFetched(true);

            // Decode JWT to get user ID
            const tokenPayload = JSON.parse(atob(session.access_token.split('.')[1]));
            const userId = tokenPayload.sub;

            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                if (userData.success && userData.data?.mobileNumber) {
                    setMobileNumber(userData.data.mobileNumber);
                }
            }
        } catch (error) {
            console.error('Error fetching mobile number:', error);
            setError("Failed to load mobile number");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!mobileNumber.trim()) {
            setError("Mobile number is required");
            return;
        }

        try {
            setIsSaving(true);
            setError("");

            // Decode JWT to get user ID
            const tokenPayload = JSON.parse(atob(session.access_token.split('.')[1]));
            const userId = tokenPayload.sub;

            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    mobileNumber: mobileNumber.trim()
                })
            });

            if (response.ok) {
                setIsEditing(false);
            } else {
                const errorData = await response.text();
                setError(errorData || "Failed to update mobile number");
            }
        } catch (error) {
            console.error('Error updating mobile number:', error);
            setError("Failed to update mobile number");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError("");
        // Don't refetch - just cancel editing
    };

    // Don't render if no session
    if (!session?.access_token) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
        );
    }

    if (mobileNumber && !isEditing) {
        return (
            <Card className="px-3 py-2 bg-muted/50 border-muted">
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                        {mobileNumber}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="h-6 w-6 p-0 hover:bg-muted"
                    >
                        <Edit className="h-3 w-3" />
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="px-3 py-2 bg-muted/50 border-muted">
            <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-1">
                    <Input
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter mobile number"
                        className="h-6 text-sm border-0 bg-transparent p-0 focus-visible:ring-0"
                        disabled={isSaving}
                    />
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                        >
                            {isSaving ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Check className="h-3 w-3 text-green-600" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                            <X className="h-3 w-3 text-red-600" />
                        </Button>
                    </div>
                </div>
            </div>
            {error && (
                <div className="text-xs text-red-500 mt-1">
                    {error}
                </div>
            )}
        </Card>
    );
}
