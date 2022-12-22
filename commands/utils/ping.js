const { SlashCommandBuilder } = require('discord.js');

const name = "ping";
const description = "Get the bot's ping";

module.exports = {
  name,
  description,
  cooldown: 1000,
  builder: new SlashCommandBuilder().setName(name).setDescription(description),
  async run(interaction, client) {
    interaction.reply({ content: client.ws.ping.toString() + "ms" });
  },
};
