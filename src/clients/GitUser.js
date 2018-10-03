import GitHubClient from './GithubClient';

export default class GitUser extends GitHubClient {
  getUser() {
    return this.query({});
  }
}
