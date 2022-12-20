const imports = require('../../index.js');
const { SlashCommandBuilder } = require('discord.js');

const name = "get_wallet";
const description = "Get the users wallet";

module.exports = {
  name,
  description,
  cooldown: 1000,
  builder: new SlashCommandBuilder().setName(name).setDescription(description),
  async run(interaction, client) {
    const wallets = imports.wallets;
    const userId = interaction.user.id;
    let result = "No address set";
    
    if (wallets[userId]) {
      result = "Your wallet address: " + wallets[userId];
    }

    interaction.reply({ content: result });
  },
  builder: 
};
