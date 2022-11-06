const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { colors, Embed } = require("../../config.json");
const db = require("quick.db");

module.exports = {
    name: "set-channel",
    description: "Set the channel for the bot to send the notifications to",
    options: [
        {
            name: "channel",
            description: "The channel to send the notifications to",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT", "GUILD_NEWS"],
            required: true,
        },
    ],

    async execute(interaction) {
    // Check if User has Administator Permission else return
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({
        content: "You don't have the permission to use this command.",
        ephemeral: true,
      });
    }
    // Get Channel of the Interaction
    let channel = interaction.options.getChannel("channel");
    // Set the Channel in the Database
    await db.set(`${interaction.guild.id}`, {
      feedChannel: channel.id,
      feedChannelType: channel.type,
    });
    // Send Success Message
    let embed = new EmbedBuilder()
      .setTitel(`${channel.name} is now the feed channel`)
      .setDescription(
        `New Free Games will be posted in ${channel}.\nYou can change the channe again with /set-channel`
      )
      .setColor(colors.Embed_Success)
      .setTimestamp()
      .setAuthor(
        interaction.user.tag,
        interaction.user.displayAvatarURL({ dynamic: true })
      )
      .setFooter(`${Embed.Footer}`, `${Embed.Footer_Icon}`);
    return interaction.reply({ embeds: [embed] });
  },
};
