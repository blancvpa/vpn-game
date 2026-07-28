import './VpnStatus.css'

type VpnStatusProps = {
  connected: boolean
}

export function VpnStatus({ connected }: VpnStatusProps) {
  return (
    <div
      className={`vpn-status ${connected ? 'vpn-status--on' : 'vpn-status--off'}`}
      role="status"
      aria-live="polite"
    >
      <span className="vpn-status__dot" aria-hidden />
      <span className="vpn-status__label">
        BlancVPN:{' '}
        <strong>{connected ? 'подключен' : 'не подключен'}</strong>
      </span>
      <span className="vpn-status__hint">
        {connected ? 'Вы защищены' : 'Вы еще не защищены'}
      </span>
    </div>
  )
}
