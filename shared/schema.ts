import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").default("user").notNull(), // 'user' or 'admin'
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

// Flight model
export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  flightNumber: text("flight_number").notNull(),
  airline: text("airline").notNull(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalDate: timestamp("arrival_date").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  duration: text("duration").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalSeats: integer("total_seats").notNull(),
  availableSeats: integer("available_seats").notNull(),
  aircraft: text("aircraft").default(""),
  classType: text("class_type").default("Economy"),
  baggageAllowance: text("baggage_allowance").default("1 x 23kg Checked, 1 x 8kg Cabin"),
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
});

// Booking model
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  flightId: integer("flight_id").notNull(),
  bookingReference: text("booking_reference").notNull().unique(),
  status: text("status").default("confirmed").notNull(), // 'confirmed', 'cancelled'
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  seatsBooked: integer("seats_booked").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

// Passenger model
export const passengers = pgTable("passengers", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  passportNumber: text("passport_number").notNull(),
});

export const insertPassengerSchema = createInsertSchema(passengers).omit({
  id: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Flight = typeof flights.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertPassenger = z.infer<typeof insertPassengerSchema>;
export type Passenger = typeof passengers.$inferSelect;

// Extension for form validation
export const searchFlightSchema = z.object({
  from: z.string().min(2, "Origin is required"),
  to: z.string().min(2, "Destination is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  passengers: z.coerce.number().int().min(1).max(10),
});

export type SearchFlightInput = z.infer<typeof searchFlightSchema>;
