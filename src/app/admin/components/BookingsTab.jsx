"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Search } from "lucide-react";
import { adminApi } from "@/lib/axios";

const BOOKING_TYPES = [
  { value: "WORKSHOP", label: "Workshop" },
  { value: "PRIVATE_1_1", label: "Private 1-on-1" },
  { value: "PRIVATE_4_PACKAGE", label: "Private 4-Session Package" },
];

export default function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    date: "",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/admin/bookings");
      setBookings(response.data.data);
    } catch (err) {
      setError(err.userMessage || "Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Search filter (name, email, phone)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.name?.toLowerCase().includes(searchLower) ||
          booking.email?.toLowerCase().includes(searchLower) ||
          booking.phone?.toLowerCase().includes(searchLower),
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(
        (booking) => booking.bookingType === filters.type,
      );
    }

    // Date filter
    if (filters.date) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.createdAt)
          .toISOString()
          .split("T")[0];
        return bookingDate === filters.date;
      });
    }

    setFilteredBookings(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "",
      date: "",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getBookingTypeLabel = (type) => {
    const bookingType = BOOKING_TYPES.find((bt) => bt.value === type);
    return bookingType ? bookingType.label : type;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p>Loading bookings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Bookings Overview</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              View all customer bookings and session details
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {BOOKING_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="w-full sm:w-48"
            />
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {bookings.length}
                </div>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter((b) => b.bookingType === "WORKSHOP").length}
                </div>
                <p className="text-sm text-gray-600">Workshop Bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {
                    bookings.filter((b) => b.bookingType === "PRIVATE_1_1")
                      .length
                  }
                </div>
                <p className="text-sm text-gray-600">Private 1-on-1</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {
                    bookings.filter(
                      (b) => b.bookingType === "PRIVATE_4_PACKAGE",
                    ).length
                  }
                </div>
                <p className="text-sm text-gray-600">4-Session Packages</p>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Session Details</TableHead>
                  <TableHead>Workshop</TableHead>
                  <TableHead>Booked On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {bookings.length === 0
                        ? "No bookings found."
                        : "No bookings match your filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.name}</div>
                          <div className="text-sm text-gray-600">
                            {booking.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getBookingTypeLabel(booking.bookingType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <Calendar className="inline w-3 h-3 mr-1" />
                            {booking.sessionDates?.length > 0
                              ? booking.sessionDates
                                  .map((date) => formatDate(date))
                                  .join(", ")
                              : formatDate(booking.date)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatTime(booking.startTime)} -{" "}
                            {formatTime(booking.endTime)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Level: {booking.englishLevel}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.workshopId ? (
                          <div>
                            <div className="font-medium text-sm">
                              {booking.workshopId.title}
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatDate(booking.workshopId.date)} at{" "}
                              {formatTime(booking.workshopId.startTime)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(booking.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
