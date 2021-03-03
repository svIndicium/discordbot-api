//region setup
// types
import { Client, ClientUser, Message, VoiceState } from 'discord.js';
import { Dirent } from 'fs';

import { config as dotenv } from 'dotenv';
import * as fs from 'fs';

dotenv();
const client = global.client = new Client();


process.on('SIGINT', async () => {
  if (client.user !== null) {  // May not yet be initialized
    await client.user.setStatus('invisible');
    await client.destroy();
  }
  process.exit();
});

function readFiles(dir?: string) {
  if (dir === undefined) {
    dir = '.';
  }
  const paths = fs.readdirSync(dir, { withFileTypes: true });

  return paths.reduce((files: string[], path: Dirent) => {
    if (path.isDirectory()) {
      files.push(...readFiles(`${dir}/${path.name}`));
    } else if (path.isFile()) {
      files.push(`${dir}/${path.name}`);
    }

    return files;
  }, []);
}

const commandFiles = readFiles('./commands');
const commands: Map<string, { name: string, execute: (message: Message) => never }> = new Map();

for (const fileName of commandFiles) {
  if (fileName.endsWith('.js')) {
    const command = await import(fileName);
    commands.set(command.default.name, command.default);
  }
}

client.once('ready', async () => {
  await (client.user as ClientUser).setStatus('online');
  console.log('Ready!');
  // @ts-ignore
  commands.get('clearCommandsChannel').execute();
});

client.login(process.env.token);

const prefix = process.env.defaultPrefix as string;
//endregion

client.on('message', async (message: Message) => {
  if (!message.content.startsWith(prefix)) {
    return;
  }
  const command = commands.get(message.content.slice(prefix.length).split(' ', 1)[0]);
  if (command !== undefined) {
    command.execute(message);
  }
});

const customVoiceChannels: string[] = [];  // Array of ids of all custom voice channels
client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
  if (oldState.channel &&
      oldState.channel !== newState.channel &&
      oldState.channel.members.size === 0 &&
      customVoiceChannels.includes(oldState.channel.id)) {
    await oldState.channel.delete();
  }
  if (newState.channel?.id === '804762078849794108' &&
      newState.member) {
    const channelCategory = newState.channel.parent ?? undefined;
    const newChannel = await newState.guild.channels.create(
        newState.member.displayName + "'s channel",
        {
          type: 'voice',
          parent: channelCategory,
          position: newState.channel.position
        });
    newState.member.voice.setChannel(newChannel);
    customVoiceChannels.push(newChannel.id);
  }
});