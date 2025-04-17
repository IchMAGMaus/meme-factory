import { Telegraf } from 'telegraf';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Инициализация бота
const bot = new Telegraf(process.env.BOT_TOKEN!);

// Настройка команд бота
bot.command('start', (ctx) => {
  ctx.reply('Добро пожаловать в Meme Factory! 🎮\n\nСоздайте свою мемную империю! 🚀', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "▶️ Начать игру",
          web_app: { url: process.env.WEBAPP_URL || 'https://meme-factory-l9od.vercel.app' }
        }
      ]]
    }
  });
});

// Обработчик webhook
export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method === 'POST') {
    try {
      await bot.handleUpdate(request.body);
      response.status(200).json({ ok: true });
    } catch (error) {
      console.error('Error in webhook handler:', error);
      response.status(500).json({ error: 'Failed to process update' });
    }
  } else {
    // Проверка работоспособности webhook
    response.status(200).json({ 
      ok: true, 
      message: 'Meme Factory Bot webhook is running!',
      timestamp: new Date().toISOString()
    });
  }
}