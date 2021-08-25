const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const { startServer } = require('./Server');
const mongoose = require('mongoose')
const path = require('path');

module.exports = class BotClient extends AkairoClient {
  constructor(config = {}) {
    super(
      { ownerID: ['756909881793183826'] },
      {
        presence: {
          status: 'online',
          activities: [
            {
              name: 'your Votes',
              type: 'WATCHING',
            },
          ],
        },
        partials: ['GUILD_MEMBER', 'REACTION', 'MESSAGE'],
        intents: 32767,
        allowedMentions: {
          parse: ['everyone', 'users', 'roles'],
          repliedUser: false,
        },
      },
    );

    /* Command Handler
    this.commandHandler = new CommandHandler(this, {
      allowMention: true,
      prefix: config.prefix,
      commandUtil: true,
      automateCategories: true,
      defaultCooldown: 3000,
      commandUtilLifetime: 300000,
      directory: `${path.dirname(require?.main?.filename)}${path.sep}Commands/`,
    });
    */
    
    // Event Handler
    this.listenerHandler = new ListenerHandler(this, {
      directory: `${path.dirname(require?.main?.filename)}${path.sep}Listeners/`,
    });
      
    // Global Variables
    this.config = config;
    if (!this.config.channelToSend.length) return new Error('No vote/review channel id provided in client config!')
    this.tools = {
      models: require('./Utility/Models'),
      wait: require('util').promisify(setTimeout),
    };

    // Enable if Command Handker is enabled
    //this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
    // Enable if Command Handker is enabled
      //commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    });

    // Enable if Command Handker is enabled
    //this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    //this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  async start(token, mongoURi, topggAuth) {
    await super.login(token);
    await startServer(topggAuth, this)
    return mongoose.connect(mongoURi, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    })
  }
};
