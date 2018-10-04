// @todo
import { WaterfallDialog } from 'botbuilder-dialogs';

export const INTENT = 'HELP';

const getChoices = () => {
  const cardOptions = [
    {
      value: 'Get my PRs',
    },
    {
      value: 'Show me my issues',
    },
    {
      value: 'Deploy content to PA',
    },
    {
      value: 'Show me my stories',
    },
  ];

  return cardOptions;
};

export function dialog(prompt) {
  async function step1(step) {
    const promptOptions = {
      prompt: 'Please select a card:',
      reprompt:
        'That was not a valid choice, please select a card or number from 1 to 8.',
      choices: getChoices(),
    };
    await step.prompt(prompt, promptOptions);

    // OR end
    return step.endDialog();
  }

  return new WaterfallDialog(INTENT, [step1]);
}
