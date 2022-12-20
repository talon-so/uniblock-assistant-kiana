const imports = require('../../index.js');
const { ethers } = require("ethers");
const { SlashCommandBuilder } = require('discord.js');

const name = "set_wallet";
const description = "Set the users wallet";

module.exports = {
  name,
  description,
  cooldown: 1000,
  builder: new SlashCommandBuilder().setName(name).setDescription(description)
    .addStringOption((option) =>
      option
      .setName('address')
      .setDescription('User wallet address to set to')
      .setRequired(true)
    ),
  async run(interaction, client) {
    const wallets = imports.wallets;
    const userId = interaction.user.id;
    let result = "Invalid address";

    const arg = interaction.options.getString('address');

    if (ethers.utils.isAddress(arg)) {
      wallets[userId] = arg;
      result = `Wallet address set to ${arg}`;
    }

    interaction.reply({ content: result });
  },
};
