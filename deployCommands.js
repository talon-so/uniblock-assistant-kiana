require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(command);
  commands.push(command.builder);
}

const commandsJSON = commands.map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest
  .put(Routes.applicationCommands(process.env.APP_ID), { body: commandsJSON })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
