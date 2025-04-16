import { useQuery } from "@tanstack/react-query";
import { Booking } from "@shared/schema";
import BookingCard from "./booking-card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2, Plane } from "lucide-react";

export default function BookingList() {
  const { data: bookings, isLoading, error } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin mb-4" />
        <p>Loading your bookings...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading bookings: {error.message}</p>
      </div>
    );
  }
  
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <Plane className="text-4xl text-neutral-dark w-12 h-12 mx-auto mb-2" />
        <h3 className="font-medium text-lg mb-2">No bookings found</h3>
        <p className="text-neutral-dark mb-4">You haven't made any flight bookings yet.</p>
        <Link href="/search">
          <Button className="bg-primary text-white">
            Search Flights
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
