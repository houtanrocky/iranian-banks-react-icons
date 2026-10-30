import { useMemo, useState } from 'react';
import { ICONS, CATEGORIES, type Category } from './icons';
import { filterIcons, type ViewMode } from './search';
import { PACKAGES, REPOSITORY_URL, usageExample, type Framework } from './site';
import { IconCard, iconUrl } from './components/IconCard';
import { useClipboard } from './useClipboard';
import './App.css';

const featured = ['Mellat', 'Saman', 'Pasargad', 'BluBank', 'Parsian', 'Zarrinpal', 'Saderat', 'Digipay', 'Tejarat'];
const countByCategory = Object.fromEntries(CATEGORIES.map(category => [category.id,
  category.id === 'all' ? ICONS.length : ICONS.filter(icon => icon.category === category.id).length]));

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [size, setSize] = useState(48);
  const [mode, setMode] = useState<ViewMode>('both');
  const [framework, setFramework] = useState<Framework>('React');
  const { copy, message } = useClipboard();
  const filtered = useMemo(() => filterIcons(search, category, mode), [search, category, mode]);
  const install = `npm install ${PACKAGES[framework]}`;
  const example = usageExample(framework);

  return <div className="app">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="topbar wrap">
      <a className="brand" href="#" aria-label="Iranian Banks Icons home">
        <span className="brand-mark" aria-hidden="true">▥</span> iranian banks<span className="brand-suffix"> / icons</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#icons">Icon library</a><a href="#usage">Quick start</a>
        <a href={REPOSITORY_URL}>GitHub <span aria-hidden="true">↗</span></a>
      </nav>
    </header>

    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> OPEN SOURCE · MIT LICENSE</p>
          <h1 id="hero-title">Iranian bank icons.<br /><span>Ready for your next build.</span></h1>
          <p className="hero-description">The familiar details that make a payment experience feel right.
            SVG logos for Iranian banks and payment providers, for React, Vue, and any web framework.</p>
          <div className="hero-actions"><a className="primary-button" href="#icons">Explore the icons <span aria-hidden="true">↓</span></a>
            <a className="text-link" href="#usage">Get started in minutes ↗</a></div>
          <p className="hero-note">59 providers <span>·</span> 117 SVG variants <span>·</span> TypeScript included</p>
        </div>
        <div className="hero-art" aria-label="A selection of included bank and payment logos">
          <div className="logo-mosaic">{featured.map((key, index) => <div className={`mosaic-tile tile-${index}`} key={key}>
            <img src={iconUrl(`${key}ColorIcon`)} alt={key} width="58" height="58" loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
          </div>)}</div>
          <span className="art-caption">LOCAL IDENTITIES. UNIVERSAL SVG.</span>
        </div>
      </section>

      <div className="feature-strip"><div className="wrap"><span>Made for your stack</span>
        <strong>React 16–19</strong><strong>Vue 3</strong><strong>Plain SVG data</strong><span>Color & monochrome</span></div></div>

      <section id="icons" className="library wrap" aria-labelledby="library-title">
        <div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p>
          <h2 id="library-title">Find a familiar face.</h2></div>
          <p>Choose a logo. Copy its import. Make it yours.</p></div>
        <div className="library-toolbar">
          <div className="search-field"><label className="sr-only" htmlFor="icon-search">Search icons</label>
            <span aria-hidden="true">⌕</span><input id="icon-search" type="search" placeholder="Search banks, payments… / جستجو"
              value={search} onChange={event => setSearch(event.target.value)} /></div>
          <div className="option-group"><label htmlFor="icon-size">Size <output>{size}px</output></label>
            <input id="icon-size" type="range" min="24" max="96" step="8" value={size}
              onChange={event => setSize(Number(event.target.value))} /></div>
          <div className="toggle-group" role="group" aria-label="Icon variant">
            {(['both', 'color', 'mono'] as ViewMode[]).map(value => <button key={value} aria-pressed={mode === value}
              onClick={() => setMode(value)}>{value === 'both' ? 'Both' : value === 'color' ? 'Color' : 'Mono'}</button>)}
          </div>
        </div>
        <div className="category-tabs" role="group" aria-label="Icon category">
          {CATEGORIES.map(value => <button key={value.id} aria-pressed={category === value.id}
            onClick={() => setCategory(value.id)}>{value.label}<span>{countByCategory[value.id]}</span></button>)}
        </div>
        <div className="results-bar"><p aria-live="polite">{filtered.length} {filtered.length === 1 ? 'provider' : 'providers'}
          {search && <> matching “{search.trim()}”</>}</p><span>Click to copy {framework} imports ↗</span></div>
        {filtered.length ? <div className="icon-grid">{filtered.map(entry => <IconCard key={entry.key} entry={entry}
          size={size} mode={mode} framework={framework} onCopy={copy} />)}</div>
          : <div className="empty"><h3>No matching icons</h3><p>Try a bank name in English or Persian, or choose another category.</p>
            <button onClick={() => { setSearch(''); setCategory('all'); setMode('both'); }}>Reset filters</button></div>}
        <p className="collection-note">Includes historical and merged institutions for existing integrations. SnappPay has a color variant only.</p>
      </section>

      <section id="usage" className="quickstart wrap" aria-labelledby="usage-title">
        <div className="quickstart-copy"><p className="eyebrow">SMALL DETAILS. SIMPLE INTEGRATION.</p>
          <h2 id="usage-title">Your stack.<br />Your bank icons.</h2>
          <p>Install the package for your framework. Import only the icons you need, set their size, and pass your usual SVG attributes.</p>
          <ul className="check-list"><li>Named imports with support for tree shaking</li><li>TypeScript declarations in every package</li>
            <li>React refs and Vue attribute forwarding</li><li>ES modules and CommonJS builds</li></ul>
          <a className="text-link" href={`${REPOSITORY_URL}#readme`}>Read the full documentation ↗</a>
        </div>
        <div className="code-panel"><div className="code-tabs" role="group" aria-label="Framework">
          {(Object.keys(PACKAGES) as Framework[]).map(value => <button key={value} aria-pressed={framework === value}
            onClick={() => setFramework(value)}>{value === 'Core' ? 'Core / SVG' : value}</button>)}
          <a href={`https://www.npmjs.com/package/${PACKAGES[framework]}`} aria-label={`${framework} package on npm`}>npm ↗</a></div>
          <div className="install-box"><code tabIndex={0}>{install}</code><button onClick={() => void copy(install)} aria-label="Copy install command">Copy</button></div>
          <pre tabIndex={0} aria-label={`${framework} usage example`}><code>{example}</code></pre>
          <button className="copy-example" onClick={() => void copy(example)}>Copy example ↗</button>
        </div>
      </section>

      <section id="faq" className="faq wrap" aria-labelledby="faq-title"><p className="eyebrow">A FEW USEFUL DETAILS</p>
        <h2 id="faq-title">Before you ship.</h2>
        <details><summary>How do I change an icon’s color?</summary><p>Use a monochrome export such as MellatIcon and pass fill="currentColor" to inherit your text color, or set a specific fill. Color exports keep their original palette. MaskanIcon is a white reverse logo for dark backgrounds; its white fill is preserved.</p></details>
        <details><summary>Can I use this without React or Vue?</summary><p>Yes. The core package exports viewBox and content strings. Use them to render SVGs in Svelte, Angular, Web Components, or any other framework.</p></details>
        <details><summary>Are all icons the same size?</summary><p>Every SVG preserves its viewBox and scales to the width and height you supply. Some detailed logos are larger downloads; import individual icons and avoid loading the entire library.</p></details>
        <details><summary>What about accessibility and brand rights?</summary><p>Give meaningful logos a role="img" and an aria-label, or hide decorative icons with aria-hidden="true". The code is MIT licensed. Bank names and logos belong to their respective owners; this project is not affiliated with them.</p></details>
        <details><summary>Missing a bank or payment provider?</summary><p>Contributions are welcome. <a href={`${REPOSITORY_URL}/issues/new?template=icon-request.yml`}>Request an icon</a> or add source SVGs and open a pull request. Please include both color and monochrome variants when available.</p></details>
      </section>
      <section className="contribute wrap"><div><p className="eyebrow">BUILT IN THE OPEN</p><h2>A useful little library.<br />Better with your contribution.</h2></div>
        <a className="primary-button" href={REPOSITORY_URL}>Explore the repository ↗</a></section>
    </main>
    <footer className="footer wrap"><span>Iranian Banks Icons · MIT License</span><p lang="fa" dir="rtl">آیکون بانک‌ها و پرداخت‌یارهای ایرانی</p>
      <a href={`${import.meta.env.BASE_URL}sitemap.xml`}>Sitemap</a><a href="https://github.com/houtanrocky">By Houtan Rocky ↗</a></footer>
    <div className={`toast${message ? ' toast-visible' : ''}`} role="status" aria-label="Clipboard feedback" aria-live="polite" aria-atomic="true">{message}</div>
  </div>;
}
