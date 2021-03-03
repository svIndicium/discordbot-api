import { TextChannel } from 'discord.js';

export default {
  name: 'clearCommandsChannel',
  execute: async () => {
    const commandsChannel = await global.client.channels.fetch('816533315246620682') as TextChannel;
    const messages = await commandsChannel.messages.fetch({ after: '816533485720043550' });
    messages.forEach(message => message.delete());
  }
};