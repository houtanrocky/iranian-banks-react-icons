'use strict';
require('./lib/build').buildPackage('core').catch(error => { console.error(error); process.exitCode = 1; });
