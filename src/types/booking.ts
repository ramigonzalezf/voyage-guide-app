export type TripStatus = 'upcoming' | 'in_progress' | 'completed';
export type ServiceType = 'flight' | 'hotel' | 'transfer' | 'excursion' | 'other';
export type ServiceStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface Booking {
  id: string;
  fileCode: string;
  status: TripStatus;
  passengers: Passenger[];
  tripId: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  guide?: DestinationGuide;
}

export interface DestinationGuide {
  safety: string[];
  currency: { name: string; symbol: string; tips: string };
  weather: { summary: string; tempRange: string };
  transport: string[];
  culture: string[];
  neighborhoods: { name: string; description: string }[];
}

export interface BaseService {
  id: string;
  type: ServiceType;
  date: string; // ISO date
  time?: string;
  status: ServiceStatus;
  provider?: string;
  reference?: string;
  notes?: string;
}

export interface FlightService extends BaseService {
  type: 'flight';
  airline: string;
  flightNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  terminal?: string;
}

export interface HotelService extends BaseService {
  type: 'hotel';
  hotelName: string;
  address: string;
  checkIn: string;
  checkOut: string;
  boardBasis: string;
  roomType?: string;
  contactPhone?: string;
  contactEmail?: string;
  imageUrl?: string;
}

export interface TransferService extends BaseService {
  type: 'transfer';
  pickupPoint: string;
  dropoffPoint: string;
  schedule: string;
  vehicleType?: string;
  instructions?: string;
}

export interface ExcursionService extends BaseService {
  type: 'excursion';
  title: string;
  description: string;
  meetingPoint: string;
  duration: string;
  imageUrl?: string;
}

export type Service = FlightService | HotelService | TransferService | ExcursionService;

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  destinations: Destination[];
  services: Service[];
  coverImageUrl?: string;
}

export interface Document {
  id: string;
  type: 'voucher' | 'ticket' | 'insurance' | 'other';
  title: string;
  serviceId?: string;
  url?: string;
  status: 'available' | 'pending';
}

export interface SupportContact {
  id: string;
  type: 'emergency' | 'operator' | 'hotel' | 'local';
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  priority: number;
}

export interface DestinationOffer {
  id: string;
  destinationId: string;
  title: string;
  description: string;
  price: string;
  type: 'excursion' | 'transfer' | 'experience' | 'addon';
  imageUrl?: string;
}

export interface AuthSession {
  booking: Booking;
  passenger: Passenger;
  trip: Trip;
}
