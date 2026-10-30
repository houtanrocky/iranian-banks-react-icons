'use strict';
module.exports = {
  multipass: true,
  floatPrecision: 4,
  js2svg: { pretty: false },
  plugins: [
    { name: 'preset-default' },
    'removeScripts',
    'removeDimensions',
    { name: 'prefixIds', params: { prefix: (_, info) => info.path.replace(/\.svg$/i, '').replace(/[^a-z0-9-]/gi, '-') } },
  ],
};
