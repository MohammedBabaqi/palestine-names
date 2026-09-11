'use client';
import { useMemo, useState } from 'react';
import { useParticleStore } from '@/lib/particleStore';

interface Cohort {
  id: string;
  label: string;
  range: string;
  count: number;
  pct: number;
  desc: string;
  icon: string;
}

const TOP_FAMILIES = [
  { name: 'عائلة النجار', count: '830+', location: 'خانيونس وجنوب القطاع' },
  { name: 'عائلة المصري', count: '450+', location: 'شمال القطاع وغزة' },
  { name: 'عائلة نصر', count: '420+', location: 'جباليا والشمال' },
  { name: 'عائلة عبيد', count: '320+', location: 'مدينة غزة' },
  { name: 'عائلة عودة', count: '310+', location: 'مخيم الشاطئ والوسطى' },
  { name: 'عائلة عاشور', count: '310+', location: 'تل الهوا والزيتون' },
  { name: 'عائلة شاهين', count: '310+', location: 'دير البلح والوسطى' },
  { name: 'عائلة دغمش', count: '300+', location: 'حي الصبرة والرمال' },
];

export default function LivingStatsScene() {
  const stats = useParticleStore(s => s.statistics);
  const total = stats?.total || 72835;
  const [activeCohort, setActiveCohort] = useState<string | null>(null);

  const cohorts: Cohort[] = useMemo(() => {
    return [
      {
        id: 'infants',
        label: 'الرُضّع والطفولة المبكرة',
        range: '0–4 سنوات',
        count: 7120,
        pct: 9.8,
        desc: '824 طفلاً استشهدوا دون إتمام عامهم الأول، قبل أن ينطقوا أسماءهم أو تصدر لهم شهادات ميلاد.',
        icon: '🍼'
      },
      {
        id: 'children',
        label: 'أطفال المدارس واليافعون',
        range: '5–14 سنة',
        count: 11830,
        pct: 16.2,
        desc: 'جيل كامل من تلاميذ المدارس سُلب مقعده الدراسي وحقه في اللعب والحياة.',
        icon: '🎒'
      },
      {
        id: 'youth',
        label: 'الشباب وطلبة الجامعات',
        range: '15–24 سنة',
        count: 15200,
        pct: 20.9,
        desc: 'طاقات إبداعية وأحلام جامعية كان يُفترض أن تبني المستقبل.',
        icon: '🎓'
      },
      {
        id: 'adults',
        label: 'البالغون وسند العائلات',
        range: '25–49 سنة',
        count: 25480,
        pct: 35.0,
        desc: 'الآباء والأمهات، المهندسون والأطباء؛ عماد الأسر ومربو الأجيال.',
        icon: '🏠'
      },
      {
        id: 'elders-mid',
        label: 'كبار السن وجيل العطاء',
        range: '50–64 سنة',
        count: 7800,
        pct: 10.7,
        desc: 'الأساتذة والجدات؛ جذور العائلة ومصدر الحكمة والأمان.',
        icon: '🌿'
      },
      {
        id: 'elders-nakba',
        label: 'شيوخ فلسطين وشواهد النكبة',
        range: '65+ سنة',
        count: 5405,
        pct: 7.4,
        desc: 'أكبرهم مسن بلغ 101 عام؛ وُلدوا قبل نكبة 1948 وعاشوا قرناً من الصمود.',
        icon: '🕊️'
      }
    ];
  }, []);

  return (
    <section id="stats" className="chapter statistics-section" aria-labelledby="stats-title">
      {/* Editorial Section Header */}
      <div className="stats-header-wrap">
        <div>
          <span className="eyebrow">02 — سِجل الإحصاء الإنساني</span>
          <h2 id="stats-title">
            لم يكونوا أرقامًا،
            <br />
            بل <em>أجيالاً</em> سُلبت حياتها.
          </h2>
        </div>
        <p className="stats-header-desc">
          كل رقم في هذا السجل يمثل فراغاً لا يمتلئ في بيت، وصوتاً سكت في مائدة عائلة.
          هنا تحليل دقيق للبيانات المستخلصة من <strong>72,835</strong> سجلاً موثقاً.
        </p>
      </div>

      {/* 4 Core Vital Metric Cards */}
      <div className="stats-metrics-grid">
        <article className="stat-card highlight-red">
          <div className="stat-card-top">
            <span className="stat-badge">29.7٪ من الشهداء</span>
            <span className="stat-icon" aria-hidden="true">👶</span>
          </div>
          <strong className="stat-number">21,637</strong>
          <h3 className="stat-title">طفلاً دون الثامنة عشرة</h3>
          <p className="stat-detail">
            منهم <strong>824 رضيعًا</strong> استشهدوا في شهورهم الأولى قبل أن يكتمل عامهم الأول.
          </p>
        </article>

        <article className="stat-card highlight-green">
          <div className="stat-card-top">
            <span className="stat-badge">مجتمع فتيّ مغدور</span>
            <span className="stat-icon" aria-hidden="true">⏳</span>
          </div>
          <strong className="stat-number">28.7</strong>
          <h3 className="stat-title">عامًا متوسط العمر</h3>
          <p className="stat-detail">
            العمر الوسيط هو <strong>27 عامًا</strong>، ما يؤكد الاستهداف المباشر لجيل الشباب والطفولة.
          </p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span className="stat-badge">شواهد التاريخ</span>
            <span className="stat-icon" aria-hidden="true">🕊️</span>
          </div>
          <strong className="stat-number">5,400+</strong>
          <h3 className="stat-title">مُسن عاشوا نكبتين</h3>
          <p className="stat-detail">
            أكبر الشهداء عمرًا معمر بلغ <strong>101 عام</strong> (مواليد 1923)، عاش النكبة الأولى واستشهد في هذه الحرب.
          </p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span className="stat-badge">عماد المجتمع</span>
            <span className="stat-icon" aria-hidden="true">👥</span>
          </div>
          <div className="stat-split-numbers">
            <div>
              <strong className="stat-number-sm">70٪</strong>
              <span>ذكور (50,959)</span>
            </div>
            <div className="stat-split-divider" />
            <div>
              <strong className="stat-number-sm">30٪</strong>
              <span>إناث (21,876)</span>
            </div>
          </div>
          <h3 className="stat-title">توزيع الفئات الإنسانية</h3>
          <p className="stat-detail">
            فقدان مئات الآلاف من الآباء والأمهات خلّف وراءه جيشاً من الأيتام في قطاع محاصر.
          </p>
        </article>
      </div>

      {/* Demographic Cohort Breakdown */}
      <div className="stats-cohort-panel">
        <div className="panel-heading">
          <div className="panel-title-group">
            <span className="panel-dot" aria-hidden="true" />
            <h3>توزيع الأجيال المغدورة بحسب الفئات العمرية</h3>
          </div>
          <span className="panel-hint">انقر على أي فئة لقراءة أبعادها الإنسانية</span>
        </div>

        <div className="cohort-bars-list">
          {cohorts.map(c => {
            const isSelected = activeCohort === c.id;
            return (
              <div
                key={c.id}
                className={`cohort-row ${isSelected ? 'selected' : ''}`}
                onClick={() => setActiveCohort(isSelected ? null : c.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveCohort(isSelected ? null : c.id);
                  }
                }}
              >
                <div className="cohort-info">
                  <div className="cohort-header">
                    <span className="cohort-icon">{c.icon}</span>
                    <strong className="cohort-name">{c.label}</strong>
                    <span className="cohort-range">({c.range})</span>
                  </div>
                  <div className="cohort-metrics">
                    <span className="cohort-count">{c.count.toLocaleString('ar-EG')} شهيد</span>
                    <span className="cohort-pct">{c.pct}٪</span>
                  </div>
                </div>

                <div className="cohort-progress-track">
                  <div
                    className="cohort-progress-fill"
                    style={{ width: `${Math.min(100, c.pct * 2.7)}%` }}
                  />
                </div>

                {isSelected && (
                  <p className="cohort-description-box" dir="rtl">
                    {c.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Family Eradication Memorial Showcase */}
      <div className="families-eradication-block">
        <div className="families-header">
          <span className="families-seal">إبادة السلالات</span>
          <h3>شطب عائلات كاملة من السجل المدني</h3>
          <p>
            لم تكن الضربات فردية؛ استشهدت أسر بكاملها ومُحيت أسماء أجيال متعاقبة من الجد إلى الحفيد.
            هذه بعض أبرز العائلات التي سجلت أكبر عدد من الشهداء في الأرشيف:
          </p>
        </div>

        <div className="families-grid">
          {TOP_FAMILIES.map(f => (
            <div key={f.name} className="family-capsule">
              <span className="family-name">{f.name}</span>
              <strong className="family-count">{f.count} شهيد</strong>
              <small className="family-location">{f.location}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Seamless Bridge to the AI Agent */}
      <div className="stats-agent-bridge">
        <div className="bridge-content">
          <span className="bridge-badge">البحث المتقدم الذكي</span>
          <h3>هل تبحث عن اسم محدد أو ترغب في فرز السجلات؟</h3>
          <p>
            تولى <strong>«حارس الأرشيف»</strong> الذكي في الأسفل مهمة البحث الخوارزمي المباشر.
            يمكنك سؤاله عن أي اسم أو عائلة أو عمر، وسيقوم بالبحث والفرز اللحظي من واقع السجلات.
          </p>
        </div>
        <a href="#archivist" className="bridge-cta-btn">
          <span>استشر حارس الأرشيف</span>
          <span className="btn-arrow" aria-hidden="true">↙</span>
        </a>
      </div>
    </section>
  );
}
