const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { colors, Embed } = require("../../config.json");

const data = new SlashCommandBuilder()
  .setName("set-notification")
  .setDescription("Shows the current notification role or sets a new one")
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("The role to send the notifications to")
      .setRequired(false)
  );

module.exports = {
  data,
  name: "set-notification",

  async execute(client, interaction) {
    // Check if User has Administator Permission else return
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({
        content: "You don't have the permission to use this command.",
        ephemeral: true,
      });
    }
    // Get Role of the Interaction
    let role = interaction.options.getRole("role");
    // Check if Role is null if so show the currently set role
    if (role === null) {
        let dbRole = await client.db.get(
          `${interaction.guild.id}.feedRole`
        );
        // FIXME
        if (dbRole === null) {
          return interaction.reply({
            content: "There is no notifcation role set yet.",
            ephemeral: true,
          });
        }
        let role = interaction.guild.roles.cache.get(dbRole);
        return interaction.reply({
          content: `The current notification role is ${role}.`,
          ephemeral: true,
        });
      }
    // Set the Role in the Database
    await client.db.set(`${interaction.guild.id}`, {
      feedRole: role.id,
    });
    // Send Success Message
    let embed = new EmbedBuilder()
      .setTitle(`${role.name} is now the feed role`)
      .setDescription(
        `${role} will now be notified, as soon as I find a new Free Game.\nYou can change the role again with \`/set-notification\``
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
    interaction.reply({ embeds: [embed] });
  },
};
