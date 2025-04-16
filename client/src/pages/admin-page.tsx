import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FlightTable from "@/components/admin/flight-table";
import BookingTable from "@/components/admin/booking-table";
import { useAuth } from "@/hooks/use-auth";
import { PlaneTakeoff, Users, BarChart3 } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>("flights");
  const { user } = useAuth();

  // Summary stats (would ideally be fetched from an API endpoint)
  const stats = {
    totalFlights: 2,
    totalBookings: 0,
    totalUsers: 1,
    revenueMonth: 0,
  };

  return (
    <section className="py-12 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
              <p className="text-neutral-dark">Welcome back, {user?.username}</p>
            </div>
          </div>

          {/* Dashboard Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Flights</CardDescription>
                <CardTitle className="text-2xl">{stats.totalFlights}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-neutral-dark flex items-center">
                  <PlaneTakeoff className="h-4 w-4 mr-1" />
                  <span className="text-sm">Active flights</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Bookings</CardDescription>
                <CardTitle className="text-2xl">{stats.totalBookings}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-neutral-dark flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm">Confirmed bookings</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-2xl">{stats.totalUsers}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-neutral-dark flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">Registered users</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Monthly Revenue</CardDescription>
                <CardTitle className="text-2xl">${stats.revenueMonth}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-neutral-dark flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span className="text-sm">Current month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="flights">Manage Flights</TabsTrigger>
              <TabsTrigger value="bookings">View Bookings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="flights">
              <FlightTable />
            </TabsContent>
            
            <TabsContent value="bookings">
              <BookingTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
