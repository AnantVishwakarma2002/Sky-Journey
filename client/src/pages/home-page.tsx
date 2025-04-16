import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane } from "lucide-react";

const popularDestinations = [
  {
    id: 1,
    city: "New York City",
    color: "from-blue-500 to-blue-700",
    icon: "🗽",
    price: 199,
  },
  {
    id: 2,
    city: "London",
    color: "from-red-500 to-red-700",
    icon: "🏛️",
    price: 299,
  },
  {
    id: 3,
    city: "Tokyo",
    color: "from-pink-500 to-purple-700",
    icon: "🏯",
    price: 599,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover the World with SkyJourney</h1>
            <p className="text-lg md:text-xl mb-8">Find and book the best flight deals to your favorite destinations</p>
            <Link href="/search">
              <Button size="lg" className="bg-[#f97316] hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg">
                Search Flights
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularDestinations.map((destination) => (
              <div key={destination.id} className="rounded-lg overflow-hidden shadow-md">
                <div className={`w-full h-48 bg-gradient-to-br ${destination.color} flex items-center justify-center text-white`}>
                  <div className="text-center">
                    <div className="text-5xl mb-2">{destination.icon}</div>
                    <div className="text-2xl font-bold">{destination.city}</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{destination.city}</h3>
                  <p className="text-neutral-dark">Flights from ${destination.price}</p>
                  <Link href="/search">
                    <Button variant="link" className="text-primary font-medium p-0 mt-2 h-auto">
                      Explore deals <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-10 text-center">Why Choose SkyJourney</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <Plane className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Flight Deals</h3>
              <p className="text-neutral-dark">We search through hundreds of airlines to find the best prices for your journey.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
              <p className="text-neutral-dark">Our transparent pricing means you always know exactly what you're paying for.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-neutral-dark">Our simple booking process takes just minutes, saving you time and effort.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Off?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of satisfied travelers who have found their perfect flights with SkyJourney.</p>
          <Link href="/search">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Search Flights Now
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
