import { Flight } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Calendar, Clock, Briefcase, Luggage } from "lucide-react";

interface FlightDetailProps {
  flight: Flight;
}

export default function FlightDetail({ flight }: FlightDetailProps) {
  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-primary p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-white mb-4 md:mb-0">
            <h2 className="text-xl md:text-2xl font-bold">Flight Details</h2>
            <div className="flex items-center mt-1">
              <span className="mr-1">{flight.from} ({flight.departureAirport})</span>
              <span className="mx-1">→</span>
              <span>{flight.to} ({flight.arrivalAirport})</span>
            </div>
          </div>
          <div className="text-white text-right">
            <p className="text-2xl font-bold">${flight.price.toFixed(2)}</p>
            <p className="text-sm">per passenger</p>
          </div>
        </div>
      </div>

      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-3">Flight Information</h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="w-16 flex-shrink-0">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                    <Plane className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">{flight.airline}</p>
                  <p className="text-sm text-neutral-500">{flight.flightNumber}</p>
                </div>
              </div>

              <div className="flex">
                <div className="w-16 flex-shrink-0">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">Departure Date</p>
                  <p className="text-sm text-neutral-500">{flight.departureDate}</p>
                </div>
              </div>

              <div className="flex">
                <div className="w-16 flex-shrink-0">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">Duration</p>
                  <p className="text-sm text-neutral-500">{flight.duration}</p>
                </div>
              </div>

              <div className="flex">
                <div className="w-16 flex-shrink-0">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 18V15H20V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15V11M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">Cabin Class</p>
                  <p className="text-sm text-neutral-500">{flight.cabinClass}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-3">Itinerary</h3>
            <div className="relative pb-8">
              <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-neutral-200"></div>
              
              <div className="flex relative mb-8">
                <div className="w-12 flex-shrink-0 relative z-10">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Plane className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-xl font-bold text-neutral-700">{flight.departureTime}</p>
                  <p className="font-medium text-neutral-700">{flight.departureAirport}</p>
                  <p className="text-sm text-neutral-500">{flight.departureCity}</p>
                </div>
              </div>
              
              <div className="flex relative">
                <div className="w-12 flex-shrink-0 relative z-10">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.1667 14.1667L16.1667 19.5M16.1667 19.5L13.3333 16.6667M16.1667 19.5L19 16.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 4.5C7.5 4.5 3.5 7.5 2 12C2.5 13.5 3.27399 14.8573 4.28736 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 20.0002C10.5 20.5002 13 21.0002 16 20.0002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-xl font-bold text-neutral-700">{flight.arrivalTime}</p>
                  <p className="font-medium text-neutral-700">{flight.arrivalAirport}</p>
                  <p className="text-sm text-neutral-500">{flight.arrivalCity}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-neutral-700 mb-3">Baggage Information</h3>
              <div className="flex items-center mb-2">
                <Briefcase className="h-5 w-5 text-primary mr-2" />
                <span className="text-neutral-700">Carry-on: 1 bag (up to 7kg)</span>
              </div>
              <div className="flex items-center">
                <Luggage className="h-5 w-5 text-primary mr-2" />
                <span className="text-neutral-700">Checked: 1 bag (up to 23kg)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
