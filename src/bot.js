// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const { DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');

// const { GreetingState } = require('./dialogs/greeting/greetingState');
const { GreetingDialog } = require('./dialogs/greeting');

// Greeting Dialog ID
const GREETING_DIALOG = 'greetingDialog';

// State Accessor Properties
const DIALOG_STATE_PROPERTY = 'dialogState';
const GREETING_STATE_PROPERTY = 'greetingState';

// Supported utterances
const GREETING_UTTERANCE = 'hello';
const CANCEL_UTTERANCE = 'cancel';
const HELP_UTTERANCE = 'help';

/**
 * Demonstrates the following concepts:
 *  Displaying a Welcome Card, using Adaptive Card technology
 *  Use LUIS to model Greetings, Help, and Cancel interations
 *  Use a Waterflow dialog to model multi-turn conversation flow
 *  Use custom prompts to validate user input
 *  Store conversation and user state
 *  Handle conversation interruptions
 */
export class OrbyBot {
  /**
   * Creates a OrbyBot.
   *
   * @param {ConversationState} conversationState property accessor
   * @param {UserState} userState property accessor
   * @param {BotConfiguration} botConfig contents of the .bot file
   */
  constructor(conversationState, userState, botConfig) {
    if (!conversationState)
      throw 'Missing parameter.  conversationState is required';
    if (!userState) throw 'Missing parameter.  userState is required';
    if (!botConfig) throw 'Missing parameter.  botConfig is required';

    // Create the property accessors for user and conversation state
    this.greetingStateAccessor = userState.createProperty(
      GREETING_STATE_PROPERTY,
    );
    this.dialogState = conversationState.createProperty(DIALOG_STATE_PROPERTY);

    console.log('creating dialogtset');
    // Create top-level dialog(s)
    this.dialogs = new DialogSet(this.dialogState);
    this.dialogs.add(
      new GreetingDialog(
        GREETING_DIALOG,
        this.greetingStateAccessor,
        userState,
      ),
    );

    this.conversationState = conversationState;
    this.userState = userState;
  }

  /**
   * Driver code that does one of the following:
   * 1. Display a welcome message upon startup
   * 2. Start a greeting dialog
   * 3. Optionally handle Cancel or Help interruptions
   *
   * @param {Context} context turn context from the adapter
   */
  async onTurn(context) {
    // Create a dialog context
    const dc = await this.dialogs.createContext(context);

    if (context.activity.type === ActivityTypes.Message) {
      const utterance = context.activity.text.trim().toLowerCase();

      // handle conversation interrupts first
      const interrupted = await this.isTurnInterrupted(dc, utterance);
      if (interrupted) {
        return;
      }

      // Continue the current dialog
      const dialogResult = await dc.continueDialog();

      // If no one has responded,
      if (!dc.context.responded) {
        // Examine results from active dialog
        switch (dialogResult.status) {
          case DialogTurnStatus.empty:
            if (utterance === GREETING_UTTERANCE) {
              await dc.beginDialog(GREETING_DIALOG);
            } else {
              // Help or no intent identified, either way, let's provide some help
              // to the user
              await dc.context.sendActivity(
                `I didn't understand what you just said to me. Try saying 'hello', 'help' or 'cancel'.`,
              );
            }
            break;
          case DialogTurnStatus.waiting:
            // The active dialog is waiting for a response from the user, so do nothing
            break;
          case DialogTurnStatus.complete:
            await dc.endDialog();
            break;
          default:
            await dc.cancelAllDialogs();
            break;
        }
      }
    } else if (
      context.activity.type === 'conversationUpdate' &&
      context.activity.membersAdded[0].name === 'Bot'
    ) {
      // When activity type is "conversationUpdate" and the member joining the conversation is the bot
      // we will send a welcome message.
      await dc.context.sendActivity(
        `Welcome to the message routing bot! Try saying 'hello' to start talking, and use 'help' or 'cancel' at anytime to try interruption and cancellation.`,
      );
    }
    // Make sure to persist state at the end of a turn.
    await this.userState.saveChanges(context);
    await this.conversationState.saveChanges(context);
  }

  /**
   * Determine whether a turn is interrupted and handle interruption based off user's utterance.
   *
   * @param {DialogContext} dc - dialog context
   * @param {string} utterance - user's utterance
   */
  async isTurnInterrupted(dc, utterance) {
    // see if there are any conversation interrupts we need to handle
    if (utterance === CANCEL_UTTERANCE) {
      if (dc.activeDialog) {
        await dc.cancelAllDialogs();
        await dc.context.sendActivity(`Ok. I've cancelled our last activity.`);
      } else {
        await dc.context.sendActivity(`I don't have anything to cancel.`);
      }
      return true; // handled the interrupt
    }

    if (utterance === HELP_UTTERANCE) {
      await dc.context.sendActivity(`Let me try to provide some help.`);
      await dc.context.sendActivity(
        `I understand greetings, being asked for help, or being asked to cancel what I am doing.`,
      );

      if (dc.activeDialog) {
        // We've shown help, reprompt again to continue where the dialog left over
        dc.repromptDialog();
      }
      return true; // handled the interrupt
    }
    return false; // did not handle the interrupt
  }
}
