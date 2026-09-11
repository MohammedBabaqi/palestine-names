'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useParticleStore } from '@/lib/particleStore';
import type { AgentResponse } from '@/lib/types';

const suggestions = [
  'كم عدد الأطفال المسجلين في الأرشيف؟',
  'من هم أصغر الأطفال؟ رتبهم حسب العمر',
  'ابحث لي عن اسم عائلة النجار',
  'ما هو متوسط الأعمار وأكبر عمر مسجل؟'
];

export default function ArchivistLetterScene() {
  const [query, setQuery] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const busy = useRef(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const followupInput = useRef<HTMLInputElement>(null);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy.current) return;
    busy.current = true;
    setLastQuestion(q);
    setLoading(true);
    setError(false);

    try {
      const res = await api.chatWithArchivist(q);
      setResponse(res);
      setQuery('');
      if (res.records && res.records.length > 0) {
        useParticleStore.setState({
          archiveRecords: res.records,
          highlightIds: new Set(res.records.map(r => r.id))
        });
      }
    } catch {
      setError(true);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };

  const resetView = () => {
    setResponse(null);
    setLastQuestion('');
    setQuery('');
    setError(false);
  };

  const isDialogue = Boolean(response || loading);

  return (
    <section id="archivist" className="chapter archivist" aria-labelledby="archivist-title">
      <div className="archivist-heading">
        <span className="eyebrow">04 — محاورة حارس الأرشيف</span>
        <h2 id="archivist-title">اسأل <em>حارس الأرشيف.</em></h2>
        <p className="micro-copy">
          مساعد أرشيفي ذكي يستحضر السجلات الموثقة بالاسم والعمر والعائلة، ويجيبك بوقارٍ وتوثيقٍ دقيق.
        </p>
      </div>

      {!isDialogue ? (
        /* ─── State 1: Invitation / Desk Mode (Responsive & Balanced) ─── */
        <div className="archivist-desk-layout">
          <div className="archivist-hero-card">
            <figure className="archivist-art-hero">
              <Image
                src="/archivist.jpg"
                alt="حارس الأرشيف الفلسطيني الوقور بين وثائق الذاكرة والمخطوطات"
                width={700}
                height={460}
                sizes="(max-width: 760px) 100vw, 400px"
              />
            </figure>
            <div className="archivist-hero-content">
              <span className="archivist-badge">مكتب التوثيق وحراسة الذاكرة</span>
              <h3>«كل اسمٍ هنا، حياةٌ ووطنٌ لا يُمحى»</h3>
              <p>
                اطرح أي سؤال عن أسماء العائلات، أو اطلب البحث عن اسم معين، أو استفسر عن أصغر وأكبر الشهداء سنّاً.
                يقوم الحارس باستحضار السجلات الموثقة لحظياً ليقدم لك إجابة وافية بأمانةٍ وإجلال.
              </p>
            </div>
          </div>

          <form className="letter archivist-initial-letter" onSubmit={e => { e.preventDefault(); ask(query); }}>
            <div className="letter-head">
              <span>رسالة استفسار إلى حارس الأرشيف</span>
              <bdi>سؤال / ARCHIVE</bdi>
            </div>
            <label htmlFor="archivist-query">ماذا تريد أن تعرف عن سجلات الشهداء وعائلاتهم؟</label>
            <textarea
              ref={textarea}
              id="archivist-query"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="اكتب اسم شخص أو عائلة، أو اسأل عن الرضّع، أو اطلب إحصاءات عائلة معينة…"
              maxLength={400}
            />
            <button type="submit" className="text-link" disabled={loading || !query.trim()}>
              أرسل الاستفسار إلى الحارس <span aria-hidden="true">↗</span>
            </button>
          </form>

          <div className="paper-prompts" aria-label="رسائل مقترحة">
            {suggestions.map(prompt => (
              <button
                key={prompt}
                onClick={() => {
                  setQuery(prompt);
                  textarea.current?.focus();
                  ask(prompt);
                }}
              >
                {prompt} <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ─── State 2: Dedicated Dialogue & Document Mode (Full Breathing Room) ─── */
        <div className="archivist-dialogue-sheet">
          <div className="dialogue-header">
            <div className="dialogue-archivist-badge">
              <div className="dialogue-avatar">
                <Image
                  src="/archivist.jpg"
                  alt="حارس الأرشيف"
                  width={64}
                  height={64}
                />
              </div>
              <div>
                <strong>رد حارس الأرشيف الموثق</strong>
                <span>مستشار الذاكرة لسجلات شهداء فلسطين</span>
              </div>
            </div>
            <button type="button" className="dialogue-reset-btn" onClick={resetView}>
              ↺ سؤال جديد / عرض المكتب
            </button>
          </div>

          {lastQuestion && (
            <div className="dialogue-user-query">
              <span className="query-tag">استفسارك:</span>
              <p>«{lastQuestion}»</p>
            </div>
          )}

          <div className="dialogue-document" aria-live="polite" aria-busy={loading}>
            {loading && (
              <div className="page-working">
                <i aria-hidden="true" />
                <span>حارس الأرشيف يستشير سجلات الشهداء المعتمدة للإجابة بدقة…</span>
              </div>
            )}

            {error && (
              <div className="feedback error">
                تعذّر استرجاع الرد من الوكيل. يمكنك إعادة المحاولة بالضغط على الزر أدناه.
                <button type="button" className="text-link" onClick={() => ask(lastQuestion)}>
                  إعادة المحاولة ↺
                </button>
              </div>
            )}

            {response && (
              <div className="dialogue-content">
                <div className="agent-meta">
                  <span className="eyebrow">وثيقة رد موثقة</span>
                  {response.tools_used?.length > 0 && (
                    <div className="agent-tools">
                      {response.tools_used.map((t, i) => (
                        <span key={i} className="tool-chip">
                          {t.tool === 'search_by_name' && '🔍 بحث خطي بالاسم Linear Search O(n)'}
                          {t.tool === 'search_by_age' && '🎯 بحث ثنائي بالعمر Binary Search O(log n)'}
                          {t.tool === 'sort_by_age' && '⚡ ترتيب الأعمار Quick Sort O(n log n)'}
                          {t.tool === 'sort_by_name' && '🔤 ترتيب أبجدي Merge Sort O(n log n)'}
                          {t.tool === 'get_archive_statistics' && '📊 استعلام إحصاءات الأرشيف'}
                          {t.execution_time_ms !== undefined && (
                            <bdi> ({t.execution_time_ms} ms)</bdi>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="agent-prose">
                  {response.answer}
                </div>

                {response.records && response.records.length > 0 && (
                  <div className="agent-records-tray">
                    <span className="tray-title">سجلات حقيقية وردت في هذا الرد (اضغط لقراءة السجل الكامل):</span>
                    <div className="tray-items">
                      {response.records.map(r => (
                        <button
                          key={r.id}
                          type="button"
                          className="tray-record-btn"
                          onClick={() => useParticleStore.setState({ selectedRecord: r })}
                        >
                          <strong>{r.ar_name || r.en_name}</strong>
                          <span>{r.age === null ? 'غير مسجل' : r.age === 0 ? 'دون عام' : `${r.age} عاماً`} ↗</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <p className="technical-note" dir="rtl">
                  توثيق مستخرج لحظياً من السجل الوطني لشهداء فلسطين ({response.tools_used.length > 0 ? 'بحث وتدقيق خوارزمي' : 'استخلاص أرشيفي مباشر'})
                </p>
              </div>
            )}
          </div>

          {/* Follow-up Inquiry Bar */}
          <form className="dialogue-followup-form" onSubmit={e => { e.preventDefault(); ask(query); }}>
            <input
              ref={followupInput}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="اسأل سؤالاً تالياً، أو اطلب تفاصيل إضافية عن السجلات…"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !query.trim()}>
              إرسال ↗
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
