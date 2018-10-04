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
import _ from 'lodash';

export const INTENT = 'Content Deployment';
export const DEPLOY_DIALOG_STATE = 'deployDialogState';

const ENTITY_BRANCH = 'branch';
const ENTITY_ENVIRONMENT = 'environment';

export function dialog(prompt, luisState) {
  async function step1(step) {
    const result = await luisState.get(step.context, {});

    const branch = getEntity(result, ENTITY_BRANCH);

    step.context.sendActivity(`I see you want to push to ${branch}`);
    step.context.sendActivity(`Entities: ${JSON.stringify(result)}`);
    step.next();
  }

  async function branchStep(step) {
    const result = await luisState.get(step.context, {});
    const branch = getEntity(result, ENTITY_BRANCH);
    if (branch === undefined) {
      return step.prompt(prompt, 'What branch do you want to deploy?');
    }
    return step.next();
  }

  async function branchCapture(step) {
    const result = step.result.value;
    console.log(`answered ${result}`);
    // TODO save this
    return step.next();
  }

  async function destinationStep(step) {
    const result = await luisState.get(step.context, {});
    const environment = getEntity(result, ENTITY_ENVIRONMENT);
    if (environment === undefined) {
      return step.prompt(prompt, 'Where do you want to deploy?');
    }
    return step.next(2);
  }

  async function destinationCapture(step) {
    const result = step.result.value;
    console.log(`answered ${result}`);
    // TODO save this
    return step.next();
  }

  async function dialogCompleteStep(step) {
    const result = await luisState.get(step.context, {});
    const branch = getEntity(result, ENTITY_BRANCH);
    const environment = getEntity(result, ENTITY_ENVIRONMENT);
    await step.context.sendActivity(
      `Ok, I'll deploy the ${branch} branch to ${environment}`,
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
    branchCapture,
    destinationStep,
    destinationCapture,
    dialogCompleteStep,
  ]);
}
