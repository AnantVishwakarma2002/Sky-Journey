import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Edit, Trash2, Search, Eye, X, Plus } from "lucide-react";
import { Flight, Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddFlightForm from "@/components/admin/add-flight-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [flightSearch, setFlightSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [flightToDelete, setFlightToDelete] = useState<number | null>(null);
  const [showAddFlightDialog, setShowAddFlightDialog] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  
  // Flight filters
  const [airlineFilter, setAirlineFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  // Booking filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookingDateFilter, setBookingDateFilter] = useState("all");
  
  const { data: flights, isLoading: flightsLoading } = useQuery<Flight[]>({
    queryKey: ["/api/admin/flights"],
  });
  
  const { data: bookings, isLoading: bookingsLoading } = useQuery<(Booking & { flight: any, user: any })[]>({
    queryKey: ["/api/admin/bookings"],
  });
  
  const deleteFlightMutation = useMutation({
    mutationFn: async (flightId: number) => {
      await apiRequest("DELETE", `/api/admin/flights/${flightId}`);
    },
    onSuccess: () => {
      toast({
        title: "Flight Deleted",
        description: "The flight has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/flights"] });
      setFlightToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      await apiRequest("PATCH", `/api/admin/bookings/${bookingId}/cancel`);
    },
    onSuccess: () => {
      toast({
        title: "Booking Cancelled",
        description: "The booking has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleEditFlight = (flight: Flight) => {
    setEditingFlight(flight);
    setShowAddFlightDialog(true);
  };
  
  const handleDeleteFlight = (flightId: number) => {
    setFlightToDelete(flightId);
  };
  
  const confirmDeleteFlight = () => {
    if (flightToDelete !== null) {
      deleteFlightMutation.mutate(flightToDelete);
    }
  };
  
  const handleCancelBooking = (bookingId: number) => {
    cancelBookingMutation.mutate(bookingId);
  };
  
  // Filter flights
  const filteredFlights = flights
    ?.filter(flight => {
      // Text search
      const searchMatch = flightSearch === "" || 
        flight.flightNumber.toLowerCase().includes(flightSearch.toLowerCase()) ||
        flight.airline.toLowerCase().includes(flightSearch.toLowerCase()) ||
        flight.from.toLowerCase().includes(flightSearch.toLowerCase()) ||
        flight.to.toLowerCase().includes(flightSearch.toLowerCase());
        
      // Airline filter
      const airlineMatch = airlineFilter === "all" || 
        flight.airline === airlineFilter;
        
      // Route filter
      const routeMatch = routeFilter === "all" || 
        `${flight.from}-${flight.to}` === routeFilter;
        
      // Date filter
      let dateMatch = true;
      if (dateFilter === "today") {
        const today = new Date().toISOString().split('T')[0];
        dateMatch = flight.departureDate === today;
      } else if (dateFilter === "thisWeek") {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const flightDate = new Date(flight.departureDate);
        dateMatch = flightDate >= weekStart && flightDate <= weekEnd;
      } else if (dateFilter === "thisMonth") {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const flightDate = new Date(flight.departureDate);
        dateMatch = flightDate >= monthStart && flightDate <= monthEnd;
      }
      
      return searchMatch && airlineMatch && routeMatch && dateMatch;
    });
    
  // Filter bookings
  const filteredBookings = bookings
    ?.filter(booking => {
      // Text search
      const searchMatch = bookingSearch === "" || 
        `BK${booking.id.toString().padStart(9, '0')}`.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        booking.flight.flightNumber.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        (booking.user.name && booking.user.name.toLowerCase().includes(bookingSearch.toLowerCase())) ||
        (booking.user.email && booking.user.email.toLowerCase().includes(bookingSearch.toLowerCase()));
        
      // Status filter
      const statusMatch = statusFilter === "all" || 
        booking.status === statusFilter;
        
      // Date filter
      let dateMatch = true;
      if (bookingDateFilter === "today") {
        const today = new Date().toISOString().split('T')[0];
        const bookingDate = new Date(booking.bookingDate).toISOString().split('T')[0];
        dateMatch = bookingDate === today;
      } else if (bookingDateFilter === "thisWeek") {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const bookingDate = new Date(booking.bookingDate);
        dateMatch = bookingDate >= weekStart && bookingDate <= weekEnd;
      } else if (bookingDateFilter === "thisMonth") {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const bookingDate = new Date(booking.bookingDate);
        dateMatch = bookingDate >= monthStart && bookingDate <= monthEnd;
      }
      
      return searchMatch && statusMatch && dateMatch;
    });
    
  // Extract unique airlines, routes for filters
  const airlines = [...new Set(flights?.map(flight => flight.airline))];
  const routes = [...new Set(flights?.map(flight => `${flight.from}-${flight.to}`))];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <section className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2 md:mb-0">Admin Dashboard</h2>
          <div className="flex space-x-3">
            <Button 
              onClick={() => {
                setEditingFlight(null);
                setShowAddFlightDialog(true);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New Flight
            </Button>
          </div>
        </div>
        
        {/* Flights Management */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-neutral-100 p-4 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-700">Flights Management</h3>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="w-full md:w-auto mb-3 md:mb-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    className="pl-9 w-full md:w-64"
                    placeholder="Search flights..."
                    value={flightSearch}
                    onChange={(e) => setFlightSearch(e.target.value)}
                  />
                  {flightSearch && (
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setFlightSearch("")}
                    >
                      <X className="h-4 w-4 text-neutral-400" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={airlineFilter} onValueChange={setAirlineFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Airlines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Airlines</SelectItem>
                    {airlines?.map(airline => (
                      <SelectItem key={airline} value={airline}>{airline}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={routeFilter} onValueChange={setRouteFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Routes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Routes</SelectItem>
                    {routes?.map(route => {
                      const [from, to] = route.split('-');
                      return (
                        <SelectItem key={route} value={route}>
                          {from} - {to}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Flight No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Airline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      From - To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Seats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {flightsLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-16" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-32" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-16" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-24 rounded-full" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredFlights?.length ? (
                    filteredFlights.map((flight) => (
                      <tr key={flight.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-700">
                          {flight.flightNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          {flight.airline}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          <div className="flex items-center">
                            <span>{flight.from}</span>
                            <span className="mx-1">→</span>
                            <span>{flight.to}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          <div>{flight.departureDate}</div>
                          <div className="text-neutral-500">{flight.departureTime} - {flight.arrivalTime}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                          ${flight.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          <div className="flex items-center">
                            <span className={`
                              px-2 py-0.5 rounded-full text-xs 
                              ${flight.availableSeats > 10 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : flight.availableSeats > 5
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-red-100 text-red-600'
                              }
                            `}>
                              {flight.availableSeats} available
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button 
                              className="text-primary hover:text-primary/80"
                              onClick={() => handleEditFlight(flight)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteFlight(flight.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                        No flights found. {flightSearch && 'Try a different search term.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-neutral-100 p-4 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-700">Recent Bookings</h3>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="w-full md:w-auto mb-3 md:mb-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    className="pl-9 w-full md:w-64"
                    placeholder="Search bookings..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                  />
                  {bookingSearch && (
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setBookingSearch("")}
                    >
                      <X className="h-4 w-4 text-neutral-400" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={bookingDateFilter} onValueChange={setBookingDateFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Passenger
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Flight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {bookingsLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-16 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-16" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredBookings?.length ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-700">
                          BK{booking.id.toString().padStart(9, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          <div>{booking.user?.name || 'Unknown'}</div>
                          <div className="text-neutral-500 text-xs">{booking.user?.email || 'No email'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          <div>{booking.flight.flightNumber}</div>
                          <div className="flex items-center text-xs text-neutral-500">
                            <span>{booking.flight.from}</span>
                            <span className="mx-1">→</span>
                            <span>{booking.flight.to}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          <div>{booking.flight.departureDate}</div>
                          <div className="text-neutral-500 text-xs">
                            Booked: {formatDate(new Date(booking.bookingDate))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                          ${booking.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          <span className={`
                            px-2 py-0.5 rounded-full text-xs 
                            ${booking.status === 'confirmed' 
                              ? 'bg-emerald-100 text-emerald-600' 
                              : 'bg-red-100 text-red-600'
                            }
                          `}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-primary hover:text-primary/80"
                              onClick={() => window.location.href = `/booking/confirmation/${booking.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {booking.status === 'confirmed' && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                        No bookings found. {bookingSearch && 'Try a different search term.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add/Edit Flight Dialog */}
      <Dialog open={showAddFlightDialog} onOpenChange={setShowAddFlightDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFlight ? 'Edit Flight' : 'Add New Flight'}
            </DialogTitle>
          </DialogHeader>
          <AddFlightForm 
            flight={editingFlight} 
            onClose={() => setShowAddFlightDialog(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Flight Confirmation */}
      <AlertDialog open={flightToDelete !== null} onOpenChange={(open) => !open && setFlightToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flight?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flight? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteFlight}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
