const imports = require('../index.js');

module.exports = {
  name: "get_wallet",
  description: "Get the users wallet",
  cooldown: 1000,
  async run(interaction, client) {
    const wallets = imports.wallets;
    const userId = interaction.user.id;
    let result = "No address set";
    
    if (wallets[userId]) {
      result = "Your wallet address: " + wallets[userId];
    }

    interaction.reply({ content: result });
  },
};
