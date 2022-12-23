const axios = require('axios');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const imports = require('../../index.js');
const { NETWORK_OPTIONS } = require('../../constants/network.js');

const name = 'get_nft_owner';
const description = 'Gets the owner of a specific ERC721 NFT';

const builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((option) =>
    option
      .setName('address')
      .setDescription('Enter the address of the NFT contract')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('token_id')
      .setDescription('Enter the NFT ID of the specific NFT to query')
      .setRequired(true)
      .setMinValue(0)
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
      const tokenId = interaction.options.getInteger('token_id');
      if (!tokenId) {
        interaction.editReply('No token ID given to get NFT');
        return;
      }

      // add params to query url as needed
      let params = { chainId: chainId, nftId: tokenId, nftAddress: address };

      let queryURL = process.env.UNIBLOCK_BASE_URL + `/nft/nftOwner`;
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
