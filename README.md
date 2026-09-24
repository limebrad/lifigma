# Мольберт (lifigma) — мини-Figma в браузере

Учебный проект на **Vite + React**: лендинг «Мольберт» — лёгкий векторный редактор интерфейсов для команд, работающий прямо в браузере.

## Стек

- [Vite](https://vitejs.dev/) — сборка
- React 18 (зависимости готовы для дальнейшего развития)
- GitHub Pages — деплой через GitHub Actions

## Команды

```bash
npm ci        # установить зависимости
npm run dev   # локальный сервер разработки
npm run build # production-сборка в dist/
npm run preview
```

## Деплой

Публикация автоматическая: при каждом `push` в `main` workflow
`.github/workflows/deploy.yml` выполняет `npm ci` → `npm run build` →
публикует папку `dist` на GitHub Pages (источник: GitHub Actions).

Сайт: **https://limebrad.github.io/lifigma/**