import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import type { ServiceStatus, TripStatus } from '@/types/booking';

interface Props {
  status: ServiceStatus | TripStatus;
  size?: 'sm' | 'md';
}

const dotColors: Record<string, string> = {
  confirmed: 'bg-success',
  upcoming: 'bg-info',
  in_progress: 'bg-primary',
  completed: 'bg-muted-foreground',
  pending: 'bg-warning',
  cancelled: 'bg-destructive',
};

const bgStyles: Record<string, string> = {
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

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap',
        bgStyles[status] || bgStyles.pending,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      )}
    >
      <span
        className={cn(
          'rounded-full shrink-0',
          dotColors[status] || dotColors.pending,
          size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'
        )}
      />
      {t(labels[status] || 'common.pending')}
    </span>
  );
}
