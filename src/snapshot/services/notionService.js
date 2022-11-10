const { Client } = require("@notionhq/client");

class NotionService {
  constructor(token, database_id) {
    this.client = new Client({
      auth: token,
    });

    this.database_id = database_id;
  }

  async getDatabaseProps() {
    const { properties } = await this.client.databases.retrieve({
      database_id: this.database_id,
    });

    return properties;
  }

  async getDatabaseItems(params = {}) {
    const { results } = await this.client.databases.query({
      database_id: this.database_id,
      ...params,
    });

    return results;
  }
}

module.exports = NotionService;
