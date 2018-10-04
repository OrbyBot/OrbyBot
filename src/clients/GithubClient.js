const octokit = require('@octokit/rest')();
octokit.authenticate({
  type: 'token',
  token: process.env.GITHUB_TOKEN,
});

async function getRepo(owner = 'OrbyBot', repo = 'OrbyBot') {
  const response = await octokit.repos.get({
    owner,
    repo,
  });

  return response.data.full_name;
}

async function _searchIssues(owner, type = 'issues', other = '') {
  const user = owner ? `user:${owner}` : '';
  const q = `state:open type:${type} ${user} ${other}`;
  const result = await octokit.search.issues({ q });

  const issues = [];
  result.data.items.forEach(issue => {
    const { title, body: description, number, html_url: link } = issue;
    issues.push({ title, description, number, link });
  });

  return issues;
}

async function getAssignedIssues(owner) {
  return _searchIssues(owner, 'issues');
}

async function getAssignedPullRequests(owner) {
  return _searchIssues(owner, 'pr');
}

async function getRequestedPullRequests(owner) {
  // we call with no owner b/c we are reviewing someone elses PR
  return _searchIssues('', 'pr', `review-requested:${owner}`);
}

module.exports = {
  getRepo,
  getAssignedIssues,
  getAssignedPullRequests,
  getRequestedPullRequests,
};
