import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthSession, Booking, Passenger, Trip } from '@/types/booking';
import { authenticatePassenger, fetchTrip } from '@/services/bookingService';

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  login: (fileCode: string, lastName: string) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
  selectPassenger: (passenger: Passenger) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const stored = localStorage.getItem('travel_session');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);

  const login = useCallback(async (fileCode: string, lastName: string) => {
    setIsLoading(true);
    try {
      const result = await authenticatePassenger(fileCode, lastName);
      if (result.success && result.booking) {
        setPendingBooking(result.booking);
        // If only one matching passenger, auto-select
        const matchingPassengers = result.booking.passengers.filter(
          (p) => p.lastName.toLowerCase() === lastName.trim().toLowerCase()
        );
        if (matchingPassengers.length === 1) {
          const trip = await fetchTrip(result.booking.tripId);
          if (trip) {
            const newSession: AuthSession = { booking: result.booking, passenger: matchingPassengers[0], trip };
            setSession(newSession);
            localStorage.setItem('travel_session', JSON.stringify(newSession));
          }
        }
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectPassenger = useCallback(async (passenger: Passenger) => {
    if (!pendingBooking) return false;
    setIsLoading(true);
    try {
      const trip = await fetchTrip(pendingBooking.tripId);
      if (trip) {
        const newSession: AuthSession = { booking: pendingBooking, passenger, trip };
        setSession(newSession);
        localStorage.setItem('travel_session', JSON.stringify(newSession));
        setPendingBooking(null);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [pendingBooking]);

  const logout = useCallback(() => {
    setSession(null);
    setPendingBooking(null);
    localStorage.removeItem('travel_session');
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, login, selectPassenger, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export { AuthContext };
