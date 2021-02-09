import { Message } from 'discord.js';

export default {
  name: 'whoami',
  execute: async (message: Message) => {
    const member = message.member;
    if (member !== null) {  // Sender is a webhook
      let memberName = member.nickname;
      if (memberName === undefined || memberName === null)
        memberName = member.displayName;
      message.channel.send(`You username: ${memberName}\nYour id: ${member.id}`);
    }
  }
};