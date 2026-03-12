import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Loader2, ChevronRight, Globe } from 'lucide-react';
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
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/5" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-accent/5" />
      </div>

      {/* Language toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card card-shadow text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
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
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
              <Plane className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">TripCompanion</h1>
              <p className="text-xs text-muted-foreground">Your travel, simplified</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!passengers ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {t('login.title')}
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  {t('login.subtitle')}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t('login.fileCode')}
                    </label>
                    <Input
                      value={fileCode}
                      onChange={(e) => setFileCode(e.target.value)}
                      placeholder={t('login.fileCodePlaceholder')}
                      className="h-12 rounded-xl bg-card text-base"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t('login.lastName')}
                    </label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t('login.lastNamePlaceholder')}
                      className="h-12 rounded-xl bg-card text-base"
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

                <p className="text-center text-xs text-muted-foreground mt-6 bg-muted rounded-lg px-3 py-2">
                  {t('login.hint')}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="passenger-select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-1">
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
                      className="w-full flex items-center gap-3 p-4 bg-card rounded-xl card-shadow hover:card-shadow-hover transition-shadow text-left"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
