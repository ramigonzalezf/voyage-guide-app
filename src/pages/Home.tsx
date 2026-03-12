import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/layout/MobileLayout';
import ServiceCard from '@/components/trip/ServiceCard';
import StatusBadge from '@/components/trip/StatusBadge';
import { motion } from 'framer-motion';
import { getDaysUntil, getNextService } from '@/services/bookingService';
import { ChevronRight, MapPin, CalendarDays, LogOut, Sparkles, FileText } from 'lucide-react';
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

  const isUpcoming = daysUntilStart > 0;
  const isToday = daysUntilStart === 0;
  const isInProgress = daysUntilStart < 0 && daysUntilEnd >= 0;

  const mainDestination = trip.destinations[0];

  return (
    <MobileLayout>
      <div className="px-5 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-5"
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              {t('home.greeting', { name: passenger.firstName })}
            </p>
            <h1 className="text-2xl font-extrabold text-foreground mt-0.5 tracking-tight">
              {trip.title}
            </h1>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="h-10 w-10 rounded-2xl bg-card card-shadow flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative rounded-3xl overflow-hidden mb-5"
        >
          <div
            className="h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${trip.coverImageUrl || mainDestination?.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-foreground/5" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-primary-foreground/70 flex items-center gap-1.5 font-medium">
                  <CalendarDays className="h-3 w-3" />
                  {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {trip.destinations.map((dest, i) => (
                    <span key={dest.id} className="text-primary-foreground/90 text-sm font-semibold flex items-center gap-1">
                      {i > 0 && <span className="text-primary-foreground/40 mx-0.5">·</span>}
                      <MapPin className="h-3 w-3" />
                      {dest.name}
                    </span>
                  ))}
                </div>
              </div>
              <StatusBadge status={trip.status} size="md" />
            </div>
          </div>
        </motion.div>

        {/* Countdown */}
        {isUpcoming && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-primary/8 to-primary/3 rounded-3xl p-6 mb-5 text-center relative overflow-hidden"
          >
            <div className="absolute top-3 right-4 opacity-10">
              <Sparkles className="h-16 w-16 text-primary" />
            </div>
            <p className="text-5xl font-black text-primary tracking-tight">{daysUntilStart}</p>
            <p className="text-sm font-semibold text-primary/70 mt-1">{t('home.daysLabel')}</p>
          </motion.div>
        )}

        {isToday && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-success/10 to-success/5 rounded-3xl p-5 mb-5 text-center"
          >
            <p className="text-lg font-bold text-success">🎉 {t('home.today')}</p>
          </motion.div>
        )}

        {isInProgress && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-primary/10 to-accent/5 rounded-3xl p-5 mb-5 text-center"
          >
            <p className="text-lg font-bold text-primary">✈️ {t('home.inProgress')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('home.endsIn', { days: daysUntilEnd })}</p>
          </motion.div>
        )}

        {/* Next service */}
        {nextService && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-foreground tracking-wide uppercase">{t('home.nextUp')}</h3>
              <p className="text-[10px] font-medium text-muted-foreground">
                {format(new Date(nextService.date), 'EEE, MMM d')}
              </p>
            </div>
            <ServiceCard service={nextService} highlighted />
          </motion.div>
        )}

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2 mb-5"
        >
          <button
            onClick={() => navigate('/itinerary')}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl card-shadow hover:card-shadow-hover transition-shadow group"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-card-foreground">{t('home.viewItinerary')}</p>
                <p className="text-xs text-muted-foreground">{t('home.services', { count: trip.services.length })}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>

          <button
            onClick={() => navigate('/documents')}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl card-shadow hover:card-shadow-hover transition-shadow group"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-card-foreground">{t('home.documents')}</p>
                <p className="text-xs text-muted-foreground">{t('home.documentsDesc')}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </motion.div>

        <div className="h-4" />
      </div>
    </MobileLayout>
  );
}
