module.exports = {
	"": async (client, guild) => {
		try {
			if (!client || !client.db)
				return;
			let db = client.db;
			await db.delete(`${guild.id}`);
		} catch (e) {
			// Ignore
		}
	},
	autoload: true
}