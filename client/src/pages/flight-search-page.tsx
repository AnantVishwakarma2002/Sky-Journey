import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Plane } from "lucide-react";
import { Flight } from "@shared/schema";
import FlightCard from "@/components/flights/flight-card";
import FlightSearchForm from "@/components/flights/flight-search-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function FlightSearchPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  
  const [sortOption, setSortOption] = useState("price-low");
  
  const { data: flights, isLoading } = useQuery<Flight[]>({
    queryKey: ["/api/flights", from, to, date],
    enabled: !!(from || to || date)
  });
  
  const sortedFlights = [...(flights || [])].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "duration-short":
        return a.duration.localeCompare(b.duration);
      case "departure-early":
        return a.departureTime.localeCompare(b.departureTime);
      case "departure-late":
        return b.departureTime.localeCompare(a.departureTime);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Flight Search Results</h2>
          {(from || to || date) && (
            <div className="flex flex-wrap items-center mt-2 text-sm text-neutral-600">
              {from && (
                <div className="flex items-center mr-2">
                  <Plane className="h-4 w-4 mr-1 text-primary" />
                  <span className="font-medium">{from}</span>
                </div>
              )}
              
              {(from && to) && (
                <span className="mx-2">→</span>
              )}
              
              {to && (
                <div className="flex items-center mr-2">
                  <Plane className="h-4 w-4 mr-1 text-primary" />
                  <span className="font-medium">{to}</span>
                </div>
              )}
              
              {date && (
                <div className="flex items-center ml-4">
                  <Calendar className="h-4 w-4 mr-1 text-neutral-500" />
                  <span>{new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <FlightSearchForm defaultValues={{ from, to, date }} />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            {isLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <span>{sortedFlights?.length || 0} flights found</span>
            )}
          </div>
          
          <div className="flex items-center">
            <label className="text-sm text-neutral-600 mr-2">Sort by:</label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="duration-short">Duration: Shortest</SelectItem>
                <SelectItem value="departure-early">Departure: Earliest</SelectItem>
                <SelectItem value="departure-late">Departure: Latest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Flight Cards List */}
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="flex-1 md:mx-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-16" />
                      <div className="hidden md:flex items-center space-x-2">
                        <Skeleton className="h-1 w-20" />
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-1 w-20" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-7 w-24 mb-1" />
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))
          ) : sortedFlights?.length ? (
            sortedFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Plane className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">No Flights Found</h3>
              <p className="text-neutral-500">Try adjusting your search criteria to find more results.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
