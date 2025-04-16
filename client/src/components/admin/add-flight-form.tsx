import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Flight, insertFlightSchema, airportData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AddFlightFormProps {
  flight?: Flight | null;
  onClose: () => void;
}

export default function AddFlightForm({ flight, onClose }: AddFlightFormProps) {
  const { toast } = useToast();
  const isEditing = !!flight;
  
  // Set up the form with the flight data if editing
  const form = useForm({
    resolver: zodResolver(insertFlightSchema),
    defaultValues: flight ? {
      ...flight,
    } : {
      flightNumber: "",
      airline: "",
      from: "",
      to: "",
      departureDate: "",
      departureTime: "",
      arrivalDate: "",
      arrivalTime: "",
      duration: "",
      price: 0,
      availableSeats: 0,
      departureAirport: "",
      departureCity: "",
      arrivalAirport: "",
      arrivalCity: "",
      cabinClass: "Economy",
    },
  });
  
  // Handle form submission to create or update a flight
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        return apiRequest("PUT", `/api/admin/flights/${flight.id}`, data);
      } else {
        return apiRequest("POST", "/api/admin/flights", data);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Flight Updated" : "Flight Created",
        description: isEditing 
          ? `Flight ${flight.flightNumber} has been updated.` 
          : "New flight has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/flights"] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Calculate duration based on departure and arrival times
  const calculateDuration = () => {
    const depTime = form.getValues("departureTime");
    const arrTime = form.getValues("arrivalTime");
    
    if (depTime && arrTime) {
      const [depHour, depMin] = depTime.split(":").map(Number);
      const [arrHour, arrMin] = arrTime.split(":").map(Number);
      
      let hoursDiff = arrHour - depHour;
      let minsDiff = arrMin - depMin;
      
      if (minsDiff < 0) {
        hoursDiff--;
        minsDiff += 60;
      }
      
      if (hoursDiff < 0) {
        // Assuming the flight arrives the next day
        hoursDiff += 24;
      }
      
      form.setValue("duration", `${hoursDiff}h ${minsDiff}m`);
    }
  };
  
  // Handle form submission
  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };
  
  // Update airport and city information when selecting origin/destination
  const updateAirportInfo = (field: string, value: string) => {
    const airport = airportData.find(a => a.code === value);
    if (airport) {
      if (field === "from") {
        form.setValue("departureAirport", airport.name);
        form.setValue("departureCity", airport.city);
      } else if (field === "to") {
        form.setValue("arrivalAirport", airport.name);
        form.setValue("arrivalCity", airport.city);
      }
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="flightNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flight Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. AA-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="airline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airline</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. American Airlines" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    updateAirportInfo("from", value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select departure city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {airportData.map((airport) => (
                      <SelectItem key={airport.code} value={airport.code}>
                        {airport.name} ({airport.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    updateAirportInfo("to", value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {airportData.map((airport) => (
                      <SelectItem key={airport.code} value={airport.code}>
                        {airport.name} ({airport.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="departureTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Time</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      calculateDuration();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="arrivalDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrival Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="arrivalTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrival Time</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      calculateDuration();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 5h 30m" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    placeholder="e.g. 349.99" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="availableSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Seats</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    placeholder="e.g. 150" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cabinClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cabin Class</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cabin class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="First">First</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="hidden">
          <FormField
            control={form.control}
            name="departureAirport"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="departureCity"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="arrivalAirport"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="arrivalCity"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending 
              ? (isEditing ? "Updating..." : "Adding...") 
              : (isEditing ? "Update Flight" : "Add Flight")
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
