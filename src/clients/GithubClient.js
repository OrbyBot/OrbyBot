import {request} from 'request';

export default class gitHubClient {
  constructor(url: 'https://api.github.com/graphql') {
    this.url = url;
  }

  query(query = {}) {
    // Default options are marked with *

    request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
    return fetch(this.url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: {
        query,
      },
    }).then(response => response.json()); // parses response to JSON
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
