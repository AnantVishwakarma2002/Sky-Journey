import { useQuery } from "@tanstack/react-query";
import { Booking, Flight } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye } from "lucide-react";

export default function BookingTable() {
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });
  
  const { data: flights, isLoading: isLoadingFlights } = useQuery<Flight[]>({
    queryKey: ["/api/flights"],
  });
  
  const isLoading = isLoadingBookings || isLoadingFlights;
  
  const formatDate = (dateString: Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getFlightById = (id: number): Flight | undefined => {
    return flights?.find(flight => flight.id === id);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-6">All Bookings</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No bookings available yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-medium">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Booking Ref
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Flight
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Route
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Passengers
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-medium">
              {bookings.map((booking) => {
                const flight = getFlightById(booking.flightId);
                return (
                  <tr key={booking.id}>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {booking.bookingReference}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {flight ? (
                        <>
                          <div>{flight.flightNumber}</div>
                          <div className="text-sm text-neutral-dark">{flight.airline}</div>
                        </>
                      ) : (
                        <span className="text-red-500">Unknown flight</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {flight ? (
                        <>
                          <div className="text-sm">{flight.from.split(',')[0]} → {flight.to.split(',')[0]}</div>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {flight ? formatDate(flight.departureDate) : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {booking.seatsBooked}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      ${booking.totalPrice}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge className={booking.status === "confirmed" ? "bg-green-500" : "bg-red-500"}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button variant="ghost" size="sm" className="text-primary">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
