"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function page() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const response = await fetch("http://localhost:8080/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const usersData = await response.json();

        if (Array.isArray(usersData)) {
          setUsers(usersData);
        } else if (usersData && Array.isArray(usersData.data)) {
          setUsers(usersData.data);
        } else {
          console.error("API response is not an array:", usersData);
          setError("Invalid data format received from server");
          setUsers([]);
        }
      } catch (err) {
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Get unique countries for filter dropdown
  const uniqueCountries = useMemo(() => {
    const countries = [
      "all",
      ...new Set(users.map((user) => user.country).filter(Boolean)),
    ];
    return countries;
  }, [users]);

  // Filter users based on search term and selected country
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry =
        selectedCountry === "all" || user.country === selectedCountry;

      return matchesSearch && matchesCountry;
    });
  }, [users, searchTerm, selectedCountry]);
  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">User Directory</h1>{" "}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-8 bg-white border border-black text-black placeholder:text-gray-500 focus-visible:ring-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select onValueChange={setSelectedCountry} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px] border border-black bg-white text-black">
              <SelectValue placeholder="Filter by Country" />
            </SelectTrigger>
            <SelectContent className="border border-black bg-white text-black">
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueCountries.slice(1).map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>{" "}
        <div className="flex flex-col gap-4">
          {loading && (
            <div className="text-center">
              <p className="text-blue-600">Loading users...</p>
            </div>
          )}
          {error && (
            <div className="text-center">
              <p className="text-red-600 bg-red-50 p-4 rounded">{error}</p>
            </div>
          )}{" "}
          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No users found matching your criteria.
              </p>
            </div>
          )}
          {!loading &&
            !error &&
            filteredUsers.length > 0 &&
            filteredUsers.map((user) => (
              <div key={user.userId || user.id}>
                <Card className="border border-black rounded-lg p-4 ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-15 w-15 bg-gray-300 text-gray-700 font-semibold text-lg flex-shrink-0">
                        <AvatarFallback>
                          {user.firstName?.[0]?.toUpperCase() || "U"}
                          {user.lastName?.[0]?.toUpperCase() || "S"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-black leading-tight">
                          {user.firstName && user.lastName
                            ? `${user.firstName.trim()} ${user.lastName.trim()}`
                            : user.username?.split("@")[0] ||
                              user.email?.split("@")[0] ||
                              "Unknown User"}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.country && (
                          <Badge
                            variant="outline"
                            className="border-gray-400 text-gray-700 bg-white px-3 py-1 mt-1"
                          >
                            {user.country}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link href={`/workspace/friends-finder/${user.userId}`}>
                        <Button
                          variant="outline"
                          className="border-gray-400 text-gray-700 bg-white hover:bg-gray-100"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
