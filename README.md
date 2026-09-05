# Gianni Network Lab

Gianni Majorenos's personal network-engineering study and portfolio site. It follows the current Cisco CCNA 200-301 v1.1 and CCNP ENCOR 350-401 v1.1 domain structures while emphasizing practical configuration, verification, and troubleshooting.

## What is included

- 600 original multiple-choice questions: 360 CCNA and 240 ENCOR
- Filtered practice drills with answers and explanations
- Timed 20-, 50-, and 100-question exam simulations
- 12 interactive drag-and-drop and tap-to-match exercises
- 27 focused Cisco IOS configuration building blocks
- 8 complete campus, branch, security, assurance, IPv6, and automation configurations
- 8 interactive SVG topology labs
- Dark theme by default with a saved light-theme option
- Responsive multi-page interface and local progress tracking

All questions are original study material. They are not copied exam questions or certification dumps.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Network-engineering command center |
| `/learn` | CCNA and ENCOR blueprint-driven learning paths |
| `/practice` | Filterable 600-question bank |
| `/exam` | Timed practice exam builder and score review |
| `/drag-drop` | Interactive matching and ordering exercises |
| `/scripts` | Small IOS examples followed by complete configurations |
| `/topologies` | Interactive network diagrams and lab tasks |
| `/about` | Resume-aligned professional profile |

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Run the full validation suite:

```bash
npm test
npm run lint
```

The Vercel deployment uses the standard Next.js production build:

```bash
npm run build:vercel
```

## Content checks

Automated tests verify that:

- all 600 question IDs and prompts are unique;
- every question has four choices and a valid answer key;
- drag-and-drop targets point to valid items;
- topology links point to valid nodes; and
- the configuration library includes both focused and full-build material.

## Exam version note

The learning path labels version-specific content. Cisco lists CCNA v1.1 as active through February 2, 2027 and CCNA v2.0 beginning February 3, 2027. ENCOR material is aligned to 350-401 v1.1.

## License and trademarks

This independent educational project is not affiliated with or endorsed by Cisco. Cisco and Cisco IOS are trademarks of Cisco Systems, Inc.
