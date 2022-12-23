const axios = require('axios');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const imports = require('../../index.js');
const { NETWORK_OPTIONS } = require('../../constants/network.js');
const { addQueryOptions } = require('../../utils/addQueryOptions');

const name = 'get_user_collections';
const description =
  'Gets all NFT collections of a specific user from all supported networks.';

const builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((option) =>
    option
      .setName('address')
      .setDescription('Enter the address of the NFT contract')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('token_address')
      .setDescription('Enter the address of the NFT collection.')
      .setRequired(false)
  )
  .addIntegerOption((option) =>
    option
      .setName('chain_id')
      .setDescription('Network to filter through balance records.')
      .setRequired(false)
      .setMinValue(0)
  );
// TODO: fix choices when discord.js bug fixed and addChoices accepts arrays.
NETWORK_OPTIONS.forEach((choice) => {
  builder.options[2].addChoices(choice);
});

addQueryOptions(builder, false);

module.exports = {
  name: name,
  description: description,
  cooldown: 1000,
  builder: builder,
  async run(interaction) {
    try {
      await interaction.deferReply();
      // ------ required params ----------
      // defaults address to a set user wallet
      const address =
        interaction.options.getString('address') ||
        imports.wallets[interaction.user.id];
      // throw error if no address given and no user wallet set
      if (!address) {
        interaction.editReply('No address given to get NFT');
        return;
      }
      const chainId = interaction.options.getInteger('chain_id') || 1;
      const tokenAddress = interaction.options.getInteger('token_address');
      const limit = interaction.options.getInteger('limit');
      const offset = interaction.options.getInteger('offset');

      // add params to query url as needed
      let params = { chainId: chainId };
      if (tokenAddress) params.nftAddress = tokenAddress;
      if (limit) params.limit = limit;
      if (offset) params.offset = offset;

      let queryURL =
        process.env.UNIBLOCK_BASE_URL + `/nft/${address}/collections`;
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
    } catch (e) {
      console.log(e);
    }
  }
};
