// @todo

/**
 * Possible intents
 *
 * Show me my stories
 * Display stories assigned to me
 * Show me all of Bill's stories
 * Show me the stories
 */
import { WaterfallDialog } from 'botbuilder-dialogs';
import Timeout from 'await-timeout';

export const INTENT = 'RALLY';

function generateMockResponse() {
  const link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  let result = '';
  for (let i = 0; i < 10; i += 1) {
    result += `[Story ${i + 1}](${link})\n`;
  }
  return result;
}
export function dialog() {
  async function step1(step) {
    await step.context.sendActivity(`Fetching user stories for you...`);
    await Timeout.set(3000);
    await step.context.sendActivity(
      `Here are the first 10\n ${generateMockResponse()}`,
    );
  }
  return new WaterfallDialog(INTENT, [step1]);
}
