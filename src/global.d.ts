import { Client } from 'discord.js';

declare global {
  namespace NodeJS {
    interface Global {
      client: Client;
    }
  }
}
export default global;