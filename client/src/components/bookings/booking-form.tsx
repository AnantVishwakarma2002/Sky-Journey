import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Flight } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

// Form schemas
const passengerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  passportNumber: z.string().min(4, "Valid passport number is required"),
});

const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Valid card number is required").max(19),
  cardName: z.string().min(2, "Cardholder name is required"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry date should be in MM/YY format"),
  cvv: z.string().regex(/^[0-9]{3,4}$/, "CVV should be 3 or 4 digits"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

const bookingFormSchema = z.object({
  passengers: z.array(passengerSchema),
  contact: contactSchema,
  payment: paymentSchema,
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

type BookingFormProps = {
  flight: Flight;
  passengerCount: number;
};

export default function BookingForm({ flight, passengerCount }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Initialize default values for passengers array
  const defaultPassengers = Array(passengerCount).fill(0).map(() => ({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    passportNumber: "",
  }));

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      passengers: defaultPassengers,
      contact: {
        email: user?.email || "",
        phone: "",
      },
      payment: {
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
        terms: false,
      },
    },
  });

  async function onSubmit(data: BookingFormValues) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to book a flight",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate total price
      const totalPrice = parseFloat(flight.price) * passengerCount;

      // Create booking payload
      const bookingData = {
        flightId: flight.id,
        seatsBooked: passengerCount,
        totalPrice: totalPrice.toString(),
        contactEmail: data.contact.email,
        contactPhone: data.contact.phone,
        passengers: data.passengers,
      };

      // Send booking request
      const res = await apiRequest("POST", "/api/bookings", bookingData);
      const booking = await res.json();

      // Show success message
      toast({
        title: "Booking confirmed!",
        description: `Your booking reference is ${booking.bookingReference}`,
      });

      // Invalidate bookings cache
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });

      // Navigate to bookings page
      navigate("/bookings");
    } catch (error) {
      console.error(error);
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Could not complete booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-medium p-6">
      <h3 className="text-xl font-semibold mb-4">Passenger Information</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Passenger Information */}
          {defaultPassengers.map((_, index) => (
            <div key={index} className="border-b border-neutral-medium pb-6 mb-6">
              <h4 className="font-medium mb-3">Passenger {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`passengers.${index}.firstName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`passengers.${index}.lastName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`passengers.${index}.dateOfBirth`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`passengers.${index}.passportNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passport Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {/* Contact Information */}
          <div className="border-b border-neutral-medium pb-6 mb-6">
            <h4 className="font-medium mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="contact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="border-b border-neutral-medium pb-6 mb-6">
            <h4 className="font-medium mb-3">Payment Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="payment.cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 9012 3456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payment.cardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="payment.expiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/YY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payment.cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div className="mb-6">
            <FormField
              control={form.control}
              name="payment.terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          {/* Booking Summary and Submit Button */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold">Total: ${parseFloat(flight.price) * passengerCount}</div>
              <div className="text-sm text-neutral-dark">{passengerCount} passenger{passengerCount > 1 ? 's' : ''}</div>
            </div>
            <Button 
              type="submit" 
              className="bg-[#f97316] hover:bg-orange-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Complete Booking'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
