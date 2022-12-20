const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

const name = "gas_price";
const description = "Get Gas Fees";

module.exports = {
  name,
  description,
  cooldown: 1000,
  builder: new SlashCommandBuilder().setName(name).setDescription(description),
  async run(interaction, client) {
    // Make a request for a user with a given ID
    const axiosRes = await axios.get(process.env.UNIBLOCK_BASE_URL + '/utils/getGasPrice?chainId=1');
    // Send a message into the channel where command was triggered from

    interaction.reply({ content: `gasPrice is ${axiosRes.data.gasPrice}` });
  }
};