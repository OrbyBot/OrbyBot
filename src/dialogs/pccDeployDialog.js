import { WaterfallDialog } from 'botbuilder-dialogs';
import ServiceNow from '../clients/serviceNowClient';

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

    console.log(`found luis entity: ${branch}`);
    step.values[ENTITY_BRANCH] = branch;
    return step.next();
  }

  async function branchCapture(step) {
    if (step.values[ENTITY_BRANCH] === undefined) {
      step.values[ENTITY_BRANCH] = step.result;
      console.log(`seting branch to ${step.result}`);
    }
    return step.next();
  }

  async function environmentStep(step) {
    const state = await luisState.get(step.context, {});
    const environment = getEntity(state, ENTITY_ENVIRONMENT);
    if (environment === undefined) {
      return step.prompt(prompt, 'Where do you want to deploy?');
    }
    console.log(`found luis entity: ${environment}`);
    step.values[ENTITY_ENVIRONMENT] = environment;

    return step.next();
  }

  async function environmentCapture(step) {
    if (step.values[ENTITY_ENVIRONMENT] === undefined) {
      step.values[ENTITY_ENVIRONMENT] = step.result;
      console.log(`seting environment to ${step.result}`);
    }
    return step.next();
  }

  async function dialogCompleteStep(step) {
    const environment = step.values[ENTITY_ENVIRONMENT];
    const branch = step.values[ENTITY_BRANCH];

    if (environment && environment.indexOf('prod') > 1) {
      const number = await createNewTask(branch, environment);

      step.context.sendActivity(
        `Ok, I've opened up a ticket ${number} to deploy the ${branch} branch to ${environment}`,
      );
    } else {
      step.context.sendActivity(
        `Ok, I went ahead and deployed the ${branch} branch to ${environment}`,
      );
    }

    return step.endDialog();
  }

  async function createNewTask(branch, environment) {
    const data = {
      short_description: 'Deploy static content',
      description: `Deploy the ${branch} to ${environment} environment`,
      urgency: '1',
      priority: '3',
      assignment_group: 'Software',
      category: 'Software',
    };

    return new Promise(resolve => {
      ServiceNow.createNewTask(data, 'change_request', res => {
        resolve(res.number);
      });
    });
  }

  return new WaterfallDialog(INTENT, [
    branchStep,
    branchCapture,
    environmentStep,
    environmentCapture,
    dialogCompleteStep,
  ]);
}
