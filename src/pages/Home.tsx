import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/layout/MobileLayout';
import ServiceCard from '@/components/trip/ServiceCard';
import StatusBadge from '@/components/trip/StatusBadge';
import { motion } from 'framer-motion';
import { getDaysUntil, getNextService } from '@/services/bookingService';
import { ChevronRight, MapPin, CalendarDays, LogOut } from 'lucide-react';
import { format } from 'date-fns';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, logout } = useAuth();

  if (!session) return null;

  const { passenger, trip } = session;
  const daysUntilStart = getDaysUntil(trip.startDate);
  const daysUntilEnd = getDaysUntil(trip.endDate);
  const nextService = getNextService(trip);

  const getCountdownText = () => {
    if (daysUntilStart > 0) return t('home.startsIn', { days: daysUntilStart });
    if (daysUntilStart === 0) return t('home.today');
    if (daysUntilEnd >= 0) return t('home.inProgress');
    return t('home.completed');
  };

  const mainDestination = trip.destinations[0];

  return (
    <MobileLayout>
      <div className="px-5 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-sm text-muted-foreground">{t('home.greeting', { name: passenger.firstName })}</p>
            <h1 className="text-xl font-bold text-foreground">{t('home.yourTrip')}</h1>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="h-9 w-9 rounded-full bg-card card-shadow flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden mb-6"
        >
          <div
            className="h-44 bg-cover bg-center"
            style={{ backgroundImage: `url(${trip.coverImageUrl || mainDestination?.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary-foreground">{trip.title}</h2>
                <p className="text-xs text-primary-foreground/80 flex items-center gap-1 mt-0.5">
                  <CalendarDays className="h-3 w-3" />
                  {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </p>
              </div>
              <StatusBadge status={trip.status} size="md" />
            </div>
          </div>
        </motion.div>

        {/* Countdown */}
        {daysUntilStart > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/5 rounded-2xl p-5 mb-6 text-center"
          >
            <p className="text-4xl font-extrabold text-primary">{daysUntilStart}</p>
            <p className="text-sm font-medium text-primary/80 mt-1">{t('home.daysLabel')}</p>
          </motion.div>
        )}

        {/* Next service */}
        {nextService && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('home.nextUp')}</h3>
            <ServiceCard service={nextService} />
          </motion.div>
        )}

        {/* Destinations */}
        {trip.destinations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('home.destinations')}</h3>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
              {trip.destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="shrink-0 w-36 rounded-xl overflow-hidden bg-card card-shadow"
                >
                  <div
                    className="h-20 bg-cover bg-center"
                    style={{ backgroundImage: `url(${dest.imageUrl})` }}
                  />
                  <div className="p-2.5">
                    <p className="text-sm font-semibold text-card-foreground">{dest.name}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <MapPin className="h-2.5 w-2.5" />
                      {dest.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick stats & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate('/itinerary')}
            className="w-full flex items-center justify-between p-4 bg-card rounded-xl card-shadow hover:card-shadow-hover transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-card-foreground">{t('home.viewItinerary')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('home.services', { count: trip.services.length })}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </motion.div>

        <div className="h-6" />
      </div>
    </MobileLayout>
  );
}
