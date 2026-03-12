import { useTranslation } from 'react-i18next';
import MobileLayout from '@/components/layout/MobileLayout';
import { Construction } from 'lucide-react';

export default function ComingSoon({ title }: { title: string }) {
  const { t } = useTranslation();
  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">{title}</h2>
        <p className="text-sm text-muted-foreground">Coming in the next phase</p>
      </div>
    </MobileLayout>
  );
}
