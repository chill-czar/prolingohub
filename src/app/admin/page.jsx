"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionsTab from "./components/QuestionsTab";
import WorkshopsTab from "./components/WorkshopsTab";
import BookingsTab from "./components/BookingsTab";
import AvailabilityTab from "./components/AvailabilityTab";
import { adminApi } from "@/lib/axios";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await adminApi.post("/api/admin/login", { password });

      if (response.data.success) {
        // Store authentication state in localStorage
        localStorage.setItem("admin_session", "authenticated");
        localStorage.setItem("admin_login_time", Date.now());
        setIsAuthenticated(true);
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.userMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 font-[dm_sans]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[dm_sans]">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ProLingo Hub Admin
            </h1>
            <p className="text-gray-600 mt-1">
              Manage questions, workshops, bookings, and availability
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("admin_session");
              localStorage.removeItem("admin_login_time");
              setIsAuthenticated(false);
            }}
          >
            Logout
          </Button>
        </div>

        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <QuestionsTab />
          </TabsContent>

          <TabsContent value="workshops">
            <WorkshopsTab />
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilityTab />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
