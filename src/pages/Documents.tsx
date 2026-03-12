import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/layout/MobileLayout';
import { motion } from 'framer-motion';
import { FileText, Ticket, Shield, Download, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Document } from '@/types/booking';

const mockDocuments: Document[] = [
  { id: 'doc-1', type: 'ticket', title: 'E-Ticket MAD → CUN (AM 2847)', serviceId: 'svc-1', status: 'available' },
  { id: 'doc-2', type: 'ticket', title: 'E-Ticket CUN → MAD (AM 2848)', serviceId: 'svc-7', status: 'available' },
  { id: 'doc-3', type: 'voucher', title: 'Hotel Voucher – Riviera Palace', serviceId: 'svc-3', status: 'available' },
  { id: 'doc-4', type: 'voucher', title: 'Transfer Voucher – Airport → Hotel', serviceId: 'svc-2', status: 'available' },
  { id: 'doc-5', type: 'voucher', title: 'Transfer Voucher – Hotel → Airport', serviceId: 'svc-6', status: 'available' },
  { id: 'doc-6', type: 'voucher', title: 'Excursion – Chichén Itzá', serviceId: 'svc-4', status: 'available' },
  { id: 'doc-7', type: 'voucher', title: 'Excursion – Snorkeling Puerto Morelos', serviceId: 'svc-5', status: 'pending' },
  { id: 'doc-8', type: 'insurance', title: 'Travel Insurance Policy', status: 'available' },
];

const iconMap = {
  ticket: Ticket,
  voucher: FileText,
  insurance: Shield,
  other: FileText,
};

export default function Documents() {
  const { t } = useTranslation();
  const { session } = useAuth();

  if (!session) return null;

  const available = mockDocuments.filter((d) => d.status === 'available');
  const pending = mockDocuments.filter((d) => d.status === 'pending');

  return (
    <MobileLayout>
      <div className="px-5 pt-6 pb-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{t('documents.title')}</h1>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            {t('documents.subtitle', { count: mockDocuments.length })}
          </p>
        </motion.div>

        {/* Available */}
        {available.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              {t('documents.available')}
            </p>
            <div className="space-y-2">
              {available.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-warning" />
              {t('documents.pending')}
            </p>
            <div className="space-y-2">
              {pending.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Info note */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-muted/50 rounded-2xl p-4 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">{t('documents.note')}</p>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
}

function DocumentRow({ doc }: { doc: Document }) {
  const Icon = iconMap[doc.type];
  const isPending = doc.status === 'pending';

  return (
    <button
      className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-shadow ${
        isPending ? 'bg-card/60 opacity-70' : 'bg-card card-shadow hover:card-shadow-hover'
      }`}
      disabled={isPending}
    >
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
        isPending ? 'bg-muted' : 'bg-primary/8'
      }`}>
        <Icon className={`h-5 w-5 ${isPending ? 'text-muted-foreground' : 'text-primary'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{doc.title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">{doc.type}</p>
      </div>
      {isPending ? (
        <span className="text-[10px] font-medium text-warning bg-warning/10 rounded-full px-2 py-0.5">Pending</span>
      ) : (
        <Download className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
}
