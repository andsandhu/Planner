# Design System Specification: The Architectural Pulse

## 1. Overview & Creative North Star
**Creative North Star: "The Empathetic Architect"**

The design system for HUHU moves beyond the standard utility of Android apps to create a high-end, editorial experience. It is rooted in the concept of **"Empathetic Architecture"**—where the UI feels solid and dependable (Bold) yet remains breathable and responsive to the user's needs (Helpful). 

To break the "template" look of standard Material 3, this system utilizes **intentional asymmetry** and **tonal depth**. Instead of centering everything, we use weighted left-alignments and oversized display type to create a sense of direction. We ignore traditional dividers in favor of "Negative Space as Structure," ensuring the app feels like a premium digital publication rather than a cluttered database.

---

## 2. Colors & Tonal Depth
The palette is a sophisticated blend of Deep Navy (`primary`) and Slate Blue (`secondary`), providing a professional foundation. However, the soul of this system lies in its **Dynamic Theming** capabilities, allowing folder-specific colors to recolor the internal surfaces.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To separate content, designers must use background color shifts. A `surface-container-low` card sitting on a `surface` background provides all the definition required. Boundaries are felt, not seen.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper.
*   **Base:** `surface` (#faf9fc) - The canvas.
*   **Level 1:** `surface-container-low` (#f4f3f6) - Secondary groupings.
*   **Level 2:** `surface-container` (#eeedf1) - Primary content areas.
*   **Level 3:** `surface-container-high` (#e8e8eb) - Active or focused elements.

### The Glass & Gradient Rule
For floating elements (like the "HUHU" logo header or FABs), use **Glassmorphism**. Apply a semi-transparent `surface` color with a 20px backdrop blur. 
*   **Signature Texture:** Use a subtle linear gradient for primary CTAs, transitioning from `primary` (#0040a1) to `primary-container` (#0056d2) at a 135-degree angle. This adds "soul" and depth that flat hex codes lack.

---

## 3. Typography: Editorial Authority
We utilize **Roboto** not as a system default, but as a Swiss-style architectural tool. By exaggerating the scale between `display` and `body`, we create an authoritative hierarchy.

*   **Display (Editorial Impact):** Use `display-lg` (3.5rem) for welcome screens and folder titles. Set with tight letter-spacing (-0.02em) to emphasize the "HUHU" bold identity.
*   **Headlines (The Guide):** `headline-sm` (1.5rem) should be used for section starts, always paired with a `surface-tint` accent bar or generous top spacing (`spacing-12`).
*   **Body (The Assistant):** `body-md` (0.875rem) is the workhorse. Use a slightly lightened `on-surface-variant` (#424654) to ensure the long-form text feels approachable and less "heavy."
*   **The Tagline:** The tagline "Help Us To Help You" must always appear in `label-sm` (0.6875rem) with all-caps and +0.1em letter spacing for a "Powered by" premium feel.

---

## 4. Elevation & Depth
In this system, shadows are a last resort, not a default.

### The Layering Principle
Depth is achieved through **Tonal Stacking**. An input field shouldn't have a shadow; it should be a `surface-container-highest` shape nested within a `surface-container` section.

### Ambient Shadows
If a floating state is required (e.g., a Modal Drawer):
*   **Color:** Use a 6% opacity tint of `on-surface` (#1a1c1e).
*   **Blur:** Use a massive 40px blur with a 12px Y-offset to mimic soft, gallery-style overhead lighting.

### The "Ghost Border" Fallback
If contrast is legally required for accessibility, use a **Ghost Border**: `outline-variant` (#c3c6d6) at 15% opacity. Never use a 100% opaque border.

---

## 5. Components

### Buttons: The Tactile Interaction
*   **Primary:** Rounded `xl` (1.5rem). Use the Signature Gradient (`primary` to `primary-container`). Label is `title-sm` in `on-primary` (#ffffff).
*   **Tertiary:** No background, no border. Use `primary` text color with an `8` spacing (2rem) touch target.

### Cards & Folders: The Core Experience
*   **Rule:** Forbid divider lines. 
*   **Structure:** Use `spacing-6` (1.5rem) padding. Separate content blocks using a background shift from `surface-container-low` to `surface-container-lowest`.
*   **Dynamic Folders:** When a user selects a folder color, the `primary_fixed` and `surface_tint` tokens for that specific screen transition to the selected hue, while the `on-surface` remains constant for legibility.

### Input Fields: Clean Efficiency
*   **Styling:** No outlines. Use a `surface-container-high` background with a `none` roundedness on the bottom (0px) and `sm` (0.25rem) on the top. 
*   **Interaction:** On focus, a 2px `surface-tint` bar animates from the center-bottom.

### Contextual Chips
*   **Visuals:** Use `secondary-container` (#bed9ff) with `on-secondary-container` (#445f7f) text. Roundedness: `full`. No border.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. If the left margin is `spacing-4`, try a right margin of `spacing-8` for editorial layouts.
*   **Do** use `surface-bright` for areas meant to inspire or "Help."
*   **Do** ensure the "HUHU" logo has a minimum of `spacing-10` breathing room from any other element.

### Don't
*   **Don't** use 1px solid dividers. If you feel the need for a line, use `spacing-4` of empty white space instead.
*   **Don't** use standard Material 3 elevation (shadows) 1 through 5. Stick to the Tonal Layering defined in Section 4.
*   **Don't** use high-contrast black (#000000). Always use `on-surface` (#1a1c1e) to maintain the premium, soft-black aesthetic.