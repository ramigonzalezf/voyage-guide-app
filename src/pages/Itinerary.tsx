import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/layout/MobileLayout';
import ServiceCard from '@/components/trip/ServiceCard';
import { groupServicesByDay } from '@/services/bookingService';
import { motion } from 'framer-motion';
import { format, differenceInCalendarDays } from 'date-fns';

export default function Itinerary() {
  const { t } = useTranslation();
  const { session } = useAuth();

  if (!session) return null;

  const { trip } = session;
  const dayGroups = groupServicesByDay(trip.services);

  const getDayNumber = (dateStr: string) => {
    return differenceInCalendarDays(new Date(dateStr), new Date(trip.startDate)) + 1;
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-xl font-bold text-foreground">{t('itinerary.title')}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border" />

          <div className="space-y-6">
            {dayGroups.map((group, groupIdx) => (
              <motion.div
                key={group.date}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIdx * 0.08 }}
              >
                {/* Day header */}
                <div className="flex items-center gap-3 mb-3 relative">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0 z-10">
                    <span className="text-xs font-bold text-primary-foreground">
                      {t('common.day').charAt(0)}{getDayNumber(group.date)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {format(new Date(group.date), 'EEEE')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(group.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>

                {/* Services for this day */}
                <div className="ml-[19px] pl-8 space-y-3 border-l-0">
                  {group.services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="h-6" />
      </div>
    </MobileLayout>
  );
}
