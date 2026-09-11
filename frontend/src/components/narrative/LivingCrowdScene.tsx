'use client';
import { useParticleStore } from '@/lib/particleStore';
export default function LivingCrowdScene() {
  const records = useParticleStore(s => s.records);
  return <section id="crowd" className="chapter crowd" aria-labelledby="crowd-title">
    <div className="chapter-heading">
      <span className="eyebrow">01 — خارطة الذاكرة</span>
      <h2 id="crowd-title">حين تقترب،<br/>ترى <em>أرضًا وإنسانًا.</em></h2>
      <p>تتشكّل حدود فلسطين التاريخية من أرواحهم؛ لم يكونوا أرقامًا، بل أرضًا وهوية، ولكل شخص اسم وحكاية.</p>
    </div>
    <div className="crowd-instruction">
      <span className="crosshair" aria-hidden="true">+</span>
      مرّر فوق أي هيئة على حدود الخارطة، أو المسها، لقراءة اسمها.
    </div>
    <div className="name-ribbon" aria-label="أسماء من الأرشيف">{records.slice(0, 5).map(r => <button key={r.id} onClick={() => useParticleStore.setState({ selectedRecord: r })}>{r.ar_name || r.en_name}<span>قراءة السجل ↗</span></button>)}</div>
    <p className="scene-footnote">خارطة فلسطين التاريخية تتجسّد من آلاف الهيئات البشرية؛ كل هيئة مرتبطة بسجل فعلي في الأرشيف.</p>
  </section>;
}
