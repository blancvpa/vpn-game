import type { BoardEvent } from '../game/types'

export const EVENTS: Record<string, BoardEvent> = {
  // --- Story funnel (fixed on board) ---
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
    effect: { kind: 'move', steps: 2 },
    tone: 'brand',
  },
  blancvpn_ru_services: {
    id: 'blancvpn_ru_services',
    title: 'Российские сервисы работают',
    text: 'Банки, маркетплейсы и другие российские сервисы можно открывать, не отключая BlancVPN.',
    effect: { kind: 'move', steps: 1 },
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

  // --- Light external friction (optional cells) ---
  whitelist: {
    id: 'whitelist',
    title: 'Ограничения сети',
    text: 'Провайдер ограничил доступ к части сайтов. Вернитесь на клетку назад.',
    effect: { kind: 'move', steps: -1 },
    tone: 'bad',
  },
  free_vpn_data: {
    id: 'free_vpn_data',
    title: 'Бесплатный VPN',
    text: 'Бесплатный VPN может зарабатывать на ваших данных. С BlancVPN ваша приватность под защитой.',
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
  unstable_connection: {
    id: 'unstable_connection',
    title: 'Нестабильное соединение',
    text: 'Без защиты соединение то и дело обрывается. Вернитесь на клетку назад.',
    effect: { kind: 'move', steps: -1 },
    tone: 'bad',
  },

  // --- Replay pool (extra brand benefits) ---
  blancvpn_devices: {
    id: 'blancvpn_devices',
    title: 'Одна подписка на все устройства',
    text: 'Подключайте BlancVPN на любое количество устройств — себе и близким.',
    effect: { kind: 'move', steps: 2 },
    tone: 'brand',
  },
  blancvpn_speed: {
    id: 'blancvpn_speed',
    title: 'Высокая скорость',
    text: 'Скорость до 10 Гбит/с позволяет смотреть видео и пользоваться сетью без задержек.',
    effect: { kind: 'move', steps: 2 },
    tone: 'brand',
  },
  blancvpn_support: {
    id: 'blancvpn_support',
    title: 'Поддержка 24/7',
    text: 'Дружелюбные специалисты BlancVPN помогут настроить VPN на любых устройствах.',
    effect: { kind: 'move', steps: 2 },
    tone: 'brand',
  },
  blancvpn_no_logs: {
    id: 'blancvpn_no_logs',
    title: 'Не торгуем данными',
    text: 'В отличие от бесплатных VPN, BlancVPN не зарабатывает на продаже личной информации.',
    effect: { kind: 'move', steps: 2 },
    tone: 'brand',
  },
}

/** Fixed story funnel: cell index → event id */
export const STORY_BY_CELL: Record<number, string> = {
  2: 'blancvpn_locations',
  4: 'blancvpn_split',
  6: 'blancvpn_protocols',
  8: 'blancvpn_ru_services',
  9: 'blancvpn_guarantee',
  10: 'blancvpn_discount',
}

export const STORY_EVENT_IDS = Object.values(STORY_BY_CELL)

export const FRICTION_EVENT_IDS = [
  'whitelist',
  'free_vpn_data',
  'incognito',
  'unstable_connection',
] as const

export const EVENT_IDS = Object.keys(EVENTS)

export function getEvent(id: string): BoardEvent {
  const event = EVENTS[id]
  if (!event) {
    throw new Error(`Unknown event: ${id}`)
  }
  return event
}
