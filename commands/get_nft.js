const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const imports = require('../index.js');
const { getNetwork } = require('../constants/network.js');

module.exports = {
  name: 'get_nft',
  description: 'Gets information of a specific NFT.',
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
      if (!tokenId) {
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
            .setURL(res?.data?.tokenURI)
            .setTimestamp()
            .setFooter({
              text: 'powered by Uniblock',
              iconURL:
                'https://uc313f52f1dff5e27ce681578805.previews.dropboxusercontent.com/p/thumb/ABxooOQ11HLoy-osr1iienXOulzAebB9uIdUJDXsPjSbsDrucTfgajTYVaEsizoxlU1TFm3Pf58XjDrHlTFqVQ9x-3UR-F0Bni06lj_0v0DT5XJBlj8hxEo4EWepdQryCKDOThOJYbYPrJaruxx78u0n0fL23KRuA57S4I_hvA4Uz39Qf4PqUYwyRtMv2edBaL5sEVdnhrDnQM5m26fFgoBBxtHgvofMjRs1Ao7NRGDGpcHrdWDJ8fPgbaW-eHSfWK1jVaqFRQpITD1WIzAUJRnkfXx0smq4mzvJCnSKQYQ8Hx-reLt5o9HNF9JzTjP75hZ5ONldnXmBa2ALDLAW6sk7NbhCuZZmp0OMadkfG8lbjTNiIOIsS9KaAJd1X8trxe9lO9HBw1ZHBalKPnlp3z971iU5Gwm0Q0chjy54Nomjxw/p.png'
            });
          metadata?.data?.name
            ? embed.setTitle(metadata?.data?.name)
            : embed.setTitle(tokenId);
          if (metadata?.data?.description)
            embed.setDescription(metadata?.data?.description);
          if (metadata?.data?.image) embed.setImage(metadata?.data?.image);
          /*.setAuthor({
          name: 'powered by Uniblock',
          iconURL:'https://i.imgur.com/AfFp7pu.png',
          url: 'https://discord.js.org'
        })
       .setThumbnail('https://i.imgur.com/AfFp7pu.png')
       */

          const traits = metadata?.data?.attributes;
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
            value: `https://opensea.io/assets/${
              getNetwork(chainId).openseaCategory
            }/${address}/${tokenId}`
          });
          return await interaction.editReply({
            embeds: [embed]
          });
        }
        return await interaction.editReply({
          body: res.data.tokenURI
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
};
