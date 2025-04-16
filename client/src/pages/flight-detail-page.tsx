import { useRoute, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Flight } from "@shared/schema";
import FlightDetail from "@/components/flights/flight-detail";
import BookingForm from "@/components/bookings/booking-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

export default function FlightDetailPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/flight/:id");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const flightId = params?.id ? parseInt(params.id) : undefined;
  
  const { data: flight, isLoading, error } = useQuery<Flight>({
    queryKey: [`/api/flights/${flightId}`],
    enabled: !!flightId,
  });
  
  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      if (!user) {
        throw new Error("You must be logged in to book a flight");
      }
      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Booking Successful",
        description: "Your flight has been booked successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setLocation(`/booking/confirmation/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleBookingSubmit = (bookingData: any) => {
    if (!flight) return;
    
    const totalAmount = flight.price * bookingData.passengerCount;
    
    bookingMutation.mutate({
      flightId: flight.id,
      ...bookingData,
      totalAmount
    });
  };
  
  const handleBackToResults = () => {
    window.history.back();
  };
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-neutral-600 mb-4">
              {error instanceof Error ? error.message : "Failed to load flight details."}
            </p>
            <Button onClick={() => setLocation("/search")}>
              Return to Search
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <section className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="flex items-center text-primary hover:text-primary-dark"
            onClick={handleBackToResults}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to results
          </Button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="text-white mb-4 md:mb-0">
                  <Skeleton className="h-8 w-48 bg-white/20" />
                  <Skeleton className="h-4 w-64 mt-2 bg-white/20" />
                </div>
                <div className="text-white text-right">
                  <Skeleton className="h-8 w-24 bg-white/20" />
                  <Skeleton className="h-4 w-16 mt-1 bg-white/20" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Flight Info Skeleton */}
                <div>
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="space-y-6">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className="flex">
                        <Skeleton className="h-10 w-10 rounded-full mr-4" />
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Itinerary Skeleton */}
                <div>
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-8">
                    <div className="flex">
                      <Skeleton className="h-12 w-12 rounded-full mr-4" />
                      <div>
                        <Skeleton className="h-6 w-24 mb-1" />
                        <Skeleton className="h-5 w-64 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <div className="flex">
                      <Skeleton className="h-12 w-12 rounded-full mr-4" />
                      <div>
                        <Skeleton className="h-6 w-24 mb-1" />
                        <Skeleton className="h-5 w-64 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : flight ? (
          <>
            <FlightDetail flight={flight} />
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <h3 className="text-lg font-semibold text-neutral-700 mb-4">Book This Flight</h3>
              <BookingForm 
                flight={flight} 
                onSubmit={handleBookingSubmit} 
                isLoading={bookingMutation.isPending}
              />
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-2">Flight Not Found</h2>
              <p className="text-neutral-600 mb-4">
                Sorry, we couldn't find the flight you're looking for.
              </p>
              <Button onClick={() => setLocation("/search")}>
                Return to Search
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
