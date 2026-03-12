import { mockBooking, mockTrip } from '@/data/mockData';
import type { AuthSession, Booking, Trip } from '@/types/booking';

// Service layer — swap these implementations for real API calls later

export async function authenticatePassenger(
  fileCode: string,
  lastName: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800));

  const normalizedCode = fileCode.trim().toUpperCase();
  const normalizedName = lastName.trim().toLowerCase();

  if (
    normalizedCode === mockBooking.fileCode &&
    mockBooking.passengers.some((p) => p.lastName.toLowerCase() === normalizedName)
  ) {
    return { success: true, booking: mockBooking };
  }

  return { success: false, error: 'invalid_credentials' };
}

export async function fetchTrip(tripId: string): Promise<Trip | null> {
  await new Promise((r) => setTimeout(r, 300));
  if (tripId === mockTrip.id) return mockTrip;
  return null;
}

export function getNextService(trip: Trip): typeof trip.services[0] | null {
  const now = new Date();
  const upcoming = trip.services
    .filter((s) => {
      const serviceDate = new Date(`${s.date}T${s.time || '00:00'}`);
      return serviceDate > now && s.status !== 'cancelled';
    })
    .sort((a, b) => {
      const da = new Date(`${a.date}T${a.time || '00:00'}`);
      const db = new Date(`${b.date}T${b.time || '00:00'}`);
      return da.getTime() - db.getTime();
    });
  return upcoming[0] || null;
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function groupServicesByDay(services: typeof mockTrip.services) {
  const groups: Record<string, typeof services> = {};
  for (const svc of services) {
    if (!groups[svc.date]) groups[svc.date] = [];
    groups[svc.date].push(svc);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({ date, services: items }));
}
