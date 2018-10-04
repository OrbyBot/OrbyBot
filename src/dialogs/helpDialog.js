// @todo
import { WaterfallDialog } from 'botbuilder-dialogs';

export const INTENT = 'HELP';

const getChoices = () => {
  const cardOptions = [
    {
      value: 'Animation Card',
      synonyms: ['1', 'animation', 'animation card'],
    },
    {
      value: 'Audio Card',
      synonyms: ['2', 'audio', 'audio card'],
    },
    {
      value: 'Hero Card',
      synonyms: ['3', 'hero', 'hero card'],
    },
    {
      value: 'Receipt Card',
      synonyms: ['4', 'receipt', 'receipt card'],
    },
    {
      value: 'Signin Card',
      synonyms: ['5', 'signin', 'signin card'],
    },
    {
      value: 'Thumbnail Card',
      synonyms: ['6', 'thumbnail', 'thumbnail card'],
    },
    {
      value: 'Video Card',
      synonyms: ['7', 'video', 'video card'],
    },
    {
      value: 'All Cards',
      synonyms: ['8', 'all', 'all cards'],
    },
  ];

  return cardOptions;
};

export function dialog(prompt) {
  async function step1(step) {
    // access user input from previous step
    // send a message to the user
    //   await step.context.sendActivity(`You mean you don't have all the answers?`);

    // Prompt the user with the configured PromptOptions.
    // Create the PromptOptions which contain the prompt and reprompt messages.
    // PromptOptions also contains the list of choices available to the user.
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
