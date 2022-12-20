const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

const name = "uniblock_ping";
const description = "Ping the Uniblock API";

module.exports = {
  name,
  description,
  cooldown: 1000,
  builder: new SlashCommandBuilder().setName(name).setDescription(description),
  async run(interaction) {
    // Make a request for a user with a given ID
    const axiosRes = await axios.get(process.env.UNIBLOCK_BASE_URL + '/ping');
    // Send a message into the channel where command was triggered from

    interaction.reply({ content: axiosRes.data.ping });
  }
};
