# CHORDSET — Nashville Number System Chord Chart App
### Comprehensive Project Documentation & Architecture Summary
#### Design System: "Chart Paper" — Grid Identity, Baseline Chord Notation & Global Light/Dark Themes

---

## 1. Project Overview

**Chordset** is a modern, responsive web application engineered specifically for musicians, bandleaders, and worship leaders. It simplifies writing, arranging, and performing songs using the **Nashville Number System (NNS)** — a musical shorthand where chords are represented by scale degrees ($1, 4, 5, 6m$, etc.) rather than fixed key letters.

### Core Features
- **Key-Agnostic Lead Sheets**: Write a chart once in numbers, and transpose it instantly to any musical key during rehearsals or live stage performances.
- **Site-Wide Global Light/Dark Theme**:
  - **Shared Source of Truth**: Single global theme setting accessible from Home, Song Editor, and Performance Mode headers.
  - **Light Mode (`#F7F4EB`)**: Warm off-white chart paper with visible ink ledger lines ($8\%$ opacity) and crisp ink borders.
  - **Dark Stage Mode (`#100D0A`)**: Warm near-black stage backdrop with inverted warm ledger lines ($7.5\%$ opacity), `#1A1512` card surfaces, and `#3A332C` borders.
  - **System & Persistence**: Defaults to user's OS preference (`prefers-color-scheme`) on first load and persists across sessions via `localStorage`.
- **Stage-Ready Performance Mode**: 
  - **Authentic Baseline Notation**: Unboxed chords sitting directly on shared horizontal baseline rules with musical barline ticks.
  - **Live Stage Spotlight**: Active line during auto-scroll is highlighted with a 5px vermilion left rail and a glowing vermilion baseline rule.
- **Tactile Haptic Feedback**: Short 10–20ms haptic pulses on chord selections, keypad buttons, perform launches, star favorites, and section reordering.

---

## 2. Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **React 19** | Modern functional components, hooks (`useState`, `useEffect`, `useRef`, `useCallback`). |
| **Language** | **TypeScript 5.9** | Strict type definitions for songs, sections, lines, chords, and keys. |
| **Bundler & Tooling** | **Vite 8** | Ultra-fast HMR and production bundling. |
| **Styling & CSS** | **Tailwind CSS v4 + Vanilla CSS Tokens** | Zero-shadow Flat Design system driven by centralized CSS variables & ledger grid patterns. |
| **Typography** | **Google Fonts** | `Big Shoulders Display` (Headlines) + `JetBrains Mono` / `IBM Plex Mono` (Chords & Metadata) + `Inter` (Lyrics & Body). |
| **Icons** | **Lucide React** | Consistent, lightweight SVG icon suite. |
| **Data Persistence** | **LocalStorage API** | Offline-first browser persistence for song repertoire and global theme choice. |

---

## 3. Directory & File Architecture

```
my-project/
├── index.html                   # HTML entry point, SEO meta tags, and Google Fonts
├── package.json                 # Project dependencies and build scripts
├── tailwind.config.js           # Design token color mappings and typography config
├── tsconfig.json / tsconfig.app.json # TypeScript configuration
├── public/                      # Static assets
│   ├── chordset-logo-light-bg.png
│   ├── chordset-logo-transparent.png
│   ├── favicon.svg / favicon.ico
│   └── manifest.json
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Global theme state controller & view router (Home / Editor / Performance)
    ├── index.css                # Global design tokens, base resets & dual-theme ledger graph patterns
    ├── types/
    │   └── song.ts              # TypeScript interfaces for Song, SongSection, SongLine, etc.
    ├── utils/
    │   ├── haptics.ts           # Tactile Web Vibration API helper with graceful fallback
    │   ├── nashville.ts         # Nashville chord transposition math & keypad input parser
    │   └── storage.ts           # LocalStorage CRUD operations & default seed repertoire
    └── components/
        ├── HomeScreen.tsx       # Song library, search, filtering, theme toggle, and FAB
        ├── SongCard.tsx         # Flat lead-sheet song card with theme-aware borders & perform CTA
        ├── SongEditor.tsx       # Chart builder with inline chord rows, section manager & theme toggle
        ├── NashvilleNumberPad.tsx # Tactile bottom drawer keypad for Nashville notations
        ├── PerformanceMode.tsx  # Stage view with baseline notation, live line spotlight & auto-scroll
        ├── NewSongModal.tsx     # Theme-aware modal dialog for creating new charts
        ├── SectionTypePickerModal.tsx # Theme-aware modal for choosing section types
        ├── LogoMark.tsx         # Responsive brand logo component with light/dark variants
        └── SplashLoader.tsx     # Brand splash screen loader
```

---

## 4. Verification & Build Status

- **Build Check**: `npm run build` passes with code 0 (`dist/` production bundle compiled in 776ms).
- **Responsive Audit**: Tested down to 375px mobile viewports.
- **Git Status**: Changes committed and pushed to `main` (`9005ddd`).
