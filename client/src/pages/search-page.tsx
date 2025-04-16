import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flight, SearchFlightInput, searchFlightSchema } from "@shared/schema";
import { z } from "zod";
import { useLocation } from "wouter";
import FlightSearchForm from "@/components/flights/flight-search-form";
import FlightCard from "@/components/flights/flight-card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const [, navigate] = useLocation();
  const [searchParams, setSearchParams] = useState<SearchFlightInput | null>(null);

  // Query for flights based on search parameters
  const { data: flights, isLoading, error } = useQuery<Flight[]>({
    queryKey: searchParams 
      ? [`/api/flights?from=${searchParams.from}&to=${searchParams.to}&departureDate=${searchParams.departureDate}&passengers=${searchParams.passengers}`] 
      : [],
    enabled: !!searchParams,
  });

  const handleSearch = (values: z.infer<typeof searchFlightSchema>) => {
    setSearchParams(values);
  };

  return (
    <section className="py-12 bg-neutral-light">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Search Flights</h2>
        
        <FlightSearchForm onSubmit={handleSearch} />
        
        {/* Search Results */}
        {searchParams && (
          <div id="search-results" className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {searchParams.from} to {searchParams.to}
              </h3>
              <div className="text-sm text-neutral-dark">
                {searchParams.departureDate} • {searchParams.passengers} Passenger{searchParams.passengers !== 1 ? 's' : ''}
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-red-500 mb-4">Error loading flights: {error instanceof Error ? error.message : 'Unknown error'}</p>
                <Button onClick={() => setSearchParams(null)}>Try another search</Button>
              </div>
            ) : flights && flights.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {flights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h4 className="text-lg font-medium mb-2">No flights found</h4>
                <p className="text-neutral-dark mb-6">
                  We couldn't find any flights matching your search criteria. Try adjusting your search parameters.
                </p>
                <Button onClick={() => setSearchParams(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Show initial state when no search has been performed */}
        {!searchParams && !isLoading && (
          <div className="mt-10 bg-white rounded-lg shadow p-8 text-center">
            <p className="text-neutral-dark mb-4">
              Enter your travel details above to find available flights.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
