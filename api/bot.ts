import { Telegraf } from 'telegraf';
import type { VercelRequest, VercelResponse } from '@vercel/node';

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Настраиваем команды бота
bot.command('start', (ctx) => {
  const webAppUrl = process.env.WEBAPP_URL || 'https://meme-factory-l9od.vercel.app';
  
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
export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    if (request.method === 'POST') {
      await bot.handleUpdate(request.body);
      response.status(200).json({ ok: true });
    } else {
      response.status(200).json({ message: 'Bot webhook endpoint' });
    }
  } catch (error) {
    console.error('Error in webhook handler:', error);
    response.status(500).json({ error: 'Failed to process update' });
  }
}