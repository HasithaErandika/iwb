"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Phone, Edit, Check, X, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export function MobileNumberCard() {
    const { data: session } = useSession();
    const [mobileNumber, setMobileNumber] = useState("");
    const [displayNumber, setDisplayNumber] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [hasFetched, setHasFetched] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (session?.access_token && !hasFetched) {
            fetchMobileNumber();
        }
    }, [session?.access_token, hasFetched]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    // Format mobile number for display (international format)
    const formatMobileNumber = (number) => {
        if (!number) return "";
        
        // Remove all non-digit characters except +
        const cleaned = number.replace(/[^\d+]/g, '');
        
        // If it's already in international format, format it nicely
        if (cleaned.startsWith('+') && cleaned.length > 1) {
            // Simple formatting: +XX XXX XXX XXX
            let formatted = '+' + cleaned.substring(1, 3);
            let remaining = cleaned.substring(3);
            
            // Add spaces every 3 digits
            for (let i = 0; i < remaining.length; i += 3) {
                formatted += ' ' + remaining.substring(i, i + 3);
            }
            
            return formatted;
        }
        
        // For other formats, try to detect Sri Lankan numbers
        if (cleaned.startsWith('0') && cleaned.length === 10 && cleaned.startsWith('07')) {
            return `+94 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
        } else if (cleaned.startsWith('94') && cleaned.length === 11 && cleaned.startsWith('947')) {
            return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
        } else if (cleaned.length === 9 && cleaned.startsWith('7')) {
            return `+94 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
        }
        
        // For other numbers, just return as is
        return number;
    };

    // Prepare number for saving (remove formatting but keep + for international numbers)
    const sanitizeMobileNumber = (number) => {
        // Keep + for international numbers, remove other formatting
        if (number.startsWith('+')) {
            return '+' + number.replace(/[^\d+]/g, '').substring(1);
        }
        return number.replace(/\D/g, '');
    };

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
                    setDisplayNumber(formatMobileNumber(userData.data.mobileNumber));
                }
            }
        } catch (error) {
            console.error('Error fetching mobile number:', error);
            setError("Failed to load mobile number");
        } finally {
            setIsLoading(false);
        }
    };

    const validateMobileNumber = (number) => {
        const cleaned = sanitizeMobileNumber(number);
        
        // Basic validation: must have at least 7 digits
        // For international numbers, must start with +
        if (cleaned.startsWith('+')) {
            return cleaned.replace(/\D/g, '').length >= 8;
        }
        
        // For local numbers, at least 7 digits
        return cleaned.length >= 7;
    };

    const handleSave = async () => {
        const cleanedNumber = sanitizeMobileNumber(mobileNumber);
        
        if (!cleanedNumber) {
            setError("Mobile number is required");
            return;
        }

        if (!validateMobileNumber(mobileNumber)) {
            setError("Please enter a valid mobile number (at least 7 digits)");
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
                    mobileNumber: cleanedNumber
                })
            });

            if (response.ok) {
                // Update display number after successful save
                setDisplayNumber(formatMobileNumber(mobileNumber));
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
        // Reset to original values
        setMobileNumber(displayNumber ? displayNumber.replace(/[^\d+]/g, '') : "");
        setIsEditing(false);
        setError("");
    };

    // Handle auto-save when user finishes typing (blur event or Enter key)
    const handleAutoSave = async () => {
        // Only save if there's actually a mobile number entered
        if (mobileNumber.trim()) {
            await handleSave();
        } else {
            // If empty, just close the editor without saving
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAutoSave();
        }
    };

    // Handle input change with formatting
    const handleInputChange = (e) => {
        const value = e.target.value;
        setMobileNumber(value);
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

    if ((mobileNumber || displayNumber) && !isEditing) {
        return (
            <Card className="px-3 py-2 bg-muted/50 border-muted">
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                        {displayNumber || formatMobileNumber(mobileNumber)}
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
                        ref={inputRef}
                        value={mobileNumber}
                        onChange={handleInputChange}
                        onBlur={handleAutoSave}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., +94 77 123 4567 or 0771234567"
                        className="h-6 text-sm border-0 bg-transparent p-0 focus-visible:ring-0"
                        disabled={isSaving}
                    />
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleAutoSave}
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