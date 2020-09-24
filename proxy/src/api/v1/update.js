const Router = require('@koa/router');
const router = new Router({prefix: '/v1/update'});

const Grakn = require('./../../database/grakn/index');
const grakn = new Grakn('docker');
const Queue = require('./../../queue/index');

router.post('/', async (ctx, next) => {
  const { ID, RID, SCORE, EXECUTABLE } = ctx.request.body;

  await grakn.updateDeployment(ID, RID, SCORE, EXECUTABLE);

  Queue.deleteProgressEntry(ID);
  
  ctx.body = {
    status: 200,
    msg: `${RID} has been updated with score ${SCORE}`
  };
});

module.exports = router;
