const axios = require('axios');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const imports = require('../../index.js');
const { NETWORK_OPTIONS } = require('../../constants/network.js');
const { addQueryOptions } = require('../../utils/addQueryOptions');

const name = 'get_balance';
const description =
  "Gets the user's current portfolio value, and user's current balance records.";

const builder = new SlashCommandBuilder()
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
  )
  .addStringOption((option) =>
    option
      .setName('token_address')
      .setDescription(
        'The address of a specific token to filter through the balance records.'
      )
  );
addQueryOptions(builder);
// TODO: fix choices when discord.js bug fixed and addChoices accepts arrays.
NETWORK_OPTIONS.forEach((choice) => {
  builder.options[1].addChoices(choice);
});

module.exports = {
  name: name,
  description: description,
  cooldown: 1000,
  builder: builder,
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
    const chainId = interaction.options.getInteger('chain_id') || 1;

    // ------ optional params ----------
    const tokenAddress = interaction.options.getString('token_address');
    const limit = interaction.options.getInteger('limit');
    const offset = interaction.options.getInteger('offset');
    const cursor = interaction.options.getString('cursor');

    // add params to query url as needed
    let params = { chainId: chainId };
    if (tokenAddress) params.tokenAddress = tokenAddress;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (cursor) params.cursor = cursor;

    let queryURL = process.env.UNIBLOCK_BASE_URL + `/balance/${address}`;
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
