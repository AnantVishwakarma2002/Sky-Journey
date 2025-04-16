import { Flight } from "@shared/schema";
import { Plane } from "lucide-react";

type FlightDetailsCardProps = {
  flight: Flight;
};

export default function FlightDetailsCard({ flight }: FlightDetailsCardProps) {
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-medium p-6 mb-8">
      <div className="md:flex justify-between items-start mb-6">
        <div>
          <span className="text-neutral-dark">{flight.airline}</span>
          <h3 className="text-xl font-semibold">{flight.flightNumber}</h3>
        </div>
        <div className="mt-3 md:mt-0">
          <span className="text-neutral-dark">Price</span>
          <div className="text-2xl font-bold">${flight.price}</div>
          <div className="text-sm text-neutral-dark">per passenger</div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-center border-b border-neutral-medium pb-6 mb-6">
        <div className="flex items-center mb-4 md:mb-0 md:mr-10">
          <div className="text-right mr-4">
            <div className="font-semibold text-lg">{flight.departureTime}</div>
            <div className="text-neutral-dark">{formatDate(flight.departureDate)}</div>
            <div className="text-sm text-neutral-dark">{flight.from}</div>
          </div>
          <div className="flex flex-col items-center mx-4">
            <div className="text-sm text-neutral-dark mb-1">{flight.duration}</div>
            <div className="relative w-28 flex items-center">
              <div className="h-[1px] bg-neutral-dark w-full"></div>
              <Plane className="text-neutral-dark absolute right-0 text-sm rotate-90" />
            </div>
            <div className="text-sm text-neutral-dark mt-1">Direct Flight</div>
          </div>
          <div className="text-left ml-4">
            <div className="font-semibold text-lg">{flight.arrivalTime}</div>
            <div className="text-neutral-dark">{formatDate(flight.arrivalDate)}</div>
            <div className="text-sm text-neutral-dark">{flight.to}</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <h4 className="font-medium mb-1">Baggage Allowance</h4>
          <p className="text-neutral-dark">{flight.baggageAllowance}</p>
        </div>
        <div>
          <h4 className="font-medium mb-1">Aircraft</h4>
          <p className="text-neutral-dark">{flight.aircraft}</p>
        </div>
        <div>
          <h4 className="font-medium mb-1">Class</h4>
          <p className="text-neutral-dark">{flight.classType}</p>
        </div>
      </div>
    </div>
  );
}
