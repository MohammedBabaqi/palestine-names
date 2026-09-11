'use client';
import { useParticleStore } from '@/lib/particleStore';
export default function OpeningNumberScene() {
  const total = useParticleStore(s => s.total);
  const status = useParticleStore(s => s.dataStatus);
  const webgl = useParticleStore(s => s.webglReady);
  return <section id="number" className="chapter opening" aria-labelledby="opening-title">
    <div className="opening-stage">
      <div className="opening-heading">
        {/* Palestinian Flag Heritage Quote Badge */}
        <div className="starter-flag-quote-badge" dir="rtl" role="note" aria-label="شاهد أدبي: محمود درويش">
          <div className="flag-miniature" aria-hidden="true">
            <div className="flag-stripes-col">
              <span className="flag-stripe flag-black" />
              <span className="flag-stripe flag-white" />
              <span className="flag-stripe flag-green" />
            </div>
            <span className="flag-triangle-red" />
          </div>
          <span className="starter-quote-text">«عَلَى هَذِهِ الأَرْضِ مَا يَسْتَحِقُّ الحَيَاة»</span>
          <span className="starter-quote-poet">— مَحْمُود دَرْوِيش</span>
        </div>

        <span className="eyebrow">من العدد إلى الاسم</span>
        <h1 id="opening-title">لكلّ واحدٍ منهم، <em>حياة.</em></h1>
      </div>
      <div className={webgl && total !== null ? 'sr-only' : 'opening-count'} dir="ltr">{total === null ? '—' : total.toLocaleString('en-US')}</div>
      <div className="opening-caption"><p>{status === 'ready' ? 'اسمًا محفوظًا في هذا الأرشيف' : status === 'error' ? 'تعذّر الاتصال بالأرشيف' : 'نستحضر الأسماء…'}</p><span>لم يكونوا أرقامًا. كانوا أشخاصًا.</span>{status === 'error' && <button className="text-link" onClick={() => location.reload()}>إعادة المحاولة</button>}</div>
      <div className="opening-bottom"><p className="micro-copy">كل هيئةٍ صغيرة تحمل اسم إنسان.<br/>اقترب، لتقرأ ما وراء العدد.</p><a className="scroll-cue" href="#crowd"><span>ابدأ الحكاية</span><i aria-hidden="true">↓</i></a><p className="edition" lang="en" dir="ltr">PALESTINE<br/>A LIVING MEMORY</p></div>
    </div>
  </section>;
}
