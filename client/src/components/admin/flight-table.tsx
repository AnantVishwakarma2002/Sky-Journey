import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flight } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import FlightForm from "./flight-form";

export default function FlightTable() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const { toast } = useToast();
  const { data: flights, isLoading } = useQuery<Flight[]>({
    queryKey: ["/api/flights"],
  });
  
  const handleAddFlight = () => {
    setSelectedFlight(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsFormOpen(true);
  };
  
  const handleDeleteFlight = async (id: number) => {
    setDeletingId(id);
    
    try {
      await apiRequest("DELETE", `/api/flights/${id}`);
      
      // Invalidate flights cache
      queryClient.invalidateQueries({ queryKey: ["/api/flights"] });
      
      toast({
        title: "Flight deleted",
        description: "The flight has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: error instanceof Error ? error.message : "Could not delete flight",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };
  
  const formatDate = (dateString: Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">All Flights</h3>
        <Button 
          className="bg-primary text-white hover:bg-primary/90"
          onClick={handleAddFlight}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Flight
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !flights || flights.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No flights available. Add your first flight!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-medium">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Flight No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  From
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  To
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Departure
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Arrival
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Seats
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-medium">
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium">{flight.flightNumber}</div>
                    <div className="text-sm text-neutral-dark">{flight.airline}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {flight.from}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {flight.to}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>{formatDate(flight.departureDate)}</div>
                    <div className="text-sm text-neutral-dark">{flight.departureTime}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>{formatDate(flight.arrivalDate)}</div>
                    <div className="text-sm text-neutral-dark">{flight.arrivalTime}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    ${flight.price}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>{flight.availableSeats} / {flight.totalSeats}</div>
                    <div className="w-24 h-2 bg-neutral-medium rounded-full mt-1">
                      <div 
                        className={`h-2 rounded-full ${
                          (flight.availableSeats / flight.totalSeats) < 0.3 
                            ? "bg-red-500" 
                            : (flight.availableSeats / flight.totalSeats) < 0.6 
                              ? "bg-yellow-500" 
                              : "bg-green-500"
                        }`}
                        style={{ width: `${(flight.availableSeats / flight.totalSeats) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary/80"
                        onClick={() => handleEditFlight(flight)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Flight</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete flight {flight.flightNumber}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => handleDeleteFlight(flight.id)}
                              disabled={deletingId === flight.id}
                            >
                              {deletingId === flight.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <FlightForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        flight={selectedFlight}
      />
    </div>
  );
}
