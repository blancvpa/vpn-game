import type { BoardEvent } from '../game/types'

export const EVENTS: Record<string, BoardEvent> = {
  whitelist: {
    id: 'whitelist',
    title: 'Белые списки',
    text: 'Провайдер включил белые списки. Вернитесь на 5 клеток назад.',
    effect: { kind: 'move', steps: -5 },
    tone: 'bad',
  },
  blancvpn: {
    id: 'blancvpn',
    title: 'BlancVPN подключён',
    text: 'Вы подключили BlancVPN — YouTube наконец-то летает. Пройдите 5 шагов вперёд.',
    effect: { kind: 'move', steps: 5 },
    tone: 'brand',
  },
  wildberries: {
    id: 'wildberries',
    title: 'Wildberries vs VPN',
    text: 'Wildberries не открывается со включённым VPN. Пропустите ход.',
    effect: { kind: 'skip', turns: 1 },
    tone: 'bad',
  },
  max: {
    id: 'max',
    title: 'Установите MAX',
    text: 'Начальник потребовал установить MAX на телефон. Начните игру заново.',
    effect: { kind: 'restart' },
    tone: 'bad',
  },
  support_silent: {
    id: 'support_silent',
    title: 'Поддержка молчит',
    text: 'Поддержка VPN не отвечает третий день. Пропустите два хода.',
    effect: { kind: 'skip', turns: 2 },
    tone: 'bad',
  },
  router: {
    id: 'router',
    title: 'Роутер сломан',
    text: 'Вы попытались установить интернет на роутер и сломали его. Вернитесь на 5 шагов назад.',
    effect: { kind: 'move', steps: -5 },
    tone: 'bad',
  },
  unpaid: {
    id: 'unpaid',
    title: 'Забыли оплатить',
    text: 'Забыли оплатить следующий месяц VPN. Пропустите ход.',
    effect: { kind: 'skip', turns: 1 },
    tone: 'bad',
  },
  telegram_block: {
    id: 'telegram_block',
    title: 'Telegram заблокирован',
    text: 'Не можете связаться с поддержкой в Telegram — его заблокировали. Вернитесь на шаг назад.',
    effect: { kind: 'move', steps: -1 },
    tone: 'bad',
  },
  email_support: {
    id: 'email_support',
    title: 'Письмо дошло',
    text: 'Смогли связаться с поддержкой по почте. Два шага вперёд.',
    effect: { kind: 'move', steps: 2 },
    tone: 'good',
  },
  dpi: {
    id: 'dpi',
    title: 'DPI режет',
    text: 'DPI режет WireGuard на лету. Вернитесь на 3 клетки назад.',
    effect: { kind: 'move', steps: -3 },
    tone: 'bad',
  },
  mirror: {
    id: 'mirror',
    title: 'Зеркало найдено',
    text: 'Нашли рабочее зеркало сайта. Три шага вперёд.',
    effect: { kind: 'move', steps: 3 },
    tone: 'good',
  },
  captcha: {
    id: 'captcha',
    title: 'Капча везде',
    text: 'Капча на каждом сайте. Пропустите ход.',
    effect: { kind: 'skip', turns: 1 },
    tone: 'neutral',
  },
  neighbor: {
    id: 'neighbor',
    title: 'Соседский вайфай',
    text: 'Раздали вайфай соседу — он поделился зеркалом. Один шаг вперёд.',
    effect: { kind: 'move', steps: 1 },
    tone: 'good',
  },
}

export function getEvent(id: string): BoardEvent {
  const event = EVENTS[id]
  if (!event) {
    throw new Error(`Unknown event: ${id}`)
  }
  return event
}
