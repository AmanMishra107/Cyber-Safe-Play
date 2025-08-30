# Cyber Safe Play

Interactive cybersecurity mini‑games to help users learn safe online practices through play. Built with Vite + TypeScript and styled with Tailwind CSS.

**Live Demo:** https://cyber-safe-play.vercel.app/

---

## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
  - [Run Locally](#run-locally)
  - [Build for Production](#build-for-production)
  - [Preview Production Build](#preview-production-build)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## About the Project
**Cyber Safe Play** is a lightweight, fast, and mobile‑friendly web app that packages multiple cybersecurity learning games into one place. It’s designed for students and beginners to practice fundamentals like recognizing phishing cues, creating strong passwords, and general cyber‑hygiene while having fun.

> This repository uses a modern frontend toolchain for quick iteration and zero‑config DX.

## Features
- 🎮 A collection of bite‑sized, replayable cybersecurity mini‑games
- ⏱️ Timers and scoring (per game implementation)
- 📱 Responsive layout that works on mobile, tablet, and desktop
- ⚡ Vite dev server for instant HMR and fast builds
- 🧩 Clear, modular folder structure for adding new games quickly
- ☁️ Ready-to-deploy on Vercel (or any static host)

## Tech Stack
- **Build Tool:** Vite, React
- **Language:** TypeScript
- **Styling:** Tailwind CSS (with PostCSS)
- **Tooling/Config:** ESLint, TSConfig

## Getting Started

### Prerequisites
- **Node.js** ≥ 18 (LTS recommended)
- **npm** (or **pnpm**/**yarn**) – commands below use npm

### Installation
```bash
# clone
git clone https://github.com/AmanMishra107/Cyber-Safe-Play.git
cd Cyber-Safe-Play

# install deps
npm install
```

### Available Scripts
- `npm run dev` – start local dev server with hot reload
- `npm run build` – production build
- `npm run preview` – preview the production build locally

### Run Locally
```bash
npm run dev
# open the printed localhost URL (usually http://localhost:5173)
```

### Build for Production
```bash
npm run build
```
This outputs an optimized production bundle into the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Project Structure
```
Cyber-Safe-Play/
├─ public/                 # static assets copied as‑is
├─ src/                    # application source code (games, UI, logic)
├─ index.html              # app entry HTML (Vite)
├─ vite.config.ts          # Vite configuration
├─ tailwind.config.ts      # Tailwind configuration
├─ postcss.config.js       # PostCSS/Tailwind pipeline
├─ tsconfig*.json          # TypeScript configs
├─ eslint.config.js        # Linting config
└─ package.json            # scripts and dependencies
```

## Configuration
- **Tailwind**: edit `tailwind.config.ts` to customize theme, paths, and plugins.
- **Vite**: edit `vite.config.ts` for aliases, plugins, and dev server tweaks.
- **TypeScript**: update `tsconfig.json` for path aliases and strictness.

## Deployment
**Vercel** is the easiest path:
1. Push your repo to GitHub.
2. Import the repo on Vercel and select the Vite (Static) preset.
3. Build command: `npm run build`
4. Output directory: `dist`

## Roadmap
- [ ] Add more mini‑games (e.g., social‑engineering spot‑the‑signs, email header inspector)
- [ ] Global state for scores and a simple leaderboard
- [ ] Sound effects and animations
- [ ] Accessibility polish (keyboard navigation, focus rings, ARIA)
- [ ] i18n support (Hindi/English)

## Contributing
Contributions are welcome! To propose changes:
1. **Fork** the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional messages: `feat(game): add phishing scenarios`
4. Push and open a **Pull Request** with a clear description and screenshots

For bug reports, please include reproduction steps and your environment (OS, browser, Node version).

## License
Distributed under the **MIT License**. See [LICENSE](#license-1) below.

## Acknowledgements
- Thanks to open‑source maintainers of Vite, react, TypeScript, Tailwind, and the wider web community.
- Deployed with ❤️ using Vercel.
