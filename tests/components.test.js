'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>');
for (const name of ['window', 'document', 'navigator', 'Node', 'Element', 'HTMLElement', 'SVGElement']) {
  Object.defineProperty(globalThis, name, { value: dom.window[name], configurable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { renderToStaticMarkup } = require('react-dom/server');
const Vue = require('vue');
const { renderToString } = require('@vue/server-renderer');
const core = require('../packages/core');
const react = require('../packages/react');
const vue = require('../packages/vue');
const { pixels } = require('../scripts/audit-images');

test('every React and Vue component server-renders its matching SVG data', async () => {
  for (const [name, data] of Object.entries(core)) {
    const reactMarkup = renderToStaticMarkup(React.createElement(react[name], { width: 32, height: 48, 'aria-label': name }));
    const vueMarkup = await renderToString(Vue.h(vue[name], { width: 32, height: 48, 'aria-label': name }));
    for (const markup of [reactMarkup, vueMarkup]) {
      const svg = new JSDOM(markup, { contentType: 'image/svg+xml' }).window.document.documentElement;
      assert.equal(svg.getAttribute('viewBox'), data.viewBox, name);
      assert.equal(svg.getAttribute('width'), '32', name);
      assert.equal(svg.getAttribute('height'), '48', name);
      assert.equal(svg.getAttribute('aria-label'), name);
      assert.equal(svg.innerHTML, new JSDOM(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${data.content}</svg>`, {contentType:'image/svg+xml'}).window.document.documentElement.innerHTML, name);
    }
    assert.equal(react[name].displayName, name);
    assert.equal(vue[name].name, name);
  }
});

test('React forwards SVG props, events, styles and refs through rerenders', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const ref = React.createRef();
  let clicks = 0;
  await React.act(() => root.render(React.createElement(react.MellatIcon, {
    ref, width: 48, height: 48, fill: 'red', className: 'bank', style: { opacity: 0.5 },
    role: 'img', 'aria-label': 'Mellat', 'data-bank': 'mellat', onClick: () => clicks++,
    dangerouslySetInnerHTML: { __html: '<script>bad</script>' },
  }, 'children must not replace artwork')));
  const svg = host.querySelector('svg');
  assert.equal(ref.current, svg);
  assert.equal(svg.getAttribute('fill'), 'red');
  assert.equal(svg.getAttribute('class'), 'bank');
  assert.equal(svg.style.opacity, '0.5');
  assert.equal(svg.getAttribute('aria-label'), 'Mellat');
  assert.equal(svg.dataset.bank, 'mellat');
  assert.ok(svg.querySelector('path'));
  assert.equal(svg.querySelector('script'), null);
  assert.doesNotMatch(svg.innerHTML, /children must/);
  svg.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(clicks, 1);
  await React.act(() => root.render(React.createElement(react.MellatIcon, { ref, width: 96, viewBox: '0 0 100 100' })));
  assert.equal(ref.current.getAttribute('width'), '96');
  assert.equal(ref.current.getAttribute('viewBox'), '0 0 100 100');
  await React.act(() => root.unmount());
  assert.equal(ref.current, null);
  host.remove();
});

test('Vue forwards reactive attrs, classes, styles and events to the SVG root', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const attrs = Vue.reactive({ width: 48, height: 48, fill: '#123456', class: 'bank', role: 'img', 'aria-label': 'Mellat' });
  let clicks = 0;
  const app = Vue.createApp({ render: () => Vue.h(vue.MellatIcon, { ...attrs, style: { opacity: 0.5 }, onClick: () => clicks++ }) });
  app.mount(host);
  const svg = host.querySelector('svg');
  assert.equal(host.children.length, 1);
  assert.equal(svg.getAttribute('class'), 'bank');
  assert.equal(svg.style.opacity, '0.5');
  assert.equal(svg.getAttribute('fill'), '#123456');
  assert.equal(svg.getAttribute('aria-label'), 'Mellat');
  svg.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(clicks, 1);
  attrs.width = 96;
  await Vue.nextTick();
  assert.equal(svg.getAttribute('width'), '96');
  assert.ok(svg.querySelector('path'));
  app.unmount();
  host.remove();
});

test('black monochrome icons inherit fill while the white reverse Maskan logo is preserved', async () => {
  for (const [name, data] of Object.entries(core).filter(([name]) => !name.endsWith('ColorIcon'))) {
    if (name === 'MaskanIcon') {
      assert.match(data.content, /fill="#fff"/);
      continue;
    }
    const red = await pixels(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${data.viewBox}" fill="#f00">${data.content}</svg>`, 48);
    let colored = 0;
    for (let i = 0; i < red.length; i += 3) if (red[i] > red[i + 1] + 30 && red[i] > red[i + 2] + 30) colored++;
    assert.ok(colored > 0, `${name} did not inherit a red fill`);
  }
});

test.after(() => dom.window.close());
