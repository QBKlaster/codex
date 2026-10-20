import { useEffect, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Blocks, Box, Check, Globe2, Layers3, MapPin, Menu, Minus, Plus, Ruler, ShieldCheck, Sparkles, Truck, X } from 'lucide-react'
import { ProductVisual } from './components/ProductVisual'
import { RequestDialog } from './components/RequestDialog'
import { ConcreteCalculator } from './components/ConcreteCalculator'
import { useSiteMotion } from './hooks/useSiteMotion'

const products = [
  { id: 'mix', title: 'Tayyor beton', tag: 'M200 — M350', text: 'Poydevordan murakkab konstruksiyalargacha — loyihangizga mos beton yechimi.', variant: 'mix' as const, category: 'Beton', icon: Box, details: 'Poydevor, pol va monolit konstruksiyalar uchun tayyor beton. Kerakli marka konstruktiv loyiha va mutaxassis tavsiyasi asosida tanlanadi.', specs: [['Qo‘llanishi', 'Poydevor, pol, monolit'], ['Hisob birligi', 'm³'], ['Marka', 'Loyihaga muvofiq']] },
  { id: 'slabs', title: 'Temir-beton mahsulotlari', tag: 'MUSTAHKAM KONSTRUKSIYA', text: 'Binolaringiz uchun mustahkam tayanch. Aniq shakl va puxta yechim.', variant: 'slabs' as const, category: 'Temir-beton', icon: Layers3, details: 'Yopma plitalari va boshqa temir-beton konstruksiyalar. O‘lchamlar, yuk ko‘tarish talablari va mavjud assortiment so‘rov paytida aniqlashtiriladi.', specs: [['Qo‘llanishi', 'Yopmalar, tayanchlar'], ['Hisob birligi', 'dona'], ['O‘lcham', 'Loyiha bo‘yicha']] },
  { id: 'blocks', title: 'Qurilish bloklari', tag: 'QULAY VA AMALIY', text: 'Devorlaringizga mustahkamlik, qurilish jarayoniga esa qulaylik qo‘shing.', variant: 'blocks' as const, category: 'Bloklar', icon: Blocks, details: 'Devor va yordamchi inshootlar uchun beton bloklar. Mahsulot turi, hajmi va kerakli miqdorini loyihangiz talablariga ko‘ra kelishib oling.', specs: [['Qo‘llanishi', 'Devor, yordamchi inshoot'], ['Hisob birligi', 'dona'], ['Miqdor', 'Loyihaga muvofiq']] },
]
const faqs = [
  ['Qaysi beton markasini tanlash kerak?', 'Beton markasi inshoot turi, hisoblangan yuklama va loyiha talablariga bog‘liq. Poydevor yoki yuk ko‘taruvchi konstruksiya uchun tanlovni loyihachi bilan kelishing. Kalkulyator hajmni hisoblaydi, beton markasini esa muhandislik loyihasi belgilaydi.'],
  ['Qancha beton kerakligini qanday hisoblayman?', 'To‘g‘ri to‘rtburchak poydevor uchun uzunlik × kenglik × qalinlik formulasidan foydalaning. Sahifamizdagi kalkulyator plita yoki silindrsimon ustun hajmini hisoblab, istasangiz 10% zaxira ham qo‘shadi.'],
  ['Yetkazib berishni qanday kelishish mumkin?', 'So‘rovda qurilish manzili, kerakli hajm va qulay sanani ko‘rsating. Yetkazish hududi, transport turi, narxi va aniq vaqt korxona bilan alohida kelishiladi.'],
  ['Mahsulot narxini qayerdan bilsam bo‘ladi?', 'Narx mahsulot turi, beton markasi, buyurtma hajmi va yetkazish sharoitiga qarab aniqlanadi. “Loyihani boshlash” tugmasi orqali tafsilotlarni kiritib, yuborishga tayyor so‘rov yarating.'],
]
const heroSlides = [
  { lines: ['Katta g‘oyalar.', 'Mustahkam', 'poydevor.'], description: ['Siz kelajakni tasavvur qilasiz.', 'Biz uning mustahkam asosini yaratamiz.'] },
  { lines: ['Har bir detal.', 'Har bir loyiha.', 'Muhim.'], description: ['Puxta tanlovdan ishonchli natijagacha.', 'Loyihangizga mos yechimdan boshlaymiz.'] },
  { lines: ['Bugun asos.', 'Ertaga yangi', 'imkoniyat.'], description: ['Uy, biznes yoki katta inshoot.', 'Qurilishingizning keyingi qadamini birga belgilaymiz.'] },
]

function Logo({ light = false }: { light?: boolean }) {
  return <a href="#bosh-sahifa" className={`logo ${light ? 'logo-light' : ''}`} aria-label="Qarshi Beton Klaster — bosh sahifa">
    <svg viewBox="0 0 46 48" aria-hidden="true"><path d="m3 13 20-11 20 11-20 11zM3 22l20 11 20-11v9L23 42 3 31zM3 34l20 11 20-11v8L23 53 3 42z" fill="currentColor" transform="translate(0 -2) scale(.94)" /></svg>
    <span>QARSHI BETON<span>KLASTER</span></span>
  </a>
}

export default function App() {
  useSiteMotion()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [request, setRequest] = useState<string | null>(null)
  const [filter, setFilter] = useState('Barchasi')
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [scrolled, setScrolled] = useState(false)
  const [slide, setSlide] = useState(0)
  const product = products.find((item) => item.id === selectedProduct)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function openRequest(summary = '') { setMobileOpen(false); setRequest(summary) }

  return <>
    <a className="skip-link" href="#asosiy">Asosiy mazmunga o‘tish</a>
    <div className="reading-progress" aria-hidden="true"><span /></div>
    <div className="top-bar"><div className="container top-bar-inner"><span><MapPin size={12} /> Qarshi, O‘zbekiston</span><span>Buyuk loyihalar mustahkam asosdan boshlanadi.</span><a href="#kalkulyator">Beton hajmini hisoblash <ArrowUpRight size={12} /></a></div></div>
    <header className="site-header" id="bosh-sahifa">
      <div className="container header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Asosiy navigatsiya"><a href="#mahsulotlar">Mahsulotlar</a><a href="#biz-haqimizda">Nega biz?</a><a href="#jarayon">Hamkorlik</a><a href="#aloqa">Aloqa</a></nav>
        <div className="header-actions"><span className="language"><Globe2 size={16} /> UZ</span><button className="button button-dark header-cta" onClick={() => openRequest()}>Loyihani boshlash <ArrowUpRight size={16} /></button><button className="icon-button menu-button" aria-label={mobileOpen ? 'Menyuni yopish' : 'Menyuni ochish'} aria-expanded={mobileOpen} aria-controls="mobile-nav" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button></div>
      </div>
      {mobileOpen && <nav className="mobile-nav" id="mobile-nav" aria-label="Mobil navigatsiya">{[['Mahsulotlar', '#mahsulotlar'], ['Nega biz?', '#biz-haqimizda'], ['Hamkorlik', '#jarayon'], ['Kalkulyator', '#kalkulyator'], ['Aloqa', '#aloqa']].map(([label, href]) => <a key={href} href={href} onClick={() => setMobileOpen(false)}>{label}<ArrowUpRight size={19} /></a>)}<button className="button button-orange" onClick={() => openRequest()}>Loyihani boshlash <ArrowRight size={17} /></button></nav>}
    </header>
    <main id="asosiy">
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-image" src="/architecture.webp" alt="Iliq quyosh nuridagi zamonaviy beton arxitektura konsepsiyasi" fetchPriority="high" width="1672" height="941" />
        <div className="hero-shade" />
        <div className="container hero-content">
          <p className="hero-eyebrow"><span /> QURILISHINGIZNING ISHONCHLI ASOSI</p>
          <h1 id="hero-title" key={slide} aria-live="polite">{heroSlides[slide].lines.map((line) => <span className="hero-line" key={line}><span>{line}</span></span>)}</h1>
          <p className="hero-description" key={`description-${slide}`}>{heroSlides[slide].description[0]}<br />{heroSlides[slide].description[1]}</p>
          <div className="hero-actions"><a href="#mahsulotlar" className="button button-orange">Mahsulotlarni ko‘rish <ArrowUpRight size={19} /></a><a href="#biz-haqimizda" className="hero-secondary"><span><ArrowDown size={18} /></span> Biz bilan tanishing</a></div>
        </div>
        <div className="hero-coordinate">QARSHI · O‘ZBEKISTON <span>38°51′ N 65°47′ E</span></div>
        <div className="hero-bottom"><div className="container hero-bottom-inner"><span className="hero-caption"><span className="tiny-cross">+</span> BETONDAN KO‘PROQ. ISHONCH QURAMIZ.</span><div className="hero-carousel-controls"><button aria-label="Oldingi slayd" onClick={() => setSlide((slide + 2) % 3)}><ArrowLeft size={14} /></button><span className="hero-index"><b>0{slide + 1}</b><span />03 <span className="index-line" style={{ background: `linear-gradient(90deg, var(--orange) ${(slide + 1) * 100 / 3}%, #ffffff40 ${(slide + 1) * 100 / 3}%)` }} /></span><button aria-label="Keyingi slayd" onClick={() => setSlide((slide + 1) % 3)}><ArrowRight size={14} /></button></div></div></div>
        <span className="image-note">Arxitektura konsepsiyasi</span>
      </section>
      <section className="benefits-strip" aria-label="Bizning yondashuvimiz"><div className="container benefits-grid">
        <div><ShieldCheck /><span><strong>Sifatga e’tibor</strong><small>Har bir detalda mas’uliyat</small></span><span className="benefit-number">01</span></div>
        <div><Layers3 /><span><strong>Loyihaga mos yechim</strong><small>Ehtiyojingizdan boshlaymiz</small></span><span className="benefit-number">02</span></div>
        <div><Truck /><span><strong>Qulay hamkorlik</strong><small>So‘rovdan yetkazib berishgacha</small></span><span className="benefit-number">03</span></div>
      </div></section>

      <section className="products-section section-space" id="mahsulotlar">
        <div className="container">
          <div className="section-topline"><p className="eyebrow"><span className="orange-dot" /> MAHSULOTLARIMIZ</p><span className="section-label">PUXTA TANLOV. MUSTAHKAM NATIJA.</span></div>
          <div className="section-heading-row"><h2>Har bir g‘oyaga<br /><span>munosib asos.</span></h2><p>Kichik poydevordan katta inshootgacha.<br />Qurilishingiz uchun kerakli yechimni toping.</p></div>
          <div className="products-toolbar"><div className="product-tabs" aria-label="Mahsulot turi">{['Barchasi', 'Beton', 'Temir-beton', 'Bloklar'].map((tab) => <button key={tab} className={filter === tab ? 'active' : ''} aria-pressed={filter === tab} onClick={() => setFilter(tab)}>{tab}{tab === 'Barchasi' && <span>03</span>}</button>)}</div><span className="product-count">{filter === 'Barchasi' ? '03' : '01'} ta yo‘nalish</span></div>
          <div className="product-grid">{products.filter((item) => filter === 'Barchasi' || item.category === filter).map((item, index) => <article className="product-card" key={item.id}>
            <button className="product-image-button" onClick={() => setSelectedProduct(item.id)} aria-label={`${item.title} haqida batafsil`}><span className="product-code">QBK / 0{index + 1}</span><ProductVisual variant={item.variant} /><span className="product-image-icon"><ArrowUpRight size={20} /></span></button>
            <div className="product-info"><span className="product-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.text}</p><button className="text-link" onClick={() => setSelectedProduct(item.id)}>Batafsil tanishish <ArrowUpRight size={17} /></button></div>
          </article>)}</div>
          <div className="catalog-note"><span><Sparkles size={17} /> Nima tanlashni bilmayapsizmi? Loyihangizdan boshlaymiz.</span><button onClick={() => openRequest('Mahsulot tanlash bo‘yicha maslahat kerak.')}>Birgalikda tanlaymiz <ArrowRight size={16} /></button></div>
        </div>
      </section>

      <section className="about-section section-space" id="biz-haqimizda"><div className="container about-grid">
        <div className="about-visual"><img src="/architecture.webp" alt="Betonning tabiiy fakturasi va zamonaviy arxitektura uyg‘unligi" loading="lazy" width="600" height="650" /><div className="about-image-overlay" /><span className="about-visual-label">MATERIALLARDAN BOSHLANADI.<br />ISHONCH BILAN DAVOM ETADI.</span><div className="about-stamp"><span>QBK</span><small>MUSTAHKAMLIK<br />HAR BIR DETALDA</small><ArrowUpRight size={24} /></div></div>
        <div className="about-content"><p className="eyebrow"><span className="orange-dot" /> BIZNING YONDASHUV</p><h2>Beton — mahsulot.<br /><span>Ishonch — poydevor.</span></h2><p className="about-intro">Har bir qurilish ortida katta niyat bor. Shinam uy, yangi ish joyi yoki butun bir mahalla. Biz uchun hamkorlik ana shu niyatni tushunishdan boshlanadi.</p><div className="about-values">
          <div><span className="value-icon"><ShieldCheck size={22} /></span><div><h3>Mustahkamlikka jiddiy qaraymiz</h3><p>Material tanlashda loyiha talabi va qurilish vazifasi birinchi o‘rinda.</p></div><Check size={16} /></div>
          <div><span className="value-icon"><Ruler size={22} /></span><div><h3>Tafsilotlarni aniqlashtiramiz</h3><p>Mahsulot turi, hajmi va yetkazish shartlari oldindan kelishiladi.</p></div><Check size={16} /></div>
          <div><span className="value-icon"><Layers3 size={22} /></span><div><h3>Birgalikda yechim topamiz</h3><p>Har bir loyiha o‘zgacha. Yondashuv ham unga mos bo‘lishi kerak.</p></div><Check size={16} /></div>
        </div><a className="text-link" href="#jarayon">Hamkorlik qanday boshlanadi? <ArrowUpRight size={18} /></a></div>
      </div></section>

      <section className="process-section section-space" id="jarayon"><div className="container"><div className="section-topline"><p className="eyebrow"><span className="orange-dot" /> HAMKORLIK JARAYONI</p><span className="section-label">SODDA. TUSHUNARLI. QULAY.</span></div><div className="section-heading-row"><h2>Katta ishlar.<br /><span>Oddiy qadamlar.</span></h2><p>Ortiqcha murakkabliklarsiz —<br />g‘oyadan amaliy yechimgacha.</p></div><div className="process-grid">{[
        ['Ehtiyojingizni ayting', 'Mahsulot turi, qurilish manzili va rejalashtirilgan hajmni belgilang.'],
        ['Yechimni aniqlashtiring', 'Mahsulot xususiyatlari va loyihangizga mos variantni kelishing.'],
        ['Shartlarni kelishing', 'Narx, to‘lov tartibi va yetkazish vaqtini oldindan aniqlashtiring.'],
        ['Qurilishni boshlang', 'Kelishilgan reja asosida mustahkam kelajagingizni barpo eting.'],
      ].map(([title, text], i) => <div className="process-step" key={title}><div className="step-top"><span>0{i + 1}</span>{i === 3 ? <Check size={22} /> : <ArrowUpRight size={22} />}</div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

      <ConcreteCalculator onRequest={openRequest} />

      <section className="faq-section section-space"><div className="container faq-grid"><div><p className="eyebrow"><span className="orange-dot" /> SAVOL-JAVOB</p><h2>Qurilishdan oldin<br /><span>aniqlik bo‘lsin.</span></h2><p className="faq-intro">Ko‘p beriladigan savollarga<br />sodda va tushunarli javoblar.</p><button className="text-link" onClick={() => openRequest('Qo‘shimcha savolim bor: ')}>Boshqa savolim bor <ArrowUpRight size={18} /></button></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={question}><h3><button aria-expanded={openFaq === index} aria-controls={`answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span className="faq-number">0{index + 1}</span><span>{question}</span>{openFaq === index ? <Minus size={19} /> : <Plus size={19} />}</button></h3><div className="faq-answer" id={`answer-${index}`} hidden={openFaq !== index}><p>{answer}</p></div></div>)}</div></div></section>

      <section className="contact-section" id="aloqa"><div className="container"><div className="contact-card"><div className="contact-art" aria-hidden="true"><span /><span /><span /></div><div className="contact-content"><p className="eyebrow"><span /> YANGI LOYIHANGIZ UCHUN</p><h2>Kelajakni birga<br />mustahkamlaymiz.</h2><p>G‘oya sizdan. Ishonchli asos sari birinchi qadam — biz bilan.</p><button className="button button-dark" onClick={() => openRequest()}>Loyihani boshlash <ArrowUpRight size={19} /></button></div><span className="contact-side">KATTA NIYATLAR. MUSTAHKAM ASOS.</span></div></div></section>
    </main>
    <footer className="site-footer"><div className="container"><div className="footer-main"><div className="footer-brand"><Logo /><p>Bugunning mustahkam asosi.<br />Ertaning katta imkoniyatlari.</p><span className="footer-location"><MapPin size={15} /> Qarshi, O‘zbekiston</span></div><div className="footer-column"><h3>Sahifalar</h3><a href="#mahsulotlar">Mahsulotlar</a><a href="#biz-haqimizda">Bizning yondashuv</a><a href="#jarayon">Hamkorlik jarayoni</a><a href="#kalkulyator">Beton kalkulyatori</a></div><div className="footer-column"><h3>Mahsulotlar</h3>{products.map((item) => <button key={item.id} onClick={() => setSelectedProduct(item.id)}>{item.title}</button>)}</div><div className="footer-column footer-connect"><h3>Keling, boshlaymiz</h3><button onClick={() => openRequest()}>Loyihangiz haqida gaplashamiz <ArrowUpRight size={18} /></button><a href="https://qarshibetonklaster.uz" target="_blank" rel="noreferrer">qarshibetonklaster.uz <ArrowUpRight size={15} /></a><span>Mustahkam hamkorlikka bir qadam.</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Qarshi Beton Klaster.</span><span>Mustahkam kelajak shu yerdan boshlanadi.</span><a href="#bosh-sahifa">Yuqoriga <ArrowUp size={14} /></a></div></div></footer>
    {scrolled && <a className="back-to-top" href="#bosh-sahifa" aria-label="Sahifa boshiga qaytish"><ArrowUp size={19} /></a>}
    {request !== null && <RequestDialog initialSummary={request} onClose={() => setRequest(null)} />}
    {product && <ProductDialog product={product} onClose={() => setSelectedProduct(null)} onRequest={() => { setSelectedProduct(null); openRequest(`${product.title} bo‘yicha ma’lumot va narx so‘rayman.`) }} />}
  </>
}

function ProductDialog({ product, onClose, onRequest }: { product: typeof products[number]; onClose: () => void; onRequest: () => void }) {
  useEffect(() => {
    const element = document.querySelector<HTMLDialogElement>('#product-dialog')
    const previousFocus = document.activeElement as HTMLElement | null
    element?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; previousFocus?.focus() }
  }, [])
  return <dialog id="product-dialog" className="request-dialog product-dialog" onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose() }} aria-labelledby="product-title"><div className="dialog-content"><button className="icon-button dialog-close" onClick={onClose} aria-label="Oynani yopish"><X size={21} /></button><div className="product-dialog-visual"><ProductVisual variant={product.variant} /></div><p className="eyebrow"><span className="orange-dot" /> {product.tag}</p><h2 id="product-title">{product.title}</h2><p className="dialog-intro">{product.details}</p><dl className="product-specs">{product.specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="form-note">Assortiment va mavjudlikni korxona bilan aniqlashtiring.</p><button className="button button-orange full-width" onClick={onRequest}>Narx bo‘yicha so‘rov <ArrowRight size={18} /></button></div></dialog>
}
