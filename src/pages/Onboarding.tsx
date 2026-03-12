import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Mail, Bell, ChevronRight, Check } from 'lucide-react';

const notificationOptions = [
  { key: 'flight_updates', icon: '✈️' },
  { key: 'schedule_changes', icon: '🔄' },
  { key: 'trip_reminders', icon: '⏰' },
  { key: 'destination_tips', icon: '🗺️' },
] as const;

export default function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState(session?.passenger.phone || '');
  const [email, setEmail] = useState(session?.passenger.email || '');
  const [selectedNotifs, setSelectedNotifs] = useState<string[]>(['flight_updates', 'schedule_changes']);

  if (!session) return null;

  const { passenger } = session;

  const toggleNotif = (key: string) => {
    setSelectedNotifs((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleFinish = () => {
    // Store onboarding as complete
    localStorage.setItem('onboarding_complete', 'true');
    navigate('/home');
  };

  const steps = [
    // Step 0: Welcome
    <motion.div
      key="welcome"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="text-center"
    >
      <div className="text-5xl mb-4">👋</div>
      <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
        {t('onboarding.welcomeTitle', { name: passenger.firstName })}
      </h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
        {t('onboarding.welcomeSubtitle')}
      </p>
      <Button onClick={() => setStep(1)} className="mt-8 h-12 rounded-2xl px-8 font-semibold" size="lg">
        {t('onboarding.getStarted')}
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </motion.div>,

    // Step 1: Contact info
    <motion.div
      key="contact"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-1">
        {t('onboarding.contactTitle')}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {t('onboarding.contactSubtitle')}
      </p>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
            <Phone className="h-3.5 w-3.5 text-primary" />
            {t('onboarding.phone')}
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+34 600 000 000"
            className="h-12 rounded-xl bg-card text-base"
            type="tel"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
            <Mail className="h-3.5 w-3.5 text-primary" />
            {t('onboarding.email')}
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-12 rounded-xl bg-card text-base"
            type="email"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="outline" onClick={() => setStep(0)} className="flex-1 h-12 rounded-2xl font-semibold">
          {t('common.back')}
        </Button>
        <Button onClick={() => setStep(2)} className="flex-1 h-12 rounded-2xl font-semibold">
          {t('common.continue')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.div>,

    // Step 2: Notification preferences
    <motion.div
      key="notifications"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-1">
        {t('onboarding.notifTitle')}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {t('onboarding.notifSubtitle')}
      </p>

      <div className="space-y-3">
        {notificationOptions.map((opt) => {
          const selected = selectedNotifs.includes(opt.key);
          return (
            <button
              key={opt.key}
              onClick={() => toggleNotif(opt.key)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all ${
                selected
                  ? 'bg-primary/[0.06] ring-1 ring-primary/20'
                  : 'bg-card card-shadow'
              }`}
            >
              <span className="text-xl">{opt.icon}</span>
              <span className="flex-1 text-sm font-semibold text-card-foreground">
                {t(`onboarding.notif_${opt.key}`)}
              </span>
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors ${
                  selected ? 'bg-primary' : 'bg-muted'
                }`}
              >
                {selected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-2xl font-semibold">
          {t('common.back')}
        </Button>
        <Button onClick={handleFinish} className="flex-1 h-12 rounded-2xl font-semibold">
          {t('onboarding.finish')}
          <Check className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.div>,
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/5" />
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 rounded-full bg-accent/5" />
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-6 relative z-10">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleFinish}
          className="absolute top-6 right-6 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {t('onboarding.skip')}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 relative z-10">
        <div className="max-w-sm mx-auto w-full">
          <AnimatePresence mode="wait">
            {steps[step]}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
