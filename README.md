# Veloura

Статичний сайт на Vite та Tailwind CSS.

## Локальний запуск

Потрібні Node.js 20+ і npm.

```bash
npm install
npm run dev
```

Після запуску відкрий:

```text
http://127.0.0.1:5173
```

`npm install` підтягне всі залежності з `package.json`, включно з Tailwind, PostCSS, Autoprefixer і Vite.

## Перевірка production-збірки

```bash
npm run build
npm run preview
```

`npm run build` створює папку `dist/`. Саме її GitHub Pages отримує після автоматичної збірки.

## Деплой на GitHub Pages

У проєкті вже є workflow: `.github/workflows/deploy.yml`.

1. Створи репозиторій на GitHub.
2. Запуш код у гілку `main`.
3. У GitHub відкрий `Settings -> Pages`.
4. У полі `Source` вибери `GitHub Actions`.
5. Після push GitHub сам виконає:

```bash
npm ci
npm run build
```

Tailwind і всі інші пакети підтягнуться автоматично через `npm ci`, а готовий сайт буде завантажений із папки `dist/`.

Для project pages Vite бере назву репозиторію з `GITHUB_REPOSITORY` і виставляє правильний `base`, тому assets мають відкриватися за адресою виду:

```text
https://username.github.io/repository-name/
```

## Ручна збірка під GitHub Pages

Якщо треба зібрати `dist/` локально без GitHub Actions:

```bash
npm run build:pages
```

Ця команда робить відносні шляхи до assets, тому зібрану папку `dist/` можна розмістити в підпапці GitHub Pages.

Якщо хочеш локально перевірити збірку з таким самим абсолютним base, як у GitHub Actions, у PowerShell можна виконати:

```powershell
$env:GITHUB_REPOSITORY='your-login/your-repo-name'
npm run build
```
