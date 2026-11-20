# CHORDSET — Nashville Number System Chord Chart App
### Comprehensive Project Documentation & Architecture Summary
#### Design System: "Chart Paper" — Grid Identity, Universal Sans-Serif Monospace Font Stack & Global Theme

---

## 1. Project Overview

**Chordset** is a modern, responsive web application engineered specifically for musicians, bandleaders, and worship leaders. It simplifies writing, arranging, and performing songs using the **Nashville Number System (NNS)** — a musical shorthand where chords are represented by scale degrees ($1, 4, 5, 6m$, etc.) rather than fixed key letters.

### Core Capabilities
- **Key-Agnostic Lead Sheets**: Write charts in numbers, transpose instantly to any musical key during rehearsals or live performances.
- **Universal Sans-Serif Monospace Typography**:
  - Engineered with a multi-layered modern monospace stack: `'JetBrains Mono', 'IBM Plex Mono', 'Cascadia Code', 'Segoe UI Mono', Consolas, 'Roboto Mono', 'SF Mono', ui-monospace, monospace`.
  - Completely purged any fallback to `Courier New` / serifed typewriter fonts across Windows, macOS, Android, and iOS.
- **Robust Song Card Flow Previews**:
  - Section badge + connector arrow units (`[INTRO] →`) bound together with `inline-flex shrink-0` to eliminate orphan arrows on line breaks.
  - Graceful truncation after 4 sections (`+N more`) for clean mobile display.
- **Site-Wide Global Light/Dark Theme**:
  - Single source of truth synchronized across Home, Song Editor, Performance Mode, modals, and keypads.
  - Inverted signature ledger grid lines ($24\text{px}\times 24\text{px}$) in both light (`#F7F4EB`) and dark (`#100D0A`) modes.
- **Dynamic Origin Navigation**:
  - Exiting Performance Mode returns dynamically to the origin screen (Home or Song Editor).
- **Tactile Haptic Feedback**:
  - Short 10–20ms haptic pulses across all key actions with fallback.

---

## 2. Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **React 19** | Modern functional components and hooks. |
| **Language** | **TypeScript 6.0** | Strict typing for songs, sections, lines, chords, and keys. |
| **Bundler & Tooling** | **Vite 8** | Ultra-fast HMR and production bundle optimization. |
| **Styling** | **Tailwind CSS v4 + Custom Tokens** | Flat design system driven by CSS variables and ledger grid textures. |
| **Typography** | **Google Fonts + System Sans-Serif Mono** | `Big Shoulders Display` + `JetBrains Mono` / `Cascadia Code` / `Consolas` + `Inter`. |
| **Icons** | **Lucide React** | Lightweight SVG icons. |
| **Storage** | **LocalStorage API** | Offline-first browser persistence for song charts and theme preference. |

---

## 3. Directory & File Architecture

```
my-project/
├── index.html                   # HTML entry point, SEO meta tags, and Google Fonts
├── package.json                 # Project dependencies and scripts
├── tailwind.config.js           # Modern sans-serif monospace font stack & tokens
├── tsconfig.json / tsconfig.app.json # TypeScript configuration
├── public/                      # Static assets and brand logos
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Global theme & origin-aware navigation controller
    ├── index.css                # Global tokens, resets & dual-theme ledger graph patterns
    ├── types/
    │   └── song.ts              # TypeScript interfaces for Song, Section, Line, etc.
    ├── utils/
    │   ├── typography.ts        # Universal MONO_FONT_STACK constants
    │   ├── haptics.ts           # Web Vibration API helper
    │   ├── nashville.ts         # Nashville transposition math & input parser
    │   └── storage.ts           # LocalStorage CRUD operations
    └── components/
        ├── HomeScreen.tsx       # Song library, search, filtering, theme toggle, and FAB
        ├── SongCard.tsx         # Flat song card with bonded flow badges & perform CTA
        ├── SongEditor.tsx       # Chart builder with wrapping chord rows & section manager
        ├── NashvilleNumberPad.tsx # Tactile bottom drawer keypad for Nashville notations
        ├── PerformanceMode.tsx  # Stage view with baseline notation & live spotlight
        ├── NewSongModal.tsx     # Theme-aware modal dialog for creating new charts
        ├── SectionTypePickerModal.tsx # Theme-aware modal for choosing section types
        ├── LogoMark.tsx         # Responsive brand logo component
        └── SplashLoader.tsx     # Brand splash screen loader
```

---

## 4. Latest Development Notes

Updated November 20, 2026. Feature commit `45efe1a` is pushed to `origin/main`.

### Today’s Performance

- Home includes a daily set sorted alphabetically by song title, ignoring case.
- Each song card has an Add to Today toggle. The daily list also has Perform and Remove actions.
- Selection persists through the existing song storage using the optional `performanceDate` field.
- The list follows the device’s local calendar date. Previous selections stay stored on songs but disappear from the daily view when the date changes.

### Blank Chart Creation

- New songs start with Add Section and an empty section list.
- New sections and lines start with an Add Chord button. Added chord slots are blank.
- Deleting the final chord leaves an empty row. Empty slots are omitted from the stage chord display.

### Metronome

- Performance Mode includes a start/stop metronome using Web Audio and the song’s BPM.
- Missing, invalid, or nonpositive tempo values fall back to 80 BPM.
- The audio context closes when the metronome stops or Performance Mode unmounts.

### Mobile and Tablet UI

- Stage controls wrap across rows, and the keypad toolbar uses two rows on phones.
- Dialogs can scroll within the viewport. Song titles wrap, and card actions have more space.
- Touch controls have larger targets, with reduced scaling on touch devices and support for reduced motion preferences.
- Today’s Performance uses the existing display heading font, bold monospace labels, and sans-serif supporting text.
- The chord-delete button appears beside the selected chord with a 44px touch target, avoiding overlap with notation.

### Chord Entry Fixes

- Accidentals entered before a degree retain their position, such as `b` followed by `7` producing `b7`.
- Entering `5 / b 3` preserves the root and produces `5/b3`, displayed as `G/Eb` in C.
- Explicit flats and sharps guide the displayed note spelling.
- Regression coverage is in `tests/nashville.test.ts`.

## 5. Verification

- `npm run build` passed after the final UI fix.
- `node --experimental-strip-types --test tests/nashville.test.ts` passed both regression tests using Node 24.13.0.
- The latest lint run completed with existing warnings in the button component, new-song modal, and React state handling.
- Live browser checks used phone widths of 320px and 375px and tablet widths of 768px and 1024px.
- Checked daily-list sorting and refresh persistence, blank chart and section creation, accidental bass entry, chord deletion, light/dark themes, auto-scroll controls, and returning from stage to the originating screen.
- Verified the corrected chord-delete button has no overlap with the chord and no horizontal page overflow at the tested phone width.
- Metronome start/stop UI was exercised. Audible playback and physical phone/tablet testing remain to be verified.
- The working preview during verification used `http://127.0.0.1:5180/`. LocalStorage belongs to each origin, so different preview ports have separate song libraries. This preview contains a UI verification chart.

## 6. Pending Product Decisions

- User accounts and sharing restricted to invited users remain pending. Confirm recipient permissions and the authentication/storage approach before implementation.
- The keypad already supports slash chords. Clarification is still needed on whether the requested bass change means repositioning the slash key beside the flat key or adding a dedicated bass field.
