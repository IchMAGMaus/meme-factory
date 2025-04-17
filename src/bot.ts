import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Настраиваем команды бота
bot.command('start', (ctx) => {
  const webAppUrl = process.env.WEBAPP_URL || 'https://your-app-url.vercel.app';
  
  ctx.reply('Добро пожаловать в Meme Factory! 🎮\n\nЗдесь вы можете создать свою мемную империю! 🚀', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "▶️ Начать игру",
          web_app: { url: webAppUrl }
        }
      ]]
    }
  });
});

// Обработчик веб-хуков для Vercel
export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } else {
      res.status(200).json({ message: 'Bot is running!' });
    }
  } catch (error) {
    console.error('Error in webhook handler:', error);
    res.status(500).json({ error: 'Failed to process update' });
  }
}