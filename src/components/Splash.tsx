import { BlancLogo } from './BlancLogo'
import './Splash.css'

type SplashProps = {
  onStart: () => void
}

export function Splash({ onStart }: SplashProps) {
  return (
    <section className="splash">
      <div className="splash__brand">
        <BlancLogo className="splash__logo" size={40} />
        <span className="splash__brand-name">BlancVPN</span>
      </div>

      <h1 className="splash__title">
        В поисках
        <br />
        свободного
        <br />
        интернета
      </h1>

      <p className="splash__lead">
        Кидайте кубик, проходите клетки с сюрпризами и доберитесь до свободного интернета. В конце —
        промокод на подписку BlancVPN.
      </p>

      <button type="button" className="btn btn-primary btn-block splash__cta" onClick={onStart}>
        Начать поиск
      </button>
    </section>
  )
}
