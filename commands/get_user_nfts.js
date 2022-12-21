const axios = require('axios');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const imports = require('../index.js');
const { getNetwork } = require('../constants/network.js');

module.exports = {
  name: 'get_user_nfts',
  description:
    'Gets the NFT balance of a specific user from all supported networks.',
  cooldown: 1000,
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

      // add params to query url as needed
      let params = { chainId: chainId };
      let queryURL = process.env.UNIBLOCK_BASE_URL + `/nft/${address}`;
      const res = await axios.get(queryURL, { params: params }).catch((e) => {
        console.log(
          '-------------------------------------- AXIOS ERROR ----------------------------------------'
        );
        interaction.editReply(
          e.response.data.statusCode + ': ' + e.response.data.message
        );
      });

      if (res) {
        console.log(res.data);
        // Send a message into the channel where command was triggered from
        const strRes = JSON.stringify(res.data, null, 2);

        const attachment = new AttachmentBuilder(Buffer.from(strRes, 'utf-8'), {
          name: 'response.txt'
        });

        await interaction.editReply({
          //files: [attachment]
        });
      }
    } catch (e) {
      console.log(
        '-------------------------------------- TRY CATCH HIT ----------------------------------------'
      );
      console.log(e);
    }
  }
};
