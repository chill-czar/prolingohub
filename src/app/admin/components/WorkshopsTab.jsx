"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Edit, Trash2, CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { adminApi } from "@/lib/axios";

// Available time slots (9 AM to 5 PM, 1-hour blocks)
const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function WorkshopsTab() {
  const [workshops, setWorkshops] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: null,
    startTime: "",
    endTime: "",
    capacity: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch workshops
      const workshopResponse = await adminApi.get("/api/admin/workshops");
      setWorkshops(workshopResponse.data.data);

      // Fetch bookings for stats
      const bookingResponse = await adminApi.get("/api/admin/bookings");
      setBookings(bookingResponse.data.data);
    } catch (err) {
      setError(err.userMessage || "Failed to fetch workshop data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (date) => {
    if (!date) {
      setAvailableSlots([]);
      return;
    }

    try {
      const dateString = format(date, "yyyy-MM-dd");
      const response = await adminApi.get(
        `/api/availability?date=${dateString}`,
      );
      setAvailableSlots(response.data.data);
    } catch (err) {
      console.error("Error fetching available slots:", err);
      setAvailableSlots([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.startTime ||
      !formData.capacity
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (parseInt(formData.capacity) <= 0) {
      setError("Capacity must be greater than 0");
      return;
    }

    const dateString = format(formData.date, "yyyy-MM-dd");
    const endTime = formData.startTime.replace(/^\d{2}/, (match) => {
      const hour = parseInt(match) + 1;
      return hour.toString().padStart(2, "0");
    });

    const submitData = {
      ...formData,
      date: dateString,
      endTime,
    };

    try {
      if (editingWorkshop) {
        await adminApi.put(
          `/api/admin/workshops/${editingWorkshop._id}`,
          submitData,
        );
      } else {
        await adminApi.post("/api/admin/workshops", submitData);
      }

      await fetchData();
      setShowDialog(false);
      resetForm();
    } catch (err) {
      setError(err.userMessage || "Failed to save workshop");
      console.error("Error saving workshop:", err);
    }
  };

  const handleDelete = async (workshopId) => {
    if (
      !confirm(
        "Are you sure you want to delete this workshop? This may affect existing bookings.",
      )
    )
      return;

    try {
      await adminApi.delete(`/api/admin/workshops/${workshopId}`);
      await fetchData();
    } catch (err) {
      setError(err.userMessage || "Failed to delete workshop");
      console.error("Error deleting workshop:", err);
    }
  };

  const handleEdit = (workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      title: workshop.title,
      description: workshop.description,
      date: new Date(workshop.date),
      startTime: workshop.startTime,
      capacity: workshop.capacity.toString(),
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: null,
      startTime: "",
      capacity: "",
    });
    setEditingWorkshop(null);
    setError("");
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getWorkshopBookings = (workshopId) => {
    return bookings.filter((booking) => booking.workshopId?._id === workshopId)
      .length;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p>Loading workshops...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Workshops Management</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Create and manage English workshops (1-hour sessions)
              </p>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Workshop
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingWorkshop ? "Edit Workshop" : "Create New Workshop"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="title">Workshop Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter workshop title"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the workshop content"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Select Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date
                              ? format(formData.date, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={async (date) => {
                              setFormData({ ...formData, date, startTime: "" });
                              await fetchAvailableSlots(date);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Select Time Slot *</Label>
                      <select
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startTime: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-md"
                        disabled={!formData.date}
                      >
                        <option value="">Choose available time</option>
                        {availableSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {formatTime(slot)} -{" "}
                            {formatTime(
                              slot.replace(/^\d{2}/, (match) => {
                                const hour = parseInt(match) + 1;
                                return hour.toString().padStart(2, "0");
                              }),
                            )}
                          </option>
                        ))}
                      </select>
                      {formData.date && availableSlots.length === 0 && (
                        <p className="text-sm text-red-600 mt-1">
                          No available slots for this date
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="capacity">Capacity *</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) =>
                          setFormData({ ...formData, capacity: e.target.value })
                        }
                        placeholder="Max participants"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingWorkshop ? "Update" : "Create"} Workshop
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error && !showDialog && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {workshops.length}
                </div>
                <p className="text-sm text-gray-600">Total Workshops</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {
                    workshops.filter((w) => new Date(w.date) >= new Date())
                      .length
                  }
                </div>
                <p className="text-sm text-gray-600">Upcoming</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {workshops.reduce(
                    (acc, w) => acc + getWorkshopBookings(w._id),
                    0,
                  )}
                </div>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </CardContent>
            </Card>
          </div>

          {/* Workshops Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workshops.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No workshops found. Create your first workshop!
                    </TableCell>
                  </TableRow>
                ) : (
                  workshops
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((workshop) => {
                      const bookingCount = getWorkshopBookings(workshop._id);
                      const isPast = new Date(workshop.date) < new Date();

                      return (
                        <TableRow key={workshop._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {workshop.title}
                              </div>
                              <div className="text-sm text-gray-600 line-clamp-2">
                                {workshop.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>
                                {format(
                                  new Date(workshop.date),
                                  "MMM dd, yyyy",
                                )}
                              </div>
                              <div className="text-gray-600">
                                {formatTime(workshop.startTime)} -{" "}
                                {formatTime(workshop.endTime)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>
                                {bookingCount}/{workshop.capacity}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                bookingCount > 0 ? "default" : "secondary"
                              }
                            >
                              {bookingCount} booked
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {!isPast && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(workshop)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(workshop._id)}
                                className="text-red-600 hover:text-red-700"
                                disabled={bookingCount > 0}
                                title={
                                  bookingCount > 0
                                    ? "Cannot delete workshop with active bookings"
                                    : "Delete workshop"
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
