const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const imports = require('../../index.js');
const { NETWORK_OPTIONS } = require('../../constants/network.js');

const name = 'resolve_name';
const description = 'Resolves the ENS domain to get the address.';

const builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((option) =>
    option
      .setName('domain')
      .setDescription('ENS domain to resolve.')
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
    // defaults domain to a set user wallet
    const domain =
      interaction.options.getString('domain') ||
      imports.wallets[interaction.user.id];
    // throw error if no domain given and no user wallet set
    if (!domain) {
      interaction.editReply('No domain given');
      return;
    }
    const chainId = interaction.options.getInteger('chain_id') || 1;

    // add params to query url as needed
    let params = { chainId: chainId, domain: domain };

    let queryURL = process.env.UNIBLOCK_BASE_URL + `/ens/resolveName`;
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
      await interaction.editReply(`Address: ${res?.data?.address}`);
    }
  }
};
