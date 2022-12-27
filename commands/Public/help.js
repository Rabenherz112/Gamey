const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { colors, Embed } = require("../../config.json");
const { Octokit } = require("@octokit/rest");

const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Gives you a tutorial on how to use the bot");

module.exports = {
  data,
  name: "help",

  async execute(client, interaction) {
    // Get from GitHub latest Release
    const octokit = new Octokit();
    let release = await octokit.repos.getLatestRelease({
      owner: "Rabenherz112",
      repo: "Gamey",
    });
    let version = release.data.tag_name;
    let releaseDate = release.data.published_at;
    // Calculate time since release
    let date = new Date(releaseDate);
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let diffMonths = Math.floor(diff / (1000 * 3600 * 24 * 30));
    let diffWeeks = Math.floor(diff / (1000 * 3600 * 24 * 7));
    let diffDays = Math.floor(diff / (1000 * 3600 * 24));
    let diffHours = Math.floor(diff / (1000 * 3600));
    let diffMinutes = Math.floor(diff / (1000 * 60));
    let diffSeconds = Math.floor(diff / 1000);
    let time;
    if (diffMonths > 0) {
      time = `${diffMonths} month(s) ago`;
    } else if (diffWeeks > 0) {
      time = `${diffWeeks} week(s) ago`;
    } else if (diffDays > 0) {
      time = `${diffDays} day(s) ago`;
    } else if (diffHours > 0) {
      time = `${diffHours} hour(s) ago`;
    } else if (diffMinutes > 0) {
      time = `${diffMinutes} minute(s) ago`;
    } else if (diffSeconds > 0) {
      time = `${diffSeconds} second(s) ago`;
    }
    let releaseLink = release.data.html_url;
    let releaseName = release.data.name;
    // Check which version is used locally
    let localVersion = require("../../package.json").version;
    if (version != "v"+localVersion) {
      version = `${version} (Local: ${localVersion})`;
    }
    // Create Embed
    let embed = new EmbedBuilder()
      .setTitle(`Gamey ${version} - Your free Game Finder`)
      .setDescription(
        `Gamey is a Discord Bot that notifies you when a new free game is available and gives you all Informations you need to claim it.\n
        To get started use the command \`/set-channel\` to set the channel where the bot will post the free games. If you want to recieve a ping for every new free game use \`/set-notification\`.\n
        After this is done, you will need to wait, until somebody finds a new free game and posts about it in Reddit.`
      )
      .setFields(
        {
          name: "Support Server",
          value: "[Click here](https://discord.gg/ySk5eYrrjG)",
          inline: true
        },
        {
          name: "Invite",
          value: "[Click here](https://discord.com/api/oauth2/authorize?client_id=918571056791453726&permissions=139586914304&scope=bot)",
          inline: true
        },
        {
          name: "Source Code",
          value: "[Click here](https://github.com/Rabenherz112/Gamey)",
          inline: true
        },
        {
          name: "Latest Update",
          value: `[${releaseName} - ${time}](${releaseLink})`,
          inline: true
        }
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
