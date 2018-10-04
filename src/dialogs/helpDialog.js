// @todo
import { WaterfallDialog } from 'botbuilder-dialogs';

export const INTENT = 'HELP';

async function step1(step) {
  // access user input from previous step
  // send a message to the user
  await step.context.sendActivity(`You mean you don't have all the answers?`);

  // OR end
  return step.endDialog();
}

export const dialog = new WaterfallDialog(INTENT, [step1]);
