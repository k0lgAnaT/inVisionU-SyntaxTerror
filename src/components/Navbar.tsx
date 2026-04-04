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
    <nav className="glass-panel sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
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

            <div className="hidden md:block">
              <div className="flex items-baseline space-x-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/student' && pathname.startsWith(item.href));
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive 
                          ? 'text-brand-600 bg-brand-50' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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

          <div className="flex items-center gap-4">
            
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1.5 mr-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-600 transition-colors border border-slate-200 dark:border-slate-700"
              title="Toggle Dark Mode"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Language Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold mr-2">
              <button onClick={() => setLang('ru')} className={`px-2 py-1 rounded-md transition-colors ${lang === 'ru' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>RU</button>
              <button onClick={() => setLang('kz')} className={`px-2 py-1 rounded-md transition-colors ${lang === 'kz' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>KZ</button>
              <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-md transition-colors ${lang === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>EN</button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow"></span>
              {t('nav_api_online')}
            </div>
            
            {role === 'student' ? (
              <div className="flex items-center gap-4">
                <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
                  {t('nav_logout')}
                </button>
                <Link href="/profile" className="flex items-center gap-2 group">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-slate-500">Заявка</div>
                    <div className="text-sm font-semibold text-brand-600 leading-tight">В процессе</div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white group-hover:border-brand-400 shadow-sm flex items-center justify-center text-slate-500 font-bold overflow-hidden transition-colors">
                    DL
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
                  {t('nav_logout')}
                </button>
                <Link href="/profile" className="flex items-center gap-3 pl-4 border-l border-slate-200 group">
                  <div className="text-right hidden sm:block group-hover:text-brand-600 transition-colors">
                    <div className="text-xs text-slate-500">{role === 'admin' ? t('auth_admin') : 'Commission'}</div>
                    <div className="text-sm font-semibold text-slate-800 leading-tight">{getRoleDisplayName()}</div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white group-hover:border-brand-400 flex items-center justify-center text-slate-500 font-bold overflow-hidden transition-all shadow-sm">
                    {role === 'admin' ? 'A' : 'C'}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
