import type { BoardEvent } from '../game/types'

export const EVENTS: Record<string, BoardEvent> = {
  // --- Story funnel (fixed, spaced across the board) ---
  blancvpn_locations: {
    id: 'blancvpn_locations',
    title: 'Более 50 локаций',
    text: 'BlancVPN дает доступ к серверам по всему миру — выбирайте локацию для быстрого и безопасного соединения.',
    effect: { kind: 'move', steps: 2 },
    tone: 'brand',
  },
  blancvpn_split: {
    id: 'blancvpn_split',
    title: 'Раздельное туннелирование',
    text: 'Можно настроить, какие сайты идут через VPN, а какие — в обход. Так удобнее пользоваться и зарубежными, и российскими сервисами.',
    effect: { kind: 'move', steps: 2 },
    tone: 'brand',
  },
  blancvpn_protocols: {
    id: 'blancvpn_protocols',
    title: 'Протокол подбирается сам',
    text: 'BlancVPN автоматически выбирает подходящий протокол, чтобы соединение оставалось стабильным.',
    effect: { kind: 'move', steps: 1 },
    tone: 'brand',
  },
  blancvpn_ru_services: {
    id: 'blancvpn_ru_services',
    title: 'Российские сервисы работают',
    text: 'Банки, маркетплейсы и другие российские сервисы можно открывать, не отключая BlancVPN.',
    effect: { kind: 'move', steps: 2 },
    tone: 'brand',
  },
  blancvpn_guarantee: {
    id: 'blancvpn_guarantee',
    title: '30 дней на тест и возврат',
    text: 'Если BlancVPN не подойдет, вернем деньги в полном объеме.',
    effect: { kind: 'move', steps: 1 },
    tone: 'brand',
  },
  blancvpn_discount: {
    id: 'blancvpn_discount',
    title: 'Подписка со скидкой',
    text: 'Дойдите до финиша — получите промокод на оформление подписки.',
    effect: { kind: 'flavor' },
    tone: 'brand',
  },

  // --- Game friction (external internet problems, not BlancVPN flaws) ---
  whitelist: {
    id: 'whitelist',
    title: 'Ограничения сети',
    text: 'Провайдер ограничил доступ к части сайтов. Вернитесь на 2 клетки назад.',
    effect: { kind: 'move', steps: -2 },
    tone: 'bad',
  },
  slow_dns: {
    id: 'slow_dns',
    title: 'Медленный DNS',
    text: 'Сайты открываются через раз. Пропустите ход.',
    effect: { kind: 'skip', turns: 1 },
    tone: 'bad',
  },
  captcha_wall: {
    id: 'captcha_wall',
    title: 'Капча на каждом шагу',
    text: 'Приходится снова и снова доказывать, что вы не робот. Вернитесь на клетку назад.',
    effect: { kind: 'move', steps: -1 },
    tone: 'bad',
  },
  outdated_guide: {
    id: 'outdated_guide',
    title: 'Устаревшая инструкция',
    text: 'Гайд из старого чата уже не работает. Вернитесь на 2 клетки назад.',
    effect: { kind: 'move', steps: -2 },
    tone: 'bad',
  },
  unstable_connection: {
    id: 'unstable_connection',
    title: 'Связь отваливается',
    text: 'Соединение обрывается каждые несколько минут. Пропустите ход.',
    effect: { kind: 'skip', turns: 1 },
    tone: 'bad',
  },
  fake_vpn: {
    id: 'fake_vpn',
    title: 'Сомнительный VPN из чата',
    text: '«Стопроцентно рабочий» сервис даже не открывается. Пропустите ход.',
    effect: { kind: 'skip', turns: 1 },
    tone: 'bad',
  },

  // --- Neutral flavor ---
  free_vpn_data: {
    id: 'free_vpn_data',
    title: 'Бесплатный VPN',
    text: 'Бесплатный VPN может зарабатывать на ваших данных — им тоже нужно на чем-то зарабатывать.',
    effect: { kind: 'flavor' },
    tone: 'neutral',
  },
  incognito: {
    id: 'incognito',
    title: 'Режим инкогнито',
    text: 'Режим инкогнито не шифрует трафик и не скрывает ваш интернет-адрес от провайдера.',
    effect: { kind: 'flavor' },
    tone: 'neutral',
  },
  too_many_tabs: {
    id: 'too_many_tabs',
    title: 'Слишком много вкладок',
    text: 'Открыто десяток гайдов, и уже непонятно, какой из них актуален.',
    effect: { kind: 'flavor' },
    tone: 'neutral',
  },
  mobile_hotspot: {
    id: 'mobile_hotspot',
    title: 'Раздача с телефона',
    text: 'Сейчас непонятно, что у вас: домашний интернет, LTE или раздача с телефона.',
    effect: { kind: 'flavor' },
    tone: 'neutral',
  },

  // --- Good luck ---
  mirror_found: {
    id: 'mirror_found',
    title: 'Рабочее зеркало',
    text: 'Нашли рабочее зеркало нужного сайта. Три шага вперед.',
    effect: { kind: 'move', steps: 3 },
    tone: 'good',
  },
  right_tip: {
    id: 'right_tip',
    title: 'Нужный совет',
    text: 'В чате подсказали рабочее решение. Два шага вперед.',
    effect: { kind: 'move', steps: 2 },
    tone: 'good',
  },
  captcha_passed: {
    id: 'captcha_passed',
    title: 'Капча с первого раза',
    text: 'Капча пропустила вас без лишней борьбы. Два шага вперед.',
    effect: { kind: 'move', steps: 2 },
    tone: 'good',
  },
  stable_dns: {
    id: 'stable_dns',
    title: 'Стабильный DNS',
    text: 'Нашли DNS, который не отваливается каждые пять минут. Два шага вперед.',
    effect: { kind: 'move', steps: 2 },
    tone: 'good',
  },
  phone_works: {
    id: 'phone_works',
    title: 'С телефона получилось',
    text: 'То, что не работало на ноутбуке, заработало с телефона. Один шаг вперед.',
    effect: { kind: 'move', steps: 1 },
    tone: 'good',
  },
}

/** Fixed story funnel: spaced so the board still feels like a game */
export const STORY_BY_CELL: Record<number, string> = {
  5: 'blancvpn_locations',
  10: 'blancvpn_split',
  14: 'blancvpn_protocols',
  17: 'blancvpn_ru_services',
  20: 'blancvpn_guarantee',
  22: 'blancvpn_discount',
}

export const STORY_EVENT_IDS = Object.values(STORY_BY_CELL)

/** Rotating pool for non-story surprise cells */
export const GAME_EVENT_IDS = [
  'whitelist',
  'slow_dns',
  'captcha_wall',
  'outdated_guide',
  'unstable_connection',
  'fake_vpn',
  'free_vpn_data',
  'incognito',
  'too_many_tabs',
  'mobile_hotspot',
  'mirror_found',
  'right_tip',
  'captcha_passed',
  'stable_dns',
  'phone_works',
] as const

export const EVENT_IDS = Object.keys(EVENTS)

export function getEvent(id: string): BoardEvent {
  const event = EVENTS[id]
  if (!event) {
    throw new Error(`Unknown event: ${id}`)
  }
  return event
}
