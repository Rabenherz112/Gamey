const { subreddits, lookuptime, limit, Embed, colors } = require("../config.json");
const { EmbedBuilder } = require("discord.js");
const { ChannelType } = require("discord-api-types/v10");
const { decode } = require("html-entities");

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
        allPosts.push(...posts);
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
    let profilePicture = json.data.subreddit.icon_img;
    profilePicture = profilePicture.split("?")[0];
    return profilePicture;
}

async function getPostsData(allPosts) {
    let postInfos = []
    for (let post of allPosts) {
        let postDataTitel = decode(post.data.title);
        let postDataAuthor = post.data.author;
        let postDataDescription = post.data.selftext;

        console.log(`[REDDIT] Found ${postDataTitel} at ${new Date().toLocaleString()}`);

        if (postDataDescription.length > 2048) {
            postDataDescription = postDataDescription.substring(0, 2045) + "...";
        }
        if (postDataDescription == "") {
            postDataDescription = "No Description available";
        }
        postDataDescription = decode(postDataDescription);
        let postDataThumbnail = post.data.thumbnail;
        if (postDataThumbnail == "default" || postDataThumbnail == "self" || postDataThumbnail == "nsfw") {
            postDataThumbnail = Embed.Thumbnail_Default;
        }
        let postDataAuthorFull = post.data.author_fullname;
        let postDataAuthorImage = await getRedditUser(postDataAuthor);
        let postDataUpvotes = post.data.upvote_ratio;
        let postDataCommentCount = post.data.num_comments;
        let postDataScore = post.data.score;
        let postDataUrl = post.data.url;
        let postDataId = post.data.id;
        let subreddit = post.data.subreddit;
        let postDataLauncher = post.data.title.match(/^\[([a-zA-Z0-9 \.]+)(?:[\/, ]*[a-zA-Z0-9\. ]*)*\]+.*$/mi);
        // Why is postDataLauncher an object and not an array?
        if (typeof postDataLauncher === 'object' && postDataLauncher.length > 1) {
            postDataLauncher = postDataLauncher[1]
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
            Thumbnail: postDataThumbnail,
            Description: postDataDescription,
            Author_Full: postDataAuthorFull,
            Upvotes: postDataUpvotes,
            CommentCount: postDataCommentCount,
            Score: postDataScore,
            URL: postDataUrl,
            Launcher: postDataLauncher,
        });
    }
    return postInfos;
}

async function sendNotification(posts) {
    // Create a new Embed with Post Data
    let postInfos = await getPostsData(posts)
    for (let postInfo of postInfos) {
        let embedColor
        switch (postInfo.Launcher.toLowerCase()) {
            case "steam":
                embedColor = colors.Steam
                break;
            case "epic":
                embedColor = colors.Epic
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
            .setTitle(`${postInfo.Title}`)
            .setDescription(`${postInfo.Description}`)
            .setFields(
            {
                name: "Comments",
                value: `${postInfo.CommentCount}`,
                inline: true 
            },
            {
                name: "Upvote Ratio",
                value: `${postInfo.Upvotes}`,
                inline: true 
            },
            {
                name: "Score",
                value: `${postInfo.Score}`,
                inline: true 
            },
            {
                name: "Free Game Link",
                value: `[Click me](${postInfo.URL})`,
                inline: false 
            })
            .setThumbnail(postInfo.Thumbnail)
            .setURL(postInfo.URL)
            .setColor(embedColor)
            .setAuthor({
                name: postInfo.Author,
                iconURL: postInfo.Author_Image,
                url: `https://www.reddit.com/user/${postInfo.Author}`
            })
            .setFooter({
                text: Embed.Footer,
                iconURL: Embed.Footer_Image
            })
            .setTimestamp()

        // Send Embed to all Guilds
        for (let guild of client.guilds.cache.values()) {
            try {
                let feedRole = await client.db.get(`${guild.id}.feedRole`);
                let feedChannel = await client.db.get(`${guild.id}.feedChannel`);
                let feedChannelType = await client.db.get(`${guild.id}.feedChannelType`);
                if (feedChannel != null) {
                    let channel = client.channels.cache.get(feedChannel);
                    if (feedChannelType === ChannelType.GuildAnnouncement) {
                        if (feedRole != null) {
                            let message = await channel.send({
                                content: `<@&${feedRole}>`,
                                embeds: [embed],
                            })
                            message.crosspost();
                        } else {
                            let message = await channel.send({ embeds: [embed] });
                            message.crosspost();
                        }
                    } else {
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
            } catch (e) {
                // Oops, I don't care
            }
        }
    }
}

async function checkReddit() {
    if (client == null)
        return;
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
setInterval(checkReddit, lookuptime);

module.exports = { checkReddit, insertClient };