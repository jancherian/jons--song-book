# CHORDSET — Nashville Number System Chord Chart App
### Comprehensive Project Documentation & Architecture Summary
#### Design System: "Chart Paper" — Grid Identity, Baseline Chord Notation & Stage Spotlight

---

## 1. Project Overview

**Chordset** is a modern, responsive web application engineered specifically for musicians, bandleaders, and worship leaders. It simplifies writing, arranging, and performing songs using the **Nashville Number System (NNS)** — a musical shorthand where chords are represented by scale degrees ($1, 4, 5, 6m$, etc.) rather than fixed key letters.

### Core Value Proposition
- **Key-Agnostic Lead Sheets**: Write a chart once in numbers, and transpose it instantly to any musical key during rehearsals or live stage performances.
- **Stage-Ready Performance Mode**: 
  - **Authentic Baseline Notation**: Unboxed chords sitting directly on shared horizontal baseline rules with musical barline ticks.
  - **Live Stage Spotlight**: Active line during auto-scroll is highlighted with a 5px vermilion left rail and a glowing vermilion baseline rule.
  - **Persistent Light / Dark Stage Themes**: Dark stage mode (`#100D0A`) and warm paper light mode (`#F7F4EB`) toggled via the top bar.
- **"Chart Paper" Grid Identity**: Grounded in real manuscript, graph, and tab paper conventions:
  - **Visible Ledger Grid**: Structurally visible ink grid lines ($24\text{px}\times 24\text{px}$ at $7.5\%$ opacity) on off-white chart paper (`#F7F4EB`) on Home & Editor.
  - **Bold Condensed Display Typography**: Bold condensed poster display headlines (`Big Shoulders Display`) on the repertoire list.
  - **Solid Ink Borders**: Flat card surfaces with crisp $2\text{px}$ solid ink borders (`border-2 border-[#171310]`) and zero drop shadows.
  - **Stage-Tape Vermilion Accent**: Full-strength vermilion `#E8432E` on the primary Scroll CTA, Perform buttons, and active selections.
  - **Mustard Gold Sequence Chips**: Meaningful section numbering (`01 INTRO`, `02 VERSE`...) on solid `#D9A62E` chips.

---

## 2. Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **React 19** | Modern functional components, hooks (`useState`, `useEffect`, `useRef`, `useCallback`). |
| **Language** | **TypeScript 5.9** | Strict type definitions for songs, sections, lines, chords, and keys. |
| **Bundler & Tooling** | **Vite 8** | Ultra-fast HMR and production bundling. |
| **Styling & CSS** | **Tailwind CSS v4 + Vanilla CSS Tokens** | Zero-shadow Flat Design system driven by centralized CSS variables. |
| **Typography** | **Google Fonts** | `Big Shoulders Display` (Page Headlines) + `JetBrains Mono` / `IBM Plex Mono` (700 weight for chords, titles, & section labels) + `Inter` (body/metadata/lyrics). |
| **Icons** | **Lucide React** | Consistent, lightweight SVG icon suite. |
| **Data Persistence** | **LocalStorage API** | Offline-first browser persistence for song catalog and stage theme choice. |

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
    ├── App.tsx                  # Root state controller & view router (Home / Editor / Performance)
    ├── index.css                # Global design tokens, base resets & visible ledger graph grid pattern
    ├── types/
    │   └── song.ts              # TypeScript interfaces for Song, SongSection, SongLine, etc.
    ├── utils/
    │   ├── nashville.ts         # Nashville chord transposition math & keypad input parser
    │   └── storage.ts           # LocalStorage CRUD operations & default seed repertoire
    └── components/
        ├── HomeScreen.tsx       # Song library, search, filtering, and FAB
        ├── SongCard.tsx         # Flat lead-sheet song card with solid ink border & perform CTA
        ├── SongEditor.tsx       # Interactive chart builder, section & line manager
        ├── NashvilleNumberPad.tsx # Tactile bottom drawer keypad for Nashville notations
        ├── PerformanceMode.tsx  # Stage view with baseline notation, live line spotlight & light/dark modes
        ├── NewSongModal.tsx     # Modal dialog for creating new charts
        ├── SectionTypePickerModal.tsx # Modal dialog for choosing section types
        ├── LogoMark.tsx         # Responsive brand logo component
        └── SplashLoader.tsx     # Brand splash screen loader
```

---

## 4. Key Application Views & Features

### 4.1. Home Screen (`HomeScreen.tsx`)
- **Visible Ledger Graph Grid**: Crisp $24\text{px}\times 24\text{px}$ graph grid lines (`.chart-grid-bg`) over off-white paper (`#F7F4EB`).
- **Bold Condensed Headline**: Page title "MY SONGS" rendered in `Big Shoulders Display` (`font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase`).
- **Single Persistent FAB**: Viewport-fixed floating action button (`z-40`, solid vermilion `#E8432E`, $2\text{px}$ ink border) with scroll clearance (`pb-36 sm:pb-40`).
- **Search & Filter**: Real-time filtering by song title or artist name; toggle between "ALL" and "★ FAVORITES".
- **Song Cards (`SongCard.tsx`)**:
  - Left-anchored title in bold monospace (`font-mono font-bold text-xl sm:text-2xl`).
  - Flat card surface (`bg-[#FBF9F2]`, or `bg-[#FDF6E8]` when favorited) with a solid $2\text{px}$ ink border (`border-2 border-[#171310]`).
  - Tightly grouped metadata cluster (key, BPM, artist, section count) in clean `Inter`.
  - Section flow badges (e.g. `INTRO → VERSE → CHORUS → BRIDGE`).
  - Solid vermilion **PERFORM** button for instant stage mode launch.

### 4.2. Song Editor (`SongEditor.tsx`)
- **Metadata Configuration**: Editable chart title, key signature selector ($C$ through $B$), tempo (BPM), time signature ($4/4, 3/4, 6/8, 2/4$), and artist in solid ink-bordered white capsules.
- **Section Workflow**:
  - Reorder sections up and down with live sequence updates (`01 INTRO`, `02 VERSE`, `03 CHORUS`) styled on solid mustard chips (`bg-[#D9A62E] text-[#171310] font-black`).
  - Add standard or custom song sections (Intro, Verse, Pre-Chorus, Chorus, Bridge, Tag, Outro).
  - Add multiple lines per section with inline lyric inputs beneath each chord row.
- **Chord Grid**:
  - Flexible chord cells separated by gaps on flat chart cards with $2\text{px}$ solid ink borders.
  - Stamped monospace chord buttons; active slot highlighted in solid vermilion (`#E8432E`).
- **Interactive Nashville Keypad (`NashvilleNumberPad.tsx`)**:
  - Tactile bottom drawer with 44×44px minimum touch targets and solid $2\text{px}$ ink borders.
  - Scale degree buttons: $1, 2, 3, 4, 5, 6, 7$.
  - Accidentals & Qualities: $\sharp, \flat, m, dim, aug, M7, m7, sus4, sus2, add9$.
  - Slash chord builder (e.g. $1/3, 5/7$).

### 4.3. Performance Mode (`PerformanceMode.tsx`)
- **Continuous Baseline Chord Notation**:
  - Chords sit unboxed directly on a shared horizontal baseline rule (`border-b border-[#2A2420]` dark / `border-b border-[#D9D2C0]` light).
  - Subtle vertical barline ticks mark beat and chord changes between notes.
- **Live Active-Line Spotlight**:
  - During auto-scroll, the active line passing the reading zone is lit up with a **5px solid vermilion left rail (`border-l-[5px] border-l-[#E8432E]`)** and an **active vermilion baseline rule (`border-b-2 border-b-[#E8432E]`)**.
- **Light / Dark Stage Themes**:
  - Top-bar toggle between **Dark Stage Mode** (`#100D0A`) and **Warm Paper Light Mode** (`#F7F4EB`).
  - State persisted across sessions in `localStorage`.
- **Stage Toolbar**:
  - **Scroll Button**: Singular solid vermilion-filled primary control (`bg-[#E8432E]`).
  - **1-4-5 / Chords Toggle**: Active option highlighted with vermilion fill.
  - 1-touch live key transposition ($C$ through $B$).
  - Adjustable scroll speeds ($1\times, 2\times, 3\times, 4\times$) and text zoom levels.

---

## 5. Verification & Build Status

- **Build Check**: `npm run build` passes with code 0 (`dist/` production bundle compiled in 812ms).
- **Responsive Audit**: Tested down to 375px mobile viewports.
- **Local Dev Server**: Active and running on `http://localhost:5173/`.
