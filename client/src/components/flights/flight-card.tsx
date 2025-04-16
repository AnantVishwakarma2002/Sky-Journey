import { Plane } from "lucide-react";
import { Flight } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type FlightCardProps = {
  flight: Flight;
};

export default function FlightCard({ flight }: FlightCardProps) {
  const formattedDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flight-card bg-white rounded-lg shadow p-4 transition duration-300 ease-in-out border border-neutral-medium hover:shadow-lg">
      <div className="md:flex justify-between items-center">
        <div className="md:flex items-center mb-3 md:mb-0">
          <div className="text-center md:text-left md:mr-6">
            <span className="text-neutral-dark text-sm">{flight.airline}</span>
            <div className="font-semibold text-lg">{flight.flightNumber}</div>
          </div>
          <div className="flex justify-center md:justify-start items-center mt-2 md:mt-0">
            <div className="text-right mr-3">
              <div className="font-semibold">{flight.departureTime}</div>
              <div className="text-sm text-neutral-dark">{flight.from.split(',')[0]}</div>
            </div>
            <div className="flex flex-col items-center mx-2">
              <div className="text-neutral-dark text-xs mb-1">{flight.duration}</div>
              <div className="relative w-20 flex items-center">
                <div className="h-[1px] bg-neutral-dark w-full"></div>
                <Plane className="text-neutral-dark absolute right-0 text-sm rotate-90" />
              </div>
              <div className="text-neutral-dark text-xs mt-1">Direct</div>
            </div>
            <div className="text-left ml-3">
              <div className="font-semibold">{flight.arrivalTime}</div>
              <div className="text-sm text-neutral-dark">{flight.to.split(',')[0]}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <div className="text-xl font-bold text-center mb-3 md:mb-0 md:mr-6">${flight.price}</div>
          <Link href={`/flights/${flight.id}`}>
            <Button className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto">
              Select
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
