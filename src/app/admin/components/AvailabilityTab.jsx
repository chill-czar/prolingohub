"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Trash2, CalendarIcon } from "lucide-react";
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

export default function AvailabilityTab() {
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch unavailabilities
      const unavailResponse = await adminApi.get("/api/admin/unavailability");
      setUnavailabilities(unavailResponse.data.data);
    } catch (err) {
      setError(err.userMessage || "Failed to fetch availability data");
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

  const handleCreateUnavailability = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

    const dateString = format(selectedDate, "yyyy-MM-dd");

    try {
      await adminApi.post("/api/admin/unavailability", {
        date: dateString,
        startTime: selectedTime,
        endTime: selectedTime.replace(/^\d{2}/, (match) => {
          const hour = parseInt(match) + 1;
          return hour.toString().padStart(2, "0");
        }),
      });

      await fetchData();
      setShowDialog(false);
      setSelectedDate(null);
      setSelectedTime("");
    } catch (err) {
      setError(err.userMessage || "Failed to create unavailability");
      console.error("Error creating unavailability:", err);
    }
  };

  const handleDeleteUnavailability = async (id) => {
    if (!confirm("Are you sure you want to delete this unavailability block?"))
      return;

    try {
      await adminApi.delete(`/api/admin/unavailability/${id}`);
      await fetchData();
    } catch (err) {
      setError(err.userMessage || "Failed to delete unavailability");
      console.error("Error deleting unavailability:", err);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p>Loading availability...</p>
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
              <CardTitle>Irina's Availability Management</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage unavailable time blocks (1-hour slots)
              </p>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedTime("");
                    setError("");
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Unavailability
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Unavailability Block</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <Label>Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate
                            ? format(selectedDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={async (date) => {
                            setSelectedDate(date);
                            setSelectedTime("");
                            await fetchAvailableSlots(date);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Select Time Slot</Label>
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                      disabled={!selectedDate}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose available time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {formatTime(slot)} -{" "}
                            {formatTime(
                              slot.replace(/^\d{2}/, (match) => {
                                const hour = parseInt(match) + 1;
                                return hour.toString().padStart(2, "0");
                              }),
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedDate && availableSlots.length === 0 && (
                      <p className="text-sm text-red-600 mt-1">
                        No available slots for this date
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateUnavailability}
                      disabled={!selectedDate || !selectedTime}
                    >
                      Create Block
                    </Button>
                  </div>
                </div>
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unavailabilities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No unavailability blocks. Irina is fully available!
                    </TableCell>
                  </TableRow>
                ) : (
                  unavailabilities
                    .sort(
                      (a, b) =>
                        new Date(a.date) - new Date(b.date) ||
                        a.startTime.localeCompare(b.startTime),
                    )
                    .map((block) => (
                      <TableRow key={block._id}>
                        <TableCell>
                          {format(new Date(block.date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {formatTime(block.startTime)} -{" "}
                          {formatTime(block.endTime)}
                        </TableCell>
                        <TableCell>
                          {block.reason || (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(block.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteUnavailability(block._id)
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
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
