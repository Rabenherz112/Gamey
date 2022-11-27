const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { colors, Embed } = require("../../config.json");

const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Gives you a tutorial on how to use the bot");

module.exports = {
  data,
  name: "help",

  async execute(client, interaction) {
    // Create and send a new Embed
    let embed = new EmbedBuilder()
      .setTitle("Gamey - Your free Game Finder")
      .setDescription(
        `Gamey is a Discord Bot that notifies you when a new free game is available and gives you all Informations you need to claim it.\n\n
        To get started use the command \`/set-channel\` to set the channel where the bot will post the free games. If you want to recieve a ping for every new free game use \`/set-notification\`.\n\n
        After this is done, you will need to wait, until somebody finds a new free game and posts about it in Reddit.`
      )
      .setColor(colors.Embed_Info)
      .setTimestamp()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setFooter({
        text: Embed.Footer,
        iconURL: Embed.Footer_Icon,
      });
    interaction.reply({ embeds: [embed] });
  },
};
