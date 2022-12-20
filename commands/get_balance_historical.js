const axios = require('axios');
const { timeEnd } = require('console');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const imports = require('../index.js');

module.exports = {
  name: 'get_balance_historical',
  description:
    "Gets the user's historical portfolio value, and user's historical balance records.",
  cooldown: 1000,
  async run(interaction) {
    await interaction.deferReply();
    // ------ required params ----------
    // defaults address to a set user wallet
    const address =
      interaction.options.getString('address') ||
      imports.wallets[interaction.user.id];
    // throw error if no address given and no user wallet set
    if (!address) {
      interaction.editReply('No address given to get_balance');
      return;
    }
    const chainId = interaction.options.getInteger('chainId') || 1;
    const timestamp = interaction.options.getInteger('timeStamp') || 0;

    // ------ optional params ----------
    const tokenAddress = interaction.options.getString('tokenAddress');
    const limit = interaction.options.getInteger('limit');
    const offset = interaction.options.getInteger('offset');
    const cursor = interaction.options.getString('cursor');

    // add params to query url as needed
    let params = { chainId: chainId, timestamp: timestamp };
    if (tokenAddress) params.tokenAddress = tokenAddress;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (cursor) params.cursor = cursor;

    let queryURL = process.env.UNIBLOCK_BASE_URL + `/balance/${address}/historical`;
    const res = await axios.get(queryURL, { params: params }).catch((e) => {
      console.log(
        '-------------------------------------- ERROR ----------------------------------------'
      );

      interaction.editReply(
        e.response.data.statusCode + ': ' + e.response.data.message
      );
    });

    if (res) {
      // Send a message into the channel where command was triggered from
      const strRes = JSON.stringify(res.data, null, 2);

      const attachment = new AttachmentBuilder(Buffer.from(strRes, 'utf-8'), {
        name: 'response.txt'
      });

      await interaction.editReply({
        files: [attachment]
      });
    }
  }
};