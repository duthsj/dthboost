import type { Receipt, TFunction } from './types'
import { translatePhrase } from '../i18n'
import type { Language } from '../i18n'

interface ReceiptDrawerProps {
  t: TFunction
  language: Language
  receipt: Receipt
  onClose: () => void
}

export default function ReceiptDrawer({ t, language, receipt, onClose }: ReceiptDrawerProps) {
  const tx = (value: string | number | null | undefined) => translatePhrase(value, language)

  return (
    <div className="drawer-backdrop" role="presentation">
      <section className="receipt-drawer" aria-label="Change receipt">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t.receipt}</span>
            <h2>{tx(receipt.title)}</h2>
          </div>
          <button
            className="action-btn ghost"
            onClick={onClose}
            type="button"
          >
            {t.close}
          </button>
        </div>

        <dl className="receipt-detail">
          <div>
            <dt>{t.command}</dt>
            <dd>{receipt.command}</dd>
          </div>
          <div>
            <dt>{t.scope}</dt>
            <dd>{tx(receipt.scope)}</dd>
          </div>
          <div>
            <dt>{t.target}</dt>
            <dd>{tx(receipt.target)}</dd>
          </div>
          <div>
            <dt>{t.before}</dt>
            <dd>{tx(receipt.before)}</dd>
          </div>
          <div>
            <dt>{t.after}</dt>
            <dd>{tx(receipt.after)}</dd>
          </div>
          <div>
            <dt>{t.rollback}</dt>
            <dd>{tx(receipt.rollback)}</dd>
          </div>
          <div>
            <dt>{t.admin}</dt>
            <dd>{receipt.requiresAdmin ? t.required : t.notRequired}</dd>
          </div>
          <div>
            <dt>{t.reboot}</dt>
            <dd>{receipt.requiresReboot ? t.required : t.notRequired}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
