'use client';
import { useMemo } from 'react';
import { useParticleStore } from '@/lib/particleStore';
const ranges=['0–9','10–19','20–29','30–39','40–49','50+'];
export default function PhysicalDataScene() {
  const stats=useParticleStore(s=>s.statistics);
  const buckets=useMemo(()=>{
    const result=[0,0,0,0,0,0];
    stats?.age_distribution.forEach(b=>{result[Math.min(5,Math.floor(parseInt(b.range,10)/10))]+=b.count;});
    return result;
  },[stats]);
  const maximum=Math.max(1,...buckets);
  const unit=100;
  return <section id="stats" className="chapter statistics" aria-labelledby="stats-title">
    <div className="statistics-heading"><div><span className="eyebrow">04 — أعمار لم تكتمل</span><h2 id="stats-title">حتى حين نحصيهم،<br/>يبقون <em>أشخاصًا.</em></h2></div><p className="statistics-insight">{stats&&<><strong><bdi>{stats.children_under_18.toLocaleString('en-US')}</bdi></strong>من الأسماء المسجلة لأطفال دون الثامنة عشرة.<br/><span>{(stats.children_under_18/Math.max(1,stats.total)*100).toFixed(1)}٪ من الأرشيف.</span></>}</p></div>
    {stats?<><div className="people-chart" role="img" aria-label={'توزيع الأعمار: '+ranges.map((r,i)=>r+' سنة: '+buckets[i]+' سجل').join('، ')}>
      {buckets.map((count,index)=>{
        const bodies=Math.ceil(count/unit),rows=Math.ceil(bodies/10),maxRows=Math.ceil(Math.ceil(maximum/unit)/10);
        return <div className="people-bar" key={ranges[index]}><span className="bar-count">{count.toLocaleString('en-US')}</span><svg aria-hidden="true" viewBox={'0 0 100 '+rows*15} style={{height:(rows/maxRows*260)+'px'}} preserveAspectRatio="xMidYMax meet">{Array.from({length:bodies},(_,i)=><path key={i} d="M5 1a1.3 1.3 0 1 0 0 2.6A1.3 1.3 0 0 0 5 1M3.7 4h2.6l1.3 4-.9.3L6 6v6H4V6l-.7 2.3-.9-.3Z" transform={'translate('+(i%10)*10+' '+(rows-1-Math.floor(i/10))*15+')'} opacity={i===bodies-1&&count%unit?(count%unit)/unit:1}/>)}</svg><span className="bar-label">{ranges[index]}</span></div>;
      })}
    </div><div className="chart-caption"><p>العمر بالسنوات · كل هيئة تمثّل نحو ١٠٠ سجل.<br/>الأعداد المكتوبة دقيقة؛ الهيئات تمثيل نسبي.</p><p>{stats.total_with_age.toLocaleString('ar')} سجلًا بعمر معلوم<br/>{stats.total-stats.total_with_age>0?(stats.total-stats.total_with_age).toLocaleString('ar')+' سجلًا دون عمر معلوم':'الأعمار متاحة لجميع السجلات'}</p></div></>:<p className="feedback">بيانات الأعمار غير متاحة حاليًا.</p>}
  </section>;
}
