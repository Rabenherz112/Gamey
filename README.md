![](https://media.discordapp.net/attachments/731166978806644827/1038799292573429840/gamey-game-placeholder.jpg)
# 🤖 Gamey (Discord Free Game finder)
> Gamey is a Bot that finds new free Games and sends them to your Discord Group. It is written in discord.js and created by the Ravenhub Development Team

![](https://img.shields.io/github/stars/Rabenherz112/Gamey?color=yellow&label=Stars&style=plastic) ![](https://img.shields.io/discord/728735370560143360?color=5460e6&label=Discord&style=plastic) ![](https://img.shields.io/codefactor/grade/github/Rabenherz112/Gamey?label=Coode%20Quality&style=plastic)
## ⚙️ Requirments
1. A Discord Bot in a Server and the Discord Bot Token [Guide on how to create a Bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
	2. Bot requires permissions "Send Messages", "Embed Links", "Use Slash Commands"
2. Node.js v18.10.0 or higher
## 🚀 Getting started

    git clone https://github.com/Rabenherz112/Gamey.git
    cd Gamey
    npm install
Onces this is done, and you have changed to configuration to your liking you can start the bot by running `node .`

## 🔑 Configuration
Create a new file in the directory named `token.json` and enter the following code. Replace *YOURBOTTOKEN* with your own discord bot token.

    {
	    "token": "YOURBOTTOKENHERE"
	}
The `config.json` file does not need to be adjusted. However, you can of course customize the bot a bit.

The Last step of the configuration can be done in Discord itself. Use the `set-channel` command to set the channel where the bot is supposed to notify you about the newest free Games.

## 🕒 Wait for the next free Game
Now you only have to wait. The Bot will (if you didn't change the config.json) Reddit all 5 Minutes for new posts about a free Game. Onces found it will post it in your Discord Channel. The notification you recieve will looks something like this:\n
![](https://image.ravshort.com/29xipq8v.png)
