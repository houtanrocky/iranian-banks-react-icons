'use strict';
require('./lib/build').buildPackage('vue').catch(error => { console.error(error); process.exitCode = 1; });
