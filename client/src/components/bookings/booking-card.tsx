import { useState } from "react";
import { Booking, Flight } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlaneTakeoff, PlaneLanding, Receipt, AlertTriangle } from "lucide-react";

type BookingCardProps = {
  booking: Booking;
};

export default function BookingCard({ booking }: BookingCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast } = useToast();
  
  // Fetch flight details for this booking
  const { data: flight, isLoading: isLoadingFlight } = useQuery<Flight>({
    queryKey: [`/api/flights/${booking.flightId}`],
  });
  
  const formatDate = (dateString: Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const handleCancelBooking = async () => {
    setIsCancelling(true);
    
    try {
      await apiRequest("PUT", `/api/bookings/${booking.id}/cancel`, {});
      
      // Invalidate bookings cache
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled",
      });
    } catch (error) {
      toast({
        title: "Cancellation failed",
        description: error instanceof Error ? error.message : "Could not cancel booking",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };
  
  if (isLoadingFlight) {
    return (
      <div className="border border-neutral-medium rounded-lg p-4">
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (!flight) {
    return (
      <div className="border border-neutral-medium rounded-lg p-4">
        <div className="md:flex justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Booking Reference: {booking.bookingReference}</h3>
            <p className="text-red-500">Flight details not available</p>
          </div>
          <div className="mt-2 md:mt-0">
            <span className={`inline-block px-3 py-1 ${
              booking.status === "confirmed" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
              } rounded-full text-sm font-medium`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border border-neutral-medium rounded-lg p-4">
      <div className="md:flex justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{flight.from} to {flight.to}</h3>
          <p className="text-neutral-dark">Booking Reference: <span className="font-medium">{booking.bookingReference}</span></p>
        </div>
        <div className="mt-2 md:mt-0">
          <span className={`inline-block px-3 py-1 ${
            booking.status === "confirmed" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
            } rounded-full text-sm font-medium`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center">
            <PlaneTakeoff className="text-neutral-dark mr-2 h-5 w-5" />
            <div>
              <div className="text-sm text-neutral-dark">Departure</div>
              <div className="font-medium">{formatDate(flight.departureDate)} - {flight.departureTime}</div>
              <div className="text-sm">{flight.from}</div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <PlaneLanding className="text-neutral-dark mr-2 h-5 w-5" />
            <div>
              <div className="text-sm text-neutral-dark">Arrival</div>
              <div className="font-medium">{formatDate(flight.arrivalDate)} - {flight.arrivalTime}</div>
              <div className="text-sm">{flight.to}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-neutral-medium">
        <div>
          <span className="text-neutral-dark">Passengers:</span>
          <span className="font-medium ml-1">{booking.seatsBooked}</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="link" className="text-primary hover:underline">
            <Receipt className="h-4 w-4 mr-1" />
            View Details
          </Button>
          
          {booking.status === "confirmed" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="link" className="text-red-500 hover:underline">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this booking? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, keep booking</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleCancelBooking}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      'Yes, cancel booking'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
