'use client';
import { useMemo, useState } from 'react';

interface Cohort {
  id: string;
  label: string;
  range: string;
  count: number;
  pct: number;
  note: string;
}

export default function LivingStatsScene() {
  const [activeCohort, setActiveCohort] = useState<string | null>(null);

  const cohorts: Cohort[] = useMemo(() => [
    {
      id: 'infants',
      label: 'الرُضّع والأطفال دون 5 سنوات',
      range: '0–4',
      count: 7120,
      pct: 9.8,
      note: '824 رضيعاً لم يكملوا عامهم الأول قبل أن يُقتلوا، لم تصدر لبعضهم شهادات ميلاد بعد.'
    },
    {
      id: 'children',
      label: 'أطفال المدارس واليافعون',
      range: '5–14',
      count: 11830,
      pct: 16.2,
      note: 'أجيال حُرمت من مقاعد الدراسة ودفاتر الرسم وحق اللعب والحياة.'
    },
    {
      id: 'youth',
      label: 'جيل الشباب والجامعات',
      range: '15–24',
      count: 15200,
      pct: 20.9,
      note: 'طاقات إبداعية وأطباء ومهندسو الغد الذين استُشهدوا على عتبة أحلامهم.'
    },
    {
      id: 'adults',
      label: 'البالغون وسند العائلات',
      range: '25–49',
      count: 25480,
      pct: 35.0,
      note: 'آباء وأمهات تركوا خلفهم آلاف الأيتام وبيوتاً أُغلقت أبوابها إلى الأبد.'
    },
    {
      id: 'elders',
      label: 'شيوخ الأرض وشواهد النكبة',
      range: '50+',
      count: 13205,
      pct: 18.1,
      note: 'أكبرهم معمر بلغ 101 عام؛ وُلدوا قبل نكبة 1948 وشهدوا قرناً من الصمود.'
    }
  ], []);

  const selectedData = cohorts.find(c => c.id === activeCohort);

  return (
    <section id="stats" className="chapter statistics-section" aria-labelledby="stats-title">
      <div className="stats-split-layout">
        {/* Dedicated Sidebar Column: Freeing the 3D space for the Olive Tree */}
        <div className="stats-editorial-sidebar">
          {/* Editorial Section Header */}
          <div className="stats-header-minimal">
            <span className="eyebrow">03 — شجرة الأجيال والذاكرة</span>
            <h2 id="stats-title">
              لم يكونوا أرقامًا،
              <br />
              بل <em>شجرة حياة</em> تمتد جذورها في الأرض.
            </h2>
            <p className="stats-poetic-lead">
              تتجمع الأرواح لتشكل شجرة زيتون فلسطين ثلاثية الأبعاد؛ مرر الفأرة فوق أوراقها وأغصانها للتعرف على أصحابها.
            </p>
          </div>

          {/* 3 Striking Sculptural Metrics */}
          <div className="stats-trio-grid">
            <article className="stat-trio-card accent-card">
              <span className="trio-badge">29.7٪ من الشهداء</span>
              <strong className="trio-number">21,637</strong>
              <h3 className="trio-title">طفلاً ويافعاً</h3>
              <p className="trio-desc">
                بينهم <strong>824 رضيعًا</strong> استشهدوا في شهورهم الأولى.
              </p>
            </article>

            <article className="stat-trio-card">
              <span className="trio-badge">جيل في ريعان شبابه</span>
              <strong className="trio-number">28.7</strong>
              <h3 className="trio-title">عامًا متوسط الأعمار</h3>
              <p className="trio-desc">
                العمر الوسيط <strong>27 عامًا</strong>، ما يؤكد استهداف شباب المستقبل.
              </p>
            </article>

            <article className="stat-trio-card">
              <span className="trio-badge">شاهد النكبتين</span>
              <strong className="trio-number">101</strong>
              <h3 className="trio-title">عامًا أكبر الشهداء سنًا</h3>
              <p className="trio-desc">
                مواليد 1923، نجا من نكبة 1948 ليرتقي شهيدًا مع أحفاده.
              </p>
            </article>
          </div>

          {/* Unified Generations Spectrum Bar */}
          <div className="generations-spectrum-container">
            <div className="spectrum-header">
              <span className="spectrum-title">توزيع الأجيال عبر شجرة الذاكرة</span>
              <span className="spectrum-hint">انقر على أي فئة للتركيز</span>
            </div>

            {/* Segmented Bar */}
            <div className="spectrum-bar" role="group" aria-label="توزيع الفئات العمرية">
              {cohorts.map(c => {
                const isActive = activeCohort === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`spectrum-segment ${isActive ? 'active' : ''}`}
                    style={{ width: `${c.pct}%` }}
                    onClick={() => setActiveCohort(isActive ? null : c.id)}
                    aria-pressed={isActive}
                  >
                    <span className="segment-label">{c.range}</span>
                    <span className="segment-pct">{c.pct}٪</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Cohort Dynamic Note */}
            {selectedData && (
              <div className="spectrum-detail-box" dir="rtl">
                <strong>{selectedData.label} ({selectedData.count.toLocaleString('ar-EG')} شهيد):</strong>
                <span> {selectedData.note}</span>
              </div>
            )}
          </div>

          {/* Lineage & AI Agent Bridge */}
          <div className="stats-bottom-ribbon">
            <div className="lineage-tribute">
              <span className="lineage-seal">إبادة السلالات</span>
              <p>
                شُطبت أسر كاملة من السجل المدني؛ كعائلات <strong>النجار (+830)</strong>، <strong>المصري (+450)</strong>، و<strong>نصر (+420)</strong>.
              </p>
            </div>

            <a href="#archivist" className="agent-shortcut-btn">
              <span>البحث في السجلات</span>
              <span className="btn-arrow" aria-hidden="true">↙</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
