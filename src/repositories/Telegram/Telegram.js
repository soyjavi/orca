const { Telegram: Telegraf } = require('telegraf');
import { Storage } from 'vanilla-storage';

import { C } from '@commons';

const { TELEGRAM_BOT, TELEGRAM_CHANNEL_MASTER } = process.env;

export const Telegram = {
  message: (message = 'Hello world ', emoji = '🤖') => {
    const telegraf = new Telegraf(TELEGRAM_BOT);

    telegraf
      .sendMessage(TELEGRAM_CHANNEL_MASTER, `${emoji} ${message}`, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      })
      .then(({ message_id: id, date: timestamp, text }) => {
        const store = new Storage(C.STORE.MESSAGES);

        store.push({ id, text, timestamp });
      })
      .catch((error) => console.log({ error }));
  },
};
