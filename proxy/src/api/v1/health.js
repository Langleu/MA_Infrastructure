const Router = require('@koa/router');
const router = new Router({prefix: '/v1/health'});

router.get('/', async (ctx, next) => {
  ctx.body = {
    status: '200',
    msg: 'ok',
  };
});

module.exports = router;
