import { Telegraf } from 'telegraf';
import type { VercelRequest, VercelResponse } from '@vercel/node';

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Настройка команд бота
bot.command('start', (ctx) => {
  const webAppUrl = process.env.WEBAPP_URL || 'https://meme-factory-7c3v.vercel.app';
  
  ctx.reply('Добро пожаловать в Meme Factory! 🎮\n\nСоздайте свою мемную империю! 🚀', {
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

// Обработчик webhook для Vercel
export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    if (request.method === 'POST') {
      await bot.handleUpdate(request.body);
      response.status(200).json({ ok: true });
    } else {
      // Эндпоинт для проверки работоспособности
      response.status(200).json({ 
        ok: true, 
        message: 'Meme Factory Bot webhook is running!',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error in webhook handler:', error);
    response.status(500).json({ error: 'Failed to process update' });
  }
}