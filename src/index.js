// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// See https://babeljs.io/docs/en/babel-polyfill for detail
import '@babel/polyfill';
import OrbyBot from './bot';

const path = require('path');
const restify = require('restify');
const {
  BotFrameworkAdapter,
  ConversationState,
  MemoryStorage,
  UserState,
} = require('botbuilder');
const { BotConfiguration } = require('botframework-config');

const DEV_ENVIRONMENT = 'development';

// bot name as defined in .bot file
// See https://aka.ms/about-bot-file to learn more about .bot file its use and bot configuration.
const BOT_CONFIGURATION = process.env.NODE_ENV || DEV_ENVIRONMENT;

// Create HTTP server.
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\n${server.name} listening to ${server.url}.`);
  console.log(
    `\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator.`,
  );
  console.log(`\nTo talk to your bot, open orby.bot file in the Emulator.`);
});

// .bot file path.
const BOT_FILE = path.join(__dirname, process.env.botFilePath || '');
let botConfig;
try {
  // Read bot configuration from .bot file.
  botConfig = BotConfiguration.loadSync(BOT_FILE, process.env.botFileSecret);
} catch (err) {
  console.error(
    `\nError reading bot file. Please ensure you have valid botFilePath and botFileSecret set for your environment.`,
  );
  console.error(
    `\n - The botFileSecret is available under appsettings for your Azure Bot Service bot.`,
  );
  console.error(
    `\n - If you are running this bot locally, consider adding a .env file with botFilePath and botFileSecret.\n\n`,
  );
  process.exit();
}

// Get bot endpoint configuration by service name.
const endpointConfig = botConfig.findServiceByNameOrId(BOT_CONFIGURATION);

// Language Understanding (LUIS) service name as defined in the .bot file.
const LUIS_CONFIGURATION = 'luisModel';

// Get endpoint and LUIS configurations by service name.
const luisConfig = botConfig.findServiceByNameOrId(LUIS_CONFIGURATION);

// Map the contents to the required format for `LuisRecognizer`.
const luisApplication = {
  applicationId: luisConfig.appId,
  endpointKey: luisConfig.authoringKey,
  azureRegion: luisConfig.region,
};

// Create configuration for LuisRecognizer's runtime behavior.
const luisPredictionOptions = {
  includeAllIntents: true,
  log: true,
  staging: false,
};

// Create adapter. See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
  appId: endpointConfig.appId || process.env.MicrosoftAppID,
  appPassword: endpointConfig.appPassword || process.env.MicrosoftAppPassword,
});

// Define the state store for your bot. See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state storage system to persist the dialog and user state between messages.
const memoryStorage = new MemoryStorage();

// Create conversation state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Create the bot.
let bot;
try {
  bot = new OrbyBot(
    conversationState,
    userState,
    luisApplication,
    luisPredictionOptions,
  );
} catch (err) {
  console.error(`[botInitializationError]: ${err}`);
  process.exit();
}

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async context => {
    await bot.onTurn(context);
  });
});

// Catch-all for errors.
adapter.onTurnError = async (turnContext, error) => {
  // This check writes out errors to console log v.s. Application Insights.
  console.error(`\n [onTurnError]: ${error}`);
  // Send a message to the user.
  await turnContext.sendActivity(`Oops. Something went wrong!`);
};
