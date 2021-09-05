import axios from 'axios';
import { Client, Intents } from 'discord.js'
import { config } from 'dotenv'
import { parse } from 'node-html-parser'

config()

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] });

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
                await interaction.reply('Pong!');
            case 'server':
                await interaction.reply(`Server name: ${interaction.guild?.name}\nTotal members: ${interaction.guild?.memberCount}`);
            case 'user':
                await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
            case 'currentplayers': {
                const resp = (
                    await axios.get(
                        'https://steamcharts.com/app/1049590', 
                        {headers: {
                            Accept: '*/*'
                        }}
                    )
                ).data as string
                const num = parse(resp).querySelector('.timeago').parentNode.querySelector('span').innerText
                await interaction.reply(`There are currently ${num} players online!`)
            }
            default:
                return
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