const fs = require("fs");
const config = require("../../config.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token } = require("../../token.json");

module.exports = {
  "": async (client) => {
    // Database Handler
    async function initDB() {
      const guilds = client.guilds.cache.map((guild) => guild.id);
      for (const guild of guilds) {
        const dbGuild = await db.get(`${guild}`);
        // If the guild is not in the database, add it
        if (!dbGuild) {
          await db.set(
            `${guild}`,
            {
              feedChannel: null,
              feedChannelType: null,
              feedRole: null
            }
          );
        }
      }
      // For each subreddits in the config.json file, add it to the database
      for (const subreddit of config.subreddits) {
        const dbSubreddit = await db.get(`${subreddit}`);
        if (!dbSubreddit) {
          await db.set(`${subreddit}`, { feedUpdate: null });
        }
      }
    }
    client.db = db;
    client.on("guildCreate", async (guild) => {
      const dbGuild = await db.get(`${guild.id}`);
      // If the guild is not in the database, add it
      if (!dbGuild) {
        await db.set(
          `${guild.id}`,
          {
            feedChannel: null,
            feedChannelType: null,
            feedRole: null
          }
        );
      }
    });
    await initDB();

    // Slash Command Handler
    let cmds = [];
    client.commands = new Collection();
    // Read all files in the commands folder
    let dir = "./commands";
    fs.readdirSync(dir).forEach((dirs) => {
      const commands = fs
        .readdirSync(`${dir}/${dirs}/`)
        .filter((files) => files.endsWith(".js"));
      // For each file, push the command to the cmds array
      for (const file of commands) {
        const command = require(`../../${dir}/${dirs}/${file}`);
        console.log("[COMMAND]", `Loaded command ${command.name}`);
        client.commands.set(command.name, command);
        cmds.push(command.data.toJSON());
      }
    });
    // Register Slash Commands globally
    const rest = new REST({ version: "10" }).setToken(token);
    (async () => {
      try {
        console.log("[CLIENT] Started refreshing application (/) commands.");
        if (config.slashCommandsGlobal === true) {
          await rest.put(Routes.applicationCommands(client.user.id), {
            body: cmds,
          });
        } else {
          await rest.put(
            Routes.applicationGuildCommands(client.user.id, config.guildIDDev),
            { body: cmds }
          );
        }
        console.log("[CLIENT] Successfully reloaded application (/) commands.");
      } catch (error) {
        console.error(error);
      }
    })();
    // Set Bot Status to "Watching /help | Server Count"
    client.user.setActivity(`/help | ${client.guilds.cache.size} servers`, {
      type: "WATCHING",
    });
    // Start checking Reddit
    let util_checkreddit = require("../../functions/util_checkReddit");
    util_checkreddit.insertClient(client);
    util_checkreddit.checkReddit(client);
    module.exports = cmds;
  },
  autoload: true
}