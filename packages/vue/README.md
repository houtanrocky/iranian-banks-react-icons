# @iran-utils/iranian-banks-vue-icons

[![npm version](https://img.shields.io/npm/v/@iran-utils/iranian-banks-vue-icons?color=42b883&logo=npm)](https://www.npmjs.com/package/@iran-utils/iranian-banks-vue-icons)
[![npm downloads](https://img.shields.io/npm/dm/@iran-utils/iranian-banks-vue-icons?color=blue)](https://www.npmjs.com/package/@iran-utils/iranian-banks-vue-icons)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@iran-utils/iranian-banks-vue-icons?label=minzipped)](https://bundlephobia.com/package/@iran-utils/iranian-banks-vue-icons)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://github.com/houtanrocky/iranian-banks-react-icons/blob/main/LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js)](https://vuejs.org)

Vue 3 SVG icon library for **59 Iranian banks, PSPs, and payment providers** — logos for Melli, Mellat, Saderat, Tejarat, Pasargad, Saman, Parsian, Zarrinpal, Shaparak, and more. Includes 117 SVG variants: 59 color logos and 58 monochrome logos. SnappPay is color-only.

**[→ Live Playground & Icon Browser](https://houtanrocky.github.io/iranian-banks-react-icons/)**

---

## Installation

```bash
npm install @iran-utils/iranian-banks-vue-icons
# or
pnpm add @iran-utils/iranian-banks-vue-icons
# or
yarn add @iran-utils/iranian-banks-vue-icons
```

> **Peer dependency:** Vue 3.x

---

## Quick Start

### Composition API (`<script setup>`)

```vue
<script setup>
import { MelliColorIcon, MellatIcon, ZarrinpalColorIcon } from '@iran-utils/iranian-banks-vue-icons';
</script>

<template>
  <!-- Full-color logo -->
  <MelliColorIcon :width="48" :height="48" />

  <!-- Monochrome — tintable via fill -->
  <MellatIcon :width="48" :height="48" fill="#0066cc" />

  <!-- All SVG attributes are supported -->
  <ZarrinpalColorIcon
    :width="64"
    :height="64"
    class="bank-logo"
    :style="{ borderRadius: '8px' }"
    aria-label="Zarrinpal"
    @click="handleClick"
  />
</template>
```

### Options API

```vue
<script>
import { PasargadColorIcon } from '@iran-utils/iranian-banks-vue-icons';

export default {
  components: { PasargadColorIcon },
};
</script>

<template>
  <PasargadColorIcon :width="48" :height="48" />
</template>
```

### Global Registration

```js
// main.js
import { createApp } from 'vue';
import { MelliColorIcon, MellatIcon } from '@iran-utils/iranian-banks-vue-icons';
import App from './App.vue';

const app = createApp(App);
app.component('MelliColorIcon', MelliColorIcon);
app.component('MellatIcon', MellatIcon);
app.mount('#app');
```

---

## TypeScript

Full TypeScript support is included. Components accept any SVG attribute via Vue's `$attrs`.

```vue
<script setup lang="ts">
import { MelliColorIcon } from '@iran-utils/iranian-banks-vue-icons';
</script>

<template>
  <MelliColorIcon :width="48" :height="48" fill="currentColor" />
</template>
```

---

## How It Works

Each icon component uses `inheritAttrs: false` and spreads `$attrs` directly onto the root `<svg>` element. This means **every standard HTML and SVG attribute** — classes, styles, event handlers, ARIA attributes — is passed through automatically.

```vue
<!-- These all work -->
<MelliColorIcon
  width="48"
  height="48"
  class="my-icon"
  :style="{ opacity: 0.8 }"
  aria-hidden="true"
  @click="onClick"
  @mouseenter="onHover"
/>
```

---

## Icon Variants

Every bank has two exports:

| Variant | Name pattern | Usage |
|---|---|---|
| **Color** | `[Bank]ColorIcon` | Full-color official logo |
| **Mono** | `[Bank]Icon` | Single-color; pass `fill` to tint |

```vue
<script setup>
import { SamanColorIcon, SamanIcon } from '@iran-utils/iranian-banks-vue-icons';
</script>

<template>
  <SamanColorIcon :width="48" :height="48" />                    <!-- full color -->
  <SamanIcon :width="48" :height="48" fill="currentColor" />     <!-- inherits text color -->
</template>
```

---

## Props

Icons accept any attribute valid on an `<svg>` element:

| Prop | Type | Description |
|---|---|---|
| `width` | `number \| string` | Icon width |
| `height` | `number \| string` | Icon height |
| `fill` | `string` | Fill color — most useful on monochrome icons |
| `class` | `string` | CSS class |
| `style` | `StyleValue` | Inline styles |
| `aria-label` | `string` | Accessibility label |
| `@click` | `MouseEvent` | Click handler |
| …and all other SVG/HTML attributes | | |

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
| [`@iran-utils/iranian-banks-react-icons`](https://www.npmjs.com/package/@iran-utils/iranian-banks-react-icons) | Same icons for React |
| [`@iran-utils/iranian-banks-icons-core`](https://www.npmjs.com/package/@iran-utils/iranian-banks-icons-core) | Framework-agnostic SVG data (viewBox + content strings) |

---

## License

[MIT](https://github.com/houtanrocky/iranian-banks-react-icons/blob/main/LICENSE) © [Houtan Rocky](https://github.com/houtanrocky)
