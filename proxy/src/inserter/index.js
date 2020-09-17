const axios = require('axios');

axios.defaults.baseURL = process.env.JENKINS_URL || 'http://localhost:9888';

const Queue = require('./../queue/index');
const Grakn = require('./../database/grakn/index');
const grakn = new Grakn('docker');

const query = "match $deployment isa deployment, has rid $rid, has rawUrl $rawUrl, has name $name, has executable $executable, has score $score; $score < 0; get; limit 100;"

const fillQueue = async () => {
  await grakn.openSession();
  const results = await grakn.runQuery(query);
  await grakn.closeSession();

  Queue.concat(results);
}

const extractGitHubInfos = (url) => {
  const splits = url.split('/');
  return {
    clone: `https://github.com/${splits[3]}/${splits[4]}.git`,
    path: splits.slice(6,splits.length).join('/')
  }
}

const triggerBuild = async () => {
  if (Queue.lengthProgress() > 10) return;

  const item = Queue.getRandom();
  if (!item) return;

  const params = {...item, ...extractGitHubInfos(item.rawUrl)};

  delete params.rawUrl;
  delete params.executable;
  delete params.score;

  const queryString = Object.keys(params).map(key => key.toUpperCase() + '=' + params[key]).join('&');
  await axios.post(`/job/compose-pipeline/buildWithParameters?${queryString}`, {});
}

// TODO: run tests with good interval values
setInterval(fillQueue, 30000);
setInterval(triggerBuild, 2000);
