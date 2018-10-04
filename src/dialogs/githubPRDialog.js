import { WaterfallDialog } from 'botbuilder-dialogs';
import { getRequestedPullRequests } from '../clients/GithubClient';
import { getEntity } from '../entityUtils';

export const INTENT = 'Get PRs';
const ENTITY_USER = 'user';

export function dialog(luisState) {
  async function step1(step) {
    const result = await luisState.get(step.context, {});
    const user = getEntity(result, ENTITY_USER);

    if (!user) {
      // TODO probably should ask for the user here instead of failing
      await step.context.sendActivity('No user was given. Please try again!');
      return step.endDialog();
    }

    const issues = await getRequestedPullRequests(user);
    if (issues.length > 0) {
      let issueActivity = '';
      issues.forEach(issue => {
        const title =
          issue.title.length > 22
            ? `${issue.title.substring(0, 22)}...`
            : issue.title;

        const description =
          issue.description.length > 22
            ? `${issue.description.substring(0, 22)}...`
            : issue.description;

        issueActivity += `([#${issue.number}](${
          issue.link
        }))${title}: ${description}\n`;
      });
      await step.context.sendActivity(issueActivity);
    } else {
      await step.context.sendActivity(`${user} has no assigned issues open!!`);
    }

    return step.endDialog();
  }

  return new WaterfallDialog(INTENT, [step1]);
}
