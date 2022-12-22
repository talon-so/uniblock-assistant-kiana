const Discord = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  once: false,
  run(interaction, client) {
    if (!interaction.isCommand()) return;
    const commandName = interaction.commandName;
    const command = client.commands.find((cmd) => cmd.name == commandName);
    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Discord.Collection());
    }

    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = command.cooldown || 0;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;
      if (Date.now() < expirationTime) {
        const timeLeft = (expirationTime - Date.now()) / 1000;
        return interaction.reply(
          'Whoops, you are on cooldown for this command for another ' +
            timeLeft +
            ' seconds.'
        );
      }
    }

    timestamps.set(interaction.user.id, Date.now());

    if (command) return command.run(interaction, client);
  }
};
