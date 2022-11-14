module.exports = {
  name: "ping",
  description: "Get the bot's ping",
  cooldown: 1000,
  async run(interaction, client) {
    interaction.reply({ content: client.ws.ping.toString() + "ms" });
  },
};
