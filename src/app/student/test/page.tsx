import Link from 'next/link';

export default function StudentTestPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Base map layer from Figma aesthetic */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
          alt="World Map" 
          className="w-full max-w-5xl"
          style={{ filter: 'hue-rotate(60deg) brightness(1.2)' }}
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/50">
        <h1 className="text-4xl font-display font-black text-slate-800 mb-6 tracking-tight">Начинай/пройди <br className="hidden sm:block"/> свой тест</h1>
        <p className="text-slate-600 mb-8 text-lg">
          Тест пока недоступен.
        </p>

        <div className="w-full max-w-md mx-auto">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Код доступа" 
              className="w-full pl-6 pr-32 py-4 bg-white border-2 border-slate-200 rounded-full text-slate-800 focus:outline-none focus:border-brand-400 font-semibold text-lg transition-colors"
            />
            <button className="absolute right-2 px-6 py-2 bg-black text-brand-400 rounded-full font-bold hover:scale-105 transition-transform">
              Начать
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Приглашение на тест отправляется после скрининга эссе.
          </p>
        </div>
      </div>
    </main>
  );
}
