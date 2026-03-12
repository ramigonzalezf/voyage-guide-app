import type { Service } from '@/types/booking';
import { useTranslation } from 'react-i18next';
import ServiceIcon from './ServiceIcon';
import StatusBadge from './StatusBadge';
import { Clock, MapPin } from 'lucide-react';

function getServiceTitle(service: Service, t: (key: string) => string): string {
  switch (service.type) {
    case 'flight':
      return `${service.originCode} → ${service.destinationCode}`;
    case 'hotel':
      return service.hotelName;
    case 'transfer':
      return service.pickupPoint.split('–')[0].trim();
    case 'excursion':
      return service.title;
  }
}

function getServiceMeta(service: Service, t: (key: string) => string): string {
  switch (service.type) {
    case 'flight':
      return `${service.flightNumber} · ${service.airline}`;
    case 'hotel':
      return `${service.boardBasis}${service.roomType ? ` · ${service.roomType}` : ''}`;
    case 'transfer':
      return service.vehicleType || service.provider || '';
    case 'excursion':
      return service.duration;
    default:
      return '';
  }
}

function getServiceTime(service: Service, t: (key: string) => string): string | null {
  switch (service.type) {
    case 'flight':
      return `${service.departureTime} – ${service.arrivalTime}`;
    case 'transfer':
      return service.time || null;
    case 'excursion':
      return service.time || null;
    default:
      return service.time || null;
  }
}

interface Props {
  service: Service;
  compact?: boolean;
  highlighted?: boolean;
}

export default function ServiceCard({ service, compact = false, highlighted = false }: Props) {
  const { t } = useTranslation();
  const timeStr = getServiceTime(service, t);
  const meta = getServiceMeta(service, t);

  return (
    <div
      className={`flex items-start gap-3.5 p-3.5 rounded-2xl transition-shadow ${
        highlighted
          ? 'bg-primary/[0.04] ring-1 ring-primary/20 card-shadow-hover'
          : 'bg-card card-shadow'
      }`}
    >
      <ServiceIcon type={service.type} size={compact ? 'sm' : 'md'} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-sm text-card-foreground truncate leading-tight">
            {getServiceTitle(service, t)}
          </p>
          <StatusBadge status={service.status} />
        </div>
        {meta && (
          <p className="text-xs text-muted-foreground mt-1 truncate">{meta}</p>
        )}
        {timeStr && !compact && (
          <div className="flex items-center gap-1 mt-1.5">
            <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
            <p className="text-xs font-medium text-foreground/70">{timeStr}</p>
          </div>
        )}
        {service.reference && !compact && (
          <p className="text-[10px] text-muted-foreground/70 mt-1.5 font-mono tracking-wide uppercase">
            {t('itinerary.ref')} {service.reference}
          </p>
        )}
      </div>
    </div>
  );
}
