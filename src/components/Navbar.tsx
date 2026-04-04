'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { TranslationKey, Language } from '@/lib/i18n/translations';
import { useTheme } from '@/components/ThemeProvider';

const adminNavItems: { href: string; labelKey: TranslationKey; icon: string }[] = [
  { href: '/', labelKey: 'nav_dashboard', icon: '◈' },
  { href: '/leaderboard', labelKey: 'nav_leaderboard', icon: '⬡' },
  { href: '/validation', labelKey: 'nav_validation', icon: '📊' },
  { href: '/submit', labelKey: 'nav_submit', icon: '⚡' },
  { href: '/about', labelKey: 'nav_about', icon: 'ℹ️' },
];

const studentNavItems: { href: string; labelKey: TranslationKey; icon: string }[] = [
  { href: '/student/test', labelKey: 'nav_test', icon: '' },
  { href: '/student/admission', labelKey: 'nav_admission', icon: '' },
  { href: '/student/about', labelKey: 'nav_about', icon: '' },
  { href: '/student', labelKey: 'nav_status', icon: '' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState<'student' | 'admin' | 'commission' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Exclude navbar entirely from login/register pages
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    // Determine role on client side
    const savedRole = localStorage.getItem('userRole') as 'student' | 'admin' | 'commission' | null;
    setRole(savedRole || 'admin'); // Default to admin for backwards compatibility
  }, [pathname]);

  if (isAuthPage) return null;

  const navItems = role === 'student' ? studentNavItems : adminNavItems;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const getRoleDisplayName = () => {
    if (role === 'admin') return 'Admin User';
    if (role === 'commission') return 'Committee Member';
    return 'Applicant';
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 bg-white/80 dark:bg-[#060b21]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href={role === 'student' ? '/student' : '/'} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-brand-400 flex items-center justify-center text-black font-bold group-hover:scale-105 transition-transform shadow-sm">
                iU
              </div>
              <span className="font-display font-semibold text-lg tracking-tight text-slate-800 dark:text-white whitespace-nowrap">
                inVision <span className="text-brand-600 font-bold">U</span>
              </span>
            </Link>

            <div className="hidden lg:block">
              <div className="flex items-baseline space-x-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/student' && pathname.startsWith(item.href));
                  
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
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active"
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-400 rounded-t-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Desktop-only controls */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-600 transition-colors border border-slate-200 dark:border-slate-700"
                title="Toggle Dark Mode"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              {/* Language Switcher */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                <button onClick={() => setLang('ru')} className={`px-2 py-1 rounded-md transition-colors ${lang === 'ru' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>RU</button>
                <button onClick={() => setLang('kz')} className={`px-2 py-1 rounded-md transition-colors ${lang === 'kz' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>KZ</button>
                <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-md transition-colors ${lang === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>EN</button>
              </div>

              <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow"></span>
                {t('nav_api_online')}
              </div>
            </div>
            
            {/* User Profile/Logout - Simplified on mobile */}
            <div className="hidden sm:flex items-center">
              {role === 'student' ? (
                <div className="flex items-center gap-4">
                  <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                    {t('nav_logout')}
                  </button>
                  <Link href="/profile" className="flex items-center gap-2 group">
                    <div className="text-right hidden xl:block">
                      <div className="text-xs text-slate-500">Заявка</div>
                      <div className="text-sm font-semibold text-brand-600 leading-tight">В процессе</div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 group-hover:border-brand-400 shadow-sm flex items-center justify-center text-slate-500 font-bold overflow-hidden transition-colors">
                      DL
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                    {t('nav_logout')}
                  </button>
                  <Link href="/profile" className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10 group">
                    <div className="text-right hidden xl:block group-hover:text-brand-600 transition-colors">
                      <div className="text-xs text-slate-500">{role === 'admin' ? t('auth_admin') : 'Commission'}</div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{getRoleDisplayName()}</div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 group-hover:border-brand-400 flex items-center justify-center text-slate-500 font-bold overflow-hidden transition-all shadow-sm">
                      {role === 'admin' ? 'A' : 'C'}
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
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

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-[#0a0f29] border-b border-slate-200 dark:border-white/10 shadow-2xl z-40 overflow-hidden"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl font-semibold transition-all ${
                  pathname === item.href ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  {t(item.labelKey)}
                </div>
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-4">
               {/* Mobile Language Switcher */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl items-center justify-around">
                <button onClick={() => setLang('ru')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${lang === 'ru' ? 'bg-white dark:bg-slate-700 shadow text-brand-600' : 'text-slate-500'}`}>RU</button>
                <button onClick={() => setLang('kz')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${lang === 'kz' ? 'bg-white dark:bg-slate-700 shadow text-brand-600' : 'text-slate-500'}`}>KZ</button>
                <button onClick={() => setLang('en')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${lang === 'en' ? 'bg-white dark:bg-slate-700 shadow text-brand-600' : 'text-slate-500'}`}>EN</button>
              </div>

              {/* Mobile Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
              >
                 {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </div>

            <button
               onClick={() => { handleLogout(); setIsMenuOpen(false); }}
               className="w-full py-3 px-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold text-sm text-center mt-4"
            >
              {t('nav_logout')}
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
