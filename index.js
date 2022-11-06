// Basic Setup
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const config = require("./config.json");
const { token } = require("./token.json");
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Database Handler
async function initDB() {
  //const posts = await new_posts.newPosts(10);
  //await db.set("lastPost", { "id": posts[0].id, "time": posts[0].time });

  const guilds = client.guilds.cache.map(guild => guild.id);
  for (const guild of guilds) {
      const dbGuild = await db.get(`${guild}`);
      // If the guild is not in the database, add it
      if (!dbGuild) {
          await db.set(`${guild}`, { "feedChannel": null }, { "feedChannelType": null });
      };
  };
};
initDB();

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
        console.log("[COMMAND]", `Loaded command ${pull.name}`);
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
      console.log("[EVENT]", `Loaded event ${evtName}`);
    }
  });
};
loadEvents();

// Login
client.login(token);
