'use client';
import { useParticleStore } from '@/lib/particleStore';
export default function QuietFinaleScene() {
  const total = useParticleStore(s => s.total);
  return <section id="finale" className="chapter finale" aria-labelledby="finale-title"><span className="eyebrow">06 — ما يبقى</span><p>لم يكونوا أرقامًا.</p><p>كانوا أشخاصًا.</p><h2 id="finale-title">ولكل شخص <em>اسم.</em></h2><a href="#archive" className="text-link">عُد إلى الأسماء <span aria-hidden="true">↗</span></a><footer className="archive-colophon"><div><strong>أسماء لا تُنسى</strong><p>أرشيف تفاعلي للذاكرة الفلسطينية.</p></div><p>يستند هذا العرض إلى ملف البيانات المرفق بالمشروع.<br/>{total !== null && total.toLocaleString('ar') + ' سجلًا · لا يمثل إحصاءً مباشرًا أو شاملًا.'}</p><span lang="en" dir="ltr">TO REMEMBER<br/>IS TO KEEP A NAME ALIVE.</span></footer></section>;
}
