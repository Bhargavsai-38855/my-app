import { Chat, FolderTab, Message } from '../types/telegram';

/**
 * Filter chats based on the selected folder tab and search query
 */
export function filterChats(
  chats: Chat[],
  folder: FolderTab,
  searchQuery: string = ''
): Chat[] {
  const query = searchQuery.trim().toLowerCase();

  return chats.filter((chat) => {
    // 1. Folder match
    if (folder === 'personal' && chat.type !== 'personal') return false;
    if (folder === 'groups' && chat.type !== 'group') return false;
    if (folder === 'channels' && chat.type !== 'channel') return false;
    if (folder === 'bots' && chat.type !== 'bot') return false;

    // 2. Search match
    if (!query) return true;

    const titleMatch = chat.title.toLowerCase().includes(query);
    const usernameMatch = chat.username ? chat.username.toLowerCase().includes(query) : false;
    const lastMsgMatch = chat.lastMessage?.text ? chat.lastMessage.text.toLowerCase().includes(query) : false;

    return titleMatch || usernameMatch || lastMsgMatch;
  });
}

/**
 * Format timestamp to Telegram message time format (e.g., "14:35")
 */
export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Format chat list preview timestamp (e.g. "14:35", "Yesterday", or "Oct 12")
 */
export function formatChatTimestamp(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);

  const isToday =
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear();

  if (isToday) {
    return formatMessageTime(timestamp);
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    yesterday.getDate() === date.getDate() &&
    yesterday.getMonth() === date.getMonth() &&
    yesterday.getFullYear() === date.getFullYear();

  if (isYesterday) {
    return 'Yesterday';
  }

  const isThisYear = now.getFullYear() === date.getFullYear();
  if (isThisYear) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  return date.toLocaleDateString([], { year: '2-digit', month: 'numeric', day: 'numeric' });
}

/**
 * Calculate total unread count per folder tab
 */
export function calculateUnreadTotals(chats: Chat[]): Record<FolderTab, number> {
  const totals: Record<FolderTab, number> = {
    all: 0,
    personal: 0,
    groups: 0,
    channels: 0,
    bots: 0,
  };

  for (const chat of chats) {
    const count = chat.unreadCount || 0;
    totals.all += count;

    if (chat.type === 'personal') totals.personal += count;
    else if (chat.type === 'group') totals.groups += count;
    else if (chat.type === 'channel') totals.channels += count;
    else if (chat.type === 'bot') totals.bots += count;
  }

  return totals;
}

/**
 * Telegram Bot command handler
 */
export function processBotCommand(
  rawInput: string
): { response: string; isMarkdown?: boolean } {
  const trimmed = rawInput.trim();
  const parts = trimmed.split(' ');
  const command = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ').trim();

  switch (command) {
    case '/start':
      return {
        response:
          "👋 Hello! I am your interactive Telegram Assistant Bot.\n\nHere are some things I can do:\n• /help - View available commands\n• /roll - Roll a dice or coin\n• /crypto - Live simulated crypto prices (TON, BTC, ETH, SOL)\n• /calc <expr> - Calculate math (e.g. /calc 25 * 40)\n• /quote - Get an inspiring tech quote\n• /fact - Get a fun fact about Telegram\n\nYou can also just send me any message, question, or thought!",
      };

    case '/help':
      return {
        response:
          "🛠 Available Bot Commands:\n\n• /roll - Roll a dice (1-6) or coin flip\n• /crypto - Live TON & crypto price quotes\n• /calc <expr> - Evaluate math expression\n• /quote - Inspirational tech quote\n• /fact - Telegram history & facts\n• /clear - Clear your bot chat history",
      };

    case '/roll': {
      const dice = Math.floor(Math.random() * 6) + 1;
      const coin = Math.random() > 0.5 ? 'Heads' : 'Tails';
      const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      return {
        response: `🎲 Dice rolled: ${dice} ${diceEmojis[dice - 1]}\n🪙 Coin flipped: ${coin}!`,
      };
    }

    case '/crypto':
      return {
        response:
          "💎 Live Market Snapshot:\n\n• TON: $5.84 (+4.2%) 🚀\n• BTC: $91,420 (+2.8%)\n• ETH: $3,450 (+1.9%)\n• SOL: $198.50 (+5.1%)\n\n24h Vol: $48.2B · Telegram Wallet active",
      };

    case '/calc': {
      if (!arg) {
        return { response: "⚠️ Please provide an expression. Example: `/calc 128 * 4`" };
      }
      try {
        // Safe evaluation of basic math only (+, -, *, /, %, parenthesis, numbers)
        if (!/^[0-9+\-*/().\s%^]+$/.test(arg)) {
          return { response: "⚠️ Invalid math expression. Only numbers and +, -, *, /, %, () are allowed." };
        }
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${arg})`)();
        return { response: `🧮 ${arg} = ${result}` };
      } catch {
        return { response: `⚠️ Could not calculate: ${arg}` };
      }
    }

    case '/quote': {
      const quotes = [
        '"Simplicity is about subtracting the obvious and adding the meaningful." — John Maeda',
        '"Privacy is not for sale, and human rights should not be compromised." — Pavel Durov',
        '"First, solve the problem. Then, write the code." — John Johnson',
        '"Talk is cheap. Show me the code." — Linus Torvalds',
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      return { response: `💬 ${randomQuote}` };
    }

    case '/fact': {
      const facts = [
        "Telegram was launched on August 14, 2013, by brothers Nikolai and Pavel Durov.",
        "Telegram's custom MTProto protocol was designed by mathematician Nikolai Durov.",
        "Telegram handles over 1 billion monthly active users with incredible speed and zero ads in private chats.",
        "Telegram was among the first messengers to introduce animated stickers, bots, and channels.",
      ];
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      return { response: `💡 Did you know?\n${randomFact}` };
    }

    default: {
      const conversationalReplies = [
        `Got your message: "${trimmed}"! Let me know if you need any assistance or try /help.`,
        `Thanks for reaching out! I'm synchronized with your Telegram cloud session.`,
        `Received! If you want to check crypto prices, type /crypto or /roll for a lucky dice.`,
      ];
      return {
        response: conversationalReplies[Math.floor(Math.random() * conversationalReplies.length)],
      };
    }
  }
}

/**
 * Synthesize Telegram sound effects using Web Audio API
 */
export function playTelegramSound(type: 'sent' | 'received') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'sent') {
      // Crisp subtle pop (two harmonic high blips)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else {
      // Receiving chime (two soft pleasant tones)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.06); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Ignore audio permission or context errors
  }
}
