// Basic Setup
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require("./config.json");
const { token } = require("./token.json");
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Event Handler
const loadEvents = (dir = "./events/") => {
  fs.readdirSync(dir).forEach((dirs) => {
    const events = fs
      .readdirSync(`${dir}/${dirs}/`)
      .filter((files) => files.endsWith(".js"));

    for (const event of events) {
      const evt = require(`${dir}/${dirs}/${event}`);
      if(!evt || !evt.autoload)
      continue;
      const evtName = event.split(".")[0];
      client.on(evtName, evt[""].bind(null, client));
      console.log("[EVENT]", `Loaded event ${evtName}`);
    }
  });
};
loadEvents();

// Login
client.login(token);