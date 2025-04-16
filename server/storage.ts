import { users, type User, type InsertUser, flights, type Flight, type InsertFlight, bookings, type Booking, type InsertBooking, passengers, type Passenger, type InsertPassenger } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { randomUUID } from "crypto";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Flight methods
  getAllFlights(): Promise<Flight[]>;
  getFlight(id: number): Promise<Flight | undefined>;
  searchFlights(from: string, to: string, departureDate: string): Promise<Flight[]>;
  createFlight(flight: InsertFlight): Promise<Flight>;
  updateFlight(id: number, flight: Partial<InsertFlight>): Promise<Flight | undefined>;
  deleteFlight(id: number): Promise<boolean>;
  
  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingByReference(reference: string): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Passenger methods
  addPassenger(passenger: InsertPassenger): Promise<Passenger>;
  getBookingPassengers(bookingId: number): Promise<Passenger[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private flights: Map<number, Flight>;
  private bookings: Map<number, Booking>;
  private passengers: Map<number, Passenger>;
  sessionStore: session.SessionStore;
  private userId: number;
  private flightId: number;
  private bookingId: number;
  private passengerId: number;

  constructor() {
    this.users = new Map();
    this.flights = new Map();
    this.bookings = new Map();
    this.passengers = new Map();
    this.userId = 1;
    this.flightId = 1;
    this.bookingId = 1;
    this.passengerId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Add default admin user
    this.createUser({
      username: "admin",
      password: "admin123", // This will be hashed before storage
      email: "admin@skyjourney.com",
      role: "admin"
    });
    
    // Add some sample flights
    this.createFlight({
      flightNumber: "AA2734",
      airline: "American Airlines",
      from: "JFK, New York",
      to: "LAX, Los Angeles",
      departureDate: new Date("2023-11-15T08:00:00Z"),
      departureTime: "08:00 AM",
      arrivalDate: new Date("2023-11-15T10:15:00Z"),
      arrivalTime: "10:15 AM",
      duration: "2h 15m",
      price: "349",
      totalSeats: 180,
      availableSeats: 120,
      aircraft: "Boeing 737-800",
      classType: "Economy",
      baggageAllowance: "1 x 23kg Checked, 1 x 8kg Cabin"
    });
    
    this.createFlight({
      flightNumber: "DL1492",
      airline: "Delta Airlines",
      from: "JFK, New York",
      to: "LAX, Los Angeles",
      departureDate: new Date("2023-11-15T10:30:00Z"),
      departureTime: "10:30 AM",
      arrivalDate: new Date("2023-11-15T13:00:00Z"),
      arrivalTime: "1:00 PM",
      duration: "2h 30m",
      price: "289",
      totalSeats: 150,
      availableSeats: 95,
      aircraft: "Boeing 737-800",
      classType: "Economy",
      baggageAllowance: "1 x 23kg Checked, 1 x 8kg Cabin"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Flight methods
  async getAllFlights(): Promise<Flight[]> {
    return Array.from(this.flights.values());
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async searchFlights(from: string, to: string, departureDate: string): Promise<Flight[]> {
    return Array.from(this.flights.values()).filter(flight => {
      const flightDate = new Date(flight.departureDate).toISOString().split('T')[0];
      const searchDate = new Date(departureDate).toISOString().split('T')[0];
      
      return flight.from.toLowerCase().includes(from.toLowerCase()) && 
             flight.to.toLowerCase().includes(to.toLowerCase()) && 
             flightDate === searchDate;
    });
  }

  async createFlight(insertFlight: InsertFlight): Promise<Flight> {
    const id = this.flightId++;
    const flight: Flight = { ...insertFlight, id };
    this.flights.set(id, flight);
    return flight;
  }

  async updateFlight(id: number, flightUpdate: Partial<InsertFlight>): Promise<Flight | undefined> {
    const existingFlight = this.flights.get(id);
    if (!existingFlight) return undefined;

    const updatedFlight = { ...existingFlight, ...flightUpdate };
    this.flights.set(id, updatedFlight);
    return updatedFlight;
  }

  async deleteFlight(id: number): Promise<boolean> {
    return this.flights.delete(id);
  }

  // Booking methods
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id,
      createdAt: new Date()
    };
    
    this.bookings.set(id, booking);
    
    // Update available seats for the flight
    const flight = this.flights.get(booking.flightId);
    if (flight) {
      flight.availableSeats -= booking.seatsBooked;
      this.flights.set(flight.id, flight);
    }
    
    return booking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingByReference(reference: string): Promise<Booking | undefined> {
    return Array.from(this.bookings.values()).find(
      booking => booking.bookingReference === reference
    );
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.userId === userId
    );
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    // If cancelling a booking, add seats back to flight
    if (status === 'cancelled' && booking.status !== 'cancelled') {
      const flight = this.flights.get(booking.flightId);
      if (flight) {
        flight.availableSeats += booking.seatsBooked;
        this.flights.set(flight.id, flight);
      }
    }

    booking.status = status;
    this.bookings.set(id, booking);
    return booking;
  }

  // Passenger methods
  async addPassenger(insertPassenger: InsertPassenger): Promise<Passenger> {
    const id = this.passengerId++;
    const passenger: Passenger = { ...insertPassenger, id };
    this.passengers.set(id, passenger);
    return passenger;
  }

  async getBookingPassengers(bookingId: number): Promise<Passenger[]> {
    return Array.from(this.passengers.values()).filter(
      passenger => passenger.bookingId === bookingId
    );
  }
}

export const storage = new MemStorage();
