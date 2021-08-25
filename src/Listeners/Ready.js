const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const cron = require('node-cron');

module.exports = class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		});
	}

	exec() {
		console.log('Bot online!')
         
        // Remove 12hr vote roles
        cron.schedule('*/5 * * * *', async() => {
            let chnl = await this.client.channels.fetch(this.client.config.channelToSend);             
            if (!chnl) return;
            let role = await chnl.guild.roles.fetch(this.client.config.roleId);
            if (!role) return;
            
            let docs = await this.client.tools.models.userVoted.find();
            for (let i = 0; i < docs.length; i++) {
                let member = await chnl.guild.members.fetch(docs[i].user);
                if (43200000 - (Date.now() - docs[i].givenAt) < 0) {
                    await docs[i].delete();
                    if (member) {
                        await member.roles.remove(role).catch((e) => console.error(e))
                    }
                }
            }
        });
        // Check for reviews
        cron.schedule('*/2 * * * *', async() => {
            let channel = await this.client.channels.fetch(this.client.config.channelToSend);
            if (!channel) return new Error('channelToSend does not exist in discord anymore!');
        
            let doc = await this.client.tools.models.review.findOne();
            
            let fetched = await fetch(`https://top.gg/api/client/entities/${this.client.config.topggBotId}/reviews`).then(res => res.json());
            
            fetched.forEach(async(review) => {
                if (!doc?.id.includes(review.id)) {
                await channel.send({ embeds: [new MessageEmbed().setThumbnail(review.poster.avatar).setTitle(`${review.poster.username} Reviewed:`).setColor('RANDOM').setDescription(review.content).addField('Rating:', review.score.toString(), true).addField('Votes received for review:', review.votes.toString(), true)] }).catch((e) => console.error(e))
                  if (!doc) {
                    await new this.client.tools.models.review({ id: [review.id] }).save()
                   } else { 
                    doc.id.push(review.id)
                    await doc.save()
                   }
                }  
            })            
        })
	}
};
