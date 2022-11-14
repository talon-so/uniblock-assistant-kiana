const imports = require('../index.js');
const { ethers } = require("ethers");

module.exports = {
  name: "set_wallet",
  description: "Set the users wallet",
  cooldown: 1000,
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
