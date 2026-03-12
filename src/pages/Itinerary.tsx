import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/layout/MobileLayout';
import ServiceCard from '@/components/trip/ServiceCard';
import { groupServicesByDay, getNextService } from '@/services/bookingService';
import { motion } from 'framer-motion';
import { format, differenceInCalendarDays, isToday, isTomorrow } from 'date-fns';

export default function Itinerary() {
  const { t } = useTranslation();
  const { session } = useAuth();

  if (!session) return null;

  const { trip } = session;
  const dayGroups = groupServicesByDay(trip.services);
  const nextService = getNextService(trip);

  const getDayNumber = (dateStr: string) => {
    return differenceInCalendarDays(new Date(dateStr), new Date(trip.startDate)) + 1;
  };

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return t('home.today').replace('!', '');
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE');
  };

  const isActiveDay = (dateStr: string) => {
    return nextService && nextService.date === dateStr;
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{t('itinerary.title')}</h1>
          <p className="text-xs font-medium text-muted-foreground mt-1 tracking-wide uppercase">
            {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')} · {dayGroups.length} {t('common.day').toLowerCase()}s
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-6 bottom-6 w-px bg-border" />

          <div className="space-y-8">
            {dayGroups.map((group, groupIdx) => {
              const active = isActiveDay(group.date);
              return (
                <motion.div
                  key={group.date}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.06 }}
                >
                  {/* Day header */}
                  <div className="flex items-center gap-3.5 mb-3.5 relative">
                    <div
                      className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                        active
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/10'
                          : 'bg-card text-foreground card-shadow'
                      }`}
                    >
                      {getDayNumber(group.date)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${active ? 'text-primary' : 'text-foreground'}`}>
                        {getDayLabel(group.date)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {format(new Date(group.date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                      {group.services.length} {group.services.length === 1 ? 'service' : 'services'}
                    </span>
                  </div>

                  {/* Services for this day */}
                  <div className="ml-5 pl-8 space-y-3">
                    {group.services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        highlighted={nextService?.id === service.id}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="h-6" />
      </div>
    </MobileLayout>
  );
}
