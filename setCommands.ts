import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv'

config()

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
    new SlashCommandBuilder().setName('currentplayers').setDescription('Show the number of people currently playing erbs.'),
	new SlashCommandBuilder().setName('randomchar').setDescription('Select a random character from the roster.'),
	new SlashCommandBuilder().setName('assembleduo').setDescription('Select 2 random characters from the roster.'),
	new SlashCommandBuilder().setName('assemblesquad').setDescription('Select 3 random characters from the roster.')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN ?? '');

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();