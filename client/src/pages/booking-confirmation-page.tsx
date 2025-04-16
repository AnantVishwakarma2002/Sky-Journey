import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Download } from "lucide-react";
import { Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

export default function BookingConfirmationPage() {
  const [match, params] = useRoute("/booking/confirmation/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const bookingId = params?.id ? parseInt(params.id) : undefined;
  
  const { data: booking, isLoading, error } = useQuery<Booking & { flight: any }>({
    queryKey: [`/api/bookings/${bookingId}`],
    enabled: !!bookingId,
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <Card>
            <div className="bg-emerald-500 p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-8 w-64 bg-white/20 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 bg-white/20 mx-auto" />
            </div>
            <CardContent className="p-6">
              <div className="space-y-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-neutral-600 mb-4">
              {error instanceof Error 
                ? error.message 
                : "Failed to load booking confirmation. Please check your bookings."}
            </p>
            <Button onClick={() => setLocation("/bookings")}>
              View My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <section className="max-w-3xl mx-auto">
        <Card>
          <div className="bg-emerald-500 p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
            <p className="text-white/90">Your flight has been successfully booked</p>
          </div>

          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-neutral-700">Booking Details</h3>
                <span className="text-sm bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-neutral-500">
                Booking ID: <span className="text-neutral-700 font-medium">BK{booking.id.toString().padStart(9, '0')}</span>
              </p>
              <p className="text-sm text-neutral-500">
                Booked On: <span className="text-neutral-700">
                  {formatDate(new Date(booking.bookingDate))}
                </span>
              </p>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary">✈</span>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">{booking.flight.airline}</p>
                  <p className="text-sm text-neutral-500">{booking.flight.flightNumber}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-xs text-neutral-500">DEPARTURE</p>
                  <p className="text-lg font-bold text-neutral-700">{booking.flight.departureTime}</p>
                  <p className="text-sm text-neutral-700">{booking.flight.departureDate}</p>
                  <p className="text-sm text-neutral-700">{booking.flight.from}</p>
                </div>
                
                <div className="hidden md:block">
                  <div className="flex items-center my-4">
                    <div className="h-[2px] w-16 bg-neutral-200"></div>
                    <span className="text-neutral-400 mx-2">✈</span>
                    <div className="h-[2px] w-16 bg-neutral-200"></div>
                  </div>
                  <p className="text-xs text-neutral-500 text-center">{booking.flight.duration}</p>
                </div>
                
                <div>
                  <p className="text-xs text-neutral-500">ARRIVAL</p>
                  <p className="text-lg font-bold text-neutral-700">{booking.flight.arrivalTime}</p>
                  <p className="text-sm text-neutral-700">{booking.flight.arrivalDate}</p>
                  <p className="text-sm text-neutral-700">{booking.flight.to}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-base font-semibold text-neutral-700 mb-3">Passenger Details</h3>
                <div className="space-y-2">
                  {booking.passengerDetails && typeof booking.passengerDetails === 'object' && (
                    <>
                      <p className="text-sm text-neutral-500">
                        Passenger Name: <span className="text-neutral-700">
                          {(booking.passengerDetails as any).name}
                        </span>
                      </p>
                      <p className="text-sm text-neutral-500">
                        Email: <span className="text-neutral-700">
                          {(booking.passengerDetails as any).email}
                        </span>
                      </p>
                      <p className="text-sm text-neutral-500">
                        Phone: <span className="text-neutral-700">
                          {(booking.passengerDetails as any).phone}
                        </span>
                      </p>
                    </>
                  )}
                  <p className="text-sm text-neutral-500">
                    Passengers: <span className="text-neutral-700">{booking.passengerCount}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-semibold text-neutral-700 mb-3">Payment Information</h3>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-500">
                    Payment Method: <span className="text-neutral-700">Credit Card (•••• 5678)</span>
                  </p>
                  <p className="text-sm text-neutral-500">
                    Base Fare: <span className="text-neutral-700">
                      ${booking.flight.price.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm text-neutral-500">
                    Taxes & Fees: <span className="text-neutral-700">
                      ${(booking.totalAmount - (booking.flight.price * booking.passengerCount)).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm text-neutral-500 font-medium">
                    Total Amount: <span className="text-primary font-bold">
                      ${booking.totalAmount.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <Button className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md font-medium transition-all">
                <Download className="h-4 w-4 mr-1" />
                Download E-Ticket
              </Button>
              <p className="text-sm text-neutral-500">
                A copy of your e-ticket has been sent to your email address. You can also access your bookings anytime from "My Bookings" section.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
