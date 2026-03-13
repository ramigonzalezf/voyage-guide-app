import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Map, FileText, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import towerLogo from '@/assets/tower-travel-logo.png';

const tabs = [
  { key: 'home', path: '/home', icon: Home },
  { key: 'itinerary', path: '/itinerary', icon: Map },
  { key: 'docs', path: '/documents', icon: FileText },
  { key: 'support', path: '/support', icon: Headphones },
];

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Agency logo bar */}
      <div className="flex items-center justify-center py-2 px-5 border-b border-border/30 bg-card/60 backdrop-blur-md">
        <img src={towerLogo} alt="Tower Travel" className="h-8 object-contain" />
      </div>

      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50 safe-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path ||
              (tab.path === '/home' && location.pathname === '/');
            const Icon = tab.icon;
            const label = t(`tabs.${tab.key}`);
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 w-16 h-full transition-all relative',
                  isActive ? 'text-primary' : 'text-muted-foreground/60'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-px left-4 right-4 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={cn('text-[10px] leading-none', isActive ? 'font-bold' : 'font-medium')}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
