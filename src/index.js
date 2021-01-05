require('dotenv').config();
const { Client } = require('discord.js');

const client = new Client();

client.once('ready', async () => {
  await client.user.setStatus('online');
  console.log('Ready!');
});

client.login(process.env.token);

process.on('SIGINT', () => {
  if (client.user !== null) {  // May not yet be initialized
    client.user.setStatus('invisible')
        .then(() => client.destroy());
  }
  process.exit();
});

client.on('message', async message => {
  console.log(message.content);
});