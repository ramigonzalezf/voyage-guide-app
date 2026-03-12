import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/layout/MobileLayout';
import StatusBadge from '@/components/trip/StatusBadge';
import ServiceIcon from '@/components/trip/ServiceIcon';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft, Plane, Clock, MapPin, Building2, Phone, Mail,
  Calendar, Users, Info, Navigation, Car, Ticket, ExternalLink
} from 'lucide-react';
import type { Service, FlightService, HotelService, TransferService, ExcursionService } from '@/types/booking';

function InfoRow({ icon: Icon, label, value, accent = false }: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${accent ? 'bg-accent/10' : 'bg-muted'}`}>
        <Icon className={`h-4 w-4 ${accent ? 'text-accent' : 'text-muted-foreground'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function FlightDetail({ service }: { service: FlightService }) {
  const { t } = useTranslation();
  return (
    <>
      {/* Route visualization */}
      <div className="bg-card rounded-3xl p-5 card-shadow mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-2xl font-black text-foreground">{service.originCode}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[100px] truncate">{service.origin}</p>
          </div>
          <div className="flex-1 mx-4 flex flex-col items-center">
            <Plane className="h-4 w-4 text-accent rotate-90 mb-1" />
            <div className="w-full h-px bg-border relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-accent" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{service.flightNumber}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-foreground">{service.destinationCode}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[100px] truncate">{service.destination}</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-muted/50 rounded-2xl p-3">
          <div>
            <p className="text-xs text-muted-foreground">{t('itinerary.departure')}</p>
            <p className="text-lg font-bold text-foreground">{service.departureTime}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t('itinerary.arrival')}</p>
            <p className="text-lg font-bold text-foreground">{service.arrivalTime}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-5 card-shadow mb-4">
        <InfoRow icon={Plane} label={t('serviceDetail.airline')} value={service.airline} />
        <div className="border-t border-border" />
        <InfoRow icon={Ticket} label={t('serviceDetail.flightNumber')} value={service.flightNumber} />
        {service.terminal && (
          <>
            <div className="border-t border-border" />
            <InfoRow icon={Building2} label={t('serviceDetail.terminal')} value={service.terminal} />
          </>
        )}
        <div className="border-t border-border" />
        <InfoRow icon={Calendar} label={t('serviceDetail.date')} value={format(new Date(service.date), 'EEEE, MMMM d, yyyy')} />
      </div>
    </>
  );
}

function HotelDetail({ service }: { service: HotelService }) {
  const { t } = useTranslation();
  return (
    <>
      {service.imageUrl && (
        <div className="rounded-3xl overflow-hidden mb-4 h-44">
          <img src={service.imageUrl} alt={service.hotelName} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="bg-card rounded-3xl p-5 card-shadow mb-4">
        <div className="flex items-center justify-between bg-muted/50 rounded-2xl p-3 mb-1">
          <div>
            <p className="text-xs text-muted-foreground">{t('itinerary.checkIn')}</p>
            <p className="text-sm font-bold text-foreground">{format(new Date(service.checkIn), 'MMM d')}</p>
          </div>
          <div className="text-xs text-muted-foreground">→</div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t('itinerary.checkOut')}</p>
            <p className="text-sm font-bold text-foreground">{format(new Date(service.checkOut), 'MMM d')}</p>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-3xl p-5 card-shadow mb-4">
        <InfoRow icon={Building2} label={t('serviceDetail.hotel')} value={service.hotelName} />
        <div className="border-t border-border" />
        <InfoRow icon={MapPin} label={t('serviceDetail.address')} value={service.address} />
        {service.roomType && (
          <>
            <div className="border-t border-border" />
            <InfoRow icon={Users} label={t('serviceDetail.roomType')} value={service.roomType} />
          </>
        )}
        <div className="border-t border-border" />
        <InfoRow icon={Info} label={t('itinerary.boardBasis')} value={service.boardBasis} accent />
      </div>
      {(service.contactPhone || service.contactEmail) && (
        <div className="bg-card rounded-3xl p-5 card-shadow mb-4">
          <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">{t('serviceDetail.contact')}</p>
          {service.contactPhone && (
            <a href={`tel:${service.contactPhone}`} className="flex items-center gap-3 py-2 text-sm text-primary font-medium">
              <Phone className="h-4 w-4" /> {service.contactPhone}
            </a>
          )}
          {service.contactEmail && (
            <a href={`mailto:${service.contactEmail}`} className="flex items-center gap-3 py-2 text-sm text-primary font-medium">
              <Mail className="h-4 w-4" /> {service.contactEmail}
            </a>
          )}
        </div>
      )}
    </>
  );
}

function TransferDetail({ service }: { service: TransferService }) {
  const { t } = useTranslation();
  return (
    <>
      <div className="bg-card rounded-3xl p-5 card-shadow mb-4">
        <div className="flex items-start gap-3 relative">
          <div className="flex flex-col items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <div className="w-px h-10 bg-border" />
            <div className="h-3 w-3 rounded-full bg-accent" />
          </div>
          <div className="flex-1 space-y-5">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{t('itinerary.pickup')}</p>
              <p className="text-sm font-semibold text-foreground">{service.pickupPoint}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{t('serviceDetail.dropoff')}</p>
              <p className="text-sm font-semibold text-foreground">{service.dropoffPoint}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-3xl p-5 card-shadow mb-4">
        <InfoRow icon={Clock} label={t('serviceDetail.schedule')} value={service.schedule} />
        {service.vehicleType && (
          <>
            <div className="border-t border-border" />
            <InfoRow icon={Car} label={t('serviceDetail.vehicle')} value={service.vehicleType} />
          </>
        )}
        <div className="border-t border-border" />
        <InfoRow icon={Calendar} label={t('serviceDetail.date')} value={format(new Date(service.date), 'EEEE, MMMM d, yyyy')} />
      </div>
      {service.instructions && (
        <div className="bg-accent/5 border border-accent/15 rounded-3xl p-5 mb-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-foreground mb-1">{t('serviceDetail.instructions')}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.instructions}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ExcursionDetail({ service }: { service: ExcursionService }) {
  const { t } = useTranslation();
  return (
    <>
      {service.imageUrl && (
        <div className="rounded-3xl overflow-hidden mb-4 h-44">
          <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="bg-card rounded-3xl p-5 card-shadow mb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
      </div>
      <div className="bg-card rounded-3xl p-5 card-shadow mb-4">
        <InfoRow icon={MapPin} label={t('itinerary.meetingPoint')} value={service.meetingPoint} accent />
        <div className="border-t border-border" />
        <InfoRow icon={Clock} label={t('itinerary.duration')} value={service.duration} />
        <div className="border-t border-border" />
        <InfoRow icon={Calendar} label={t('serviceDetail.date')} value={format(new Date(service.date), 'EEEE, MMMM d, yyyy')} />
        {service.time && (
          <>
            <div className="border-t border-border" />
            <InfoRow icon={Clock} label={t('serviceDetail.time')} value={service.time} />
          </>
        )}
      </div>
    </>
  );
}

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { session } = useAuth();

  if (!session) return null;

  const service = session.trip.services.find((s) => s.id === serviceId);
  if (!service) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <p className="text-sm text-muted-foreground">{t('serviceDetail.notFound')}</p>
        </div>
      </MobileLayout>
    );
  }

  const getTitle = (s: Service) => {
    switch (s.type) {
      case 'flight': return `${s.originCode} → ${s.destinationCode}`;
      case 'hotel': return s.hotelName;
      case 'transfer': return t('itinerary.transfer');
      case 'excursion': return s.title;
    }
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-4 pb-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </button>
          <div className="flex items-start gap-3">
            <ServiceIcon type={service.type} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t(`itinerary.${service.type}`)}
              </p>
              <h1 className="text-xl font-extrabold text-foreground tracking-tight mt-0.5">
                {getTitle(service)}
              </h1>
            </div>
            <StatusBadge status={service.status} size="md" />
          </div>
        </motion.div>

        {/* Service-specific content */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          {service.type === 'flight' && <FlightDetail service={service} />}
          {service.type === 'hotel' && <HotelDetail service={service} />}
          {service.type === 'transfer' && <TransferDetail service={service} />}
          {service.type === 'excursion' && <ExcursionDetail service={service} />}

          {/* Notes */}
          {service.notes && (
            <div className="bg-muted/50 rounded-3xl p-5 mb-4">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground mb-1">{t('serviceDetail.notes')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reference */}
          {service.reference && (
            <div className="text-center py-3">
              <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
                {t('itinerary.ref')} {service.reference}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </MobileLayout>
  );
}
