const { SlashCommandBuilder } = require('discord.js');

const name = "uniblock_request";
const description = "generate uniblock request link";

module.exports = {
  name,
  description,
  cooldown: 1000,
  builder: new SlashCommandBuilder().setName(name).setDescription(description),
  async run(interaction) {
    interaction.reply({ content: "https://request.uniblock.dev/" });
  },
};
