'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useParticleStore } from '@/lib/particleStore';
import type { Record, Pagination } from '@/lib/types';
type SearchKind = 'name'|'age'|'date';
type Sort = 'none'|'name'|'age';
export default function LivingArchiveScene() {
  const [query,setQuery]=useState('');
  const [kind,setKind]=useState<SearchKind>('name');
  const [dateTo,setDateTo]=useState('');
  const [sort,setSort]=useState<Sort>('none');
  const [ascending,setAscending]=useState(true);
  const [page,setPage]=useState(1);
  const [retry,setRetry]=useState(0);
  const [result,setResult]=useState<{records:Record[];pagination:Pagination;note:string}|null>(null);
  const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
  const request=useRef(0);
  useEffect(()=>{
    const version=++request.current;
    let alive=true;
    const timer=setTimeout(async()=>{
      setStatus('loading');
      const started=performance.now();
      useParticleStore.setState({archiveRecords:[],highlightIds:new Set(),searchQuery:query,sortMode:sort,sortAscending:ascending});
      try {
        const searching=query.trim().length>0 || (kind==='date'&&dateTo!=='');
        let records:Record[],pagination:Pagination,note:string;
        if(searching) {
          const res=kind==='name'?await api.searchByName(query, page, 12):kind==='age'?await api.searchByAge(Number(query),0,page,12):await api.searchByDate(query||undefined,dateTo||undefined,page,12);
          records=res.results; pagination=res.pagination;
          note=res.algorithm+' · '+res.complexity;
        } else if(sort!=='none') {
          const res=sort==='age'?await api.sortByAge(ascending,page,12):await api.sortByName(ascending,page,12);
          records=res.results; pagination=res.pagination;
          note=res.algorithm+' · '+res.complexity;
        } else {
          const res=await api.getRecords(page,12);
          records=res.items; pagination={total:res.total,page:res.page,page_size:res.page_size,total_pages:res.total_pages};
          note='Archive · Original record order';
        }
        if(!alive||version!==request.current) return;
        setResult({records,pagination,note:note+' · Request '+Math.round(performance.now()-started)+' ms'});
        setStatus('ready');
        useParticleStore.setState({archiveRecords:records,highlightIds:new Set(records.map(r=>r.id))});
      } catch {
        if(alive&&version===request.current) {setStatus('error');setResult(null);}
      }
    },query?320:0);
    return ()=>{alive=false;clearTimeout(timer);};
  },[query,kind,dateTo,sort,ascending,page,retry]);
  const changeQuery=(value:string)=>{setQuery(value);setSort('none');setPage(1);setStatus('loading');};
  return <section id="archive" className="chapter archive" aria-labelledby="archive-title">
    <div className="archive-intro"><div><span className="eyebrow">03 — استدعاء الأسماء</span><h2 id="archive-title">ابحث عن <em>اسم.</em><br/>اقترب من حياة.</h2></div><p>اكتب اسمًا أو اسم عائلة. تتقدّم الأسماء المطابقة في الحشد، ويبقى لكل منها موضع في الذاكرة.</p></div>
    <div className="archive-workspace">
      <div className="search-line"><label htmlFor="name-query">{kind==='name'?'الاسم أو العائلة':kind==='age'?'العمر بالسنوات':'الميلاد، من تاريخ'}</label><input id="name-query" type={kind==='age'?'number':kind==='date'?'date':'search'} min={kind==='age'?0:undefined} max={kind==='age'?150:undefined} placeholder={kind==='name'?'مثلاً: محمد، النجار…':kind==='age'?'0–150':undefined} value={query} onChange={e=>changeQuery(e.target.value)} autoComplete="off" aria-describedby="archive-status"/>{query&&<button aria-label="مسح البحث" onClick={()=>changeQuery('')}>×</button>}<span aria-hidden="true">↙</span></div>
      <div className="archive-toolbar">
        <div className="sort-controls"><label htmlFor="search-kind">ابحث بحسب</label><select id="search-kind" value={kind} onChange={e=>{setKind(e.target.value as SearchKind);setQuery('');setDateTo('');setPage(1);}}><option value="name">الاسم</option><option value="age">العمر</option><option value="date">تاريخ الميلاد</option></select>{kind==='date'&&<><label htmlFor="date-to">إلى</label><input id="date-to" type="date" value={dateTo} min={query||undefined} onChange={e=>{setDateTo(e.target.value);setPage(1);}}/></>}</div>
        <div className="sort-controls"><label htmlFor="sort-mode">ترتيب الأرشيف</label><select id="sort-mode" value={sort} onChange={e=>{setSort(e.target.value as Sort);setQuery('');setDateTo('');setPage(1);setStatus('loading');}}><option value="none">ترتيب السجلات</option><option value="age">حسب العمر</option><option value="name">حسب الاسم</option></select>{sort!=='none'&&<button onClick={()=>{setAscending(!ascending);setPage(1);}} aria-label="عكس اتجاه الترتيب">{ascending?'تصاعدي ↑':'تنازلي ↓'}</button>}</div>
      </div>
      <div className="archive-stage" aria-hidden="true"><p>{query?'الاسم الذي تبحث عنه، له مكان هنا.':sort!=='none'?'يتغيّر الترتيب. ويبقى الاسم.':'كل اسم، أثر لا يغيب.'}</p></div>
      <div className="results-sheet" aria-busy={status==='loading'}>
        <div className="results-heading"><span id="archive-status" role="status">{status==='loading'?'نستحضر السجلات…':status==='error'?'تعذّر استرجاع الأسماء':(result?.pagination.total??0).toLocaleString('ar')+' اسمًا'+(query?' يطابق البحث':' في الأرشيف')}</span><span>اضغط الاسم لقراءة سجله</span></div>
        {status==='error'?<div className="feedback error">لم يصل رد من الأرشيف. <button className="text-link" onClick={()=>setRetry(retry+1)}>حاول مجددًا</button></div>:status==='ready'&&result?.records.length===0?<p className="feedback">لم نجد أسماء مطابقة. جرّب جزءًا أقصر من الاسم، أو امسح البحث للعودة إلى الأرشيف.</p>:<ul className="results-list">{(status==='ready'?result?.records:[])?.map(r=><li key={r.id}><button onClick={()=>useParticleStore.setState({selectedRecord:r})}><span>{r.ar_name||r.en_name}</span><small>{r.age===null?'العمر غير مسجل':r.age===0?'دون عام':r.age+' عامًا'} ↗</small></button></li>)}</ul>}
        {status==='ready'&&result&&result.pagination.total_pages>1&&<div className="pagination"><button disabled={page<=1} onClick={()=>setPage(page-1)}>السابق</button><span>صفحة <bdi>{page}</bdi> من <bdi>{result.pagination.total_pages}</bdi></span><button disabled={page>=result.pagination.total_pages} onClick={()=>setPage(page+1)}>التالي</button></div>}
        {status==='ready'&&result&&<p className="technical-note" lang="en">{result.note}</p>}
      </div>
    </div>
  </section>;
}
