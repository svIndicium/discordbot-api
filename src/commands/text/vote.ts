import { Message } from 'discord.js';

export default {
  name: 'vote',
  execute: async (message: Message) => {
    let voteMessage: Message;
    try {
      if (message.reference !== null && message.reference.messageID !== null) {
        voteMessage = await message.channel.messages.fetch(message.reference.messageID);
      } else {  // no args
        voteMessage = (await message.channel.messages.fetch({limit: 2})).array()[1];
      }
    } catch (error) {
      if (error.name === 'DiscordAPIError' && error.code === 10008) {
        message.reply('Could not find that message');
      } else {
        throw error;
      }
      return;
    }

      voteMessage.react('<:yes:809459785204367380>').catch(error => {
        if (error.name === 'DiscordAPIError' && error.code === 50013) {
          message.reply("I don't have the permission to add reactions");
        } else {
          throw error;
        }
      });
      voteMessage.react('<:no:809460617751691295>').catch(()=>{});  // Only need to catch once

    try {
      await message.delete();
    } catch (error) {
      if (error.name === 'DiscordAPIError' && error.code === 50013) {
        message.reply("I don't have the permission to delete the command");
      } else if (error.name === "DiscordAPIError" && error.code === 10008) {
      } else {
        throw error;
      }
    }
  }
};