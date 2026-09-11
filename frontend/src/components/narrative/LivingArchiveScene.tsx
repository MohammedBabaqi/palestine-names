'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useParticleStore } from '@/lib/particleStore';
import type { Record, Pagination } from '@/lib/types';

type SearchKind = 'name' | 'age' | 'date';
type Sort = 'none' | 'name' | 'age';

const CURATED_DRAWS = [
  { label: 'عائلة النجار', kind: 'name' as SearchKind, query: 'النجار', icon: '📜' },
  { label: 'عائلة الأسطل', kind: 'name' as SearchKind, query: 'الأسطل', icon: '📜' },
  { label: 'عائلة شبات', kind: 'name' as SearchKind, query: 'شبات', icon: '📜' },
  { label: 'عائلة الفرا', kind: 'name' as SearchKind, query: 'الفرا', icon: '📜' },
  { label: 'أطفال دون عام (رُضّع)', kind: 'age' as SearchKind, query: '0', icon: '👶' },
  { label: 'كبار السن (حماة الذاكرة)', kind: 'age' as SearchKind, query: '75', icon: '🕊️' },
];

const SEARCH_TABS: { id: SearchKind; label: string; icon: string; placeholder: string }[] = [
  { id: 'name', label: 'بالاسم والعائلة', icon: '🔍', placeholder: 'ابحث بالاسم الأول أو اسم العائلة (مثلاً: النجار، مريم، أحمد…)' },
  { id: 'age', label: 'بالعمر والسنوات', icon: '⏳', placeholder: 'أدخل العمر (مثلاً: 0 للرضع، 5 للأطفال، 70 للمسنين…)' },
  { id: 'date', label: 'بتاريخ الميلاد', icon: '📅', placeholder: 'حدد تاريخ الميلاد' },
];

export default function LivingArchiveScene() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<SearchKind>('name');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState<Sort>('none');
  const [ascending, setAscending] = useState(true);
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState<{ records: Record[]; pagination: Pagination; note: string; algoBadge: string } | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const request = useRef(0);

  useEffect(() => {
    const version = ++request.current;
    let alive = true;
    const timer = setTimeout(async () => {
      setStatus('loading');
      const started = performance.now();
      useParticleStore.setState({
        archiveRecords: [],
        highlightIds: new Set(),
        searchQuery: query,
        sortMode: sort,
        sortAscending: ascending
      });

      try {
        const searching = query.trim().length > 0 || (kind === 'date' && dateTo !== '');
        let records: Record[], pagination: Pagination, note: string, algoBadge: string;

        if (searching) {
          const res = kind === 'name'
            ? await api.searchByName(query, page, 12)
            : kind === 'age'
            ? await api.searchByAge(Number(query) || 0, 0, page, 12)
            : await api.searchByDate(query || undefined, dateTo || undefined, page, 12);
          records = res.results;
          pagination = res.pagination;
          note = `${res.algorithm} · ${res.complexity}`;
          algoBadge = `${res.algorithm} (${res.complexity})`;
        } else if (sort !== 'none') {
          const res = sort === 'age'
            ? await api.sortByAge(ascending, page, 12)
            : await api.sortByName(ascending, page, 12);
          records = res.results;
          pagination = res.pagination;
          note = `${res.algorithm} · ${res.complexity}`;
          algoBadge = `${res.algorithm} (${res.complexity})`;
        } else {
          const res = await api.getRecords(page, 12);
          records = res.items;
          pagination = { total: res.total, page: res.page, page_size: res.page_size, total_pages: res.total_pages };
          note = 'Archive Index · Natural record order';
          algoBadge = 'Index Scan O(1)';
        }

        if (!alive || version !== request.current) return;
        const elapsed = Math.round(performance.now() - started);
        setResult({
          records,
          pagination,
          note: `${note} · نفذت في ${elapsed} ملي ثانية`,
          algoBadge: `${algoBadge} · ${elapsed}ms`
        });
        setStatus('ready');
        useParticleStore.setState({
          archiveRecords: records,
          highlightIds: new Set(records.map(r => r.id))
        });
      } catch {
        if (alive && version === request.current) {
          setStatus('error');
          setResult(null);
        }
      }
    }, query ? 280 : 0);

    return () => { alive = false; clearTimeout(timer); };
  }, [query, kind, dateTo, sort, ascending, page, retry]);

  const changeQuery = (value: string) => {
    setQuery(value);
    setSort('none');
    setPage(1);
    setStatus('loading');
  };

  const applyCurated = (draw: typeof CURATED_DRAWS[0]) => {
    setKind(draw.kind);
    setQuery(draw.query);
    setDateTo('');
    setSort('none');
    setPage(1);
    setStatus('loading');
  };

  const currentTab = SEARCH_TABS.find(t => t.id === kind) || SEARCH_TABS[0];

  return (
    <section id="archive" className="chapter archive" aria-labelledby="archive-title">
      {/* Editorial Section Header with Archival Seal */}
      <div className="archive-intro">
        <div>
          <div className="archive-header-badge">
            <span className="wax-seal" aria-hidden="true">⚜</span>
            <span className="eyebrow">02 — سِجل الذاكرة والأسماء</span>
          </div>
          <h2 id="archive-title">
            ابحث عن <em>اسم.</em>
            <br />
            استحضر حياةً وحكاية.
          </h2>
        </div>
        <div className="archive-stats-card">
          <span className="stats-seal">وثيقة رقمية</span>
          <p>
            <strong>72,835</strong>
            <span>اسمًا وسجلاً موثقًا في قطاع غزة</span>
          </p>
          <small className="stats-hint">فرز وبحث خوارزمي فوري من البيانات الحقيقية</small>
        </div>
      </div>

      <div className="archive-workspace">
        {/* Curated Drawers (الأدراج الأرشيفية التوثيقية) */}
        <div className="curated-drawers" aria-label="أدراج أرشيفية سريعة">
          <span className="drawers-label">أدراج استحضار سريعة:</span>
          <div className="drawers-chips">
            {CURATED_DRAWS.map(draw => {
              const active = kind === draw.kind && query === draw.query;
              return (
                <button
                  key={draw.label}
                  type="button"
                  className={`drawer-chip ${active ? 'active' : ''}`}
                  onClick={() => applyCurated(draw)}
                >
                  <span className="chip-icon">{draw.icon}</span>
                  <span>{draw.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Master Console: Search Tabs + Inputs */}
        <div className="archive-console-panel">
          {/* Segmented Search Tabs */}
          <div className="search-mode-tabs" role="tablist">
            {SEARCH_TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={kind === tab.id}
                className={`tab-btn ${kind === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setKind(tab.id);
                  setQuery('');
                  setDateTo('');
                  setPage(1);
                }}
              >
                <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input Bar */}
          <div className="search-box-wrap">
            <span className="search-box-icon" aria-hidden="true">{currentTab.icon}</span>
            <input
              id="name-query"
              type={kind === 'age' ? 'number' : kind === 'date' ? 'date' : 'search'}
              min={kind === 'age' ? 0 : undefined}
              max={kind === 'age' ? 150 : undefined}
              placeholder={currentTab.placeholder}
              value={query}
              onChange={e => changeQuery(e.target.value)}
              autoComplete="off"
              className="search-box-input"
              aria-describedby="archive-status"
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                aria-label="مسح البحث"
                onClick={() => changeQuery('')}
              >
                ✕
              </button>
            )}
            {kind === 'date' && (
              <div className="date-to-wrap">
                <label htmlFor="date-to">إلى تاريخ:</label>
                <input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  min={query || undefined}
                  onChange={e => { setDateTo(e.target.value); setPage(1); }}
                />
              </div>
            )}
          </div>

          {/* Sort Toolbar & Algorithm Benchmark Chip */}
          <div className="archive-toolbar-row">
            <div className="sort-segment-group">
              <span className="toolbar-label">ترتيب الأرشيف:</span>
              <div className="sort-buttons">
                <button
                  type="button"
                  className={`sort-pill ${sort === 'none' ? 'active' : ''}`}
                  onClick={() => { setSort('none'); setQuery(''); setDateTo(''); setPage(1); setStatus('loading'); }}
                >
                  الترتيب الأصلي
                </button>
                <button
                  type="button"
                  className={`sort-pill ${sort === 'age' ? 'active' : ''}`}
                  onClick={() => { setSort('age'); setQuery(''); setDateTo(''); setPage(1); setStatus('loading'); }}
                >
                  حسب العمر (Quick Sort)
                </button>
                <button
                  type="button"
                  className={`sort-pill ${sort === 'name' ? 'active' : ''}`}
                  onClick={() => { setSort('name'); setQuery(''); setDateTo(''); setPage(1); setStatus('loading'); }}
                >
                  أبجدياً (Merge Sort)
                </button>
              </div>

              {sort !== 'none' && (
                <button
                  type="button"
                  className="sort-dir-toggle"
                  onClick={() => { setAscending(!ascending); setPage(1); }}
                  aria-label="عكس اتجاه الترتيب"
                >
                  <span>{ascending ? 'تصاعدي' : 'تنازلي'}</span>
                  <span className="dir-arrow">{ascending ? '↑' : '↓'}</span>
                </button>
              )}
            </div>

            {/* Algorithm Live Benchmark Indicator */}
            {result?.algoBadge && (
              <div className="algo-benchmark-badge" title="الخوارزمية وزمن التنفيذ">
                <span className="algo-dot" aria-hidden="true" />
                <span className="algo-text">{result.algoBadge}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Container with Tactile Archival Cards */}
        <div className="results-sheet" aria-busy={status === 'loading'}>
          <div className="results-header-bar">
            <div className="results-count-title">
              <span className="count-bullet" aria-hidden="true">❖</span>
              <span id="archive-status" role="status">
                {status === 'loading'
                  ? 'جاري استدعاء السجلات من الأرشيف…'
                  : status === 'error'
                  ? 'تعذّر استرجاع الأسماء'
                  : `${(result?.pagination.total ?? 0).toLocaleString('ar-EG')} اسمًا موثقًا${query ? ' يطابق البحث' : ''}`}
              </span>
            </div>
            <span className="inspect-hint">انقر فوق أي بطاقة لعرض الوثيقة الكاملة ↗</span>
          </div>

          {status === 'error' ? (
            <div className="feedback error">
              لم نتمكن من الوصول للأرشيف. تأكد من تشغيل خادم البيانات.
              <button className="text-link" onClick={() => setRetry(retry + 1)}>حاول مجددًا</button>
            </div>
          ) : status === 'ready' && result?.records.length === 0 ? (
            <div className="archive-empty-state">
              <span className="empty-seal">📜</span>
              <h3>لم يُعثر على سجل مطابق</h3>
              <p>بحثت الخوارزمية في 72,835 سجل ولم تجد نتيجة تطابق «{query}».</p>
              <button className="text-link" onClick={() => changeQuery('')}>
                العودة للأرشيف الكامل
              </button>
            </div>
          ) : (
            <div className="archive-cards-grid">
              {status === 'loading'
                ? Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="archive-card skeleton" aria-hidden="true">
                      <div className="card-top-row">
                        <div className="skeleton-pill short" />
                        <div className="skeleton-pill mini" />
                      </div>
                      <div className="skeleton-title" />
                      <div className="skeleton-subtitle" />
                      <div className="card-bottom-row">
                        <div className="skeleton-pill micro" />
                      </div>
                    </div>
                  ))
                : result?.records.map(r => {
                    const isBaby = r.age === 0;
                    const isChild = r.age !== null && r.age > 0 && r.age < 18;
                    const isElder = r.age !== null && r.age >= 65;
                    const ageLabel = isBaby
                      ? '👶 رضيع (دون عام)'
                      : isChild
                      ? `🌱 طفل (${r.age} عامًا)`
                      : isElder
                      ? `🕊️ مسن (${r.age} عامًا)`
                      : r.age !== null
                      ? `${r.age} عامًا`
                      : 'العمر غير مسجل';

                    const birthYear = r.dob ? r.dob.slice(0, 4) : null;

                    return (
                      <article
                        key={r.id}
                        className="archive-card"
                        tabIndex={0}
                        role="button"
                        onClick={() => useParticleStore.setState({ selectedRecord: r })}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            useParticleStore.setState({ selectedRecord: r });
                          }
                        }}
                      >
                        {/* Decorative parchment corners */}
                        <div className="card-corner top-left" aria-hidden="true" />
                        <div className="card-corner bottom-right" aria-hidden="true" />

                        <div className="card-top-row">
                          <span className={`card-age-tag ${isBaby ? 'baby' : isChild ? 'child' : isElder ? 'elder' : ''}`}>
                            {ageLabel}
                          </span>
                          <span className="card-id-badge">#{r.id}</span>
                        </div>

                        <div className="card-body">
                          <h3 className="card-name-ar">{r.ar_name || r.en_name}</h3>
                          {r.en_name && <p className="card-name-en">{r.en_name}</p>}
                        </div>

                        <div className="card-bottom-row">
                          <div className="card-meta-tags">
                            {birthYear && <span className="meta-tag">مواليد {birthYear}</span>}
                            {r.sex && <span className="meta-tag">{r.sex === 'f' ? 'أنثى' : 'ذكر'}</span>}
                          </div>
                          <span className="card-open-action">عرض الوثيقة ↗</span>
                        </div>
                      </article>
                    );
                  })}
            </div>
          )}

          {/* Book-Style Archival Pagination */}
          {status === 'ready' && result && result.pagination.total_pages > 1 && (
            <nav className="archival-pagination" aria-label="صفحات الأرشيف">
              <button
                type="button"
                className="pag-btn edge"
                disabled={page <= 1}
                onClick={() => setPage(1)}
                title="الصفحة الأولى"
              >
                « الأولى
              </button>
              <button
                type="button"
                className="pag-btn"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                السابق
              </button>

              <div className="pag-indicator">
                <span>دفتر الذاكرة:</span>
                <strong>صفحة {page.toLocaleString('ar-EG')}</strong>
                <span>من</span>
                <span>{result.pagination.total_pages.toLocaleString('ar-EG')}</span>
              </div>

              <button
                type="button"
                className="pag-btn"
                disabled={page >= result.pagination.total_pages}
                onClick={() => setPage(page + 1)}
              >
                التالي
              </button>
              <button
                type="button"
                className="pag-btn edge"
                disabled={page >= result.pagination.total_pages}
                onClick={() => setPage(result.pagination.total_pages)}
                title="الصفحة الأخيرة"
              >
                الأخيرة »
              </button>
            </nav>
          )}

          {status === 'ready' && result && (
            <div className="archive-technical-bar">
              <span className="tech-icon">⚙️</span>
              <p className="technical-note" lang="ar">
                {result.note} — تم استخراج السجلات مباشرة من الملف التوثيقي الأصلي دون وساطة طرف ثالث.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
