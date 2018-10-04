// @todo

/**
 * Possible intents
 * Show me my defects
 * Display defects assigned to me
 * Show me all of Bill's defects
 * Show me the bugs
 */

import { WaterfallDialog } from 'botbuilder-dialogs';
import Timeout from 'await-timeout';

export const INTENT = 'Get Defects';

function generateMockResponse() {
  const link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  let result = '';
  for (let i = 0; i < 10; i += 1) {
    result += `[Issue ${i + 1}](${link})\n`;
  }
  return result;
}
export function dialog(prompt) {
  async function step1(step) {
    await step.context.sendActivity(`Fetching defects for you...`);
    await Timeout.set(2000);
    await step.context.sendActivity(`There appears to be many, one moment...`);
    await Timeout.set(2000);
    return step.prompt(
      prompt,
      `Found over 1000, would you like to see the first 10?`,
    );
  }

  async function step2(step) {
    const lastStepAnswer = step.result;
    // send a message to the user
    if (lastStepAnswer.trim().toLowerCase() === 'yes') {
      await step.context.sendActivity(
        `Here are the first 10\n ${generateMockResponse()}`,
      );
    } else {
      await step.context.sendActivity('OK');
    }

    // OR end
    return step.endDialog();
  }
  return new WaterfallDialog(INTENT, [step1, step2]);
}
