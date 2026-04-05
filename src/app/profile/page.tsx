'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ProfilePage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail') || '';
    setEmail(savedEmail);
    const savedName = localStorage.getItem('userName') || '';
    
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    if (savedEmail && userProfiles[savedEmail]) {
      setName(userProfiles[savedEmail].name || savedName);
      setAvatarUrl(userProfiles[savedEmail].avatarUrl || '');
    } else {
      setName(savedName);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email) {
      const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      userProfiles[email] = {
        name,
        avatarUrl
      };
      localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
      
      localStorage.setItem('userName', name);
      window.dispatchEvent(new Event('profileUpdated'));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const currentAvatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || 'User'}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-[#0b0e1e]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="glass-card p-8 animate-fade-in-up">
            <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6">Настройки профиля</h1>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">URL фото (аватарка)</label>
                  <input 
                    type="url" 
                    className="input-field" 
                    placeholder="https://example.com/my-photo.jpg" 
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Вставьте прямую ссылку на изображение, чтобы оно отображалось в системе.</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Имя и фамилия</label>
                <input 
                  required 
                  type="text" 
                  className="input-field" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Email (только для чтения)</label>
                <input 
                  type="text" 
                  className="input-field opacity-50 cursor-not-allowed" 
                  value={email}
                  readOnly
                  disabled
                />
                <p className="text-[10px] text-slate-500 mt-1">Этот email используется для идентификации и доступа.</p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-6 pt-6">
                <div>
                  {saved && <span className="text-sm font-semibold text-emerald-600">✓ Изменения сохранены</span>}
                </div>
                <button type="submit" className="btn-primary px-8">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
