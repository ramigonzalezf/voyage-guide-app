import type { Service } from '@/types/booking';
import { useTranslation } from 'react-i18next';
import ServiceIcon from './ServiceIcon';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';

function getServiceTitle(service: Service, t: (key: string) => string): string {
  switch (service.type) {
    case 'flight':
      return `${service.flightNumber} · ${service.originCode} → ${service.destinationCode}`;
    case 'hotel':
      return service.hotelName;
    case 'transfer':
      return `${t('itinerary.transfer')} · ${service.pickupPoint.split('–')[0].trim()}`;
    case 'excursion':
      return service.title;
  }
}

function getServiceSubtitle(service: Service, t: (key: string) => string): string {
  switch (service.type) {
    case 'flight':
      return `${t('itinerary.departure')} ${service.departureTime} · ${t('itinerary.arrival')} ${service.arrivalTime}`;
    case 'hotel':
      return `${service.boardBasis}${service.roomType ? ` · ${service.roomType}` : ''}`;
    case 'transfer':
      return service.schedule;
    case 'excursion':
      return `${service.duration} · ${service.meetingPoint}`;
    default:
      return '';
  }
}

interface Props {
  service: Service;
  compact?: boolean;
}

export default function ServiceCard({ service, compact = false }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-3 p-3 bg-card rounded-xl card-shadow">
      <ServiceIcon type={service.type} size={compact ? 'sm' : 'md'} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`font-semibold text-card-foreground truncate ${compact ? 'text-sm' : 'text-sm'}`}>
            {getServiceTitle(service, t)}
          </p>
          <StatusBadge status={service.status} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {getServiceSubtitle(service, t)}
        </p>
        {service.time && !compact && (
          <p className="text-xs text-muted-foreground mt-1">
            {service.time}
          </p>
        )}
        {service.reference && !compact && (
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">
            {t('itinerary.ref')}: {service.reference}
          </p>
        )}
      </div>
    </div>
  );
}
