'use client';
import { useParticleStore } from '@/lib/particleStore';

export default function QuietFinaleScene() {
  const total = useParticleStore(s => s.total);

  return (
    <section id="finale" className="chapter finale" aria-labelledby="finale-title">
      <span className="eyebrow">05 — ما يبقى</span>
      <p>لم يكونوا أرقامًا.</p>
      <p>كانوا حيواتٍ وأحلاماً.</p>
      <h2 id="finale-title">
        ولكل إنسان <em>اسمٌ وخلود.</em>
      </h2>

      <footer className="archive-colophon">
        <div>
          <strong>أسماء لا تُنسى</strong>
          <p>سِجل تفاعلي تخليداً لأرواح شهداء فلسطين.</p>
        </div>

        <div className="colophon-developer">
          <span className="colophon-role">تطوير وهندسة المنصة</span>
          <a
            href="https://github.com/MohammedBabaqi"
            target="_blank"
            rel="noopener noreferrer"
            className="developer-link"
            aria-label="GitHub Profile of Developer Mohammed Babaqi"
          >
            <strong className="dev-name">Mohammed Babaqi</strong>
            <span className="dev-handle" dir="ltr">github.com/MohammedBabaqi ↗</span>
          </a>
        </div>

        <div className="colophon-meta">
          <p>
            يستند هذا العرض إلى سجلات البيانات الموثقة.
            <br />
            {total !== null && `${total.toLocaleString('ar-EG')} سجلاً موثقاً بالاسم والعمر.`}
          </p>
          <span lang="en" dir="ltr">
            TO REMEMBER
            <br />
            IS TO KEEP A NAME ALIVE.
          </span>
        </div>
      </footer>
    </section>
  );
}
