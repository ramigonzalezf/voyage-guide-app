import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Building2, Car, Compass, Shield, MapPin, Phone, Mail, Clock, Calendar, User } from 'lucide-react';
import type { Document } from '@/types/booking';
import type { Service } from '@/types/booking';
import { cn } from '@/lib/utils';

const accentMap: Record<Document['type'], string> = {
  ticket: 'from-sky-500 to-blue-600',
  voucher: 'from-emerald-500 to-teal-600',
  insurance: 'from-violet-500 to-purple-600',
  other: 'from-amber-500 to-orange-600',
};

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

interface VoucherModalProps {
  open: boolean;
  onClose: () => void;
  doc: Document | null;
  service: Service | null;
  passengerName: string;
}

export default function VoucherModal({ open, onClose, doc, service, passengerName }: VoucherModalProps) {
  if (!doc) return null;

  const Icon = iconMap[doc.type];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className={cn('bg-gradient-to-r px-5 pt-12 pb-6 relative', accentMap[doc.type])}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
              >
                <X className="h-4 w-4 text-white" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-5 w-5 text-white/90" />
                <span className="text-[11px] font-bold tracking-[0.15em] text-white/80 uppercase">
                  {labelMap[doc.type]}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-white leading-tight">{doc.title}</h2>

              {service?.reference && (
                <p className="text-sm text-white/70 mt-2 font-mono tracking-wider">{service.reference}</p>
              )}
            </div>

            {/* Perforated edge */}
            <div className="flex items-center px-0 bg-background">
              <div className={cn('h-4 w-4 rounded-full -ml-2 shrink-0 bg-gradient-to-r', accentMap[doc.type])} />
              <div className="flex-1 border-t border-dashed border-border mx-1" />
              <div className={cn('h-4 w-4 rounded-full -mr-2 shrink-0 bg-gradient-to-r', accentMap[doc.type])} />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {/* Passenger */}
              <InfoRow icon={User} label="Passenger" value={passengerName} />

              {/* Service-specific details */}
              {service && <ServiceDetails service={service} />}

              {/* Status */}
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                    {doc.status === 'available' ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Present this voucher at the point of service
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ icon: IconComp, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
        <IconComp className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function ServiceDetails({ service }: { service: Service }) {
  switch (service.type) {
    case 'flight':
      return (
        <div className="space-y-4">
          {/* Route */}
          <div className="bg-card rounded-xl border border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-foreground">{service.originCode}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[90px] truncate">{service.origin}</p>
              </div>
              <div className="flex-1 flex items-center justify-center px-3">
                <div className="h-px flex-1 bg-border" />
                <Plane className="h-4 w-4 text-primary mx-2 rotate-90" />
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-foreground">{service.destinationCode}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[90px] truncate">{service.destination}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoRow icon={Calendar} label="Date" value={new Date(service.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
            <InfoRow icon={Clock} label="Departure" value={service.departureTime} />
          </div>
          <InfoRow icon={Plane} label="Flight" value={`${service.airline} · ${service.flightNumber}`} />
          {service.terminal && <InfoRow icon={MapPin} label="Terminal" value={service.terminal} />}
          {service.notes && <InfoRow icon={Compass} label="Notes" value={service.notes} />}
        </div>
      );

    case 'hotel':
      return (
        <div className="space-y-4">
          <InfoRow icon={Building2} label="Hotel" value={service.hotelName} />
          <InfoRow icon={MapPin} label="Address" value={service.address} />
          <div className="grid grid-cols-2 gap-3">
            <InfoRow icon={Calendar} label="Check-in" value={new Date(service.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} />
            <InfoRow icon={Calendar} label="Check-out" value={new Date(service.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} />
          </div>
          {service.roomType && <InfoRow icon={Building2} label="Room" value={service.roomType} />}
          <InfoRow icon={Compass} label="Board" value={service.boardBasis} />
          {service.contactPhone && <InfoRow icon={Phone} label="Phone" value={service.contactPhone} />}
          {service.contactEmail && <InfoRow icon={Mail} label="Email" value={service.contactEmail} />}
        </div>
      );

    case 'transfer':
      return (
        <div className="space-y-4">
          <InfoRow icon={MapPin} label="Pickup" value={service.pickupPoint} />
          <InfoRow icon={MapPin} label="Drop-off" value={service.dropoffPoint} />
          <InfoRow icon={Clock} label="Schedule" value={service.schedule} />
          {service.vehicleType && <InfoRow icon={Car} label="Vehicle" value={service.vehicleType} />}
          {service.instructions && <InfoRow icon={Compass} label="Instructions" value={service.instructions} />}
        </div>
      );

    case 'excursion':
      return (
        <div className="space-y-4">
          <InfoRow icon={Compass} label="Activity" value={service.title} />
          <InfoRow icon={Calendar} label="Date" value={new Date(service.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
          {service.time && <InfoRow icon={Clock} label="Time" value={service.time} />}
          <InfoRow icon={MapPin} label="Meeting point" value={service.meetingPoint} />
          <InfoRow icon={Clock} label="Duration" value={service.duration} />
          <div className="bg-muted/30 rounded-xl p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
