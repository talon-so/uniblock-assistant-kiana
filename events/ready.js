const axios = require('axios');
const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async run(client) {
    console.log("Successfully logged in as " + client.user.tag);

    // Periodically update ETH price status every minute
    setInterval(async () => {
      console.log("Updating Ξ Price status" + client.user.tag);
      const axiosRes = await axios.get(process.env.UNIBLOCK_BASE_URL + '/price?address=0x0000000000000000000000000000000000000000&chainId=1');
      const price = axiosRes.data.priceData[0].price
      client.user.setActivity(`Ξ ETH $${price}`, {
        type: ActivityType.Watching
      });
    }, 60000);
  },
};
