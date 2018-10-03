import { WaterfallDialog } from 'botbuilder-dialogs';

export const DIALOG_ONE = 'test';

export default function(prompt) {
  async function step1(step) {
    return step.prompt(prompt, 'What is your name?');
  }

  async function step2(step) {
    // access user input from previous step
    const lastStepAnswer = step.result;
    console.log('Last answer: ', lastStepAnswer);

    // send a message to the user
    await step.context.sendActivity(`Thanks ${lastStepAnswer}`);

    // OR end
    return step.endDialog();
  }
  return new WaterfallDialog(DIALOG_ONE, [step1, step2]);
}
