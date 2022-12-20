const axios = require('axios');

module.exports = {
  name: "ready",
  once: true,
  run(client) {
    // console.log("Successfully logged in as " + client.user.tag);
    // Update price status every 2 minutes
    // setInterval(async () => {
    //   const axiosRes = await axios.get(process.env.UNIBLOCK_BASE_URL + '/price?address=0x0000000000000000000000000000000000000000&chainId=1');
    //   const price = axiosRes["priceData"][0]["price"];
    //   client.user.setActivity(`ETH $${price}`);
    // }, 120000);
  },
};
