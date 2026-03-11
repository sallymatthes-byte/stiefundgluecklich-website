# Typografie-System — stiefundgluecklich.de

## Schriftarten
- **Headings:** Cormorant Garamond (Serif) — elegant, ruhig
- **Fließtext:** Raleway (Sans-Serif) — klar, modern

---

## Größen-Hierarchie

### Headings (font-serif / Cormorant Garamond)

| Element | Mobile | Tablet (md) | Desktop (lg) | Beispiel |
|---------|--------|-------------|---------------|----------|
| **h1** (Hero) | `text-2xl` | `text-4xl` | `text-5xl` | "Du gibst alles..." |
| **h2** (Section) | `text-xl` | `text-3xl` | `text-4xl` | "Es ist 23 Uhr..." |
| **h3** (Karten) | `text-lg` | `text-xl` | — | Podcast-Episodentitel |

### Fließtext (font-sans / Raleway)

| Element | Größe | Farbe | Beispiel |
|---------|-------|-------|----------|
| **Body** | `text-base` | `text-muted-foreground` | Beschreibungstexte, Pain Points |
| **Lead** (unter Heading) | `text-base md:text-lg` | `text-muted-foreground` | Untertitel unter h2 |
| **Label** (über Heading) | `text-sm` | `text-primary font-medium` | "Kommt dir das bekannt vor?" |
| **Akzent-Satz** | `text-base md:text-lg` | `text-foreground font-medium` | "Du wolltest nie Stiefmutter sein." |
| **Small** | `text-sm` | `text-muted-foreground` | Feature-Listen, Meta-Infos |
| **XS** | `text-xs` | `text-muted-foreground` | Mobile Stats-Labels |

---

## Abstände

| Zwischen... | Wert |
|-------------|------|
| Sektionen (padding) | `py-16 md:py-28` |
| Label → Heading | `mb-4 md:mb-5` |
| Heading → Text | `mb-5 md:mb-7` (Heading), `mb-8` (vor Content-Block) |
| Content-Blöcke | `space-y-4` |
| Abschluss-Text → CTA | `mt-12` |

---

## Stilregeln

1. **Max 2 Textstile pro Abschnitt.** Nicht kursiv + fett + grau + grün in aufeinanderfolgenden Zeilen.
2. **Kursiv sparsam.** Nur für Highlight-Worte in Headings (`italic text-primary` / `italic text-gold-bright`), nicht im Fließtext.
3. **Bold nur für einen Schlüsselsatz** pro Section, nicht für mehrere.
4. **Fließtext immer `text-base`** — keine `text-lg` / `text-xl` Mischung im gleichen Block.
5. **Labels immer `text-sm`** — einheitlich klein über jedem Heading.

---

## Farbsystem (Kurzreferenz)

| Token | Verwendung |
|-------|-----------|
| `text-foreground` | Headings, wichtige Sätze (schwarz) |
| `text-muted-foreground` | Fließtext, Beschreibungen (grau) |
| `text-primary` | Labels, Links, Akzente (grün) |
| `text-gold-bright` | Highlight-Worte in Headings |

---

*Stand: 11.03.2026 — gilt aktuell für die Startseite. Bei Gefallen auf alle Seiten ausrollen.*
