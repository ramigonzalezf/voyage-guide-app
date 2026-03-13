import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/layout/MobileLayout';
import VoucherCard from '@/components/voucher/VoucherCard';
import VoucherModal from '@/components/voucher/VoucherModal';
import { motion } from 'framer-motion';
import { Wallet, Clock, CheckCircle2 } from 'lucide-react';
import type { Document } from '@/types/booking';

const mockDocuments: Document[] = [
  { id: 'doc-1', type: 'ticket', title: 'E-Ticket MAD → CUN', serviceId: 'svc-1', status: 'available' },
  { id: 'doc-2', type: 'ticket', title: 'E-Ticket CUN → MAD', serviceId: 'svc-7', status: 'available' },
  { id: 'doc-3', type: 'voucher', title: 'Hotel – Riviera Palace', serviceId: 'svc-3', status: 'available' },
  { id: 'doc-4', type: 'voucher', title: 'Transfer – Airport → Hotel', serviceId: 'svc-2', status: 'available' },
  { id: 'doc-5', type: 'voucher', title: 'Transfer – Hotel → Airport', serviceId: 'svc-6', status: 'available' },
  { id: 'doc-6', type: 'voucher', title: 'Excursion – Chichén Itzá', serviceId: 'svc-4', status: 'available' },
  { id: 'doc-7', type: 'voucher', title: 'Excursion – Snorkeling', serviceId: 'svc-5', status: 'pending' },
  { id: 'doc-8', type: 'insurance', title: 'Travel Insurance Policy', status: 'available' },
];

export default function Documents() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  if (!session) return null;

  const available = mockDocuments.filter((d) => d.status === 'available');
  const pending = mockDocuments.filter((d) => d.status === 'pending');

  const getServiceType = (doc: Document) => {
    if (doc.type === 'insurance') return 'insurance' as const;
    if (!doc.serviceId) return undefined;
    const svc = session.trip.services.find((s) => s.id === doc.serviceId);
    if (!svc) return undefined;
    return svc.type as 'flight' | 'hotel' | 'transfer' | 'excursion';
  };

  const getServiceInfo = (doc: Document) => {
    if (!doc.serviceId) return undefined;
    const svc = session.trip.services.find((s) => s.id === doc.serviceId);
    if (!svc) return undefined;

    let subtitle = svc.provider || '';
    if (svc.type === 'flight') subtitle = `${svc.originCode} → ${svc.destinationCode} · ${svc.flightNumber}`;
    if (svc.type === 'hotel') subtitle = `${svc.hotelName}`;
    if (svc.type === 'transfer') subtitle = `${svc.pickupPoint?.split('–')[0]?.trim()} → ${svc.dropoffPoint?.split(',')[0]?.trim()}`;
    if (svc.type === 'excursion') subtitle = svc.title;

    return {
      date: svc.date,
      time: svc.time,
      provider: svc.provider,
      reference: svc.reference,
      subtitle,
    };
  };

  const getService = (doc: Document) => {
    if (!doc.serviceId) return null;
    return session.trip.services.find((s) => s.id === doc.serviceId) || null;
  };

  const passengerName = `${session.passenger.firstName} ${session.passenger.lastName}`;

  return (
    <MobileLayout>
      <div className="px-5 pt-6 pb-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{t('documents.title')}</h1>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            {t('documents.subtitle', { count: mockDocuments.length })}
          </p>
        </motion.div>

        {/* Available */}
        {available.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
            <p className="text-[11px] font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              {t('documents.available')}
            </p>
            <div className="space-y-3">
              {available.map((doc, i) => (
                <VoucherCard
                  key={doc.id}
                  doc={doc}
                  serviceInfo={getServiceInfo(doc)}
                  onClick={() => setSelectedDoc(doc)}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
            <p className="text-[11px] font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              {t('documents.pending')}
            </p>
            <div className="space-y-3">
              {pending.map((doc, i) => (
                <VoucherCard
                  key={doc.id}
                  doc={doc}
                  serviceInfo={getServiceInfo(doc)}
                  onClick={() => {}}
                  index={i + available.length}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Note */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-muted/50 rounded-2xl p-4 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">{t('documents.note')}</p>
          </div>
        </motion.div>
      </div>

      {/* Full-screen voucher modal */}
      <VoucherModal
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        doc={selectedDoc}
        service={selectedDoc ? getService(selectedDoc) : null}
        passengerName={passengerName}
      />
    </MobileLayout>
  );
}
