const axios = require('axios');

axios.defaults.baseURL = process.env.JENKINS_URL || 'http://localhost:9888';

const Queue = require('./../queue/index');
const Grakn = require('./../database/grakn/index');
const grakn = new Grakn('docker');

var limit = process.env.LIMIT || 20;

const query = "match $deployment isa deployment, has rid $rid, has rawUrl $rawUrl, has name $name, has executable $executable, has score $score; $score < 0; get; limit 300;"

const fillQueue = async () => {
  if (Queue.lengthStorage() > 100) return;

  await grakn.openSession();
  const results = await grakn.runQuery(query);
  await grakn.closeSession();

  Queue.concat(results);
}

const extractGitHubInfos = (url) => {
  const splits = url.split('/');

  return {
    clone: `https://github.com/${splits[3]}/${splits[4]}.git`,
    compose_path: splits.slice(6,splits.length-1).join('/')
  }
}

const triggerBuild = async () => {
  if (Queue.lengthProgress() > limit || Queue.lengthStorage == 0) return;

  const item = Queue.getRandom();
  if (!item) return;

  const params = {...item, ...extractGitHubInfos(item.rawUrl)};

  delete params.rawUrl;
  delete params.executable;
  delete params.score;

  params.BASE_URL = process.env.SELF || 'localhost:9889';

  const queryString = Object.keys(params).map(key => key.toUpperCase() + '=' + params[key]).join('&');
  await axios.post(`/job/compose-pipeline/buildWithParameters?${queryString}`, {});
}

// agents like to not start up and thereby block the queue
const increaseLimit = () => {
  limit = limit + 2;
  console.log(`limit is currently at ${limit}`);
}

setInterval(fillQueue, 30000);
setInterval(triggerBuild, 2000);
setInterval(increaseLimit, 3600000);
