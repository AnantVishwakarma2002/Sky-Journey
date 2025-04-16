import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Booking } from "@shared/schema";
import BookingCard from "@/components/bookings/booking-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function MyBookingsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  
  const { data: bookings, isLoading } = useQuery<(Booking & { flight: any })[]>({
    queryKey: ["/api/bookings"],
  });
  
  const cancelMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      await apiRequest("DELETE", `/api/bookings/${bookingId}`);
    },
    onSuccess: () => {
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setBookingToCancel(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleCancelBooking = (bookingId: number) => {
    setBookingToCancel(bookingId);
  };
  
  const confirmCancelBooking = () => {
    if (bookingToCancel !== null) {
      cancelMutation.mutate(bookingToCancel);
    }
  };
  
  const filteredBookings = searchTerm 
    ? bookings?.filter(booking => 
        `BK${booking.id.toString().padStart(9, '0')}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.flight.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.flight.to.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : bookings;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">My Bookings</h2>
        
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                className="pl-9"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4 text-neutral-400" />
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="bg-neutral-100 p-3 flex justify-between items-center">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div className="flex items-start mb-3 md:mb-0">
                        <Skeleton className="h-10 w-10 rounded-full mr-3" />
                        <div className="space-y-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="text-center mb-2 md:mb-0 md:mr-4">
                          <Skeleton className="h-6 w-16 mx-auto mb-1" />
                          <Skeleton className="h-4 w-10 mx-auto" />
                        </div>
                        <div className="hidden md:block md:mx-2">
                          <Skeleton className="h-1 w-32 my-2" />
                          <Skeleton className="h-4 w-10 mx-auto" />
                        </div>
                        <div className="text-center">
                          <Skeleton className="h-6 w-16 mx-auto mb-1" />
                          <Skeleton className="h-4 w-10 mx-auto" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between pt-3 border-t border-neutral-200">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      <div className="flex space-x-2 mt-2 md:mt-0">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredBookings?.length ? (
              filteredBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onCancelBooking={handleCancelBooking} 
                />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                  <span className="text-2xl">✈</span>
                </div>
                <h3 className="text-lg font-medium text-neutral-700 mb-1">No Bookings Found</h3>
                <p className="text-neutral-500 mb-4">
                  {searchTerm 
                    ? "No bookings match your search criteria." 
                    : "You haven't made any bookings yet."}
                </p>
                {searchTerm ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                ) : (
                  <Button 
                    variant="default"
                    onClick={() => window.location.href = "/search"}
                  >
                    Book a Flight
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <AlertDialog open={bookingToCancel !== null} onOpenChange={(open) => !open && setBookingToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep It</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelBooking}
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
