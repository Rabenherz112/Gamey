// Basic Setup
const Discord = require("discord.js");
const fs = require("fs");
const db = require("quick.db");
const { config, token } = require("./config.json");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS],
});


// Collection for Commands
const commands = [];
client.commands = new Collection();

// Command Handler
const loadCommands = (dir = "./commands/") => {
  fs.readdirSync(dir).forEach((dirs) => {
    const commands = fs
      .readdirSync(`${dir}/${dirs}/`)
      .filter((files) => files.endsWith(".js"));

    for (const file of commands) {
      const pull = require(`${dir}/${dirs}/${file}`);

      if (pull.name) {
        client.commands.set(pull.name, pull);
      } else {
        continue;
      }
    }
  });
};
loadCommands();
module.exports = commands;

// Event Handler
const loadEvents = (dir = "./events/") => {
  fs.readdirSync(dir).forEach((dirs) => {
    const events = fs
      .readdirSync(`${dir}/${dirs}/`)
      .filter((files) => files.endsWith(".js"));

    for (const event of events) {
      const evt = require(`${dir}/${dirs}/${event}`);
      const evtName = event.split(".")[0];
      client.on(evtName, evt.bind(null, client));
    }
  });
}
loadEvents();

// Login
client.login(token);