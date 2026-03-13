import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Building2, Car, Compass, Shield, MapPin, Phone, Mail, Clock, Calendar, User } from 'lucide-react';
import type { Document, Service } from '@/types/booking';
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

type ServiceTypeKey = 'flight' | 'hotel' | 'transfer' | 'excursion' | 'insurance';

const serviceGradientMap: Record<ServiceTypeKey, string> = {
  flight: 'linear-gradient(135deg, hsl(210 75% 38%), hsl(225 65% 48%))',
  hotel: 'linear-gradient(135deg, hsl(160 50% 30%), hsl(175 45% 38%))',
  transfer: 'linear-gradient(135deg, hsl(25 70% 38%), hsl(40 65% 42%))',
  excursion: 'linear-gradient(135deg, hsl(270 50% 38%), hsl(290 45% 48%))',
  insurance: 'linear-gradient(135deg, hsl(330 60% 38%), hsl(345 55% 48%))',
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
  const colorKey: ServiceTypeKey = service?.type as ServiceTypeKey || (doc.type === 'ticket' ? 'flight' : doc.type === 'insurance' ? 'insurance' : 'hotel');
  const headerGradient = serviceGradientMap[colorKey];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="h-full flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 pt-12 pb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {labelMap[doc.type]}
              </span>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Scrollable pass */}
            <div className="flex-1 overflow-y-auto px-5 pb-10">
              <div className="rounded-[22px] overflow-hidden card-shadow max-w-md mx-auto">
                {/* Pass Header */}
                <div className="px-6 pt-6 pb-5 relative" style={{ backgroundColor: headerBg }}>
                  {/* Decorative circles */}
                  <div className="absolute top-4 right-5 h-12 w-12 rounded-full" style={{ backgroundColor: `${headerFg}0D` }} />
                  <div className="absolute bottom-3 right-12 h-6 w-6 rounded-full" style={{ backgroundColor: `${headerFg}0A` }} />

                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${headerFg}1F` }}>
                      <Icon className="h-4.5 w-4.5" style={{ color: headerFg }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold tracking-[0.18em] uppercase block" style={{ color: `${headerFg}99` }}>
                        {labelMap[doc.type]}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl font-extrabold leading-tight pr-12" style={{ color: headerFg }}>
                    {doc.title}
                  </h2>

                  {service?.reference && (
                    <p className="text-xs font-mono mt-2 tracking-widest" style={{ color: `${headerFg}73` }}>
                      {service.reference}
                    </p>
                  )}
                </div>

                {/* Perforated edge */}
                <div className="flex items-center bg-card relative">
                  <div className="h-5 w-5 rounded-full bg-background -ml-2.5 shrink-0 relative z-10" />
                  <div className="flex-1 border-t border-dashed border-border mx-0" />
                  <div className="h-5 w-5 rounded-full bg-background -mr-2.5 shrink-0 relative z-10" />
                </div>

                {/* Pass Body */}
                <div className="bg-card px-6 py-5 space-y-5">
                  {/* Passenger row */}
                  <FieldRow label="Passenger" value={passengerName} />

                  {/* Service-specific fields */}
                  {service && <ServiceFields service={service} />}

                  {/* Status pill */}
                  <div className="pt-2">
                    <div className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-full',
                      doc.status === 'available' ? 'bg-[hsl(var(--success)/0.1)]' : 'bg-muted'
                    )}>
                      <div className={cn(
                        'h-2 w-2 rounded-full',
                        doc.status === 'available' ? 'bg-[hsl(var(--success))] animate-pulse' : 'bg-muted-foreground'
                      )} />
                      <span className={cn(
                        'text-[11px] font-bold uppercase tracking-wider',
                        doc.status === 'available' ? 'text-[hsl(var(--success))]' : 'text-muted-foreground'
                      )}>
                        {doc.status === 'available' ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pass Footer */}
                <div className="bg-muted/40 px-6 py-4 border-t border-border/50">
                  <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                    Present this pass at the point of service
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---- Shared field row ---- */
function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{label}</p>
      <p className="text-sm font-bold text-foreground mt-0.5">{value}</p>
    </div>
  );
}

/* ---- Service-specific detail blocks ---- */
function ServiceFields({ service }: { service: Service }) {
  switch (service.type) {
    case 'flight':
      return (
        <div className="space-y-4">
          {/* Route display */}
          <div className="flex items-center justify-between py-2">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-foreground tracking-tight">{service.originCode}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[80px] truncate">{service.origin}</p>
            </div>
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="h-px flex-1 bg-border" />
              <Plane className="h-4 w-4 text-accent mx-2 rotate-90" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-foreground tracking-tight">{service.destinationCode}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[80px] truncate">{service.destination}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FieldRow label="Date" value={new Date(service.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} />
            <FieldRow label="Departure" value={service.departureTime} />
            <FieldRow label="Flight" value={service.flightNumber} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Airline" value={service.airline} />
            {service.terminal && <FieldRow label="Terminal" value={service.terminal} />}
          </div>
          {service.notes && <FieldRow label="Notes" value={service.notes} />}
        </div>
      );

    case 'hotel':
      return (
        <div className="space-y-4">
          <FieldRow label="Hotel" value={service.hotelName} />
          <FieldRow label="Address" value={service.address} />
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Check-in" value={new Date(service.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} />
            <FieldRow label="Check-out" value={new Date(service.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {service.roomType && <FieldRow label="Room" value={service.roomType} />}
            <FieldRow label="Board" value={service.boardBasis} />
          </div>
          {service.contactPhone && <FieldRow label="Phone" value={service.contactPhone} />}
          {service.contactEmail && <FieldRow label="Email" value={service.contactEmail} />}
        </div>
      );

    case 'transfer':
      return (
        <div className="space-y-4">
          <FieldRow label="Pickup" value={service.pickupPoint} />
          <FieldRow label="Drop-off" value={service.dropoffPoint} />
          <FieldRow label="Schedule" value={service.schedule} />
          {service.vehicleType && <FieldRow label="Vehicle" value={service.vehicleType} />}
          {service.instructions && <FieldRow label="Instructions" value={service.instructions} />}
        </div>
      );

    case 'excursion':
      return (
        <div className="space-y-4">
          <FieldRow label="Activity" value={service.title} />
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Date" value={new Date(service.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} />
            {service.time && <FieldRow label="Time" value={service.time} />}
          </div>
          <FieldRow label="Meeting Point" value={service.meetingPoint} />
          <FieldRow label="Duration" value={service.duration} />
          <div className="bg-muted/30 rounded-xl p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
