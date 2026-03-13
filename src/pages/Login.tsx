import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronRight, Globe, Building } from 'lucide-react';
import type { Passenger } from '@/types/booking';
import i18n from '@/i18n';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, selectPassenger, isLoading } = useAuth();

  const [fileCode, setFileCode] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [passengers, setPassengers] = useState<Passenger[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fileCode.trim() || !lastName.trim()) return;

    const result = await login(fileCode, lastName);
    if (!result.success) {
      setError(t('login.error'));
      return;
    }

    if (result.booking) {
      const matching = result.booking.passengers.filter(
        (p) => p.lastName.toLowerCase() === lastName.trim().toLowerCase()
      );
      if (matching.length > 1) {
        setPassengers(matching);
      } else {
        navigate('/home');
      }
    }
  };

  const handleSelectPassenger = async (passenger: Passenger) => {
    const success = await selectPassenger(passenger);
    if (success) navigate('/home');
  };

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(next);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/10" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-primary-foreground/5" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-accent/5" />
      </div>

      {/* Language toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-xs font-medium text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/15 transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          {i18n.language === 'en' ? 'ES' : 'EN'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-sm mx-auto w-full"
        >
          {/* Tower Travel Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center mb-4 shadow-elevated">
              <Building className="h-8 w-8 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-extrabold text-primary-foreground tracking-tight">Tower Travel</h1>
            <p className="text-xs text-primary-foreground/50 mt-1 font-medium tracking-wide">Your travel companion</p>
          </div>

          <AnimatePresence mode="wait">
            {!passengers ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="bg-card rounded-3xl p-6 card-shadow">
                  <h2 className="text-xl font-bold text-card-foreground mb-1">
                    {t('login.title')}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t('login.subtitle')}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-1.5">
                        {t('login.fileCode')}
                      </label>
                      <Input
                        value={fileCode}
                        onChange={(e) => setFileCode(e.target.value)}
                        placeholder={t('login.fileCodePlaceholder')}
                        className="h-12 rounded-xl bg-muted/50 text-base border-border"
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-1.5">
                        {t('login.lastName')}
                      </label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={t('login.lastNamePlaceholder')}
                        className="h-12 rounded-xl bg-muted/50 text-base border-border"
                        autoComplete="off"
                      />
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
                      >
                        {error}
                      </motion.p>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading || !fileCode.trim() || !lastName.trim()}
                      className="w-full h-12 rounded-xl text-base font-semibold"
                      size="lg"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        t('login.submit')
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="passenger-select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="bg-card rounded-3xl p-6 card-shadow">
                  <h2 className="text-xl font-bold text-card-foreground mb-1">
                    {t('login.selectPassenger')}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t('login.subtitle')}
                  </p>

                  <div className="space-y-3">
                    {passengers.map((pax) => (
                      <button
                        key={pax.id}
                        onClick={() => handleSelectPassenger(pax)}
                        disabled={isLoading}
                        className="w-full flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors text-left"
                      >
                        <div className="h-10 w-10 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-sm">
                          {pax.firstName[0]}{pax.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-card-foreground">{pax.firstName} {pax.lastName}</p>
                          {pax.email && <p className="text-xs text-muted-foreground">{pax.email}</p>}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Powered by The Flock */}
      <div className="pb-6 pt-2 text-center relative z-10">
        <p className="text-[11px] text-primary-foreground/30 font-medium tracking-wide">
          powered by <span className="font-bold text-primary-foreground/45">The Flock</span>
        </p>
      </div>
    </div>
  );
}
