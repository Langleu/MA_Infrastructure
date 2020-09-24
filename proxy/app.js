const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();
const port = process.env.PORT || 9889;

const server = app.listen(port);

const router = require('./src/api/index');
app.use(koaBody());
app.use(router());

console.info(`The server was started on port: ${port}`);

//require('./src/inserter/index');

module.exports = {server};
