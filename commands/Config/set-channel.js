const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { config } = require("../config.json");
const db = require("quick.db");

module.exports = {
    name: 'set-channel',
    description: 'Set the channel for the bot to send the notifications to.',
    type: 'CHANNEL',
    channelTypes: ['GUILD_TEXT', 'GUILD_NEWS'],
};