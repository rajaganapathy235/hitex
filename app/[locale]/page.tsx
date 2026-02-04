'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Recycle, Leaf, TrendingUp, ShieldCheck } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { InstallPrompt } from '@/components/install-prompt';

export default function Home() {
  const t = useTranslations('Common');
  const home = useTranslations('Home');

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* Background Blobs - Earthy/Green tones */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-emerald-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal" />
      </div>

      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
          <div className="p-2 bg-gradient-to-br from-primary to-green-700 rounded-lg text-white">
            <Recycle className="w-6 h-6" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-800 dark:to-green-400">
            HITEX REWARDS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <InstallPrompt />
          <LanguageSwitcher />
          <Link href="/auth">
            <Button variant="ghost" className="font-semibold hover:bg-primary/10 hover:text-primary">
              {t('login')}
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-gradient-to-r from-primary to-green-700 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
              {t('register')}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-4xl pt-24 pb-32 sm:pt-48 sm:pb-40 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-white/20 backdrop-blur-md shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-muted-foreground">{home('badge')}</span>
          </div>

          <h1 className="text-5xl font-black tracking-tight sm:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 drop-shadow-sm">
            {home('heroTitle1')} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-green-600 to-teal-500">
              {home('heroTitle2')}
            </span>
          </h1>

          <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            {home('heroDescription')}
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-primary to-green-700 hover:scale-105 transition-transform shadow-xl shadow-primary/25">
                {home('startEarning')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats / Trust Badges */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-primary/20 pt-8">
            <div className="flex flex-col items-center group hover:scale-105 transition-transform">
              <span className="text-3xl font-bold text-foreground">{home('stat1Title')}</span>
              <span className="text-sm text-muted-foreground">{home('stat1Desc')}</span>
            </div>
            <div className="flex flex-col items-center group hover:scale-105 transition-transform">
              <span className="text-3xl font-bold text-foreground">{home('stat2Title')}</span>
              <span className="text-sm text-muted-foreground">{home('stat2Desc')}</span>
            </div>
            <div className="flex flex-col items-center group hover:scale-105 transition-transform">
              <span className="text-3xl font-bold text-foreground">{home('stat3Title')}</span>
              <span className="text-sm text-muted-foreground">{home('stat3Desc')}</span>
            </div>
            <div className="flex flex-col items-center group hover:scale-105 transition-transform">
              <span className="text-3xl font-bold text-foreground">{home('stat4Title')}</span>
              <span className="text-sm text-muted-foreground">{home('stat4Desc')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group relative p-8 bg-white/40 dark:bg-white/5 rounded-3xl border border-white/20 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 text-white">
              <Leaf className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{home('feature1Title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {home('feature1Desc')}
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative p-8 bg-white/40 dark:bg-white/5 rounded-3xl border border-white/20 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30 text-white">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{home('feature2Title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {home('feature2Desc')}
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative p-8 bg-white/40 dark:bg-white/5 rounded-3xl border border-white/20 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 text-white">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{home('feature3Title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {home('feature3Desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
