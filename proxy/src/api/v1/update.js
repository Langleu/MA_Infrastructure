const Router = require('@koa/router');
const router = new Router({prefix: '/v1/update'});

const Grakn = require('./../../database/grakn/index');
const grakn = new Grakn('docker');
const Queue = require('./../../queue/index');

(async () => {
  await grakn.openSession();
})();

router.post('/', async (ctx, next) => {
  const { id, rid, score, executable } = ctx.request.body;

  let uScore = parseInt(score * 100);
  let uExecutable = (executable) ? 1 : 0;

  await grakn.updateDeployment(id, rid, uScore, uExecutable);

  Queue.deleteProgressEntry(id);
  
  ctx.body = {
    status: 200,
    msg: `${rid} has been updated with score ${score}`
  };
});

router.post('/remove', async (ctx, next) => {
  const { id, rid } = ctx.request.body;

  Queue.deleteProgressEntry(id);
  
  ctx.body = {
    status: 200,
    msg: `${rid} has been removed from the queue!`
  };
});

module.exports = router;
