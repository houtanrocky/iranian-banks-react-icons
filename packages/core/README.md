# @iran-utils/iranian-banks-icons-core

[![npm version](https://img.shields.io/npm/v/@iran-utils/iranian-banks-icons-core?color=gray&logo=npm)](https://www.npmjs.com/package/@iran-utils/iranian-banks-icons-core)
[![npm downloads](https://img.shields.io/npm/dm/@iran-utils/iranian-banks-icons-core?color=blue)](https://www.npmjs.com/package/@iran-utils/iranian-banks-icons-core)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@iran-utils/iranian-banks-icons-core?label=minzipped)](https://bundlephobia.com/package/@iran-utils/iranian-banks-icons-core)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://github.com/houtanrocky/iranian-banks-react-icons/blob/main/LICENSE)

Framework-agnostic SVG icon data for **59 Iranian banks, PSPs, and payment providers** — logos for Melli, Mellat, Saderat, Tejarat, Pasargad, Saman, Parsian, Zarrinpal, Shaparak, and more.

Each icon export is a plain object `{ viewBox: string, content: string }`. Use this package to build adapters for **any framework** — Angular, Svelte, Solid, Web Components, vanilla JS, or a server-side renderer.

If you use **React or Vue**, prefer the ready-made wrappers:
- React → [`@iran-utils/iranian-banks-react-icons`](https://www.npmjs.com/package/@iran-utils/iranian-banks-react-icons)
- Vue 3 → [`@iran-utils/iranian-banks-vue-icons`](https://www.npmjs.com/package/@iran-utils/iranian-banks-vue-icons)

---

## Installation

```bash
npm install @iran-utils/iranian-banks-icons-core
# or
pnpm add @iran-utils/iranian-banks-icons-core
# or
yarn add @iran-utils/iranian-banks-icons-core
```

---

## Data Format

Every export is a `SvgIconData` object:

```ts
interface SvgIconData {
  viewBox: string;  // e.g. "0 0 100 100"
  content: string;  // inner SVG markup — the children of <svg>
}
```

---

## Usage Examples

### Vanilla JS / Web Components

```js
import { MelliColorIcon } from '@iran-utils/iranian-banks-icons-core';

// Render directly to a DOM element
const el = document.getElementById('logo');
el.innerHTML = `
  <svg viewBox="${MelliColorIcon.viewBox}" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    ${MelliColorIcon.content}
  </svg>
`;
```

```js
// Web Component
class BankIcon extends HTMLElement {
  static observedAttributes = ['name', 'size'];

  connectedCallback() { this.#render(); }
  attributeChangedCallback() { this.#render(); }

  #render() {
    const icons = { melli: MelliColorIcon, mellat: MellatColorIcon };
    const data = icons[this.getAttribute('name')];
    const size = this.getAttribute('size') ?? 32;
    if (!data) return;
    this.innerHTML = `
      <svg viewBox="${data.viewBox}" xmlns="http://www.w3.org/2000/svg"
           width="${size}" height="${size}">
        ${data.content}
      </svg>
    `;
  }
}
customElements.define('bank-icon', BankIcon);
```

```html
<bank-icon name="melli" size="64"></bank-icon>
```

### Svelte

```svelte
<script>
  import { PasargadColorIcon } from '@iran-utils/iranian-banks-icons-core';

  export let size = 48;
</script>

<svg
  viewBox={PasargadColorIcon.viewBox}
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html PasargadColorIcon.content}
</svg>
```

### Angular

```typescript
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MelliColorIcon, SvgIconData } from '@iran-utils/iranian-banks-icons-core';

@Component({
  selector: 'bank-icon',
  template: `
    <svg [attr.viewBox]="data.viewBox" xmlns="http://www.w3.org/2000/svg"
         [attr.width]="size" [attr.height]="size" [innerHTML]="safeContent">
    </svg>
  `,
})
export class BankIconComponent {
  @Input() data: SvgIconData = MelliColorIcon;
  @Input() size = 48;

  get safeContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.data.content);
  }

  constructor(private sanitizer: DomSanitizer) {}
}
```

### Solid.js

```jsx
import { MelliColorIcon } from '@iran-utils/iranian-banks-icons-core';

function BankIcon({ data, size = 48 }) {
  return (
    <svg
      viewBox={data.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      innerHTML={data.content}
    />
  );
}

<BankIcon data={MelliColorIcon} size={64} />
```

### Node.js / SSR (string rendering)

```js
import { MelliColorIcon, ZarrinpalColorIcon } from '@iran-utils/iranian-banks-icons-core';

function renderIcon(data, { width = 32, height = 32 } = {}) {
  return `<svg viewBox="${data.viewBox}" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${data.content}</svg>`;
}

const html = renderIcon(MelliColorIcon, { width: 64, height: 64 });
// → <svg viewBox="0 0 100 100" xmlns="..." width="64" height="64"><path .../></svg>
```

---

## TypeScript

```ts
import type { SvgIconData } from '@iran-utils/iranian-banks-icons-core';
import { MelliColorIcon } from '@iran-utils/iranian-banks-icons-core';

function renderIcon(data: SvgIconData, size: number): string {
  return `<svg viewBox="${data.viewBox}" width="${size}" height="${size}"
               xmlns="http://www.w3.org/2000/svg">${data.content}</svg>`;
}

renderIcon(MelliColorIcon, 48);
```

---

## Icon Variants

Every bank has two exports:

| Variant | Name pattern | Description |
|---|---|---|
| **Color** | `[Bank]ColorIcon` | Full-color official logo |
| **Mono** | `[Bank]Icon` | Paths use `currentColor` / single fill — tintable |

---

## Available Icons

Browse all 59 icons: **[Playground →](https://houtanrocky.github.io/iranian-banks-react-icons/)**

<details>
<summary><strong>Banks (38)</strong></summary>

`MelliColorIcon` / `MelliIcon` · `MellatColorIcon` / `MellatIcon` · `SaderatColorIcon` / `SaderatIcon` · `TejaratColorIcon` / `TejaratIcon` · `SepahColorIcon` / `SepahIcon` · `KeshavarziColorIcon` / `KeshavarziIcon` · `MaskanColorIcon` / `MaskanIcon` · `RefahColorIcon` / `RefahIcon` · `PostColorIcon` / `PostIcon` · `SanatMadanColorIcon` / `SanatMadanIcon` · `TaavonEslamiColorIcon` / `TaavonEslamiIcon` · `PasargadColorIcon` / `PasargadIcon` · `SamanColorIcon` / `SamanIcon` · `ParsianColorIcon` / `ParsianIcon` · `AyandehColorIcon` / `AyandehIcon` · `KarafarinColorIcon` / `KarafarinIcon` · `EghtesadNovinColorIcon` / `EghtesadNovinIcon` · `SinaColorIcon` / `SinaIcon` · `ShahrColorIcon` / `ShahrIcon` · `GardeshgariColorIcon` / `GardeshgariIcon` · `KhavarMianehColorIcon` / `KhavarMianehIcon` · `DeyColorIcon` / `DeyIcon` · `CaspianColorIcon` / `CaspianIcon` · `SarmayehColorIcon` / `SarmayehIcon` · `ResalatColorIcon` / `ResalatIcon` · `IranZaminColorIcon` / `IranZaminIcon` · `IranEuropeColorIcon` / `IranEuropeIcon` · `IranVenezuelaColorIcon` / `IranVenezuelaIcon` · `NoorColorIcon` / `NoorIcon` · `MehrIranColorIcon` / `MehrIranIcon` · `MelallColorIcon` / `MelallIcon` · `ToseeColorIcon` / `ToseeIcon` · `ToseeSaderatColorIcon` / `ToseeSaderatIcon` · `ToseeTaavonColorIcon` / `ToseeTaavonIcon` · `StandardCharteredColorIcon` / `StandardCharteredIcon` · `BluBankColorIcon` / `BluBankIcon` · `BankinoColorIcon` / `BankinoIcon` · `FuturebankColorIcon` / `FuturebankIcon`

</details>

<details>
<summary><strong>Payment Platforms (11)</strong></summary>

`ZarrinpalColorIcon` / `ZarrinpalIcon` · `PayIrColorIcon` / `PayIrIcon` · `PaypingColorIcon` / `PaypingIcon` · `NextPayColorIcon` / `NextPayIcon` · `IdpayColorIcon` / `IdpayIcon` · `VandarColorIcon` / `VandarIcon` · `DigipayColorIcon` / `DigipayIcon` · `ZibalColorIcon` / `ZibalIcon` · `HesabitColorIcon` / `HesabitIcon` · `AsanPardakhtColorIcon` / `AsanPardakhtIcon` · `SnappPayColorIcon`

</details>

<details>
<summary><strong>PSPs (3)</strong></summary>

`SamanKishColorIcon` / `SamanKishIcon` · `PasargadPepColorIcon` / `PasargadPepIcon` · `SadadColorIcon` / `SadadIcon`

</details>

<details>
<summary><strong>Networks (2)</strong></summary>

`ShaparakColorIcon` / `ShaparakIcon` · `BankMarkaziColorIcon` / `BankMarkaziIcon`

</details>

<details>
<summary><strong>Merged into Sepah Bank (5)</strong></summary>

`SepahMergedAnsarColorIcon` / `SepahMergedAnsarIcon` · `SepahMergedGhavaminColorIcon` / `SepahMergedGhavaminIcon` · `SepahMergedHekmatColorIcon` / `SepahMergedHekmatIcon` · `SepahMergedKosarColorIcon` / `SepahMergedKosarIcon` · `SepahMergedMehrEghtesadColorIcon` / `SepahMergedMehrEghtesadIcon`

</details>

---

## Related Packages

| Package | Description |
|---|---|
| [`@iran-utils/iranian-banks-react-icons`](https://www.npmjs.com/package/@iran-utils/iranian-banks-react-icons) | Ready-made React components |
| [`@iran-utils/iranian-banks-vue-icons`](https://www.npmjs.com/package/@iran-utils/iranian-banks-vue-icons) | Ready-made Vue 3 components |

---

## License

[MIT](https://github.com/houtanrocky/iranian-banks-react-icons/blob/main/LICENSE) © [Houtan Rocky](https://github.com/houtanrocky)
