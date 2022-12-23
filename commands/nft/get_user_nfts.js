const axios = require('axios');
const {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder
} = require('discord.js');
const imports = require('../../index.js');
const { addQueryOptions } = require('../../utils/addQueryOptions');
const { convertIPFSUrl } = require('../../utils/convertIPFSUrl');
const { NETWORK_OPTIONS } = require('../../constants/network.js');

const name = 'get_user_nfts';
const description = 'Get the NFT balance of a specific user.';

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
      .setDescription('Enter the address of the NFT contract')
      .setRequired(false)
  )
  .addIntegerOption((option) =>
    option
      .setName('token_id')
      .setDescription('Enter the NFT ID of the specific NFT to query')
      .setRequired(false)
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
  builder.options[3].addChoices(choice);
});
addQueryOptions(builder);

module.exports = {
  name: name,
  description: description,
  builder: builder,
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

      let queryURL = process.env.UNIBLOCK_BASE_URL + `/nft/${address}`;

      const res = await axios.get(queryURL, { params: params }).catch((e) => {
        console.log(
          '-------------------------------------- AXIOS ERROR ----------------------------------------'
        );

        interaction.editReply(
          e?.response?.data?.statusCode + ': ' + e?.response?.data?.message
        );
      });
      if (res) {
        const strRes = JSON.stringify(res.data, null, 2);
        const attachment = new AttachmentBuilder(Buffer.from(strRes, 'utf-8'), {
          name: 'response.txt'
        });
        let titleEmbed = new EmbedBuilder().setTitle('Last NFTs');
        let nftEmbeds = [titleEmbed];
        let maxEmbeds = Math.min(res.data.count, 8);
        let count = 0;
        let index = 0;
        // run while less than 8 embeds created and array index less than queried results
        while (count < maxEmbeds && index < res.data.count) {
          // console.log('index ', index);
          // console.log('count ', count);
          // console.log(convertIPFSUrl(res.data.assets[index].nftInfo.tokenURI));
          const metadata = await axios
            .get(convertIPFSUrl(res.data.assets[index].nftInfo.tokenURI), {
              headers: { 'Accept-Encoding': 'gzip,deflate,compress' } // TODO: remove when axios fixes issue https://github.com/axios/axios/issues/5346
            })
            .catch((e) => {
              console.log(
                '-------------------------------------- AXIOS ERROR ----------------------------------------'
              );
              console.log(e?.response?.status + ': ' + e?.response?.data);
            });
          // if metadata contains an image field increase embed count
          if (metadata?.data?.image) {
            newEmbed = new EmbedBuilder()
              .setImage(convertIPFSUrl(metadata?.data?.image))
              // to group image embeds together (4 max) set the same url
              .setURL(count < 4 ? 'https://set1.test' : 'https://set2.test');
            nftEmbeds.push(newEmbed);
            count++;
          }
          index++;
        }

        // replies with embeds if nft embeds are available
        if (nftEmbeds.length > 1) {
          // display title above embed nfts
          const titleStr = `Last ${count} NFT`;
          if (count > 1) titleStr + 's';
          titleEmbed.setTitle(titleStr);

          await interaction.editReply({
            embeds: nftEmbeds,
            files: [attachment]
          });
        } else {
          await interaction.editReply({
            files: [attachment]
          });
        }
      }
    } catch (e) {
      console.log(
        '-------------------------------------- TRY CATCH HIT ----------------------------------------'
      );
      console.log(e);
    }
  }
};
