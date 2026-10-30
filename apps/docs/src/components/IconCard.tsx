import { memo } from 'react';
import files from '../../../../packages/core/dist/manifest.json';
import type { IconEntry } from '../icons';
import type { ViewMode } from '../search';
import { PACKAGES, type Framework } from '../site';

export function iconUrl(name: string) {
  return `${import.meta.env.BASE_URL}icons/${encodeURIComponent((files as Record<string, string>)[name])}`;
}

export const IconCard = memo(function IconCard({ entry, size, mode, framework, onCopy }: {
  entry: IconEntry; size: number; mode: ViewMode; framework: Framework;
  onCopy: (text: string) => Promise<void>;
}) {
  const names = mode === 'mono' ? [entry.monoIcon!] : mode === 'color' || !entry.monoIcon
    ? [entry.colorIcon] : [entry.colorIcon, entry.monoIcon];
  const statement = `import { ${names.join(', ')} } from '${PACKAGES[framework]}';`;
  return <button className="icon-card" onClick={() => void onCopy(statement)}
    aria-label={`Copy ${entry.displayName} ${framework} import`} title={statement}>
    <span className="icon-card-icons" style={{ minHeight: Math.max(size, 64) }}>
      {names.map(name => <img key={name} src={iconUrl(name)} width={size} height={size} className={name === 'MaskanIcon' ? 'reverse-logo' : undefined}
        loading="lazy" decoding="async" alt="" />)}
    </span>
    <span className="icon-card-name">{entry.displayName}</span>
    <span className="icon-card-key">{names[0]}</span>
    <span className="card-action" aria-hidden="true">Copy import ↗</span>
  </button>;
});
