const axios = require('axios');
const { wrapCodeBlock } = require('../utils/wrapCodeBlock');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
  name: 'get_balance',
  description: 'Ping the Uniblock API',
  cooldown: 1000,
  async run(interaction, client) {
    // Make a request for a user with a given ID
    const axiosRes = await axios.get(
      process.env.UNIBLOCK_BASE_URL +
        '/balance/0x4A8b9FA6B245a34E587Dc9A9AfBC395907446e4C?chainId=1'
    );

    // Send a message into the channel where command was triggered from
    const strRes = JSON.stringify(axiosRes.data, null, 2);

    const attachment = new AttachmentBuilder(Buffer.from(strRes, 'utf-8'), {
      name: 'response.txt'
    });

    await interaction.reply({
      files: [attachment]
    });
  }
};
