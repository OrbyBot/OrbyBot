// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
  ComponentDialog,
  WaterfallDialog,
  TextPrompt,
} = require('botbuilder-dialogs');
// User state for greeting dialog
const { GreetingState } = require('./greetingState');

// Minimum lengh requirements for name
const NAME_LENGTH_MIN = 3;

// Dialog IDs
const PROFILE_DIALOG = 'profileDialog';

// Prompt IDs
const NAME_PROMPT = 'namePrompt';

/**
 * Demonstrates the following concepts:
 *  Use a subclass of ComponentDialog to implement a mult-turn conversation
 *  Use a Waterflow dialog to model multi-turn conversation flow
 *  Use custom prompts to validate user input
 *  Store conversation and user state
 *
 * @param {String} dialogId unique identifier for this dialog instance
 * @param {Object} greetingStateAccessor property accessor for user state
 * @param {Object} userState user state
 */
class Greeting extends ComponentDialog {
  constructor(dialogId, greetingStateAccessor, userState) {
    super(dialogId);
    console.log('hi');
    // validate what was passed in
    if (!dialogId) throw 'Missing parameter.  dialogId is required';
    if (!greetingStateAccessor)
      throw 'Missing parameter.  greetingStateAccessor is required';
    if (!userState) throw 'Missing parameter.  userState is required';

    console.log('hi1.5');
    // Add control flow dialogs
    this.addDialog(
      new WaterfallDialog(PROFILE_DIALOG, [
        this.initializeStateStep.bind(this),
        this.promptForNameStep.bind(this),
        this.displayGreetingStateStep.bind(this),
      ]),
    );

    console.log('hi2');
    // Add text prompts for name
    this.addDialog(new TextPrompt(NAME_PROMPT, this.validateName));

    // Save off our state accessor for later use
    this.greetingStateAccessor = greetingStateAccessor;
    this.userState = userState;
  }

  /**
   * Waterfall Dialog step functions.
   *
   * Initialize our state.  See if the WaterfallDialog has state pass to it
   * If not, then just new up an empty GreetingState object
   *
   * @param {DialogContext} dc context for this dialog
   * @param {WaterfallStepContext} step contextual information for the current step being executed
   */
  async initializeStateStep(dc, step) {
    const greetingState = await this.greetingStateAccessor.get(dc.context);
    if (greetingState === undefined) {
      if (step.options && step.options.greetingState) {
        await this.greetingStateAccessor.set(
          dc.context,
          step.options.greetingState,
        );
      } else {
        await this.greetingStateAccessor.set(dc.context, new GreetingState());
      }
      await this.userState.saveChanges(dc.context);
    }
    return step.next();
  }

  /**
   * Waterfall Dialog step functions.
   *
   * Using a text prompt, prompt the user for their name.
   * Only prompt if we don't have this information already.
   *
   * @param {DialogContext} dc context for this dialog
   * @param {WaterfallStepContext} step contextual information for the current step being executed
   */
  async promptForNameStep(dc, step) {
    const greetingState = await this.greetingStateAccessor.get(dc.context);
    // if we have everything we need, greet user and return
    if (greetingState !== undefined && greetingState.name !== undefined) {
      return this.greetUser(dc);
    }
    if (!greetingState.name) {
      // prompt for name, if missing
      return dc.prompt(NAME_PROMPT, 'What is your name?');
    }
    return step.next();
  }

  /**
   * Waterfall Dialog step functions.
   *
   * Having all the data we need, simply display a summary back to the user.
   *
   * @param {DialogContext} dc context for this dialog
   * @param {WaterfallStepContext} step contextual information for the current step being executed
   */
  async displayGreetingStateStep(dc) {
    return this.greetUser(dc);
  }

  /**
   * Validator function to verify that user name meets required constraints.
   *
   * @param {DialogContext} context for this dialog
   * @param {PromptValidatorContext} prompt context for this prompt
   */
  async validateName(context, prompt) {
    // Validate that the user entered a minimum lenght for their name
    const value = (prompt.recognized.value || '').trim();
    if (value.length >= NAME_LENGTH_MIN) {
      prompt.end(value);
    } else {
      await context.sendActivity(
        `Names need to be at least ${NAME_LENGTH_MIN} characters long.`,
      );
    }
  }

  /**
   * Helper function to greet user with information in greetingState.
   *
   * @param {DialogContext} dc context for this dialog
   */
  async greetUser(dc) {
    const greetingState = await this.greetingStateAccessor.get(dc.context);
    // Display to the user their profile information and end dialog
    await dc.context.sendActivity(
      `Hi ${greetingState.name}, nice to meet you!`,
    );
    return dc.end();
  }
}

module.exports.GreetingDialog = Greeting;
