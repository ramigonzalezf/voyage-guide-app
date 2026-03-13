import { motion } from 'framer-motion';
import { Plane, Building2, Car, Compass, Shield, Clock } from 'lucide-react';
import type { Document } from '@/types/booking';
import { cn } from '@/lib/utils';

const iconMap = {
  ticket: Plane,
  voucher: Building2,
  insurance: Shield,
  other: Compass,
};

const labelMap: Record<Document['type'], string> = {
  ticket: 'BOARDING PASS',
  voucher: 'VOUCHER',
  insurance: 'POLICY',
  other: 'DOCUMENT',
};

// Map service type to gradient backgrounds — all dark enough for white text
type ServiceTypeKey = 'flight' | 'hotel' | 'transfer' | 'excursion' | 'insurance';

const serviceGradientMap: Record<ServiceTypeKey, string> = {
  flight: 'linear-gradient(135deg, hsl(210 75% 38%), hsl(225 65% 48%))',
  hotel: 'linear-gradient(135deg, hsl(160 50% 30%), hsl(175 45% 38%))',
  transfer: 'linear-gradient(135deg, hsl(25 70% 38%), hsl(40 65% 42%))',
  excursion: 'linear-gradient(135deg, hsl(270 50% 38%), hsl(290 45% 48%))',
  insurance: 'linear-gradient(135deg, hsl(330 60% 38%), hsl(345 55% 48%))',
};

const serviceAccentMap: Record<ServiceTypeKey, string> = {
  flight: 'hsl(215 70% 45%)',
  hotel: 'hsl(165 48% 34%)',
  transfer: 'hsl(32 68% 40%)',
  excursion: 'hsl(280 48% 43%)',
  insurance: 'hsl(335 58% 43%)',
};

interface VoucherCardProps {
  doc: Document;
  serviceType?: ServiceTypeKey;
  serviceInfo?: {
    date?: string;
    time?: string;
    provider?: string;
    reference?: string;
    subtitle?: string;
  };
  onClick: () => void;
  index: number;
}

export default function VoucherCard({ doc, serviceType, serviceInfo, onClick, index }: VoucherCardProps) {
  const Icon = iconMap[doc.type];
  const isPending = doc.status === 'pending';
  const colorKey: ServiceTypeKey = serviceType || (doc.type === 'ticket' ? 'flight' : doc.type === 'insurance' ? 'insurance' : 'hotel');
  const headerGradient = serviceGradientMap[colorKey];
  const accentColor = serviceAccentMap[colorKey];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      onClick={onClick}
      disabled={isPending}
      className={cn(
        'w-full text-left rounded-[18px] overflow-hidden transition-all card-shadow',
        isPending ? 'opacity-50' : 'active:scale-[0.97] hover:card-shadow-hover'
      )}
    >
      {/* Pass header — gradient by service type */}
      <div className="px-5 py-4 relative" style={{ background: headerGradient }}>
        {/* Decorative circle */}
        <div className="absolute top-3 right-4 h-8 w-8 rounded-full bg-white/[0.08]" />

        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-white/[0.15]">
            <Icon className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/70">
            {labelMap[doc.type]}
          </span>
        </div>

        <h3 className="text-[15px] font-extrabold leading-snug pr-8 text-white">
          {doc.title}
        </h3>

        {serviceInfo?.reference && (
          <p className="text-[11px] font-mono mt-1.5 tracking-wider text-white/50">
            {serviceInfo.reference}
          </p>
        )}
      </div>

      {/* Perforated edge */}
      <div className="flex items-center bg-card relative">
        <div className="h-3.5 w-3.5 rounded-full bg-background -ml-[7px] shrink-0 relative z-10" />
        <div className="flex-1 border-t border-dashed border-border mx-0" />
        <div className="h-3.5 w-3.5 rounded-full bg-background -mr-[7px] shrink-0 relative z-10" />
      </div>

      {/* Pass body */}
      <div className="bg-card px-5 py-4">
        {isPending ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wide">Pending confirmation</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex gap-5">
              {serviceInfo?.date && (
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Date</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {new Date(serviceInfo.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              )}
              {serviceInfo?.time && (
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Time</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{serviceInfo.time}</p>
                </div>
              )}
              {serviceInfo?.provider && (
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Provider</p>
                  <p className="text-sm font-bold text-foreground mt-0.5 truncate">{serviceInfo.provider}</p>
                </div>
              )}
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}1A` }}>
              <Icon className="h-3.5 w-3.5" style={{ color: accentColor }} />
            </div>
          </div>
        )}
      </div>
    </motion.button>
  );
}
