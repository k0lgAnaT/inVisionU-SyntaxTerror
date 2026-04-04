'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { TranslationKey, Language } from '@/lib/i18n/translations';
import { useTheme } from '@/components/ThemeProvider';

const adminNavItems: { href: string; labelKey: TranslationKey; icon: string }[] = [
  { href: '/admin', labelKey: 'nav_dashboard', icon: '◈' },
  { href: '/leaderboard', labelKey: 'nav_leaderboard', icon: '⬡' },
  { href: '/validation', labelKey: 'nav_validation', icon: '📊' },
  { href: '/submit', labelKey: 'nav_submit', icon: '⚡' },
  { href: '/profile', labelKey: 'prof_title', icon: '👤' },
];

const studentNavItems: { href: string; labelKey: TranslationKey; icon: string }[] = [
  { href: '/student', labelKey: 'nav_status', icon: '📋' },
  { href: '/student/test', labelKey: 'nav_test', icon: '🧠' },
  { href: '/student/admission', labelKey: 'nav_admission', icon: '📝' },
  { href: '/profile', labelKey: 'prof_title', icon: '👤' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState<'student' | 'admin' | 'commission' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isLanding = pathname === '/';

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as 'student' | 'admin' | 'commission' | null;
    setRole(savedRole);
  }, [pathname]);

  if (isAuthPage) return null;

  const navItems = role === 'student' ? studentNavItems : role ? adminNavItems : [];

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setRole(null);
    router.push('/');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 bg-white/80 dark:bg-[#060b21]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform shadow-sm shadow-brand-500/20">
                iU
              </div>
              <span className="font-display font-semibold text-lg tracking-tight text-slate-800 dark:text-white whitespace-nowrap">
                inVision <span className="text-brand-600 font-bold">U</span>
              </span>
            </Link>

            {role && (
              <div className="hidden lg:block">
                <div className="flex items-baseline space-x-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          isActive 
                            ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon && <span className="opacity-70">{item.icon}</span>}
                          {t(item.labelKey)}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-600 transition-colors border border-slate-200 dark:border-slate-700"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              {/* Language Switcher */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
                <button onClick={() => setLang('ru')} className={`px-2 py-1 rounded-md transition-colors ${lang === 'ru' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 font-black' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>RU</button>
                <button onClick={() => setLang('kz')} className={`px-2 py-1 rounded-md transition-colors ${lang === 'kz' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 font-black' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>KZ</button>
                <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-md transition-colors ${lang === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 font-black' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>EN</button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {role ? (
                 <button onClick={handleLogout} className="btn-secondary py-1.5 px-4 text-xs font-bold">
                    {t('nav_logout')}
                 </button>
              ) : (
                !isLanding && (
                  <Link href="/login" className="btn-primary py-1.5 px-4 text-xs font-bold">
                    {t('auth_login_link')}
                  </Link>
                )
              )}
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300"
              >
                <div className="w-6 h-5 relative flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-current rounded-full transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-current rounded-full transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-current rounded-full transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-[#060b21] border-b border-slate-200 dark:border-white/10 shadow-2xl z-40 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-2xl font-semibold transition-all ${
                    pathname === item.href ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    {t(item.labelKey)}
                  </div>
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                    <button onClick={() => setLang('ru')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${lang === 'ru' ? 'bg-white dark:bg-slate-700 shadow text-brand-600' : 'text-slate-500'}`}>RU</button>
                    <button onClick={() => setLang('kz')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${lang === 'kz' ? 'bg-white dark:bg-slate-700 shadow text-brand-600' : 'text-slate-500'}`}>KZ</button>
                    <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${lang === 'en' ? 'bg-white dark:bg-slate-700 shadow text-brand-600' : 'text-slate-500'}`}>EN</button>
                  </div>
                  <button onClick={toggleTheme} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xl">
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
                </div>
                
                {!role && (
                   <Link href="/login" onClick={() => setIsMenuOpen(false)} className="btn-primary py-3 text-center rounded-2xl">
                    {t('auth_login_link')}
                   </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
