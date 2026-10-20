import { useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowRight, Check, CheckCheck, Copy, FileText, X } from 'lucide-react'
import type { FormEvent } from 'react'

type Props = { initialSummary: string; onClose: () => void }

export function RequestDialog({ initialSummary, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [prepared, setPrepared] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    dialog.current?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus() }
  }, [])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setPrepared([
      'QARSHI BETON KLASTER — loyiha so‘rovi',
      `Ism: ${String(data.get('name')).trim()}`,
      `Telefon: ${String(data.get('phone')).trim()}`,
      `Mahsulot: ${data.get('product')}`,
      `Loyiha tafsilotlari: ${String(data.get('details')).trim() || 'Ko‘rsatilmagan'}`,
      `Tayyorlangan sana: ${new Intl.DateTimeFormat('uz-UZ', { timeZone: 'Asia/Tashkent' }).format(new Date())}`,
    ].join('\n\n'))
  }

  function download() {
    const url = URL.createObjectURL(new Blob([prepared], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'QBK-loyiha-sorovi.txt'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(prepared)
      setCopied(true)
      setCopyError(false)
    } catch { setCopyError(true) }
  }

  return <dialog ref={dialog} className="request-dialog" onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose() }} aria-labelledby="request-title">
    <div className="dialog-content">
      <button className="icon-button dialog-close" aria-label="Oynani yopish" onClick={onClose}><X size={21} /></button>
      {prepared ? <>
        <span className="success-icon"><CheckCheck size={28} /></span>
        <p className="eyebrow">KEYINGI QADAMGA TAYYOR</p>
        <h2 id="request-title">So‘rovingiz tayyor.</h2>
        <p className="dialog-intro">Faylni yuklab oling yoki matnni nusxalang. Uni korxonaning rasmiy aloqa kanali orqali yuborishingiz mumkin.</p>
        <pre className="request-preview" tabIndex={0}>{prepared}</pre>
        <p className="form-note"><FileText size={16} /> So‘rov korxonaga avtomatik yuborilmadi.</p>
        <button className="button button-orange full-width" onClick={download}><ArrowDownToLine size={18} /> So‘rovni yuklab olish</button>
        <button className="button button-outline full-width" onClick={copy}>{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? 'Nusxalandi' : 'Matnni nusxalash'}</button>
        {copyError && <p role="status" className="form-note">Avtomatik nusxalash mavjud emas. Yuqoridagi matnni belgilang yoki faylni yuklab oling.</p>}
      </> : <>
        <p className="eyebrow"><span className="orange-dot" /> BIRINCHI QADAM</p>
        <h2 id="request-title">Katta loyihangiz<br />kichik qadamdan.</h2>
        <p className="dialog-intro">Loyihangiz haqida yozing. Siz uchun yuborishga tayyor so‘rov tuzamiz.</p>
        <form onSubmit={submit}>
          <div className="form-row">
            <label>Ismingiz<input name="name" placeholder="Ismingizni kiriting" autoComplete="given-name" required minLength={2} maxLength={80} pattern=".*\S.*" /></label>
            <label>Telefon raqamingiz<input name="phone" type="tel" placeholder="+998 90 123 45 67" autoComplete="tel" required pattern="\+?[0-9\s()\-]{9,20}" title="9 dan 20 tagacha belgidan iborat telefon raqamini kiriting" /></label>
          </div>
          <label>Qaysi mahsulot kerak?<select name="product" defaultValue={initialSummary.toLowerCase().includes('temir-beton') ? 'Temir-beton mahsulotlari' : initialSummary.toLowerCase().includes('blok') ? 'Qurilish bloklari' : initialSummary.toLowerCase().includes('maslahat') ? 'Tanlashda yordam kerak' : 'Tayyor beton'}><option>Tayyor beton</option><option>Temir-beton mahsulotlari</option><option>Qurilish bloklari</option><option>Tanlashda yordam kerak</option></select></label>
          <label>Loyihangiz haqida<textarea name="details" rows={3} maxLength={2000} defaultValue={initialSummary} placeholder="Kerakli hajm, qurilish manzili va boshqa tafsilotlar…" /></label>
          <p className="form-note">Ma’lumotlar serverga yuborilmaydi. Tayyor so‘rovni fayl sifatida saqlashingiz mumkin.</p>
          <button className="button button-orange full-width" type="submit">So‘rovni tayyorlash <ArrowRight size={18} /></button>
        </form>
      </>}
    </div>
  </dialog>
}
