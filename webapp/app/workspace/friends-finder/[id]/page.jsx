"use client";
import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function UserProfilePage({ params }) {
  const resolvedParams = use(params);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/users/${resolvedParams.id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch user");
        }

        const userData = await response.json();
        setUser(userData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchUser();
    }
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black p-4 md:p-8 flex items-center justify-center">
        <p className="text-blue-600">Loading user...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black p-4 md:p-8 flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!user) {
    notFound();
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white text-black p-4 md:p-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="text-black hover:bg-gray-100"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
          {/* User Profile Section (1.4/4 width, approx 3/10) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="md:col-span-3 flex flex-col"
          >
            <Card className="border border-black bg-white text-black rounded-lg overflow-hidden flex-1 flex flex-col">
              <CardHeader className="flex flex-col items-center text-center p-6 border-b border-black">
                {" "}
                <Avatar className="h-24 w-24 mb-4 border border-black">
                  <AvatarImage
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={`${user.firstName || ""} ${user.lastName || ""}`}
                  />
                  <AvatarFallback className="bg-gray-200 text-black text-4xl">
                    {user.firstName?.[0]?.toUpperCase() || "U"}
                    {user.lastName?.[0]?.toUpperCase() || "S"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-3xl font-bold text-black">
                  {user.firstName || "Unknown"} {user.lastName || "User"}
                </CardTitle>
                <p className="text-gray-700 text-lg">
                  @{user.username || "unknown"}
                </p>
              </CardHeader>
              <CardContent className="p-6 grid gap-4 flex-1 overflow-y-auto">
                {" "}
                <div className="flex flex-col">
                  <span className="font-semibold text-black text-sm mb-1">
                    Email:
                  </span>
                  <span className="text-gray-800 text-base">
                    {user.email || "Not provided"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-black text-sm mb-1">
                    Phone:
                  </span>
                  <span className="text-gray-800 text-base">
                    {user.mobileNumber || "Not provided"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-black text-sm mb-1">
                    Country:
                  </span>
                  <span className="text-gray-800 text-base">
                    {user.country || "Not provided"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-black text-sm mb-1">
                    Date of Birth:
                  </span>
                  <span className="text-gray-800 text-base">
                    {user.birthdate || "Not provided"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-black text-sm mb-1">
                    Bio:
                  </span>
                  <p className="text-gray-800 text-base">
                    {user.bio || "No bio available"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Section (2.6/4 width, approx 7/10) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="md:col-span-7 flex flex-col"
          >
            <Card className="border border-black bg-white text-black rounded-lg overflow-hidden flex flex-col flex-1">
              <CardContent className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                {/* Simulated Chat Messages */}
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%] border border-gray-200">
                    {"Hello there! How can I assist you today regarding "}
                    <span className="font-semibold">{user.firstName}</span>
                    {"?"}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%] border border-gray-200">
                    {
                      "I'm an AI assistant, and this panel simulates a real-time conversation."
                    }
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%] border border-gray-200">
                    {
                      "You can ask me about their profile details, activities, or anything else you'd like to know."
                    }
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%] border border-gray-200">
                    {"For example, you could ask: 'What is "}
                    <span className="font-semibold">{user.firstName}</span>
                    {"'s country?'"}
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t border-black">
                <Input
                  placeholder="Type your message..."
                  disabled
                  className="bg-gray-100 border-gray-300 text-gray-600 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
