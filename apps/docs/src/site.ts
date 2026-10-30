export const SITE_URL = 'https://houtanrocky.github.io/iranian-banks-react-icons/';
export const REPOSITORY_URL = 'https://github.com/houtanrocky/iranian-banks-react-icons';
export const PACKAGES = {
  React: '@iran-utils/iranian-banks-react-icons',
  Vue: '@iran-utils/iranian-banks-vue-icons',
  Core: '@iran-utils/iranian-banks-icons-core',
} as const;
export type Framework = keyof typeof PACKAGES;

export function usageExample(framework: Framework) {
  const statement = `import { MellatColorIcon, MellatIcon } from '${PACKAGES[framework]}';`;
  if (framework === 'Vue') return `<script setup>\n${statement}\n</script>\n\n<template>\n  <MellatColorIcon :width="48" :height="48" />\n  <MellatIcon :width="48" :height="48" fill="#146c4a" />\n</template>`;
  if (framework === 'Core') return `${statement}\n\n// Framework-independent, trusted SVG data\nconst { viewBox, content } = MellatColorIcon;\nconst svg = \`<svg xmlns="http://www.w3.org/2000/svg"\n  viewBox="\${viewBox}" width="48" height="48">\n  \${content}\n</svg>\`;`;
  return `${statement}\n\nexport default function PaymentMethod() {\n  return (\n    <div>\n      <MellatColorIcon width={48} height={48} aria-label="Mellat" />\n      <MellatIcon width={48} height={48} fill="#146c4a" />\n    </div>\n  );\n}`;
}
