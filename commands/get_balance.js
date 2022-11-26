const axios = require('axios');
const { wrapCodeBlock } = require('../utils/wrapCodeBlock');
const { AttachmentBuilder } = require('discord.js');
const imports = require('../index.js');

module.exports = {
  name: 'get_balance',
  description: 'Ping the Uniblock API',
  cooldown: 1000,
  async run(interaction) {
    await interaction.deferReply();
    // parameters
    const address =
      interaction.options.getString('address') ||
      imports.wallets[interaction.user.id]; // defaults to a set user wallet
    const chainId = interaction.options.getInteger('chainId') || 1;

    const axiosRes = await axios
      .get(
        process.env.UNIBLOCK_BASE_URL + `/balance/${address}?chainId=${chainId}`
      )
      .catch((e) => {
        console.log(
          '-------------------------------------- ERROR ----------------------------------------'
        );
        console.log(e.data);
        interaction.reply(e.data);
      });

    if (axiosRes) {
      // Send a message into the channel where command was triggered from
      const strRes = JSON.stringify(axiosRes.data, null, 2);

      const attachment = new AttachmentBuilder(Buffer.from(strRes, 'utf-8'), {
        name: 'response.txt'
      });

      await interaction.editReply({
        files: [attachment]
      });
    }
  }
};
