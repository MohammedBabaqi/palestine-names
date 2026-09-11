'use client';
import { useParticleStore } from '@/lib/particleStore';
export default function LivingCrowdScene() {
  const records = useParticleStore(s => s.records);
  return <section id="crowd" className="chapter crowd" aria-labelledby="crowd-title">
    <div className="chapter-heading"><span className="eyebrow">01 — أشخاص</span><h2 id="crowd-title">حين تقترب،<br/>ترى <em>إنسانًا.</em></h2><p>ليس الحشد كتلةً واحدة.<br/>لكل شخص اسم يستحق أن يُقرأ.</p></div>
    <div className="crowd-instruction"><span className="crosshair" aria-hidden="true">+</span>مرّر فوق هيئة، أو المسها، لقراءة اسمها.</div>
    <div className="name-ribbon" aria-label="أسماء من الأرشيف">{records.slice(0, 5).map(r => <button key={r.id} onClick={() => useParticleStore.setState({ selectedRecord: r })}>{r.ar_name || r.en_name}<span>قراءة السجل ↗</span></button>)}</div>
    <p className="scene-footnote">عينة من الأرشيف؛ كل هيئة مرئية مرتبطة بسجل فعلي.</p>
  </section>;
}
