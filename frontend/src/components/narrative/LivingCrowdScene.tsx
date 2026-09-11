'use client';

export default function LivingCrowdScene() {
  return (
    <section id="crowd" className="chapter crowd" aria-labelledby="crowd-title">
      <div className="chapter-heading">
        <span className="eyebrow">01 — خارطة الذاكرة الحية</span>
        <h2 id="crowd-title">
          حين تنظر للأرض،
          <br />
          ترى <em>أرواحهم.</em>
        </h2>
        <p>
          تتشكّل حدود فلسطين التاريخية من 72 ألف جسد وروح؛ من رأس الناقورة إلى خليج العقبة، ومن البحر إلى النهر.
          لم يكونوا أرقاماً عابرة، بل كانوا شعباً، وأرضاً، وهوية.
        </p>
      </div>

      <div className="crowd-memorial-tags" aria-label="أبعاد الخارطة التذكارية">
        <div className="crowd-tag">
          <span className="tag-dot" aria-hidden="true" />
          <span>خارطة فلسطين التاريخية كاملة</span>
        </div>
        <div className="crowd-tag">
          <span className="tag-dot" aria-hidden="true" />
          <span>72,835 هيئة بشرية في تشكيل حي</span>
        </div>
        <div className="crowd-tag">
          <span className="tag-dot" aria-hidden="true" />
          <span>كل نقطة توثق إنساناً وحياة سُلبت</span>
        </div>
      </div>

      <blockquote className="crowd-poetic-quote" dir="rtl">
        «على هذه الأرض ما يستحق الحياة..
        <br />
        كانت تسمى فلسطين، صارت تسمى فلسطين.»
        <cite>— محمود درويش</cite>
      </blockquote>

      <p className="scene-footnote">
        خارطة فلسطين تتجسّد من آلاف الهيئات ثلاثية الأبعاد؛ كل هيئة مرتبطة بسجل فعلي موثق.
      </p>
    </section>
  );
}
