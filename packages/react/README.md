# @iran-utils/iranian-banks-react-icons

[![npm version](https://img.shields.io/npm/v/@iran-utils/iranian-banks-react-icons?color=crimson&logo=npm)](https://www.npmjs.com/package/@iran-utils/iranian-banks-react-icons)
[![npm downloads](https://img.shields.io/npm/dm/@iran-utils/iranian-banks-react-icons?color=blue)](https://www.npmjs.com/package/@iran-utils/iranian-banks-react-icons)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@iran-utils/iranian-banks-react-icons?label=minzipped)](https://bundlephobia.com/package/@iran-utils/iranian-banks-react-icons)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://github.com/houtanrocky/iranian-banks-react-icons/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-16%20|%2017%20|%2018%20|%2019-61dafb?logo=react)](https://reactjs.org)

React SVG icon library for **59 Iranian banks, PSPs, and payment providers** — logos for Melli, Mellat, Saderat, Tejarat, Pasargad, Saman, Parsian, Zarrinpal, Shaparak, and more. Includes 117 SVG variants: 59 color logos and 58 monochrome logos. SnappPay is color-only.

**[→ Live Playground & Icon Browser](https://houtanrocky.github.io/iranian-banks-react-icons/)**

---

## Installation

```bash
npm install @iran-utils/iranian-banks-react-icons
# or
pnpm add @iran-utils/iranian-banks-react-icons
# or
yarn add @iran-utils/iranian-banks-react-icons
```

> **Peer dependency:** React 16.13+ / 17 / 18 / 19

---

## Quick Start

```jsx
import { MelliColorIcon, MellatIcon, ZarrinpalColorIcon } from '@iran-utils/iranian-banks-react-icons';

export default function App() {
  return (
    <div>
      {/* Full-color logo */}
      <MelliColorIcon width={48} height={48} />

      {/* Monochrome — tintable via fill */}
      <MellatIcon width={48} height={48} fill="#0066cc" />

      {/* All SVG props are supported */}
      <ZarrinpalColorIcon
        width={64}
        height={64}
        className="bank-logo"
        style={{ borderRadius: 8 }}
        aria-label="Zarrinpal"
        onClick={() => console.log('clicked')}
      />
    </div>
  );
}
```

---

## TypeScript

Full TypeScript support is included. Every icon accepts `React.SVGProps<SVGSVGElement>` — all standard SVG attributes including `width`, `height`, `fill`, `stroke`, `className`, `style`, `aria-*`, `ref`, event handlers, and more.

```tsx
import type { ComponentProps } from 'react';
import { MelliColorIcon } from '@iran-utils/iranian-banks-react-icons';

// Infer icon props
type IconProps = ComponentProps<typeof MelliColorIcon>;
```

---

## Tree Shaking

The package is fully tree-shakeable. Only the icons you import are included in your bundle.

```jsx
// Only MelliColorIcon and MellatIcon end up in the bundle
import { MelliColorIcon, MellatIcon } from '@iran-utils/iranian-banks-react-icons';
```

---

## Icon Variants

Every bank has two exports:

| Variant | Name pattern | Usage |
|---|---|---|
| **Color** | `[Bank]ColorIcon` | Full-color official logo |
| **Mono** | `[Bank]Icon` | Single-color; pass `fill` to tint |

```jsx
import { PasargadColorIcon, PasargadIcon } from '@iran-utils/iranian-banks-react-icons';

<PasargadColorIcon width={48} height={48} />           // full color
<PasargadIcon width={48} height={48} fill="currentColor" /> // inherits text color
```

---

## Props

All icons are standard function components. They accept every prop an `<svg>` element accepts:

| Prop | Type | Description |
|---|---|---|
| `width` | `number \| string` | Icon width (default: SVG viewBox width) |
| `height` | `number \| string` | Icon height (default: SVG viewBox height) |
| `fill` | `string` | Fill color — most useful on monochrome icons |
| `className` | `string` | CSS class |
| `style` | `CSSProperties` | Inline styles |
| `aria-label` | `string` | Accessibility label |
| `ref` | `Ref<SVGSVGElement>` | Forwarded to the `<svg>` element |
| `onClick` | `MouseEventHandler` | Click handler |
| …and all other SVG attributes | | |

---

## Available Icons

Browse all icons interactively: **[Playground →](https://houtanrocky.github.io/iranian-banks-react-icons/)**

<details>
<summary><strong>Banks (38 banks × 2 variants)</strong></summary>

| Bank | Color | Mono |
|---|---|---|
| Bank Melli Iran | `MelliColorIcon` | `MelliIcon` |
| Mellat | `MellatColorIcon` | `MellatIcon` |
| Saderat | `SaderatColorIcon` | `SaderatIcon` |
| Tejarat | `TejaratColorIcon` | `TejaratIcon` |
| Sepah | `SepahColorIcon` | `SepahIcon` |
| Keshavarzi | `KeshavarziColorIcon` | `KeshavarziIcon` |
| Maskan | `MaskanColorIcon` | `MaskanIcon` |
| Refah | `RefahColorIcon` | `RefahIcon` |
| Post Bank | `PostColorIcon` | `PostIcon` |
| Sanat & Madan | `SanatMadanColorIcon` | `SanatMadanIcon` |
| Taavon Eslami | `TaavonEslamiColorIcon` | `TaavonEslamiIcon` |
| Pasargad | `PasargadColorIcon` | `PasargadIcon` |
| Saman | `SamanColorIcon` | `SamanIcon` |
| Parsian | `ParsianColorIcon` | `ParsianIcon` |
| Ayandeh | `AyandehColorIcon` | `AyandehIcon` |
| Karafarin | `KarafarinColorIcon` | `KarafarinIcon` |
| Eghtesad Novin | `EghtesadNovinColorIcon` | `EghtesadNovinIcon` |
| Sina | `SinaColorIcon` | `SinaIcon` |
| Shahr | `ShahrColorIcon` | `ShahrIcon` |
| Gardeshgari | `GardeshgariColorIcon` | `GardeshgariIcon` |
| Khavar Mianeh | `KhavarMianehColorIcon` | `KhavarMianehIcon` |
| Dey | `DeyColorIcon` | `DeyIcon` |
| Caspian | `CaspianColorIcon` | `CaspianIcon` |
| Sarmayeh | `SarmayehColorIcon` | `SarmayehIcon` |
| Resalat | `ResalatColorIcon` | `ResalatIcon` |
| Iran Zamin | `IranZaminColorIcon` | `IranZaminIcon` |
| Iran Europe | `IranEuropeColorIcon` | `IranEuropeIcon` |
| Iran Venezuela | `IranVenezuelaColorIcon` | `IranVenezuelaIcon` |
| Noor | `NoorColorIcon` | `NoorIcon` |
| Mehr Iran | `MehrIranColorIcon` | `MehrIranIcon` |
| Melall | `MelallColorIcon` | `MelallIcon` |
| Tosee | `ToseeColorIcon` | `ToseeIcon` |
| Tosee Saderat | `ToseeSaderatColorIcon` | `ToseeSaderatIcon` |
| Tosee Taavon | `ToseeTaavonColorIcon` | `ToseeTaavonIcon` |
| Standard Chartered | `StandardCharteredColorIcon` | `StandardCharteredIcon` |
| Blu Bank | `BluBankColorIcon` | `BluBankIcon` |
| Bankino | `BankinoColorIcon` | `BankinoIcon` |
| Future Bank | `FuturebankColorIcon` | `FuturebankIcon` |

</details>

<details>
<summary><strong>Payment Platforms (11)</strong></summary>

| Provider | Color | Mono |
|---|---|---|
| Zarrinpal | `ZarrinpalColorIcon` | `ZarrinpalIcon` |
| Pay.ir | `PayIrColorIcon` | `PayIrIcon` |
| Payping | `PaypingColorIcon` | `PaypingIcon` |
| NextPay | `NextPayColorIcon` | `NextPayIcon` |
| IDPay | `IdpayColorIcon` | `IdpayIcon` |
| Vandar | `VandarColorIcon` | `VandarIcon` |
| Digipay | `DigipayColorIcon` | `DigipayIcon` |
| Zibal | `ZibalColorIcon` | `ZibalIcon` |
| Hesabit | `HesabitColorIcon` | `HesabitIcon` |
| Asan Pardakht | `AsanPardakhtColorIcon` | `AsanPardakhtIcon` |
| Snapp Pay | `SnappPayColorIcon` | — |

</details>

<details>
<summary><strong>PSPs (3)</strong></summary>

| Provider | Color | Mono |
|---|---|---|
| Saman Kish | `SamanKishColorIcon` | `SamanKishIcon` |
| Pasargad PEP | `PasargadPepColorIcon` | `PasargadPepIcon` |
| Sadad | `SadadColorIcon` | `SadadIcon` |

</details>

<details>
<summary><strong>Networks (2)</strong></summary>

| Provider | Color | Mono |
|---|---|---|
| Shaparak | `ShaparakColorIcon` | `ShaparakIcon` |
| Bank Markazi | `BankMarkaziColorIcon` | `BankMarkaziIcon` |

</details>

<details>
<summary><strong>Merged into Sepah Bank (5)</strong></summary>

| Bank | Color | Mono |
|---|---|---|
| Ansar (merged) | `SepahMergedAnsarColorIcon` | `SepahMergedAnsarIcon` |
| Ghavamin (merged) | `SepahMergedGhavaminColorIcon` | `SepahMergedGhavaminIcon` |
| Hekmat (merged) | `SepahMergedHekmatColorIcon` | `SepahMergedHekmatIcon` |
| Kosar (merged) | `SepahMergedKosarColorIcon` | `SepahMergedKosarIcon` |
| Mehr Eghtesad (merged) | `SepahMergedMehrEghtesadColorIcon` | `SepahMergedMehrEghtesadIcon` |

</details>

---

## Related Packages

| Package | Description |
|---|---|
| [`@iran-utils/iranian-banks-vue-icons`](https://www.npmjs.com/package/@iran-utils/iranian-banks-vue-icons) | Same icons for Vue 3 |
| [`@iran-utils/iranian-banks-icons-core`](https://www.npmjs.com/package/@iran-utils/iranian-banks-icons-core) | Framework-agnostic SVG data (viewBox + content strings) |

---

## License

[MIT](https://github.com/houtanrocky/iranian-banks-react-icons/blob/main/LICENSE) © [Houtan Rocky](https://github.com/houtanrocky)
