const axios = require('axios');

module.exports = {
  name: 'gas_price',
  description: 'Get Gas Fees',
  cooldown: 1000,
  async run(interaction, client) {
    // Make a request for a user with a given ID
    const axiosRes = await axios.get(process.env.UNIBLOCK_BASE_URL + '/utils/getGasPrice?chainId=1');
    // Send a message into the channel where command was triggered from

    interaction.reply({ content: `gasPrice is ${axiosRes.data.gasPrice}` });
  }
};