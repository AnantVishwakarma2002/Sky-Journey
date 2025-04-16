import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertFlightSchema, searchFlightSchema, insertBookingSchema, insertPassengerSchema } from "@shared/schema";
import { randomUUID } from "crypto";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admin access required" });
};

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Flight routes
  app.get("/api/flights", async (req, res) => {
    try {
      const { from, to, departureDate } = req.query;
      
      if (from && to && departureDate) {
        const result = searchFlightSchema.safeParse({
          from,
          to,
          departureDate,
          passengers: req.query.passengers || 1
        });
        
        if (!result.success) {
          return res.status(400).json({ message: "Invalid search parameters" });
        }
        
        const flights = await storage.searchFlights(
          from as string, 
          to as string, 
          departureDate as string
        );
        
        return res.json(flights);
      }
      
      const flights = await storage.getAllFlights();
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flights" });
    }
  });

  app.get("/api/flights/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const flight = await storage.getFlight(id);
      
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      
      res.json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flight" });
    }
  });

  app.post("/api/flights", isAdmin, async (req, res) => {
    try {
      const result = insertFlightSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid flight data", errors: result.error.errors });
      }
      
      const flight = await storage.createFlight(result.data);
      res.status(201).json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to create flight" });
    }
  });

  app.put("/api/flights/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertFlightSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid flight data", errors: result.error.errors });
      }
      
      const updatedFlight = await storage.updateFlight(id, result.data);
      
      if (!updatedFlight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      
      res.json(updatedFlight);
    } catch (error) {
      res.status(500).json({ message: "Failed to update flight" });
    }
  });

  app.delete("/api/flights/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteFlight(id);
      
      if (!success) {
        return res.status(404).json({ message: "Flight not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete flight" });
    }
  });

  // Booking routes
  app.get("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      if (req.user.role === "admin") {
        const bookings = await storage.getAllBookings();
        return res.json(bookings);
      }
      
      const bookings = await storage.getUserBookings(req.user.id);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if the user is authorized to view this booking
      if (req.user.role !== "admin" && booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to view this booking" });
      }
      
      // Get passengers for this booking
      const passengers = await storage.getBookingPassengers(booking.id);
      
      res.json({ booking, passengers });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  app.post("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const { flightId, seatsBooked, totalPrice, contactEmail, contactPhone, passengers } = req.body;
      
      // Validate booking data
      const bookingData = {
        userId: req.user.id,
        flightId,
        bookingReference: `SKY${randomUUID().substring(0, 8).toUpperCase()}`,
        status: "confirmed",
        totalPrice,
        seatsBooked,
        contactEmail,
        contactPhone
      };
      
      const result = insertBookingSchema.safeParse(bookingData);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid booking data", errors: result.error.errors });
      }
      
      // Check if the flight exists and has enough seats
      const flight = await storage.getFlight(flightId);
      
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      
      if (flight.availableSeats < seatsBooked) {
        return res.status(400).json({ message: "Not enough seats available" });
      }
      
      // Create the booking
      const booking = await storage.createBooking(result.data);
      
      // Add passengers
      if (Array.isArray(passengers)) {
        for (const passenger of passengers) {
          const passengerResult = insertPassengerSchema.safeParse({
            ...passenger,
            bookingId: booking.id
          });
          
          if (passengerResult.success) {
            await storage.addPassenger(passengerResult.data);
          }
        }
      }
      
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.put("/api/bookings/:id/cancel", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if the user is authorized to cancel this booking
      if (req.user.role !== "admin" && booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to cancel this booking" });
      }
      
      // Check if booking is already cancelled
      if (booking.status === "cancelled") {
        return res.status(400).json({ message: "Booking is already cancelled" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(id, "cancelled");
      
      if (!updatedBooking) {
        return res.status(500).json({ message: "Failed to cancel booking" });
      }
      
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel booking" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
