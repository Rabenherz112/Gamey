![](https://media.discordapp.net/attachments/731166978806644827/1047929202474745887/Gamey_BannerWithCentralLogo.png)
# 🤖 Gamey (Discord Free Game finder)
> Gamey is a Bot that finds new free Games and sends them to your Discord group. It is written in discord.js and created by the Ravenhub Development Team

![](https://img.shields.io/github/stars/Rabenherz112/Gamey?color=yellow&style=plastic&label=Stars) ![](https://img.shields.io/discord/728735370560143360?color=5460e6&label=Discord&style=plastic) ![](https://img.shields.io/codefactor/grade/github/Rabenherz112/Gamey?label=Coode%20Quality&style=plastic)

[![Button Invite]][Link1] [![Button Discord]][Link2]
<!----------------------------------------------------------------------------->
[Link1]: # 'https://discord.com/api/oauth2/authorize?client_id=918571056791453726&permissions=139586848768&scope=applications.commands%20bot'
[Link2]: # 'https://discord.gg/ySk5eYrrjG'
<!---------------------------------[ Buttons ]--------------------------------->
[Button Invite]: https://img.shields.io/badge/Invite_me-7289da?style=for-the-badge
[Button Discord]: https://img.shields.io/badge/Join_Discord-7289da?style=for-the-badge

## ⚙️ Requirments
1. A Discord Bot in a Server and the Discord Bot Token [Guide on how to create a Bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
   1. Bot requires permissions "Send Messages", "Embed Links", "Use Slash Commands"
2. Node.js v18.10.0 or higher

## 🚀 Getting started

    git clone https://github.com/Rabenherz112/Gamey.git
    cd Gamey
    npm install
Onces this is done, and you have changed to configuration to your liking you can start the bot by running `node .`

## 🔑 Configuration
Create a new file in the directory named `token.json` and enter the following code. Replace *YOURBOTTOKEN* with your own Discord bot token.

    {
	    "token": "YOURBOTTOKENHERE"
	}
The `config.json` file does not need to be adjusted. However, you can of course customize the bot a bit.

The last step of the configuration can be done in Discord itself. Use the `set-channel` command to set the channel where the bot is supposed to notify you about the newest free games.

## 🕒 Wait for the next free Game
Now you only have to wait. The Bot will check Reddit every 5 minutes for new posts about a free games (if you didn't change the config.json). Onces found it will post it in your Discord channel. The notification you recieve will looks something like this:

![](https://image.ravshort.com/29xipq8v.png)
