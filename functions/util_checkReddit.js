const { subreddits, lookuptime, limit, Embed, colors } = require("../config.json");
const { EmbedBuilder } = require("discord.js");
const { ChannelType } = require("discord-api-types/v10");

async function getSubredditData() {
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

async function getSubredditComments(subreddit, postDataId) {
    let response = await fetch(
        `https://www.reddit.com/r/${subreddit}/comments/${postDataId}/best.json?limit=50`
    );
    // Filter response for author FGF_Info_Bot
    let json = await response.json();
    let comments = json[1].data.children.filter(
        (comment) => comment.data.author === "FGF_Info_Bot"
    );
    return postDataBotComment;
}

async function getRedditUser(user) {
    let response = await fetch(
        `https://www.reddit.com/user/${user}/about.json`
    );
    let json = await response.json();
    let profilePicture = json.data.icon_img;
    return profilePicture;
}

async function getPostsData() {
    let postInfos = []
    return await getSubredditData().then(async (allPosts) => {
        for (let post of allPosts) {
            let postDataTitel = post.data.title;
            let postDataAuthor = post.data.name;
            let postDataDescription = post.data.description;
            let postDataAuthorFull = post.data.author_fullname;
            let postDataAuthorImage = await getRedditUser(postDataAuthor);
            let postDataUpvotes = post.data.upvote_ratio;
            let postDataUrl = post.data.url;
            let postDataId = post.data.id;
            let subreddit = post.data.subreddit;
            let postDataLauncher = post.data.title.match(/^\[([a-zA-Z0-9 \.]+)(?:[\/, ]*[a-zA-Z0-9\. ]*)*\]+.*$/gmi);
            if (postDataLauncer.length > 0) {
                postDataLauncher = postDataLauncher[0]
            } else {
                postDataLauncher = "unknown"
            }
            /*let postDataBotComment = await getSubredditComments(subreddit, postDataId);
            if (postDataBotComment.length >= 1) {
                let postDataStorePage = postDataBotComment[0].data.body.match(/^.*\[Store Page\]\((.*)\).*$/gmi);
                let postDataSteamDB = postDataBotComment[0].data.body.match(/^.*\[SteamDB\]\((.*)\).*$/gmi);
                let postDataPrice = postDataBotComment[0].data.body.match(/^.*\[Price\]\((.*)\).*$/gmi);
            }*/
            postInfos.push({
                Title: postDataTitel,
                Author: postDataAuthor,
                Author_Image: postDataAuthorImage,
                Description: postDataDescription,
                Author_Full: postDataAuthorFull,
                Upvotes: postDataUpvotes,
                URL: postDataUrl,
                Lauchner: postDataLauncher,
            });
        }
        return postInfos;
    });
}

async function sendNotification() {
    // Create a new Embed with Post Data
    let postInfos = await getPostsData()
    for (let postInfo of postInfos) {
        let embedColor
        switch (postInfo.Launcher.toLowerCase()) {
            case "steam":
                embedColor = colors.Steam
                break;
            case "epic":
                embedColor = colors.Epic
                break;
            case "gog":
                embedColor = colors.GOG
                break;
            case "origin":
                embedColor = colors.Origin
                break;
            case "uplay":
                embedColor = colors.Uplay
                break;
            case "pc":
                embedColor = colors.PC
                break;
            case "xbox":
            case "xb":
                embedColor = colors.Xbox
                break;
            case "playstation":
            case "ps":
            case "ps4":
            case "ps5":
                embedColor = colors.Playstation
                break;
            case "switch":
                embedColor = colors.Switch
                break;
            case "itch.io":
                embedColor = colors.Itch
                break;
            case "unknown":
                embedColor = colors.Other
            default:
                embedColor = colors.Expired
                platform = "Unknown"
                break;
        }
        let embed = new EmbedBuilder()
            .setTitle(`${postInfo.Lauchner} ${postInfo.Title}`)
            .setDescription(`Hey there, I found a new free game for you!\n\n${postInfo.Description}`)
            .setFields(["Free Game Link (Click me)"](postInfo.URL))
            .setURL(postInfo.URL)
            .setColor(embedColor)
            .setAuthor(postInfo.Author, postInfo.Author_Image, `https://www.reddit.com/user/${postInfo.Author}`)
            .setFooter(Embed.Footer, Embed.Footer_Image)
            .setTimestamp()

        // Send Embed to all Guilds
        for (let guild of client.guilds.cache) {
            let feedRole = await client.db.get(`${guild.id}.feedRole`);
            let feedChannel = await client.db.get(`${guild.id}.feedChannel`);
            let feedChannelType = await client.db.get(`${guild.id}.feedChannelType`);
            if (feedChannel != null) {
                let channel = client.channels.cache.get(feedChannel);
                if (feedChannelType === ChannelType.GuildAnnouncement) {
                    if (feedRole != null) {
                        channel.send({
                            content: `<@&${feedRole}>`,
                            embeds: [embed],
                        }).crosspost();
                    } else {
                        channel.send({ embeds: [embed] }).crosspost();
                    }
                }
                else {
                    if (feedRole != null) {
                        channel.send({
                            content: `<@&${feedRole}>`,
                            embeds: [embed],
                        });
                    } else {
                        channel.send({ embeds: [embed] });
                    }
                }
            } else {
                continue;
            }
        }
    }
}

async function checkReddit() {
    // Get Subreddit Data
    let posts = await getSubredditData();
    // Send Notification
    await sendNotification(posts);
    return
}
let client = null;
function insertClient(client2) {
    client = client2;
}
// Create schedule for checking reddit
setInterval(() => {
    if (client != null)
        return;
    checkReddit();
    console.log("[REDDIT] Checked Reddit at " + new Date());
}
    , lookuptime);

module.exports = { checkReddit, insertClient };