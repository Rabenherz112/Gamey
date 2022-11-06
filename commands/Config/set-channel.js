const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { colors, Embed } = require("../../config.json");
const { ChannelType } = require("discord-api-types/v10");

const data = new SlashCommandBuilder()
  .setName("set-channel")
  .setDescription("Set the channel for the bot to send the notifications to")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to send the notifications to")
      .setRequired(true)
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
    // Set the Channel in the Database
    await client.db.set(`${interaction.guild.id}`, {
      feedChannel: channel.id,
      feedChannelType: channel.type,
    });
    // Send Success Message
    let embed = new EmbedBuilder()
      .setTitle(`${channel.name} is now the feed channel`)
      .setDescription(
        `New Free Games will be posted in ${channel}.\nYou can change the channe again with /set-channel`
      )
      .setColor(colors.Embed_Success)
      .setTimestamp()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setFooter({
        text: Embed.Footer,
        iconURL: Embed.Icon,
      });
    return interaction.reply({ embeds: [embed] });
  },
};
