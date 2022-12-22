const axios = require('axios');
const {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder
} = require('discord.js');
const imports = require('../../index.js');
const { addQueryOptions } = require('../../utils/addQueryOptions');
const { NETWORK_OPTIONS } = require('../../constants/network.js');

const name = 'get_balance_historical';
const description =
  "Gets the user's historical portfolio value, and user's historical balance records.";

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

      let embed1 = new EmbedBuilder()
        .setTitle('Some title')
        .setURL(
          'https://uc313f52f1dff5e27ce681578805.previews.dropboxusercontent.com/p/thumb/ABxooOQ11HLoy-osr1iienXOulzAebB9uIdUJDXsPjSbsDrucTfgajTYVaEsizoxlU1TFm3Pf58XjDrHlTFqVQ9x-3UR-F0Bni06lj_0v0DT5XJBlj8hxEo4EWepdQryCKDOThOJYbYPrJaruxx78u0n0fL23KRuA57S4I_hvA4Uz39Qf4PqUYwyRtMv2edBaL5sEVdnhrDnQM5m26fFgoBBxtHgvofMjRs1Ao7NRGDGpcHrdWDJ8fPgbaW-eHSfWK1jVaqFRQpITD1WIzAUJRnkfXx0smq4mzvJCnSKQYQ8Hx-reLt5o9HNF9JzTjP75hZ5ONldnXmBa2ALDLAW6sk7NbhCuZZmp0OMadkfG8lbjTNiIOIsS9KaAJd1X8trxe9lO9HBw1ZHBalKPnlp3z971iU5Gwm0Q0chjy54Nomjxw/p.png'
        )
        .setImage(
          'https://uc313f52f1dff5e27ce681578805.previews.dropboxusercontent.com/p/thumb/ABxooOQ11HLoy-osr1iienXOulzAebB9uIdUJDXsPjSbsDrucTfgajTYVaEsizoxlU1TFm3Pf58XjDrHlTFqVQ9x-3UR-F0Bni06lj_0v0DT5XJBlj8hxEo4EWepdQryCKDOThOJYbYPrJaruxx78u0n0fL23KRuA57S4I_hvA4Uz39Qf4PqUYwyRtMv2edBaL5sEVdnhrDnQM5m26fFgoBBxtHgvofMjRs1Ao7NRGDGpcHrdWDJ8fPgbaW-eHSfWK1jVaqFRQpITD1WIzAUJRnkfXx0smq4mzvJCnSKQYQ8Hx-reLt5o9HNF9JzTjP75hZ5ONldnXmBa2ALDLAW6sk7NbhCuZZmp0OMadkfG8lbjTNiIOIsS9KaAJd1X8trxe9lO9HBw1ZHBalKPnlp3z971iU5Gwm0Q0chjy54Nomjxw/p.png'
        );

      let embed2 = new EmbedBuilder()
        .setURL(
          'https://uc313f52f1dff5e27ce681578805.previews.dropboxusercontent.com/p/thumb/ABxooOQ11HLoy-osr1iienXOulzAebB9uIdUJDXsPjSbsDrucTfgajTYVaEsizoxlU1TFm3Pf58XjDrHlTFqVQ9x-3UR-F0Bni06lj_0v0DT5XJBlj8hxEo4EWepdQryCKDOThOJYbYPrJaruxx78u0n0fL23KRuA57S4I_hvA4Uz39Qf4PqUYwyRtMv2edBaL5sEVdnhrDnQM5m26fFgoBBxtHgvofMjRs1Ao7NRGDGpcHrdWDJ8fPgbaW-eHSfWK1jVaqFRQpITD1WIzAUJRnkfXx0smq4mzvJCnSKQYQ8Hx-reLt5o9HNF9JzTjP75hZ5ONldnXmBa2ALDLAW6sk7NbhCuZZmp0OMadkfG8lbjTNiIOIsS9KaAJd1X8trxe9lO9HBw1ZHBalKPnlp3z971iU5Gwm0Q0chjy54Nomjxw/p.png'
        )
        .setImage('https://someimagelink.jpg');

      let embed3 = new EmbedBuilder()
        .setURL(
          'https://uc313f52f1dff5e27ce681578805.previews.dropboxusercontent.com/p/thumb/ABxooOQ11HLoy-osr1iienXOulzAebB9uIdUJDXsPjSbsDrucTfgajTYVaEsizoxlU1TFm3Pf58XjDrHlTFqVQ9x-3UR-F0Bni06lj_0v0DT5XJBlj8hxEo4EWepdQryCKDOThOJYbYPrJaruxx78u0n0fL23KRuA57S4I_hvA4Uz39Qf4PqUYwyRtMv2edBaL5sEVdnhrDnQM5m26fFgoBBxtHgvofMjRs1Ao7NRGDGpcHrdWDJ8fPgbaW-eHSfWK1jVaqFRQpITD1WIzAUJRnkfXx0smq4mzvJCnSKQYQ8Hx-reLt5o9HNF9JzTjP75hZ5ONldnXmBa2ALDLAW6sk7NbhCuZZmp0OMadkfG8lbjTNiIOIsS9KaAJd1X8trxe9lO9HBw1ZHBalKPnlp3z971iU5Gwm0Q0chjy54Nomjxw/p.png'
        )
        .setImage('https://someimagelink.jpg');

      let embed4 = new EmbedBuilder()
        .setURL(
          'https://uc313f52f1dff5e27ce681578805.previews.dropboxusercontent.com/p/thumb/ABxooOQ11HLoy-osr1iienXOulzAebB9uIdUJDXsPjSbsDrucTfgajTYVaEsizoxlU1TFm3Pf58XjDrHlTFqVQ9x-3UR-F0Bni06lj_0v0DT5XJBlj8hxEo4EWepdQryCKDOThOJYbYPrJaruxx78u0n0fL23KRuA57S4I_hvA4Uz39Qf4PqUYwyRtMv2edBaL5sEVdnhrDnQM5m26fFgoBBxtHgvofMjRs1Ao7NRGDGpcHrdWDJ8fPgbaW-eHSfWK1jVaqFRQpITD1WIzAUJRnkfXx0smq4mzvJCnSKQYQ8Hx-reLt5o9HNF9JzTjP75hZ5ONldnXmBa2ALDLAW6sk7NbhCuZZmp0OMadkfG8lbjTNiIOIsS9KaAJd1X8trxe9lO9HBw1ZHBalKPnlp3z971iU5Gwm0Q0chjy54Nomjxw/p.png'
        )
        .setImage('https://someimagelink.jpg');

      await interaction.editReply('test', {
        embed: [embed1, embed2, embed3]
        //files: [attachment]
      });
      if (res) {
        const res = await axios.get(queryURL, { params: params }).catch((e) => {
          console.log(
            '-------------------------------------- AXIOS ERROR ----------------------------------------'
          );
          interaction.editReply(
            e.response.data.statusCode + ': ' + e.response.data.message
          );
        });
        console.log(res.data);
        // Send a message into the channel where command was triggered from
        const strRes = JSON.stringify(res.data, null, 2);

        const attachment = new AttachmentBuilder(Buffer.from(strRes, 'utf-8'), {
          name: 'response.txt'
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
