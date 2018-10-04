const rp = require('request-promise');

export default class gitHubClient {
  constructor(url: 'https://api.github.com/graphql') {
    this.url = url;
  }

  async query(query = {}) {
    return rp
      .post({
        url: this.url,
        cache: 'no-cache',
        headers: {
          Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
        },
        body: {
          query,
        },
      })
      .promise();
  }

  mutation(mutation = {}) {
    // Default options are marked with *
    return fetch(this.url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: {
        mutation,
      },
    }).then(response => response.json()); // parses response to JSON
  }
}
