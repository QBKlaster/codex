import { useId, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Box, Check, CircleHelp, Cylinder, Minus, Plus } from 'lucide-react';
import './ConcreteCalculator.css';

type Shape = 'slab' | 'column';
type Dimension = 'length' | 'width' | 'depth' | 'diameter' | 'height' | 'quantity';

const initialDimensions: Record<Dimension, string> = {
  length: '10',
  width: '8',
  depth: '0.2',
  diameter: '0.4',
  height: '3',
  quantity: '6',
};

const numberFormat = new Intl.NumberFormat('uz-UZ', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const displayNumber = (value: number) => numberFormat.format(value);

function AnimatedVolume({ value }: { value: number | null }) {
  const element = useRef<HTMLSpanElement>(null);
  const current = useRef(value);
  // Keep React's initial text stable; animation frames update only this node.
  const initialText = useRef(value === null ? '—' : displayNumber(value));

  useLayoutEffect(() => {
    const node = element.current;
    if (!node) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame: number | undefined;

    function settle() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      current.current = value;
      node!.textContent = value === null ? '—' : displayNumber(value);
    }

    function onPreferenceChange(event: MediaQueryListEvent) {
      if (event.matches) settle();
    }

    preference.addEventListener('change', onPreferenceChange);
    const startValue = current.current;
    if (value === null || startValue === null || startValue === value || preference.matches) {
      settle();
    } else {
      const target = value;
      const started = performance.now();
      function tick(now: number) {
        const progress = Math.min((now - started) / 480, 1);
        const eased = 1 - (1 - progress) ** 3;
        current.current = startValue! + (target - startValue!) * eased;
        node!.textContent = displayNumber(current.current);
        if (progress < 1) frame = requestAnimationFrame(tick);
        else current.current = target;
      }
      frame = requestAnimationFrame(tick);
    }

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      preference.removeEventListener('change', onPreferenceChange);
    };
  }, [value]);

  return <span ref={element}>{initialText.current}</span>;
}

export function ConcreteCalculator({ onRequest }: { onRequest: (summary: string) => void }) {
  const id = useId();
  const [shape, setShape] = useState<Shape>('slab');
  const [dimensions, setDimensions] = useState(initialDimensions);
  const [grade, setGrade] = useState('M300');
  const [reserve, setReserve] = useState(true);

  const activeDimensions: Dimension[] = shape === 'slab' ? ['length', 'width', 'depth'] : ['diameter', 'height', 'quantity'];
  const values = Object.fromEntries(Object.entries(dimensions).map(([key, value]) => [key, Number(value)])) as Record<Dimension, number>;
  const valid = activeDimensions.every((key) => dimensions[key].trim() !== '' && Number.isFinite(values[key]) && values[key] > 0 && values[key] <= 10000)
    && (shape !== 'column' || Number.isInteger(values.quantity));
  const baseVolume = valid
    ? shape === 'slab'
      ? values.length * values.width * values.depth
      : Math.PI * (values.diameter / 2) ** 2 * values.height * values.quantity
    : 0;
  const volume = baseVolume * (reserve ? 1.1 : 1);

  const fields: { key: Dimension; label: string; unit: string; step: string }[] = shape === 'slab'
    ? [{ key: 'length', label: 'Uzunligi', unit: 'm', step: '0.1' }, { key: 'width', label: 'Kengligi', unit: 'm', step: '0.1' }, { key: 'depth', label: 'Qalinligi', unit: 'm', step: '0.01' }]
    : [{ key: 'diameter', label: 'Diametri', unit: 'm', step: '0.1' }, { key: 'height', label: 'Balandligi', unit: 'm', step: '0.1' }, { key: 'quantity', label: 'Ustunlar soni', unit: 'ta', step: '1' }];

  function requestQuote() {
    if (!valid) return;
    const specification = fields.map(({ key, label, unit }) => `${label}: ${values[key]} ${unit}`).join(', ');
    onRequest(`${shape === 'slab' ? 'Plita / poydevor' : 'Ustun'} — ${grade}, ${displayNumber(volume)} m³. ${specification}.${reserve ? ' 10% zaxira bilan.' : ' Zaxirasiz.'}`);
  }

  return (
    <section className="concrete-calculator" id="kalkulyator" aria-labelledby={`${id}-title`}>
      <div className="calculator-section-heading">
        <div>
          <span className="calculator-eyebrow"><span /> BETON KALKULYATORI</span>
          <h2 id={`${id}-title`}>Reja sizdan.<br /><span>Aniq hisob bizdan.</span></h2>
        </div>
        <p>Loyihangiz uchun qancha beton kerak?<br />O‘lchamlarni kiriting, bir zumda hisoblang.</p>
      </div>

      <div className="calculator-layout">
        <div className="calculator-controls">
          <div className="calculator-shapes" role="group" aria-label="Konstruksiya shakli">
            <button type="button" aria-pressed={shape === 'slab'} className={shape === 'slab' ? 'active' : ''} onClick={() => setShape('slab')}><Box size={18} strokeWidth={1.6} /> Plita / poydevor</button>
            <button type="button" aria-pressed={shape === 'column'} className={shape === 'column' ? 'active' : ''} onClick={() => setShape('column')}><Cylinder size={18} strokeWidth={1.6} /> Ustun</button>
          </div>

          <div className="calculator-fields">
            {fields.map(({ key, label, unit, step }) => (
              <label className="calculator-field" key={key} htmlFor={`${id}-${key}`}>
                <span>{label}</span>
                <span className="calculator-input-wrap">
                  <input id={`${id}-${key}`} type="number" min={key === 'quantity' ? 1 : 0.01} max="10000" step={step} inputMode="decimal" value={dimensions[key]} onChange={(event) => setDimensions((current) => ({ ...current, [key]: event.target.value }))} />
                  <span>{unit}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="calculator-grade-heading">Beton markasi <span>Mustahkamlik darajasi</span></div>
          <div className="calculator-grades" role="group" aria-label="Beton markasi">
            {['M200', 'M250', 'M300', 'M350'].map((item) => <button key={item} type="button" aria-pressed={grade === item} className={grade === item ? 'active' : ''} onClick={() => setGrade(item)}>{item}{grade === item && <Check size={14} />}</button>)}
          </div>

          <label className="calculator-reserve">
            <span className="calculator-check"><input type="checkbox" checked={reserve} onChange={(event) => setReserve(event.target.checked)} /><span><Check size={13} /></span></span>
            <span>10% zaxira qo‘shish<small>Quyish jarayonidagi tabiiy sarf uchun</small></span>
            <CircleHelp size={18} className="calculator-help" aria-hidden="true" />
          </label>
          {!valid && <p className="calculator-error" role="alert">Barcha o‘lchamlarni 0 dan katta va 10 000 dan kichik kiriting. Ustunlar soni butun son bo‘lishi kerak.</p>}
        </div>

        <div className="calculator-result">
          <div className="calculator-result-top"><span>LOYIHANGIZ UCHUN</span><span className="calculator-grade-pill">{grade}</span></div>
          <div className="calculator-volume" aria-hidden="true"><AnimatedVolume value={valid ? volume : null} /><span>m³</span></div>
          <span role="status" aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>{valid ? `${displayNumber(volume)} m³ — taxminiy beton hajmi` : 'Beton hajmi hisoblanmadi.'}</span>
          <p className="calculator-volume-label">taxminiy beton hajmi</p>
          <div className="calculator-formula">
            <div><span>{shape === 'slab' ? 'Uzunlik × kenglik × qalinlik' : 'π × radius² × balandlik × soni'}</span><span>{valid ? `${displayNumber(baseVolume)} m³` : '—'}</span></div>
            <div><span>{reserve ? <Plus size={12} /> : <Minus size={12} />} Zaxira {reserve ? '(10%)' : '(0%)'}</span><span>{valid ? `${displayNumber(reserve ? baseVolume * 0.1 : 0)} m³` : '—'}</span></div>
          </div>
          <button className="calculator-request" type="button" disabled={!valid} onClick={requestQuote}>Shu hajmga taklif olish <ArrowUpRight size={19} /></button>
          <p className="calculator-disclaimer">Hisob taxminiy. Yakuniy hajm va beton markasini loyiha mutaxassisi bilan aniqlashtiring.</p>
        </div>
      </div>
    </section>
  );
}
