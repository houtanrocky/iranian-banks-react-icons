import { h } from 'vue';
import { MelliColorIcon, type IconProps } from '../../packages/vue';
const attrs: IconProps = { width: 48, height: 48, fill: 'red', 'aria-label': 'Melli', onClick: () => {} };
const icon = h(MelliColorIcon, attrs);
void icon;
