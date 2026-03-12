import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/layout/MobileLayout';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Banknote,
  CloudSun,
  Bus,
  Lightbulb,
  MapPin,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import type { Destination as DestinationType, DestinationOffer } from '@/types/booking';

const mockOffers: DestinationOffer[] = [
  {
    id: 'offer-1',
    destinationId: 'dest-1',
    title: 'Sunset Catamaran Cruise',
    description: 'Sail along the coast with open bar and snorkeling stop.',
    price: 'From $85 USD',
    type: 'experience',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
  },
  {
    id: 'offer-2',
    destinationId: 'dest-1',
    title: 'Private Cenote Tour',
    description: 'Visit 3 hidden cenotes with a local guide. Lunch included.',
    price: 'From $120 USD',
    type: 'excursion',
    imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&q=80',
  },
];

const sectionDelay = (i: number) => ({ delay: 0.05 + i * 0.06 });

function GuideSection({
  icon: Icon,
  title,
  children,
  index,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={sectionDelay(index)}
      className="bg-card rounded-2xl card-shadow p-5"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-bold text-card-foreground">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function TipList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[13px] text-muted-foreground leading-relaxed">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/30 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Destination() {
  const { destId } = useParams<{ destId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useAuth();

  if (!session) return null;

  const destination = session.trip.destinations.find((d) => d.id === destId);
  if (!destination) {
    return (
      <MobileLayout>
        <div className="px-5 pt-6">
          <p className="text-muted-foreground">{t('common.error')}</p>
        </div>
      </MobileLayout>
    );
  }

  const guide = destination.guide;
  const offers = mockOffers.filter((o) => o.destinationId === destination.id);

  let sectionIdx = 0;

  return (
    <MobileLayout>
      <div className="pb-6">
        {/* Hero */}
        <div className="relative h-56">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${destination.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 z-10 h-9 w-9 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center text-primary-foreground hover:bg-background/30 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-xs font-medium text-primary-foreground/60 uppercase tracking-wider">
              {t('destination.guide')}
            </p>
            <h1 className="text-2xl font-extrabold text-primary-foreground mt-0.5 tracking-tight">
              {destination.name}
            </h1>
            <p className="text-sm text-primary-foreground/70 mt-0.5">{destination.country}</p>
          </div>
        </div>

        {/* Guide sections */}
        {guide ? (
          <div className="px-5 mt-5 space-y-3">
            {/* Practical tips */}
            <GuideSection icon={Lightbulb} title={t('destination.localTips')} index={sectionIdx++}>
              <TipList items={guide.culture} />
            </GuideSection>

            {/* Safety */}
            <GuideSection icon={Shield} title={t('destination.safety')} index={sectionIdx++}>
              <TipList items={guide.safety} />
            </GuideSection>

            {/* Currency */}
            <GuideSection icon={Banknote} title={t('destination.currency')} index={sectionIdx++}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-card-foreground">
                    {guide.currency.name} ({guide.currency.symbol})
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {guide.currency.tips}
                </p>
              </div>
            </GuideSection>

            {/* Weather */}
            <GuideSection icon={CloudSun} title={t('destination.weather')} index={sectionIdx++}>
              <div className="space-y-1.5">
                <p className="text-[13px] text-card-foreground font-medium">{guide.weather.tempRange}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{guide.weather.summary}</p>
              </div>
            </GuideSection>

            {/* Transport */}
            <GuideSection icon={Bus} title={t('destination.transport')} index={sectionIdx++}>
              <TipList items={guide.transport} />
            </GuideSection>

            {/* Neighborhoods */}
            {guide.neighborhoods.length > 0 && (
              <GuideSection icon={MapPin} title={t('destination.neighborhoods')} index={sectionIdx++}>
                <div className="space-y-3">
                  {guide.neighborhoods.map((n) => (
                    <div key={n.name}>
                      <p className="text-[13px] font-semibold text-card-foreground">{n.name}</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed mt-0.5">
                        {n.description}
                      </p>
                    </div>
                  ))}
                </div>
              </GuideSection>
            )}

            {/* Subtle upsell section */}
            {offers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={sectionDelay(sectionIdx++)}
                className="pt-3"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('destination.enhanceTrip')}
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="flex gap-3 bg-card rounded-2xl card-shadow overflow-hidden p-3 items-center"
                    >
                      {offer.imageUrl && (
                        <img
                          src={offer.imageUrl}
                          alt={offer.title}
                          className="h-16 w-16 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-card-foreground truncate">{offer.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                          {offer.description}
                        </p>
                        <p className="text-[11px] font-semibold text-accent mt-1">{offer.price}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="px-5 mt-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-2xl card-shadow p-6 text-center"
            >
              <MapPin className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t('destination.noGuide')}</p>
            </motion.div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
