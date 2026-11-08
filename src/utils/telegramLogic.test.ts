import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterChats,
  formatMessageTime,
  calculateUnreadTotals,
  processBotCommand,
} from './telegramLogic';
import { Chat } from '../types/telegram';

const mockChats: Chat[] = [
  {
    id: 'chat-1',
    title: 'Saved Messages',
    type: 'personal',
    unreadCount: 0,
    pinned: true,
  },
  {
    id: 'chat-2',
    title: 'Elena Rostova',
    type: 'personal',
    unreadCount: 2,
    username: 'elena_design',
    lastMessage: {
      text: 'Check the new layout mockups',
      timestamp: Date.now(),
      isOutgoing: false,
    },
  },
  {
    id: 'chat-3',
    title: 'Frontend Devs Community',
    type: 'group',
    unreadCount: 5,
    lastMessage: {
      text: 'React 19 compiler is super fast!',
      timestamp: Date.now(),
      isOutgoing: false,
    },
  },
  {
    id: 'chat-4',
    title: 'Telegram News',
    type: 'channel',
    unreadCount: 1,
  },
  {
    id: 'chat-5',
    title: 'Assistant Bot',
    type: 'bot',
    unreadCount: 0,
    username: 'TeleBot',
  },
];

test('filterChats filters by folder correctly', () => {
  const personal = filterChats(mockChats, 'personal');
  assert.equal(personal.length, 2);
  assert.equal(personal[0].id, 'chat-1');

  const groups = filterChats(mockChats, 'groups');
  assert.equal(groups.length, 1);
  assert.equal(groups[0].title, 'Frontend Devs Community');

  const bots = filterChats(mockChats, 'bots');
  assert.equal(bots.length, 1);
  assert.equal(bots[0].title, 'Assistant Bot');
});

test('filterChats filters by search query matching title or username or text', () => {
  const searchByName = filterChats(mockChats, 'all', 'Elena');
  assert.equal(searchByName.length, 1);
  assert.equal(searchByName[0].id, 'chat-2');

  const searchByUsername = filterChats(mockChats, 'all', 'TeleBot');
  assert.equal(searchByUsername.length, 1);
  assert.equal(searchByUsername[0].id, 'chat-5');

  const searchByMessage = filterChats(mockChats, 'all', 'compiler');
  assert.equal(searchByMessage.length, 1);
  assert.equal(searchByMessage[0].id, 'chat-3');
});

test('calculateUnreadTotals calculates folder counts accurately', () => {
  const totals = calculateUnreadTotals(mockChats);
  assert.equal(totals.all, 8); // 0 + 2 + 5 + 1 + 0
  assert.equal(totals.personal, 2);
  assert.equal(totals.groups, 5);
  assert.equal(totals.channels, 1);
  assert.equal(totals.bots, 0);
});

test('processBotCommand responds to /start and /help', () => {
  const startRes = processBotCommand('/start');
  assert.ok(startRes.response.includes('Pigeon Assistant Bot'));

  const helpRes = processBotCommand('/help');
  assert.ok(helpRes.response.includes('Available Bot Commands'));
});

test('processBotCommand /calc evaluates safe math expressions', () => {
  const calcSuccess = processBotCommand('/calc 25 * 4');
  assert.ok(calcSuccess.response.includes('100'));

  const calcEmpty = processBotCommand('/calc');
  assert.ok(calcEmpty.response.includes('Please provide an expression'));

  const calcBlocked = processBotCommand('/calc alert(1)');
  assert.ok(calcBlocked.response.includes('Invalid math expression'));
});

test('formatMessageTime formats valid time string', () => {
  const time = new Date('2026-11-08T14:35:00').getTime();
  const formatted = formatMessageTime(time);
  assert.ok(typeof formatted === 'string');
  assert.ok(formatted.includes(':'));
});
