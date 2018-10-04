// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');

const { LuisRecognizer } = require('botbuilder-ai');

/**
 * Demonstrates the following concepts:
 *  Displaying a Welcome Card, using Adaptive Card technology
 *  Use LUIS to model Greetings, Help, and Cancel interations
 *  Use a Waterflow dialog to model multi-turn conversation flow
 *  Use custom prompts to validate user input
 *  Store conversation and user state
 *  Handle conversation interruptions
 */
export default class OrbyBot {
  /**
   * Creates a OrbyBot.
   *
   * @param {ConversationState} conversationState property accessor
   * @param {UserState} userState property accessor
   * @param {BotConfiguration} botConfig contents of the .bot file
   */
  constructor(application, luisPredictionOptions) {
    this.luisRecognizer = new LuisRecognizer(
      application,
      luisPredictionOptions,
      true,
    );
  }

  /**
   * Driver code that does one of the following:
   * 1. Display a welcome message upon startup
   * 2. Start a greeting dialog
   * 3. Optionally handle Cancel or Help interruptions
   *
   * @param {Context} context turn context from the adapter
   */
  async onTurn(turnContext) {
    // By checking the incoming Activity type, the bot only calls LUIS in appropriate cases.
    if (turnContext.activity.type === ActivityTypes.Message) {
      console.log('what');
      // Perform a call to LUIS to retrieve results for the user's message.
      const results = await this.luisRecognizer.recognize(turnContext);
      console.log('recognize ran');
      // Since the LuisRecognizer was configured to include the raw results, get the `topScoringIntent` as specified by LUIS.
      const topIntent = results.luisResult.topScoringIntent;
      console.log('topIntent');

      if (topIntent.intent !== 'None') {
        await turnContext.sendActivity(
          `LUIS Top Scoring Intent: ${topIntent.intent}, Score: ${
            topIntent.score
          }`,
        );
      } else {
        // If the top scoring intent was "None" tell the user no valid intents were found and provide help.
        await turnContext.sendActivity(`No LUIS intents were found.
                                                \nThis sample is about identifying two user intents:
                                                \n - 'Calendar.Add'
                                                \n - 'Calendar.Find'
                                                \nTry typing 'Add Event' or 'Show me tomorrow'.`);
      }
    } else if (
      turnContext.activity.type === ActivityTypes.ConversationUpdate &&
      turnContext.activity.recipient.id !==
        turnContext.activity.membersAdded[0].id
    ) {
      // If the Activity is a ConversationUpdate, send a greeting message to the user.
      await turnContext.sendActivity(
        'Welcome to the NLP with LUIS sample! Send me a message and I will try to predict your intent.',
      );
    } else if (turnContext.activity.type !== ActivityTypes.ConversationUpdate) {
      // Respond to all other Activity types.
      await turnContext.sendActivity(
        `[${turnContext.activity.type}]-type activity detected.`,
      );
    }
  }
}
