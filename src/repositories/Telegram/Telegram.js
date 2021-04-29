const { Telegram: Telegraf } = require('telegraf');

const { TELEGRAM_BOT, TELEGRAM_CHANNEL_MASTER } = process.env;

export const Telegram = {
  message: (message = 'Hello world ', emoji = '🤖') => {
    const telegraf = new Telegraf(TELEGRAM_BOT);

    telegraf
      .sendMessage(TELEGRAM_CHANNEL_MASTER, `${emoji} ${message}`, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      })
      .then((response) => {
        console.log({ response });
      })
      .catch((error) => console.log({ error }));
  },
};
