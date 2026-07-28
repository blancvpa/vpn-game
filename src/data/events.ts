import type { BoardEvent } from '../game/types'

export const EVENTS: Record<string, BoardEvent> = {
  whitelist: {
    id: 'whitelist',
    title: 'Белые списки',
    text: 'Провайдер включил белые списки. Вернитесь на 5 клеток назад.',
    effect: { kind: 'move', steps: -5 },
    tone: 'bad',
  },
  wb_blocked: {
    id: 'wb_blocked',
    title: 'Wildberries против VPN',
    text: 'Wildberries не открывается со включённым VPN. Пропустите ход.',
    effect: { kind: 'skip', turns: 1 },
    tone: 'bad',
  },
  max_order: {
    id: 'max_order',
    title: 'Установите MAX',
    text: 'Начальник потребовал установить MAX на телефон. Начните игру заново.',
    effect: { kind: 'restart' },
    tone: 'bad',
  },
  support_silent: {
    id: 'support_silent',
    title: 'Поддержка молчит',
    text: 'Поддержка VPN не отвечает уже третий день. Пропустите два хода.',
    effect: { kind: 'skip', turns: 2 },
    tone: 'bad',
  },
  router_broken: {
    id: 'router_broken',
    title: 'Роутер сломан',
    text: 'Вы попытались настроить VPN на роутере и сломали его. Вернитесь на 5 клеток назад.',
    effect: { kind: 'move', steps: -5 },
    tone: 'bad',
  },
  unpaid_month: {
    id: 'unpaid_month',
    title: 'Забыли оплатить',
    text: 'Вы забыли оплатить следующий месяц VPN. Пропустите ход.',
    effect: { kind: 'skip', turns: 1 },
    tone: 'bad',
  },
  telegram_blocked: {
    id: 'telegram_blocked',
    title: 'Telegram недоступен',
    text: 'Не можете связаться с поддержкой в Telegram, потому что Telegram заблокировали. Вернитесь на шаг назад.',
    effect: { kind: 'move', steps: -1 },
    tone: 'bad',
  },
  dpi_cut: {
    id: 'dpi_cut',
    title: 'DPI режет трафик',
    text: 'DPI снова режет WireGuard. Вернитесь на 3 клетки назад.',
    effect: { kind: 'move', steps: -3 },
    tone: 'bad',
  },
  fake_vpn: {
    id: 'fake_vpn',
    title: 'Рабочий VPN из чата',
    text: 'Друзья скинули «100% рабочий VPN», а он даже не открывается. Пропустите ход.',
    effect: { kind: 'skip', turns: 1 },
    tone: 'bad',
  },
  outdated_guide: {
    id: 'outdated_guide',
    title: 'Гайд из 2022',
    text: 'Вы пошли по старому гайду, и он больше не работает. Вернитесь на 2 клетки назад.',
    effect: { kind: 'move', steps: -2 },
    tone: 'bad',
  },
  dns_search: {
    id: 'dns_search',
    title: 'Поиск рабочего DNS',
    text: 'Вы полчаса выбираете между «самым быстрым» и «самым стабильным» DNS.',
    effect: { kind: 'flavor' },
    tone: 'neutral',
  },
  fifteen_tabs: {
    id: 'fifteen_tabs',
    title: '14 вкладок с инструкциями',
    text: 'Вы открыли слишком много гайдов и теперь не понимаете, какой из них настоящий.',
    effect: { kind: 'flavor' },
    tone: 'neutral',
  },
  captcha_everywhere: {
    id: 'captcha_everywhere',
    title: 'Капча везде',
    text: 'На каждом сайте капча, и каждая считает вас подозрительным.',
    effect: { kind: 'flavor' },
    tone: 'neutral',
  },
  incognito_mode: {
    id: 'incognito_mode',
    title: 'Режим инкогнито',
    text: 'Вы включили инкогнито, просто чтобы почувствовать контроль над ситуацией.',
    effect: { kind: 'flavor' },
    tone: 'neutral',
  },
  mobile_hotspot: {
    id: 'mobile_hotspot',
    title: 'Раздача с телефона',
    text: 'Вы уже не помните, что у вас сейчас: домашний интернет, LTE или раздача с телефона.',
    effect: { kind: 'flavor' },
    tone: 'neutral',
  },
  secret_server: {
    id: 'secret_server',
    title: 'Секретный сервер',
    text: 'Кто-то в чате написал про «секретный сервер», но никто так и не объяснил, где его искать.',
    effect: { kind: 'flavor' },
    tone: 'neutral',
  },
  one_checkbox: {
    id: 'one_checkbox',
    title: 'Одна галочка',
    text: 'Вы понимаете, что всё это время проблема была в одной галочке в настройках.',
    effect: { kind: 'flavor' },
    tone: 'neutral',
  },
  email_support: {
    id: 'email_support',
    title: 'Письмо дошло',
    text: 'Смогли связаться с поддержкой по почте. Два шага вперёд.',
    effect: { kind: 'move', steps: 2 },
    tone: 'good',
  },
  mirror_found: {
    id: 'mirror_found',
    title: 'Зеркало найдено',
    text: 'Вы нашли рабочее зеркало сайта. Три шага вперёд.',
    effect: { kind: 'move', steps: 3 },
    tone: 'good',
  },
  wifi_neighbor: {
    id: 'wifi_neighbor',
    title: 'Соседский вайфай',
    text: 'Сосед поделился рабочим Wi-Fi и полезной ссылкой. Один шаг вперёд.',
    effect: { kind: 'move', steps: 1 },
    tone: 'good',
  },
  captcha_passed: {
    id: 'captcha_passed',
    title: 'Капча с первого раза',
    text: 'Капча внезапно пропустила вас без борьбы. Два шага вперёд.',
    effect: { kind: 'move', steps: 2 },
    tone: 'good',
  },
  right_forum_post: {
    id: 'right_forum_post',
    title: 'Нужный пост на форуме',
    text: 'Вы нашли человека с точно такой же проблемой и рабочим решением. Три шага вперёд.',
    effect: { kind: 'move', steps: 3 },
    tone: 'good',
  },
  phone_mail: {
    id: 'phone_mail',
    title: 'С телефона получилось',
    text: 'То, что не работало на ноутбуке, внезапно заработало с телефона. Два шага вперёд.',
    effect: { kind: 'move', steps: 2 },
    tone: 'good',
  },
  stable_dns: {
    id: 'stable_dns',
    title: 'Наконец стабильный DNS',
    text: 'Вы нашли DNS, который не отваливается каждые пять минут. Два шага вперёд.',
    effect: { kind: 'move', steps: 2 },
    tone: 'good',
  },
  blancvpn_first_try: {
    id: 'blancvpn_first_try',
    title: 'BlancVPN с первой попытки',
    text: 'BlancVPN обошёл блокировку с первой попытки. Четыре шага вперёд.',
    effect: { kind: 'move', steps: 4 },
    tone: 'brand',
  },
  blancvpn_youtube: {
    id: 'blancvpn_youtube',
    title: 'YouTube наконец летает',
    text: 'Вы подключили BlancVPN, и YouTube наконец-то летает. Пять шагов вперёд.',
    effect: { kind: 'move', steps: 5 },
    tone: 'brand',
  },
  blancvpn_mobile: {
    id: 'blancvpn_mobile',
    title: 'Работает даже на мобильном',
    text: 'BlancVPN заработал даже через мобильный интернет. Три шага вперёд.',
    effect: { kind: 'move', steps: 3 },
    tone: 'brand',
  },
  blancvpn_fast_setup: {
    id: 'blancvpn_fast_setup',
    title: 'Настройка за минуту',
    text: 'Вы установили BlancVPN за минуту и ничего не сломали. Три шага вперёд.',
    effect: { kind: 'move', steps: 3 },
    tone: 'brand',
  },
  blancvpn_stable: {
    id: 'blancvpn_stable',
    title: 'Соединение держится',
    text: 'BlancVPN удержал соединение там, где всё отваливалось каждые пять минут. Ещё два шага вперёд.',
    effect: { kind: 'move', steps: 2 },
    tone: 'brand',
  },
  blancvpn_rescue: {
    id: 'blancvpn_rescue',
    title: 'Спас в последний момент',
    text: 'Когда уже казалось, что ничего не откроется, BlancVPN всё-таки вытянул маршрут. Ещё четыре шага вперёд.',
    effect: { kind: 'move', steps: 4 },
    tone: 'brand',
  },
}

export const EVENT_IDS = Object.keys(EVENTS)

export function getEvent(id: string): BoardEvent {
  const event = EVENTS[id]
  if (!event) {
    throw new Error(`Unknown event: ${id}`)
  }
  return event
}
