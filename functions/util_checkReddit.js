const { subreddits, lookuptime, limit, Embed } = require("../../config.json");
const { EmbedBuilder } = require("discord.js");

async function getSubredditData() {
    // TODO Validate and fix 
    // Get all new Posts from Subreddits
    for (let subreddit of subreddits) {
        let response = await fetch(
            `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`
        );
        let json = await response.json();
        // Get the latest Post from DB and compare it to the latest Post from Reddit
        let feedUpdate = await client.db.get(`${subreddit}.feedUpdate`);
        let posts = json.data.children.filter(
            (post) => post.data.created_utc > feedUpdate
        );
        // If there are no new posts, continue with the next subreddit
        if (posts.length === 0) {
            continue;
        }
        // Set feedUpdate to current time
        await client.db.set(`${subreddit}.feedUpdate`, Date.now());
        return(posts);
    }
}

async function sendNotification() {
    // Create a new Embed with Post Data

    // Check Launcher
    const regex = new RegExp('^\[.*\]');
    if regex.test(postDataTitle)
    {
        
    }

    const embed = new EmbedBuilder()
        .setTitle(postDataTitle)
        .setURL(postDataURL)
        .setDescription(postDataDescription)
        .setColor(postDataColor)
        .setTimestamp()
        .setAuthor({
            name: postDataAuthor,
            iconURL: postDataAuthorIcon,
            url: postDataAuthorURL,
        })
        .setThumbnail(postDataThumbnail)
        .setFooter({
            text: Embed.Footer,
            iconURL: Embed.Footer_Icon,
        });

    // Send Embed to all Guilds
    for (let guild of client.guilds.cache) {
        let feedRole = await client.db.get(`${guild.id}.feedRole`);
        let feedChannel = await client.db.get(`${guild.id}.feedChannel`);
        let feedChannelType = await client.db.get(`${guild.id}.feedChannelType`);
        if (feedChannel != null) {
            let channel = client.channels.cache.get(feedChannel);
            if (feedRole != null) {
                channel.send({
                    content: `<@&${feedRole}>`,
                    embeds: [embed],
                });
            } else {
                channel.send({ embeds: [embed] });
            }
            // Check if feedChannelType is a Announcement Channel, if so publish the message
            

        } else {
            continue;
        }
    }
}

async function getPostsData(){

}

async function checkReddit(client) {
    // Get Subreddit Data
    let posts = await getSubredditData();
    // Send Notification
    await sendNotification(posts);
    return
}

// Create schedule for checking reddit
setInterval(() => {
    checkReddit(client);
}
, lookuptime);