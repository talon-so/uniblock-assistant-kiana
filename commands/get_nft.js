const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const imports = require('../index.js');

module.exports = {
  name: 'get_nft',
  description: 'Gets information of a specific NFT.',
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
      interaction.editReply('No address given to get NFT');
      return;
    }
    const chainId = interaction.options.getInteger('chain_id') || 1;
    const tokenId = interaction.options.getInteger('token_id');
    if (!address) {
      interaction.editReply('No token ID given to get NFT');
      return;
    }

    // add params to query url as needed
    let params = { chainId: chainId, nftId: tokenId, nftAddress: address };

    let queryURL = process.env.UNIBLOCK_BASE_URL + `/nft/nftInfo`;
    const res = await axios.get(queryURL, { params: params }).catch((e) => {
      console.log(
        '-------------------------------------- ERROR ----------------------------------------'
      );
      console.log(e);
      interaction.editReply(
        e.response.data.statusCode + ': ' + e.response.data.message
      );
    });

    if (res) {
      // try and get metadata
      const metadata = await axios.get(res.data.tokenURI);
      if (metadata) {
        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(metadata.data.name)
          .setURL(res.data.tokenURI)
          .setDescription(metadata.data.description)
          .setImage(metadata.data.image)
          .setTimestamp()
          .setFooter({
            text: 'powered by Uniblock',
            iconURL: 'https://i.imgur.com/AfFp7pu.png'
          });
        /*.setAuthor({
          name: 'powered by Uniblock',
          iconURL:'https://i.imgur.com/AfFp7pu.png',
          url: 'https://discord.js.org'
        })
       .setThumbnail('https://i.imgur.com/AfFp7pu.png')
       */

        const traits = metadata.data.attributes;
        for (const i in traits) {
          embed.addFields({
            name: traits[i].trait_type,
            value: traits[i].value,
            inline: true
          });
        }

        // opensea url
        embed.addFields({
          name: 'View on OpenSea',
          value: `https://opensea.io/assets/ethereum/${address}/${tokenId}`
        });
      }
      await interaction.editReply({
        body: res.data.tokenURI,
        embeds: metadata ? [embed] : []
      });
    }
  }
};
