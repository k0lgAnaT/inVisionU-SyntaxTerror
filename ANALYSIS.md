# Анализ проекта по ТЗ Decentrathon 5.0

## Оценка по критериям

| Критерий | Макс | Текущее | Статус |
|---|---|---|---|
| Проблема & ценность | 10 | ~8 | ✅ Hero banner есть, но нет явного mapping problem→solution |
| Данные & представление кандидата | 15 | ~12 | ⚠️ Нет явного пояснения какие данные используются |
| Baseline & улучшения | 10 | ~10 | ✅ Есть /validation со Spearman, edge cases |
| Модель & валидация | 20 | ~15 | ⚠️ Нет явного объяснения роли весовых профилей |
| Fairness & explainability | 15 | ~11 | ⚠️ Blind mode есть, но не очень заметен + нет Privacy statement |
| Демо & UX | 10 | ~6 | 🔴 Нет единого demo tour / сценария |
| Надёжность & приватность | 10 | ~7 | ⚠️ README есть, но нет Privacy notice |
| Документация | 10 | ~7 | ⚠️ README не включает ограничения модели |

## Что нужно сделать (приоритет)

### 🔴 Критично
1. **Navbar — добавить ссылки на ВСЕ страницы** (Validation, Student Portal)
2. **Главный Dashboard** — добавить "Blind Mode" кнопку, перевести кнопки
3. **About/Demo page** — нужна страница с объяснением системы для жюри  
4. **README** — добавить ограничения, data pipeline, ethical commitments

### 🟡 Важно
5. **Candidate page** — добавить "blind" переключатель в UI
6. **Validation page** — добавить dark mode (сейчас много text-slate-800)
7. **Leaderboard** — показать как работают Weight Profiles
8. **Submit page** — проверить что live scoring работает
