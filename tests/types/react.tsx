import { createRef, type ComponentProps } from 'react';
import { MelliColorIcon, MellatIcon, type IconProps } from '../../packages/react';

const ref = createRef<SVGSVGElement>();
const props: IconProps = { width: 48, height: '2em', fill: 'currentColor', role: 'img', 'aria-label': 'Melli' };
const icon = <MelliColorIcon {...props} ref={ref} onClick={event => event.currentTarget.focus()} />;
const callback = <MellatIcon ref={node => { if (node) node.setAttribute('data-ready', 'true'); }} />;
const inferred: ComponentProps<typeof MellatIcon> = { ref, className: 'bank' };
// @ts-expect-error SVG refs must reference SVG elements, not HTML elements.
const invalidRef = <MelliColorIcon ref={createRef<HTMLDivElement>()} />;
// @ts-expect-error Invalid SVG event handler.
const invalidHandler = <MellatIcon onClick="click" />;
void [icon, callback, inferred, invalidRef, invalidHandler];
