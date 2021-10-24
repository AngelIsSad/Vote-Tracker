const Client = require('./Structure/Client');
const client = new Client({ prefix: 'YOUR-BOT-PREFIX', channelToSend: 'VOTE-LOG-CHANNELID', topggBotId: 'YOUR-BOT-ID', roleId: 'ROLEID-YOU-WANT-TO-GIVE' });

// Bot Token, MongoURi, Topgg Auth Token
return client.start('BOT-TOKEN-GOES-HERE', 'MONGO-DB-URI-GOES-HERE', 'AUTHORIZATION-KEY')
