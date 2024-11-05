import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import { NotifierService } from '../notifier.service';

@Injectable()
export class DiscordNotifierService implements NotifierService {
  constructor(private readonly client: Client) {}

  async send(message: string) {
    const user = await this.client.users.fetch(process.env.DISCORD_USER_ID);
    const dmChannel = await user.createDM();
    return dmChannel.send(message);
  }
}
