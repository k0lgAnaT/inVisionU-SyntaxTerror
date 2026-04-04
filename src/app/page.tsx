'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Navbar from '@/components/Navbar';
export default function LandingPage() {
  const { t } = useLanguage();

  const features = [
    { 
      icon: '🧠', 
      title: t('landing_features_ai'), 
      desc: t('landing_features_ai_sub'),
      color: 'text-brand-600',
      bg: 'bg-brand-50'
    },
    { 
      icon: '🛡️', 
      title: t('landing_features_fair'), 
      desc: t('landing_features_fair_sub'),
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      icon: '📊', 
      title: t('landing_features_xai'), 
      desc: t('landing_features_xai_sub'),
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-brand-100 selection:text-brand-900">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-200/40 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-200/40 blur-[120px] rounded-full"></div>
      </div>

      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-100 rounded-full text-brand-700 text-xs font-bold mb-6 tracking-tight"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            {t('nav_api_online')}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-black text-slate-900 dark:text-white mb-6 leading-[1.1]"
          >
            {t('landing_hero_title')}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed"
          >
            {t('landing_hero_sub')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Link 
              href="/register" 
              className="group relative px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-200/50 hover:bg-brand-700 hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                <span>👤</span>
                {t('landing_apply_btn')}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>

            <Link 
              href="/login" 
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <span>🔑</span>
              {t('landing_staff_btn')}
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 group hover:border-brand-200 transition-colors"
            >
              <div className={`w-12 h-12 ${feature.bg} ${feature.color} flex items-center justify-center rounded-xl text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <footer className="mt-20 text-center text-slate-400 text-sm font-medium">
          {t('landing_footer')}
        </footer>
      </main>
    </div>
  );
}
