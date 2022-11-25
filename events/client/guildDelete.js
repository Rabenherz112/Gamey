module.exports = {
	"": async (client, guild) => {
		try {
			if(!client || !client.db)
			return;
			let db = client.db;
            console.log(`[GUILD] Left guild ${guild.name} (${guild.id})`);
			await db.delete(`${guild.id}`);
		} catch(e) {
			// Ignore
		}
	},
	autoload: true
}