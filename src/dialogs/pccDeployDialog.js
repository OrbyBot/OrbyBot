import { WaterfallDialog } from 'botbuilder-dialogs';
import _ from 'lodash';

export const INTENT = 'Content Deployment';
export const DEPLOY_DIALOG_STATE = 'deployDialogState';

const ENTITY_BRANCH = 'branch';
const ENTITY_ENVIRONMENT = 'environment';

export function dialog(prompt, luisState) {
  async function step1(step) {
    const result = await luisState.get(step.context, {});

    const branch = getEntity(result, 'branch');

    step.context.sendActivity(`I see you want to push to ${branch}`);
    step.context.sendActivity(`Entities: ${JSON.stringify(result)}`);
    step.next(2);
  }

  async function branchStep(step) {
    return step.prompt(prompt, 'What branch do you want to deploy?');
  }

  async function destinationStep(step) {
    return step.prompt(prompt, 'Where do you want to deploy?');
  }

  // async function step2(step) {
  //   // access user input from previous step
  //   step.values[BRANCH] = step.result;

  //   // send a message to the user
  //   await step.prompt(prompt, 'Where do you want to deploy?');
  // }

  async function dialogCompleteStep(step) {
    await step.context.sendActivity(
      `Ok, I'll deploy the ${step.values[BRANCH]} branch to ${step.result}`,
    );
    return step.endDialog();
  }

  function getEntity(list, type) {
    const result = _.find(list, item => item.type === type);
    if (result) {
      return result.entity;
    }
    return undefined;
  }

  return new WaterfallDialog(INTENT, [
    step1,
    branchStep,
    destinationStep,
    dialogCompleteStep,
  ]);
}
