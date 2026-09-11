'use client';
import { useState } from 'react';
import { useParticleStore } from '@/lib/particleStore';
import { CHAPTERS } from '@/lib/useScrollStory';
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const mode = useParticleStore(s => s.mode);
  const progress = useParticleStore(s => s.scrollProgress);
  const reduced = useParticleStore(s => s.reducedMotion);
  const chapter = CHAPTERS.find(c => c.mode === mode) || CHAPTERS[0];
  return <>
    <header className="masthead">
      <a className="wordmark" href="#number" aria-label="أسماء لا تُنسى — البداية"><span className="memory-mark" aria-hidden="true">ا</span><span>أسماء <strong>لا تُنسى</strong><small lang="en" dir="ltr">NAMES, NOT NUMBERS</small></span></a>
      <span className="masthead-context">فلسطين · أرشيف الذاكرة</span>
      <div className="header-actions"><button className="motion-toggle" onClick={() => useParticleStore.setState({ reducedMotion: !reduced })} aria-pressed={reduced}>{reduced ? 'الحركة متوقفة' : 'إيقاف الحركة'}</button><button className="index-toggle" aria-expanded={open} aria-controls="chapter-index" onClick={() => setOpen(!open)}>الفهرس <span aria-hidden="true">{open ? '−' : '+'}</span></button></div>
    </header>
    {open && <nav id="chapter-index" className="chapter-index" aria-label="فصول الحكاية" onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}>
      {CHAPTERS.map((c, i) => <a href={'#' + c.id} key={c.id} aria-current={chapter.id === c.id ? 'location' : undefined} onClick={() => setOpen(false)}><span>{c.label}</span><bdi>{String(i + 1).padStart(2, '0')}</bdi></a>)}
    </nav>}
    <aside className="reading-rail" aria-label="الفصل الحالي"><span className="rail-line"><i style={{ transform: 'scaleY(' + progress + ')' }} /></span><span className="rail-label">{chapter.label}</span><span className="folio" dir="ltr">{String(CHAPTERS.indexOf(chapter) + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}</span></aside>
  </>;
}
