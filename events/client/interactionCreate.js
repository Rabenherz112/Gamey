module.exports = {
    "": async (client, interaction) => {
        if(!interaction.guildId) return;

        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(client, interaction);
            } catch (error) {
                if (error) console.error(error);
                await interaction.reply({ content: `Error`, ephemeral: true });
            };
        };
    },
	autoload: true
}