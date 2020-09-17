const combineRouters = require('koa-combine-routers');

// actual routes
const healthV1 = require('./v1/health');
const updateV1 = require('./v1/update');

const routes = [
  healthV1,
  updateV1,
];

module.exports = combineRouters(routes);
