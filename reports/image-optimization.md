# SVG optimization audit

Run `pnpm build && pnpm audit:images` to reproduce. Source artwork is preserved in `raw/`.

- 117 SVG variants for 59 providers; no raster conversion or embedded bitmap assets.
- Source: 1,525,180 bytes. Optimized: 832,738 bytes (45.4% smaller).
- The previous build produced 1,089,340 bytes with pretty printing and 8-digit precision. This build uses compact output and 4-digit precision.
- All rendered core exports were compared with the source artwork at 96 and 256 pixels, on white, using Sharp. Maximum mean absolute channel error: 0.1862/255 (khavar-mianeh.svg). The regression limit is 1/255; this is an automated similarity check, not a substitute for review of changed artwork.

## Problems found and addressed

- Four gradient-based logos reused IDs such as `a` and `b`, allowing one inline logo to reference another logo's gradients. File-specific, deterministic prefixes now isolate definitions between different icons. Identical repeated instances still share IDs; their definitions are identical. Avoid styling these internal IDs; repeated-instance ID uniqueness is not guaranteed by the current API.
- Hard-coded black fills overrode the public monochrome `fill` prop. Monochrome black paths now inherit the root fill, while white cutouts and `fill="none"` are retained. `MaskanIcon` is an entirely white reverse logo; its source palette is preserved and the gallery previews it on a dark background.
- Duplicated optimizer plugins, verbose serialization and excessive coordinate precision increased distribution size. The pipeline now validates SVGs, retains viewBox, prefixes IDs and writes compact output.
- The old gallery eagerly bundled all icon data into 1,291,760 bytes of JavaScript (457,270 gzip). The gallery now references separate SVG files with lazy loading and explicit dimensions, so the artwork does not inflate the JavaScript bundle. A user browsing the full collection will still download its images.

## Remaining size considerations

Melli, Sepah, Shaparak and Tejarat contain detailed vector paths. Precision reduction alone cannot make this artwork tiny. Prefer individual named ESM imports, avoid namespace imports in consumers, and do not replace detailed brand artwork with simplified paths without visual review. CommonJS consumers may load the entire data module.

Gzip values below measure each SVG separately; they are not a promise about a consumer's bundle or GitHub Pages compression.

| Largest optimized files | Source bytes | Optimized bytes | Gzip bytes | Max render error / 255 |
| --- | ---: | ---: | ---: | ---: |
| melli-color.svg | 369945 | 162480 | 59151 | 0.0478 |
| melli.svg | 218014 | 91862 | 34593 | 0.0660 |
| sepah-color.svg | 81700 | 49970 | 21378 | 0.0048 |
| sepah.svg | 81563 | 49851 | 21320 | 0.0065 |
| tejarat-color.svg | 68863 | 42868 | 17575 | 0.0073 |
| tejarat.svg | 68830 | 42820 | 17549 | 0.0106 |
| shaparak-color.svg | 78922 | 40807 | 16366 | 0.0710 |
| shaparak.svg | 78794 | 40615 | 16328 | 0.1141 |
| pasargad-color.svg | 36735 | 22772 | 7589 | 0.0010 |
| pasargad-.svg | 36733 | 22745 | 7568 | 0.0024 |
| saman.svg | 29851 | 18309 | 8462 | 0.0286 |
| saman kish-color.svg | 24610 | 16495 | 7221 | 0.0007 |

References: [SVGO ID prefixing](https://svgo.dev/docs/plugins/prefixIds/), [Vite static deployment](https://vite.dev/guide/static-deploy).
