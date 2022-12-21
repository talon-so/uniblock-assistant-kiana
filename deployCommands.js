require('dotenv').config();
const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const { NETWORK_OPTIONS } = require('./constants/network.js');
const fs = require('fs');
const { addQueryOptions } = require('./utils/addQueryOptions.js');

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  let builder = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description);
  switch (command.name) {
    case 'get_balance':
      builder
        .addStringOption((option) =>
          option
            .setName('address')
            .setDescription('The address that the balance records are tied to.')
            .setRequired(false)
        )
        .addIntegerOption((option) =>
          option
            .setName('chain_id')
            .setDescription('Network to filter through balance records.')
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName('token_address')
            .setDescription(
              'The address of a specific token to filter through the balance records.'
            )
        );
      addQueryOptions(builder);
      // TODO: fix choices when discord.js bug fixed and addChoices accepts arrays.
      NETWORK_OPTIONS.forEach((choice) => {
        builder.options[1].addChoices(choice);
      });
      break;
    case 'get_balance_historical':
      builder
        .addStringOption((option) =>
          option
            .setName('address')
            .setDescription('The address that the balance records are tied to.')
            .setRequired(false)
        )
        .addIntegerOption((option) =>
          option
            .setName('chain_id')
            .setDescription('Network to filter through balance records.')
            .setRequired(false)
            .setMinValue(0)
        )
        .addIntegerOption((option) =>
          option
            .setName('timestamp')
            .setDescription(
              'Numerical representation of the earliest date the balance records were indexed.'
            )
            .setRequired(false)
            .setMinValue(0)
        )
        .addStringOption((option) =>
          option
            .setName('token_address')
            .setDescription(
              'The address of a specific token to filter through the balance records.'
            )
        );
      addQueryOptions(builder);
      // TODO: fix choices when discord.js bug fixed and addChoices accepts arrays.
      NETWORK_OPTIONS.forEach((choice) => {
        builder.options[1].addChoices(choice);
      });
      break;
    case 'get_nft':
      builder
        .addStringOption((option) =>
          option
            .setName('address')
            .setDescription('Enter the address of the NFT contract')
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName('token_id')
            .setDescription('Enter the NFT ID of the specific NFT to query')
            .setRequired(true)
            .setMinValue(0)
        )
        .addIntegerOption((option) =>
          option
            .setName('chain_id')
            .setDescription('Network to filter through balance records.')
            .setRequired(false)
            .setMinValue(0)
        );
      // TODO: fix choices when discord.js bug fixed and addChoices accepts arrays.
      NETWORK_OPTIONS.forEach((choice) => {
        builder.options[2].addChoices(choice);
      });
      break;
    case 'get_user_nfts':
      builder
        .addStringOption((option) =>
          option
            .setName('address')
            .setDescription('Enter the address of the NFT contract')
            .setRequired(true)
        )
        .addStringOption((option) =>
        option
          .setName('token_address')
          .setDescription('Enter the address of the NFT contract')
          .setRequired(false)
      )
        .addIntegerOption((option) =>
          option
            .setName('token_id')
            .setDescription('Enter the NFT ID of the specific NFT to query')
            .setRequired(false)
            .setMinValue(0)
        )
        .addIntegerOption((option) =>
          option
            .setName('chain_id')
            .setDescription('Network to filter through balance records.')
            .setRequired(false)
            .setMinValue(0)
        );
      // TODO: fix choices when discord.js bug fixed and addChoices accepts arrays.
      NETWORK_OPTIONS.forEach((choice) => {
        builder.options[3].addChoices(choice);
      });
      addQueryOptions(builder);
      break;
    case 'get_transaction':
      builder.addStringOption((option) =>
        option
          .setName('address')
          .setDescription('A valid ethereum address')
          .setRequired(true)
      );
      break;
    case 'set_wallet':
      builder.addStringOption((option) =>
        option
          .setName('address')
          .setDescription('User wallet address to set to')
          .setRequired(true)
      );
      break;
    default:
      break;
  }
  console.log(command);
  commands.push(builder);
}

const commandsJSON = commands.map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest
  .put(Routes.applicationCommands(process.env.APP_ID), { body: commandsJSON })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
