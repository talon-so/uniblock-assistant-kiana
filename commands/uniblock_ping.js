const axios = require('axios');

module.exports = {
  name: 'uniblock_ping',
  description: 'Ping the Uniblock API',
  cooldown: 1000,
  async run(interaction, client) {
    // Make a request for a user with a given ID
    const axiosRes = await axios.get(process.env.UNIBLOCK_BASE_URL + '/ping');
    // Send a message into the channel where command was triggered from

    interaction.reply({ content: axiosRes.data.ping });
  }
};
