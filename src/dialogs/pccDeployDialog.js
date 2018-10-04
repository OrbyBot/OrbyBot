// import ServiceNow from '../clients/serviceNowClient';

// const data = {
//   short_description: 'Deploy static content',
//   description: 'Deploy content from 19.2 to Prod',
//   urgency: '1',
//   priority: '3',
//   assignment_group: 'Software',
//   category: 'Software',
// };

// ServiceNow.createNewTask(data, 'change_request', res => {
//   console.log(res);
// });

import { WaterfallDialog } from 'botbuilder-dialogs';
import { getEntity } from '../entityUtils';

export const INTENT = 'Content Deployment';
export const DEPLOY_DIALOG_STATE = 'deployDialogState';

const ENTITY_BRANCH = 'branch';
const ENTITY_ENVIRONMENT = 'environment';

export function dialog(prompt, luisState) {
  async function branchStep(step) {
    const state = await luisState.get(step.context, {});
    const branch = getEntity(state, ENTITY_BRANCH);
    if (branch === undefined) {
      return step.prompt(prompt, 'What branch do you want to deploy?');
    }

    step.values[ENTITY_BRANCH] = branch;
    return step.next(2);
  }

  async function branchCapture(step) {
    step.values[ENTITY_BRANCH] = step.result;
    console.log(`set ${step.result}`);
    return step.next();
  }

  async function environmentStep(step) {
    const state = await luisState.get(step.context, {});
    const environment = getEntity(state, ENTITY_ENVIRONMENT);
    if (environment === undefined) {
      return step.prompt(prompt, 'Where do you want to deploy?');
    }
    step.values[ENTITY_ENVIRONMENT];

    return step.next(2);
  }

  async function environmentCapture(step) {
    step.values[ENTITY_ENVIRONMENT] = step.result;
    console.log(`set ${step.result}`);
    return step.next();
  }

  async function dialogCompleteStep(step) {
    const environment = step.values[ENTITY_ENVIRONMENT];
    const branch = step.values[ENTITY_BRANCH];

    await step.context.sendActivity(
      `Ok, I'll deploy the ${branch} branch to ${environment}`,
    );
    return step.endDialog();
  }

  return new WaterfallDialog(INTENT, [
    branchStep,
    branchCapture,
    environmentStep,
    environmentCapture,
    dialogCompleteStep,
  ]);
}
