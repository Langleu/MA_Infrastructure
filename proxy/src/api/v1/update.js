const Router = require('@koa/router');
const router = new Router({prefix: '/v1/update'});

const Grakn = require('./../../database/grakn/index');
const grakn = new Grakn('docker');
const Queue = require('./../../queue/index');

router.post('/', async (ctx, next) => {
  const { id, rid, score, executable } = ctx.request.body;

  await grakn.updateDeployment(id, rid, score, executable);

  Queue.deleteProgressEntry(id);
  
  ctx.body = {
    status: 200,
    msg: `${rid} has been updated with score ${score}`
  };
});

module.exports = router;
