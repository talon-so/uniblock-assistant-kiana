const axios = require('axios');
const {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder
} = require('discord.js');
const imports = require('../../index.js');
const { addQueryOptions } = require('../../utils/addQueryOptions');
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

        let embed1 = new EmbedBuilder()
          .setTitle('testy')
          .setImage('https://picsum.photos/400')
          .setURL('https://picsum.photos/500');
        let embed2 = new EmbedBuilder()
          .setTitle('test2')
          .setImage('https://picsum.photos/400')
          .setURL('https://picsum.photos/500');
        let embed3 = new EmbedBuilder()
          .setTitle('test3')
          .setImage('https://picsum.photos/400')
          .setURL('https://picsum.photos/500');
        let embed4 = new EmbedBuilder()
          .setImage('https://picsum.photos/400')
          .setURL('https://picsum.photos/500');
        let embed5 = new EmbedBuilder()
          .setImage('https://picsum.photos/400')
          .setURL('https://picsum.photos/300');
        let embed6 = new EmbedBuilder()
          .setImage('https://picsum.photos/400')
          .setURL('https://picsum.photos/300');
        let embed7 = new EmbedBuilder()
          .setImage('https://picsum.photos/400')
          .setURL('https://picsum.photos/300');
        let embed8 = new EmbedBuilder()
          .setImage('https://picsum.photos/400')
          .setURL('https://picsum.photos/300');

        await interaction.editReply({
          embeds: [
            embed1,
            embed2,
            embed3,
            embed4,
            embed5,
            embed6,
            embed7,
            embed8
          ],
          files: [attachment]
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
