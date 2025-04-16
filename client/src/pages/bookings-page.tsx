import { useAuth } from "@/hooks/use-auth";
import BookingList from "@/components/bookings/booking-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plane } from "lucide-react";

export default function BookingsPage() {
  const { user } = useAuth();

  return (
    <section className="py-12 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Bookings</h2>
            <Link href="/search">
              <Button variant="outline" className="flex items-center">
                <Plane className="mr-2 h-4 w-4" />
                New Booking
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Flight Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <BookingList />
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-dark mb-4">Please log in to view your bookings.</p>
                  <Link href="/auth">
                    <Button>Go to Login</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Booking Tips */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Tips</h3>
            <ul className="space-y-2 text-sm text-neutral-dark">
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Check your booking details carefully before confirming.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Make sure all passengers have valid ID and travel documents.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Review the airline's baggage policy to avoid additional fees.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
