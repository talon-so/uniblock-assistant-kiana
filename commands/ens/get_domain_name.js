const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const imports = require('../../index.js');
const { NETWORK_OPTIONS } = require('../../constants/network.js');

const name = 'get_domain_name';
const description = 'Looks up the ENS domain name bound to a wallet address.';

const builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((option) =>
    option
      .setName('address')
      .setDescription('Address of the user to fetch the default ENS domain for')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('chain_id')
      .setDescription('Network to resolve domain for.')
      .setRequired(false)
  );

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
      interaction.editReply('No address given or set');
      return;
    }
    const chainId = interaction.options.getInteger('chain_id') || 1;

    // add params to query url as needed
    let params = { chainId: chainId, address: address };

    let queryURL = process.env.UNIBLOCK_BASE_URL + `/ens/lookupName`;
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

      await interaction.editReply(`Domain: ${res?.data?.domain}`);
    }
  }
};
