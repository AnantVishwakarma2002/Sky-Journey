import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plane, Search } from "lucide-react";
import { searchFlightSchema } from "@shared/schema";

type FlightSearchFormProps = {
  onSubmit: (values: z.infer<typeof searchFlightSchema>) => void;
};

export default function FlightSearchForm({ onSubmit }: FlightSearchFormProps) {
  const form = useForm<z.infer<typeof searchFlightSchema>>({
    resolver: zodResolver(searchFlightSchema),
    defaultValues: {
      from: "",
      to: "",
      departureDate: new Date().toISOString().split('T')[0],
      passengers: 1,
    },
  });

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <div className="relative">
                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 rotate-45" />
                        <Input 
                          placeholder="City or airport" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                  </div>
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
                  <div className="relative">
                    <FormControl>
                      <div className="relative">
                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 -rotate-45" />
                        <Input 
                          placeholder="City or airport" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Date</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          type="date" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passengers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passengers</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select number of passengers" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 Passenger</SelectItem>
                      <SelectItem value="2">2 Passengers</SelectItem>
                      <SelectItem value="3">3 Passengers</SelectItem>
                      <SelectItem value="4">4 Passengers</SelectItem>
                      <SelectItem value="5">5 Passengers</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="text-center">
            <Button type="submit" className="bg-[#f97316] hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md">
              <Search className="h-4 w-4 mr-2" />
              Search Flights
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
