import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flight } from "@shared/schema";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlightDetailsCard from "@/components/flights/flight-details-card";
import BookingForm from "@/components/bookings/booking-form";

type FlightDetailsPageProps = {
  id: number;
};

export default function FlightDetailsPage({ id }: FlightDetailsPageProps) {
  const [, navigate] = useLocation();
  const [passengerCount, setPassengerCount] = useState(1);
  
  // Fetch flight details
  const { data: flight, isLoading, error } = useQuery<Flight>({
    queryKey: [`/api/flights/${id}`],
  });

  if (isLoading) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl mx-auto">
          <Link href="/search" className="text-primary flex items-center mb-6 hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to search results
          </Link>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4 text-red-800">Flight Not Found</h2>
            <p className="text-red-600 mb-6">
              Sorry, we couldn't find the flight you're looking for. The flight may have been removed or you may have followed an invalid link.
            </p>
            <Button onClick={() => navigate("/search")}>
              Return to Flight Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/search" className="text-primary flex items-center mb-6 hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to search results
          </Link>
          
          <h2 className="text-2xl font-semibold mb-6">Flight Details</h2>
          
          {/* Flight Details Card */}
          <FlightDetailsCard flight={flight} />
          
          {/* Passenger Selection */}
          <div className="bg-white rounded-lg shadow-md border border-neutral-medium p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Select Passengers</h3>
            <div className="flex items-center">
              <div className="mr-4">
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Passengers
                </label>
                <select 
                  id="passengers" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(parseInt(e.target.value))}
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4 Passengers</option>
                  <option value="5">5 Passengers</option>
                </select>
              </div>
              <div>
                <div className="text-sm text-neutral-dark mb-1">Total Price</div>
                <div className="text-xl font-bold">${parseFloat(flight.price) * passengerCount}</div>
              </div>
            </div>
          </div>
          
          {/* Booking Form */}
          <BookingForm flight={flight} passengerCount={passengerCount} />
        </div>
      </div>
    </section>
  );
}
