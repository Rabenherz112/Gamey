const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { colors, Embed } = require("../../config.json");
const { ChannelType } = require("discord-api-types/v10");

const data = new SlashCommandBuilder()
  .setName("set-channel")
  .setDescription("Shows the current channel for the feed or sets a new one")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to send the notifications to")
      .setRequired(false)
      .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
  );

module.exports = {
  data,
  name: "set-channel",

  async execute(client, interaction) {
    // Check if User has Administator Permission else return
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({
        content: "You don't have the permission to use this command.",
        ephemeral: true,
      });
    }
    // Get Channel of the Interaction
    let channel = interaction.options.getChannel("channel");
    let dbGuild = await client.db.get(
      `${interaction.guild.id}`
    );
    // Check if Channel is null if so show the currently set channel
    if (channel === null) {
      let dbChannel = dbGuild.feedChannel;
      if (dbChannel === null) {
        return interaction.reply({
          content: "There is no notifcation channel set yet.",
          ephemeral: true,
        });
      }
      let channel = client.channels.cache.get(dbChannel);
      return interaction.reply({
        content: `The current notification channel is ${channel}.`,
        ephemeral: true,
      });
    }
    // Set the Channel in the Database
    dbGuild.feedChannel = channel.id;
    dbGuild.feedChannelType = channel.type;
    await client.db.set(`${interaction.guild.id}`, dbGuild);
    // Send Success Message
    let embed = new EmbedBuilder()
      .setTitle(`${channel.name} is now the feed channel`)
      .setDescription(
        `New Free Games will be posted in ${channel}.\nYou can change the channe again with \`/set-channel\``
      )
      .setColor(colors.Embed_Success)
      .setTimestamp()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setFooter({
        text: Embed.Footer,
        iconURL: Embed.Footer_Icon,
      });
    return interaction.reply({ embeds: [embed] });
  },
};
