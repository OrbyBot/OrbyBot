const rp = require('request-promise');

export default class gitHubClient {
  constructor(url) {
    console.log('Constructor');
    this.url = url || 'https://mapi.discoverbank.com/api/index.json';
    console.log('URL: ', this.url);
  }

  query(query = {}) {
    return rp.get({
      uri: this.url,
    });
    // return rp
    //   .get({
    //     uri: this.url,
    //     cache: 'no-cache',
    //     // headers: {
    //     //   Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    //     // },
    //     // body: {
    //     //   query,
    //     // },
    //   })
    //   .then(r => console.log(r));
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
