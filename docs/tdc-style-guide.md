# Transport Data Commons: visual identity

_Making high-quality transport data accessible_

Logo | Colour | Typography | Imagery

October 2026

## Logo

Two diverging arrows: data flowing into and out of the commons. The mark always sits in its teal square.

| Version       | Description                                           | Use                                                               |
| ------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| Primary logo  | Teal square with the mark, and the name in teal       | Default version on white and light mint backgrounds               |
| Reversed logo | The mark in an outlined square, and the name in white | On teal, dark panels and photos with the teal overlay             |
| Symbol        | The mark in its teal square, without the name         | Where space is tight: avatars, favicons, app icons, slide footers |

The mark's two arrows are white and lime. The symbol is shown in two versions: the plain teal square, and the teal square with an inner white outline.

### Rules

- **Clear space**: Keep the area around the logo free of text and graphics.
- **No changes**: Do not recolour, stretch, rotate, outline or add effects.
- **Contrast**: On busy photos, place the logo on the teal overlay only.

## Colour

Teal carries the identity. Mint tones build calm surfaces, and lime marks the one thing to notice.

| Colour | HEX       | RGB             | Use                                   |
| ------ | --------- | --------------- | ------------------------------------- |
| Teal   | `#006064` | 0 · 96 · 100    | Logo, headings, dark backgrounds      |
| Lime   | `#DFF64D` | 223 · 246 · 77  | Accent: one key word, numbers, arrows |
| White  | `#FFFFFF` | 255 · 255 · 255 | Page background, text on teal         |

### Supporting colours

| Colour    | HEX       | RGB             | Use                           |
| --------- | --------- | --------------- | ----------------------------- |
| Slate     | `#3A6A6C` | 58 · 106 · 108  | Secondary text                |
| Grey teal | `#758E90` | 117 · 142 · 144 | Captions, footnotes, metadata |
| Pale lime | `#F8FDDB` | 248 · 253 · 219 | Call-out and highlight panels |

## Mint and teal scale

One scale from background mint to teal. Use the light end for surfaces and the dark end for text and charts.

| Colour   | HEX       | RGB             | Use                            |
| -------- | --------- | --------------- | ------------------------------ |
| Mint 50  | `#E7FAEF` | 231 · 250 · 239 | Slide and page backgrounds     |
| Mint 100 | `#DDF7EC` | 221 · 247 · 236 | Cards, table fills             |
| Mint 200 | `#B5DED7` | 181 · 222 · 215 | Dividers, borders              |
| Mint 300 | `#8BC4C0` | 139 · 196 · 192 | Icons on mint, inactive states |
| Mint 400 | `#5CA8A9` | 92 · 168 · 169  | Chart series, map fills        |
| Teal 500 | `#00878D` | 0 · 135 · 141   | Links, chart highlight         |
| Teal 600 | `#006064` | 0 · 96 · 100    | Primary teal                   |
| Teal 700 | `#296268` | 41 · 98 · 104   | Photo overlays, dark panels    |

### Data category colours

Used only to code the four TDC data categories in tables, badges and charts.

| Category       | HEX       | RGB             |
| -------------- | --------- | --------------- |
| Public         | `#E2EFFF` | 226 · 239 · 255 |
| Community      | `#EDECFE` | 237 · 236 · 254 |
| TDC formatted  | `#DDF7EC` | 221 · 247 · 236 |
| TDC harmonised | `#FDF6B2` | 253 · 246 · 178 |

## Typography

Inter for everything, from cover titles to footnotes. Arial is the fallback where Inter is not installed.

**Inter** is open source (SIL Open Font License), free from Google Fonts and [rsms.me/inter](https://rsms.me/inter). Weights: Regular, SemiBold, Bold, ExtraBold.

### Hierarchy

| Level    | Style                 | Example                                                                          |
| -------- | --------------------- | -------------------------------------------------------------------------------- |
| Display  | ExtraBold · 44–60 pt  | Get started                                                                      |
| Title    | Bold · 24–30 pt       | The TDC portal                                                                   |
| Subtitle | SemiBold · 16–18 pt   | Four data categories                                                             |
| Body     | Regular · 14–16 pt    | TDC brings together data, tools and partners to make transport more transparent. |
| Caption  | Regular · 10–12 pt    | Source: TDC portal, accessed October 2026                                        |
| Emphasis | Lime marker, one word | Data <mark>Infrastructure</mark>                                                 |

In the guide's examples, headings are set in teal, and the emphasis is a lime highlight behind one word, with the text staying teal.

## Imagery

Real streets and public transport: buses, trains, cycling and walking. People in motion, not posed.

### Photo treatment

1. **Desaturate**: Reduce colour saturation by about half.
2. **Tint**: Lay Teal 500 over the image at around 35% opacity.
3. **Overlay**: Fade Teal 700 in where text or the logo sits.

---

## Notes on this conversion

Not part of the guide. This is a text version of `TDC_Style_Guide_v2.pdf`.

- **Left out**: the logo artwork, colour swatches, the "Aa" type specimen, and the example photos. The primary logo is at `frontend/public/images/logos/tdc-logo.svg` in the portal repo.
- **Font in the PDF**: the PDF itself is set in Arial Black and Lucida Sans, not Inter, so its pages don't show the real typeface.
- **Sizes are in points**, as they're intended for slides. They need adapting for the web.
- **The scale isn't strictly ordered**: Teal 700 (`#296268`) is lighter than Teal 600 (`#006064`).
- **Interactive controls aren't covered by the guide**: the portal uses solid Teal 600 with white text for active controls and buttons, on a `#F3F4F6` background for the track behind them.
- **Contrast against white**, by the WCAG AA threshold of 4.5:1 for normal-size text: Teal 600 7.35, Teal 700 6.91, Slate 6.07 pass; Teal 500 (links) 4.33 and Grey teal (captions) 3.48 fall short.
