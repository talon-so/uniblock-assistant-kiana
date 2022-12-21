const axios = require('axios');
const { timeEnd } = require('console');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const imports = require('../../index.js');

const name = "get_balance_historical";
const description = "Gets the user's historical portfolio value, and user's historical balance records."

module.exports = {
  name,
  description,
  cooldown: 1000,
  builder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription('The address that the balance records are tied to.')
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName('chain_id')
        .setDescription('Network to filter through balance records.')
        .setRequired(false)
        .setMinValue(0)
    )
    .addIntegerOption((option) =>
      option
        .setName('timestamp')
        .setDescription('Numerical representation of the earliest date the balance records were indexed.')
        .setRequired(false)
        .setMinValue(0)
    )
    .addStringOption((option) =>
      option
        .setName('token_address')
        .setDescription(
          'The address of a specific token to filter through the balance records.'
        )
    )
    .addIntegerOption((option) =>
      option
        .setName('limit')
        .setDescription('The maximum number of balance records to return.')
        .setMinValue(0)
    )
    .addIntegerOption((option) =>
      option
        .setName('offset')
        .setDescription('Number of records to skip in the query.')
        .setMinValue(0)
    )
    .addStringOption((option) =>
      option
        .setName('cursor')
        .setDescription('The cursor returned in the previous response.')
    ),
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
