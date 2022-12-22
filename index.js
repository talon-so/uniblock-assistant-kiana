require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client({
  intents: [Discord.GatewayIntentBits.Guilds],
});

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`);
//   client.commands.set(command.name, command);
// }

for (const file of commandFiles) {
  if (!file.endsWith('.js')) {
    {
      const subCommandFiles = fs
        .readdirSync(`./commands/${file}`)
        .filter((file) => file.endsWith('.js'));
      for (const subfile of subCommandFiles) {
        const command = require(`./commands/${file}/${subfile}`);
        client.commands.set(command.name, command);
      }
    }
  } else {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
}

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.run(...args, client));
  } else {
    client.on(event.name, (...args) => event.run(...args, client));
  }
}

client.login(process.env.DISCORD_TOKEN);

module.exports.wallets = {};