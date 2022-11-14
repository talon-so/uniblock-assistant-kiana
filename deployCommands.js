require('dotenv').config();
const { REST, SlashCommandBuilder, Routes } = require('discord.js');

const fs = require('fs');
const { SocketAddress } = require('net');

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

const argCommandFiles = fs
  .readdirSync("./arg_commands")
  .filter((file) => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(command);
  let builder = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description);
  switch (command.name) {
    case 'get_balance':
      builder.addStringOption((option) =>
        option
          .setName('address')
          .setDescription('A valid ethereum address')
          .setRequired(true)
      );
      break;
    default:
      break;
  }
  commands.push(builder);
}

for (const file of argCommandFiles) {
  const command = require(`./arg_commands/${file}`);
  commands.push(
    new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description)
      .addStringOption(option =>
        option.setName('address')
          .setDescription('User wallet address to set to'))
  )
}



const commandsJSON = commands.map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest
  .put(Routes.applicationCommands(process.env.APP_ID), { body: commandsJSON })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
