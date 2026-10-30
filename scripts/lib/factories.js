'use strict';

// These functions are serialized into both module formats. Keep them self-contained.
function createReactIcon(data, name) {
  var Icon = React.forwardRef(function (props, ref) {
    var rest = Object.assign({}, props);
    delete rest.children;
    return React.createElement('svg', Object.assign({
      ref: ref, viewBox: data.viewBox, xmlns: 'http://www.w3.org/2000/svg', xmlnsXlink: 'http://www.w3.org/1999/xlink',
    }, rest, { dangerouslySetInnerHTML: { __html: data.content } }));
  });
  Icon.displayName = name;
  return Icon;
}

function createVueIcon(data, name) {
  return Vue.defineComponent({
    name: name,
    inheritAttrs: false,
    setup: function (_, context) {
      return function () {
        return Vue.h('svg', Object.assign({
          viewBox: data.viewBox, xmlns: 'http://www.w3.org/2000/svg', 'xmlns:xlink': 'http://www.w3.org/1999/xlink', innerHTML: data.content,
        }, context.attrs));
      };
    },
  });
}

module.exports = { createReactIcon, createVueIcon };
