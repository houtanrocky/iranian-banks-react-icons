'use strict';
require('./lib/build').buildPackage('react').catch(error => { console.error(error); process.exitCode = 1; });
