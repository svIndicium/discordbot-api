import { Message } from 'discord.js';

export default {
  name: 'log',
  execute: async (message: Message) => {
    console.log(message.content);
  }
};