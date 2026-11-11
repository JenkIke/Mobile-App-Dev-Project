# Design

Reference designs for TeeMetric. The Figma file is the source of truth; this folder holds exported copies so the designs can be viewed next to the code and in pull requests.


## Contents

| Folder | What's inside |
|---|---|
| `mockups/` | One PNG per screen, numbered in flow order (`mockup-01-splash.png` … `mockup-15-home-dark.png`) |
| `flows/` | `ux-flow.png` and the design document (user flows, interface scope, mockup notes) |
| `standards/` | `design-tokens.png` (colours, type scale) and `components.png` (component sheet) |
| `assets/logo/` | `logo-mark.svg` |

## Rules

- **Reference only.** Nothing in `design/` is imported by app code. Images the app uses are copied into `assets/`.
- **Naming.** Lowercase words separated by hyphens; mockups keep their number. PNGs are exported at 2x, logos as SVG.
- **Updating a design.** Change it in Figma, re-export with the same filename, and commit it in a pull request that links the issue. Changes that affect scope, data or deadlines are also recorded in `ARCHITECTURE.md`.
- **Tickets.** Every screen ticket links its mockup from `mockups/` and its Figma frame.

See the team charter and `ARCHITECTURE.md` for the full process.
