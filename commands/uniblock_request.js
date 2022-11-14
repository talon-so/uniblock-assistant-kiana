module.exports = {
  name: "uniblock_request",
  description: "generate uniblock request link",
  cooldown: 1000,
  async run(interaction) {
    interaction.reply({ content: "https://request.uniblock.dev/" });
  },
};
