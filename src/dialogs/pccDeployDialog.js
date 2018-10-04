import { WaterfallDialog } from 'botbuilder-dialogs';
import _ from 'lodash';

export const INTENT = 'Content Deployment';
export const DEPLOY_DIALOG_STATE = 'deployDialogState';

const ENTITY_BRANCH = 'branch';
const ENTITY_ENVIRONMENT = 'environment';

export function dialog(prompt, luisState) {
  async function step1(step) {
    const result = await luisState.get(step.context, {});
    step.context.sendActivity(`Entities: ${result}`);
    return step.prompt(prompt, 'What branch do you want to deploy?');
  }

  async function step2(step) {
    // access user input from previous step
    step.values[BRANCH] = step.result;

    // send a message to the user
    await step.prompt(prompt, 'Where do you want to deploy?');
  }

  async function step3(step) {
    await step.context.sendActivity(
      `Ok, I'll deploy the ${step.values[BRANCH]} branch to ${step.result}`,
    );
    return step.endDialog();
  }

  function getEntity(list, type) {
    const result = _.find(list, item => item.type === type);
    if (result) {
      return result.value;
    }
    return undefined;
  }

  return new WaterfallDialog(INTENT, [step1, step2, step3]);
}
