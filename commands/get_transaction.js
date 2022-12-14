const axios = require('axios');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');

const name = "get_transaction";
const description = "Get Transaction Fees";

module.exports = {
  name,
  description,
  cooldown: 1000,
  builder: new SlashCommandBuilder().setName(name).setDescription(description)
    .addStringOption((option) =>
      option
      .setName('address')
      .setDescription('A valid ethereum address')
      .setRequired(true)
    ),
  async run(interaction, client) {
    const address = interaction.options.getString('address');
    // Make a request for a user with a given ID
    console.log(process.env.UNIBLOCK_BASE_URL + `/transaction/${address}?chainId=1`);
    const axiosRes = await axios.get(process.env.UNIBLOCK_BASE_URL + `/transaction/${address}?chainId=1`);
    // Send a message into the channel where command was triggered from
    const strRes = JSON.stringify(axiosRes.data, null, 2);

    console.log(strRes);
    const attachment = new AttachmentBuilder(Buffer.from(strRes, 'utf-8'), {
      name: 'response.txt'
    });

    interaction.reply({
      files: [attachment]
    });
  }
};