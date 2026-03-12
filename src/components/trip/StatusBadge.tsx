import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import type { ServiceStatus, TripStatus } from '@/types/booking';

interface Props {
  status: ServiceStatus | TripStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const { t } = useTranslation();

  const styles: Record<string, string> = {
    confirmed: 'bg-success/10 text-success',
    upcoming: 'bg-info/10 text-info',
    in_progress: 'bg-primary/10 text-primary',
    completed: 'bg-muted text-muted-foreground',
    pending: 'bg-warning/10 text-warning',
    cancelled: 'bg-destructive/10 text-destructive',
  };

  const labels: Record<string, string> = {
    confirmed: 'common.confirmed',
    upcoming: 'common.confirmed',
    in_progress: 'home.inProgress',
    completed: 'common.completed',
    pending: 'common.pending',
    cancelled: 'common.cancelled',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        styles[status] || styles.pending,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      )}
    >
      {t(labels[status] || 'common.pending')}
    </span>
  );
}
