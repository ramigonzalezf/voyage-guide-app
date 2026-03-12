import { Plane, Building2, Car, MapPin, Package } from 'lucide-react';
import type { ServiceType } from '@/types/booking';
import { cn } from '@/lib/utils';

const config: Record<ServiceType, { icon: typeof Plane; bgClass: string; textClass: string }> = {
  flight: { icon: Plane, bgClass: 'bg-info/10', textClass: 'text-info' },
  hotel: { icon: Building2, bgClass: 'bg-primary/10', textClass: 'text-primary' },
  transfer: { icon: Car, bgClass: 'bg-warning/10', textClass: 'text-warning' },
  excursion: { icon: MapPin, bgClass: 'bg-success/10', textClass: 'text-success' },
  other: { icon: Package, bgClass: 'bg-muted', textClass: 'text-muted-foreground' },
};

interface Props {
  type: ServiceType;
  size?: 'sm' | 'md' | 'lg';
}

export default function ServiceIcon({ type, size = 'md' }: Props) {
  const { icon: Icon, bgClass, textClass } = config[type];
  const sizeClasses = {
    sm: 'h-8 w-8 [&_svg]:h-4 [&_svg]:w-4',
    md: 'h-10 w-10 [&_svg]:h-5 [&_svg]:w-5',
    lg: 'h-12 w-12 [&_svg]:h-6 [&_svg]:w-6',
  };

  return (
    <div className={cn('rounded-xl flex items-center justify-center shrink-0', bgClass, sizeClasses[size])}>
      <Icon className={textClass} />
    </div>
  );
}
