const Router = require('@koa/router');
const router = new Router({prefix: '/v1/update'});

const Queue = require('./../../queue/index');

router.post('/', async (ctx, next) => {
  // update GRAKN entry
  // used by the jenkins instance to update executable and score of an entry
  // Queue remove progress entry
});

module.exports = router;
