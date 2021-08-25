const app = require('express')()
const Topgg = require('@top-gg/sdk')
const { MessageEmbed } = require('discord.js');

module.exports = {
    startServer: (authToken, client) => {
        const hook = new Topgg.Webhook(authToken)
        app.post('/dblwebhook', hook.listener(async vote => {
           let chnl = await client.channels.fetch(client.config.channelToSend);
           if (!chnl) return;
          
           let member = await chnl.guild.members.fetch(vote.user);
           let role = await chnl.guild.roles.fetch(client.config.roleId);
            
           if (role && member) {
               let doc = await client.tools.models.votedUser.findOne({ user: vote.user });
               if (!doc) {
                   await new client.tools.models.votedUser({ user: vote.user, givenAt: Date.now() }).save();
               } else {
                   doc.givenAt = Date.now()
                   await doc.save()
               }
               await member.roles.add(role).catch((e) => console.error(e))
           } 
            
           let embed = new MessageEmbed().setTitle('User Voted').setDescription(`<@${vote.user}> | ${member ? member.user.tag : ''} has voted for the bot!`).setColor('RANDOM');
           if (member) embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
            
           return chnl.send({ embeds: [embed] }) 
        }))
        app.get('/', (req, res) => res.sendStatus(200))
        app.listen(process.env.PORT ?? 8080)
        console.log('Server online!')
    }
}