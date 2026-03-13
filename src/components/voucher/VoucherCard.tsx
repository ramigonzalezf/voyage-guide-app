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

interface VoucherCardProps {
  doc: Document;
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

export default function VoucherCard({ doc, serviceInfo, onClick, index }: VoucherCardProps) {
  const Icon = iconMap[doc.type];
  const isPending = doc.status === 'pending';

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
      {/* Pass header — navy/primary branded */}
      <div className="bg-primary px-5 py-4 relative">
        {/* Decorative circle */}
        <div className="absolute top-3 right-4 h-8 w-8 rounded-full bg-primary-foreground/[0.08]" />

        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg bg-primary-foreground/[0.12] flex items-center justify-center">
            <Icon className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.18em] text-primary-foreground/70 uppercase">
            {labelMap[doc.type]}
          </span>
        </div>

        <h3 className="text-[15px] font-extrabold text-primary-foreground leading-snug pr-8">
          {doc.title}
        </h3>

        {serviceInfo?.reference && (
          <p className="text-[11px] font-mono text-primary-foreground/50 mt-1.5 tracking-wider">
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
            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Icon className="h-3.5 w-3.5 text-accent" />
            </div>
          </div>
        )}
      </div>
    </motion.button>
  );
}
