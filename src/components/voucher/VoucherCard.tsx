import { motion } from 'framer-motion';
import { Plane, Building2, Car, Compass, Shield, ChevronRight, Clock } from 'lucide-react';
import type { Document } from '@/types/booking';
import { cn } from '@/lib/utils';

const iconMap = {
  ticket: Plane,
  voucher: Building2,
  insurance: Shield,
  other: Compass,
};

const accentMap: Record<Document['type'], string> = {
  ticket: 'from-sky-500 to-blue-600',
  voucher: 'from-emerald-500 to-teal-600',
  insurance: 'from-violet-500 to-purple-600',
  other: 'from-amber-500 to-orange-600',
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
        'w-full text-left rounded-2xl overflow-hidden transition-all',
        isPending ? 'opacity-60 grayscale' : 'active:scale-[0.98]'
      )}
    >
      {/* Ticket top band */}
      <div className={cn('bg-gradient-to-r px-4 py-3 flex items-center justify-between', accentMap[doc.type])}>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-white/90" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-white/90 uppercase">
            {labelMap[doc.type]}
          </span>
        </div>
        {isPending ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-white/80">
            <Clock className="h-3 w-3" /> PENDING
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-white/70 tracking-wider">
            {serviceInfo?.reference || '—'}
          </span>
        )}
      </div>

      {/* Ticket body */}
      <div className="bg-card border border-t-0 border-border/50 rounded-b-2xl">
        {/* Perforated edge */}
        <div className="flex items-center -mt-px">
          <div className="h-3 w-3 rounded-full bg-background -ml-1.5 shrink-0" />
          <div className="flex-1 border-t border-dashed border-border/40 mx-1" />
          <div className="h-3 w-3 rounded-full bg-background -mr-1.5 shrink-0" />
        </div>

        <div className="px-4 py-3.5 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate leading-tight">{doc.title}</p>
            {serviceInfo?.subtitle && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{serviceInfo.subtitle}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              {serviceInfo?.date && (
                <span className="text-[11px] font-medium text-muted-foreground">
                  {new Date(serviceInfo.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              )}
              {serviceInfo?.time && (
                <span className="text-[11px] font-medium text-muted-foreground">{serviceInfo.time}</span>
              )}
              {serviceInfo?.provider && (
                <span className="text-[11px] font-medium text-muted-foreground truncate">{serviceInfo.provider}</span>
              )}
            </div>
          </div>
          {!isPending && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
        </div>
      </div>
    </motion.button>
  );
}
