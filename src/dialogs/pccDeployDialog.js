import { WaterfallDialog } from 'botbuilder-dialogs';
import { getEntity, updateState } from '../entityUtils';

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
    return step.next(2);
  }

  async function branchCapture(step) {
    const result = step.result.value;
    const state = await luisState.get(step.context, {});
    luisState.set(updateState(state, result, ENTITY_BRANCH));
    return step.next();
  }

  async function destinationStep(step) {
    const state = await luisState.get(step.context, {});
    const environment = getEntity(state, ENTITY_ENVIRONMENT);
    if (environment === undefined) {
      return step.prompt(prompt, 'Where do you want to deploy?');
    }
    return step.next(2);
  }

  async function destinationCapture(step) {
    const result = step.result.value;
    const state = await luisState.get(step.context, {});
    luisState.set(updateState(state, result, ENTITY_ENVIRONMENT));
    return step.next();
  }

  async function dialogCompleteStep(step) {
    const state = await luisState.get(step.context, {});
    const branch = getEntity(state, ENTITY_BRANCH);
    const environment = getEntity(state, ENTITY_ENVIRONMENT);
    await step.context.sendActivity(
      `Ok, I'll deploy the ${branch} branch to ${environment}`,
    );
    return step.endDialog();
  }

  return new WaterfallDialog(INTENT, [
    branchStep,
    branchCapture,
    destinationStep,
    destinationCapture,
    dialogCompleteStep,
  ]);
}
