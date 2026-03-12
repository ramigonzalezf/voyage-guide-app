import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/layout/MobileLayout';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, AlertTriangle, Headphones, Building2, ChevronDown, HelpCircle } from 'lucide-react';
import { mockSupportContacts } from '@/data/mockData';
import { useState } from 'react';

const faqs = [
  { key: 'luggage' },
  { key: 'cancel' },
  { key: 'checkin' },
  { key: 'insurance' },
];

const contactIcons = {
  emergency: AlertTriangle,
  operator: Headphones,
  hotel: Building2,
  local: Phone,
};

export default function Support() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  if (!session) return null;

  const emergencyContact = mockSupportContacts.find((c) => c.type === 'emergency');
  const otherContacts = mockSupportContacts.filter((c) => c.type !== 'emergency');

  return (
    <MobileLayout>
      <div className="px-5 pt-6 pb-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{t('support.title')}</h1>
          <p className="text-xs font-medium text-muted-foreground mt-1">{t('support.subtitle')}</p>
        </motion.div>

        {/* Emergency CTA */}
        {emergencyContact && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-5">
            <a
              href={`tel:${emergencyContact.phone}`}
              className="flex items-center gap-3.5 p-4 bg-destructive/8 border border-destructive/15 rounded-2xl"
            >
              <div className="h-10 w-10 rounded-xl bg-destructive/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{t('support.emergency')}</p>
                <p className="text-xs text-muted-foreground">{emergencyContact.phone}</p>
              </div>
              <Phone className="h-4 w-4 text-destructive" />
            </a>
          </motion.div>
        )}

        {/* Support contacts */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">{t('support.contacts')}</p>
          <div className="space-y-2">
            {otherContacts.map((contact) => {
              const Icon = contactIcons[contact.type] || Phone;
              return (
                <div key={contact.id} className="bg-card rounded-2xl p-4 card-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{contact.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-muted rounded-xl text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" /> {t('support.call')}
                      </a>
                    )}
                    {contact.whatsapp && (
                      <a
                        href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-success/10 rounded-xl text-xs font-semibold text-success hover:bg-success/15 transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-muted rounded-xl text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5" /> Email
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
            {t('support.faq')}
          </p>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div key={faq.key} className="bg-card rounded-2xl card-shadow overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === faq.key ? null : faq.key)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <p className="text-sm font-semibold text-foreground pr-3">{t(`support.faq_${faq.key}_q`)}</p>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${openFaq === faq.key ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === faq.key && (
                  <div className="px-4 pb-4 -mt-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`support.faq_${faq.key}_a`)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="h-4" />
      </div>
    </MobileLayout>
  );
}
