import axios from 'axios';
import { Client, Intents } from 'discord.js'
import { config } from 'dotenv'
import { ErBsClient } from 'erbs-client';
import { currentplayers, randomchar } from './commands';

config()

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] });
export const erbsClient = new ErBsClient(process.env.ERBS_KEY)

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
    try {
        switch(commandName) {
            case 'ping':
                return await interaction.reply('Pong!');
            case 'server':
                return await interaction.reply(`Server name: ${interaction.guild?.name}\nTotal members: ${interaction.guild?.memberCount}`);
            case 'user':
                return await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
            case 'currentplayers': 
                return await currentplayers(interaction)
            case 'randomchar':
                return await randomchar(interaction, erbsClient)
            case 'assembleduo':
                return await randomchar(interaction, erbsClient, 2)
            case 'assemblesquad':
                return await randomchar(interaction, erbsClient, 3)
            default:
                return await interaction.reply('Seems like that command hasn\'t been implemented yet, try again later!');
        }
    } catch(err: any) {
        console.log(err.message)
    }
});

client.on('messageCreate', async message => {
    try {
        if (message.author.id === client.user?.id) {
            return
        }

        const parsedMessage = message.content.toLocaleLowerCase()
        if (parsedMessage.includes('erbs') && parsedMessage.endsWith('?')) {
            const realPlayers = message.guild?.members.cache.filter(
                member => member.roles.cache.filter(role => role.id === '882753703382237236').size === 1
            )
            const numOnline = realPlayers?.filter(member => member.presence?.status === 'online').size
            console.log(numOnline)
            if ((numOnline ?? 0) >= 3) {
                if (Math.random() > 0.5) {
                    await message.reply('yerbs')
                } else {
                    await message.reply('surebs')
                }
            } else {
                await message.reply('nerbs')
            }
        }
    } catch(err: any) {
        console.log(err.message)
    }
})

// Login to Discord with your client's token
client.login(process.env.TOKEN);