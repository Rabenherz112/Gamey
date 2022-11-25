const { subreddits, lookuptime, limit, Embed } = require("../../config.json");
const { EmbedBuilder } = require("discord.js");

async function getSubredditData() {
    // TODO Validate and fix 
    // Get all new Posts from Subreddits
    let allPosts = [];
    for (let subreddit of subreddits) {
        let response = await fetch(
            `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`
        );
        let json = await response.json();
        // Get the latest Post from DB and compare it to the latest Post from Reddit
        let feedUpdate = await client.db.get(`${subreddit}.feedUpdate`);
        let posts = json.data.children.filter(
            (post) => (post.data.created_utc * 1000) > feedUpdate
        );
        // Set feedUpdate to current time
        await client.db.set(`${subreddit}.feedUpdate`, Date.now());
        if (posts.length === 0) {
            continue;
        }
        allPosts.push(posts);
    }
    return allPosts;
}

async function getPostsData(){
    let postInfos = []
    await getSubredditData().then((allPosts) => {
        for (let post of allPosts) {
            let postDataTitel = post.data.title;
            let postDataAuthor = post.data.name;
            let postDataDescription = post.data.description;
            let postDataAuthorFull = post.data.author_fullname;
            let postDataUpvotes = post.data.upvote_ratio;
            let postDataUrl = post.data.url;
            postInfos.push({
                Title: postDataTitel,
                Author: postDataAuthor,
                Description: postDataDescription,
                Author_Full: postDataAuthorFull,
                Upvotes: postDataUpvotes,
                URL: postDataUrl,
            });
        }
        return(postInfos);
    });
}

async function sendNotification() {
    // Create a new Embed with Post Data
    let postDatas = await getPostsData()
    for (let postData of postDatas)
    {
        
    }
    // Check Launcher
    const regex = new RegExp('^\[.*\]');
    if (regex.test(postDataTitle)) {
        
    }

    const embed = new EmbedBuilder()
        .setTitle(postData.Title)
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