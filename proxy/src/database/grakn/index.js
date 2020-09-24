const GraknClient = require('grakn-client');

class Grakn {

  constructor(keyspace) {
    this.keyspace = keyspace;
    this.client = null;
    this.session = null;
  }

  async openSession () {
    this.client = new GraknClient(process.env.GRAKNURI || 'localhost:48555');
    this.session = await this.client.session(this.keyspace);
  };

  async closeSession() {
    await this.session.close();
    this.client.close();
  }

  async updateDeployment(ID, RID, SCORE, EXECUTABLE) {
    await this.openSession();
    await this.writeQuery(`match $deployment isa deployment, has rid "${RID}", has score $score; delete $deployment has score $score;`);
    await this.writeQuery(`match $deployment isa deployment, has rid "${RID}", has executable $executable; delete $deployment has executable $executable;`);
    await this.writeQuery(`match $deployment isa deployment, has rid "${RID}"; insert $deployment has score ${SCORE};`);
    await this.writeQuery(`match $deployment isa deployment, has rid "${RID}"; insert $deployment has executable ${EXECUTABLE};`);
    await this.closeSession();
  }

  graknMapToJSON = (map) => {
    const objects = Object.fromEntries(map);
    const temp = {};

    for (const [key, value] of Object.entries(objects)) {
      if (value.baseType === 'ENTITY') {
        temp.id = value.id;
      } else if (value.baseType === 'ATTRIBUTE') {
        temp[key] = value._value;
      }
    }

    return temp;
  };

  graknToJSON = (array) => {
    const results = [];
    array.forEach(async (answer) => {
      results.push(this.graknMapToJSON(answer.map()));
    });
    return results;
  };

  async writeQuery(query) {
    const writeTransaction = await this.session.transaction().write();
    await writeTransaction.query(query);
    await writeTransaction.commit();
  }

  async runQuery(query) {
    const transaction = await this.session.transaction().read();
    const iterator = await transaction.query(query);
    const answers = await iterator.collect();
    await transaction.close();

    return this.graknToJSON(answers);
  }

}

module.exports = Grakn;
