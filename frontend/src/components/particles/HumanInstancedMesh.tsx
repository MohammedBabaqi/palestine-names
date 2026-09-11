'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useParticleStore } from '@/lib/particleStore';

// One flat, low-poly silhouette; every body is a single GPU instance.
function humanGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-.13,.25); shape.lineTo(.13,.25); shape.lineTo(.24,-.1);
  shape.lineTo(.15,-.14); shape.lineTo(.1,.05); shape.lineTo(.1,-.48);
  shape.lineTo(.015,-.48); shape.lineTo(0,-.16); shape.lineTo(-.015,-.48);
  shape.lineTo(-.1,-.48); shape.lineTo(-.1,.05); shape.lineTo(-.15,-.14);
  shape.lineTo(-.24,-.1); shape.closePath();
  const head = new THREE.Shape();
  head.absarc(0,.4,.12,0,Math.PI*2,false);
  return new THREE.ShapeGeometry([shape, head], 5);
}
function random(i: number, salt = 0) {
  const n = Math.sin((i + 1) * 127.1 + salt * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
export default function HumanInstancedMesh() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport, size, invalidate } = useThree();
  const records = useParticleStore(s => s.records);
  const archiveRecords = useParticleStore(s => s.archiveRecords);
  const total = useParticleStore(s => s.total);
  const mode = useParticleStore(s => s.mode);
  const sort = useParticleStore(s => s.sortMode);
  const query = useParticleStore(s => s.searchQuery);
  const matchIds = useMemo(() => new Set(archiveRecords.map(r => r.id)), [archiveRecords]);
  const reduced = useParticleStore(s => s.reducedMotion);
  const visibleRecords = useMemo(() => {
    if (mode !== 'archive' || !archiveRecords.length) return records;
    const ids = new Set(archiveRecords.map(r => r.id));
    return [...archiveRecords, ...records.filter(r => !ids.has(r.id))];
  }, [mode, records, archiveRecords]);
  const count = Math.min(size.width < 760 ? 1000 : 2400, visibleRecords.length);
  const geometry = useMemo(() => humanGeometry(), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide }), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const current = useRef(new Float32Array(2400 * 4));
  const pointer = useRef({ x: -9999, y: -9999 });
  const hovered = useRef(-1);
  const dirty = useRef(true);
  const w = viewport.width, h = viewport.height;
  const number = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1400; canvas.height = 350;
    const ctx = canvas.getContext('2d');
    if (!ctx || total === null) return [];
    ctx.font = 'bold 280px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(total.toLocaleString('en-US'),700,180);
    const pixels = ctx.getImageData(0,0,1400,350).data;
    const points: [number,number][] = [];
    for (let y=0;y<350;y+=4) for(let x=0;x<1400;x+=4) {
      if (pixels[(y*1400+x)*4+3]>150) points.push([x,y]);
    }
    return Array.from({length: count}, (_,i) => points[Math.floor(i * points.length / Math.max(count,1))]);
  }, [total,count]);
  const targets = useMemo(() => {
    const values = new Float32Array(count * 4);
    const mobile = size.width < 760;
    const groups = [0,0,0,0,0,0];
    const ranks = new Map(archiveRecords.map((r,i) => [r.id,i]));
    for(let i=0;i<count;i++) {
      const a = random(i), b = random(i,1), c = random(i,2);
      let x = (a-.5)*w*.85, y = (b-.5)*h*.62, z = c*2, scale = mobile ? .085 : .075;
      if(mode === 'number' || mode === 'hero') {
        const point = number[i] || [700,175];
        x=(point[0]/1400-.5)*w*(mobile ? 1.09 : 1.0);
        y=-(point[1]/350-.5)*Math.min(h*.34,w*.32)+h*.005;
        scale=mobile ? .043 : .062; z=0;
      } else if(mode === 'scatter') {
        x=Math.cos(b*Math.PI*2)*Math.sqrt(a)*w*.34 - w*.09;
        y=Math.sin(b*Math.PI*2)*Math.sqrt(a)*h*.28 - h*.07;
        scale=(mobile ? .075 : .09) + c*.03;
        if(x>w*.12 && y>h*.03) x-=w*.34;
      } else if(mode === 'names') {
        x=(a>.5?1:-1)*(w*.32+b*w*.19); y=(c-.5)*h*.7; scale=.07;
        if(i===0) { x=0; y=h*.01; z=3; scale=mobile ? .7 : 1.05; }
      } else if(mode === 'archive') {
        const rank = ranks.get(visibleRecords[i]?.id);
        const active = query.trim().length>0 || sort!=='none';
        if(active && rank !== undefined) {
          const cols=mobile?8:18;
          x= -w*.24 + (rank%cols)*w*(mobile?.048:.026);
          y= -h*.02 - Math.floor(rank/cols)*.19;
          z=2; scale=mobile?.12:.14;
        } else {
          x=(a-.5)*w*.65-w*.12; y=(b-.5)*h*.26-h*.07; scale=active?.045:.075;
        }
      } else if(mode === 'stats') {
        const age=visibleRecords[i]?.age;
        const group=age===null||age===undefined ? 5 : Math.min(5,Math.floor(age/10));
        const rank=groups[group]++;
        x=-w*.365+group*w*.146+(rank%12)*w*.006;
        y=-h*.22+Math.floor(rank/12)*.043;
        z=0; scale=.043;
      } else if(mode === 'archivist') {
        x=(a-.5)*w*.92; y=(b-.5)*h*.86;
        scale=.025;
      } else if(mode === 'finale') {
        x=(a-.5)*w*.9; y=-h*.32+b*h*.13; scale=.055;
      }
      values[i*4]=x; values[i*4+1]=y; values[i*4+2]=z; values[i*4+3]=scale;
    }
    return values;
  },[count,w,h,size.width,mode,number,archiveRecords,visibleRecords,query,sort]);
  useEffect(() => {
    dirty.current = true; hovered.current=-1;
    useParticleStore.setState({ hoveredRecord: null, hoveredScreenPos: null });
    invalidate();
  },[targets,reduced,invalidate]);
  useEffect(() => useParticleStore.subscribe((s,prev) => {
    if(s.chapterProgress!==prev.chapterProgress || s.selectedRecord!==prev.selectedRecord || s.mode!==prev.mode) { dirty.current=true; invalidate(); }
  }),[invalidate]);
  useEffect(() => {
    const onScroll = () => { dirty.current = true; invalidate(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [invalidate]);
  useEffect(() => {
    const clear = () => { pointer.current={x:-9999,y:-9999}; dirty.current=true; hovered.current=-1; useParticleStore.setState({ hoveredRecord:null, hoveredScreenPos:null }); invalidate(); };
    const move = (event: PointerEvent) => {
      if(event.pointerType==='touch') return;
      if((event.target as Element).closest('button,a,input,select,textarea,dialog,header')) { clear(); return; }
      pointer.current={x:event.clientX,y:event.clientY}; dirty.current=true; invalidate();
    };
    const tap = (event: PointerEvent) => {
      if((event.target as Element).closest('button,a,input,select,textarea,dialog,header')) return;
      if(!['scatter','names','archive'].includes(useParticleStore.getState().mode)) return;
      let index=-1, distance=225;
      for(let i=0;i<count;i++) {
        const dx=(current.current[i*4]/w+.5)*size.width-event.clientX;
        const dy=(.5-current.current[i*4+1]/h)*size.height-event.clientY;
        const d=dx*dx+dy*dy;
        if(d<distance) { distance=d; index=i; }
      }
      if(index>=0 && visibleRecords[index]) useParticleStore.setState({ selectedRecord:visibleRecords[index] });
    };
    window.addEventListener('pointermove',move,{passive:true});
    window.addEventListener('pointerup',tap,{passive:true});
    window.addEventListener('scroll',clear,{passive:true});
    document.addEventListener('pointerleave',clear);
    return () => { window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',tap); window.removeEventListener('scroll',clear); document.removeEventListener('pointerleave',clear); };
  },[count,visibleRecords,w,h,size.width,size.height,invalidate]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); },[geometry,material]);
  useFrame((_,delta) => {
    if(!mesh.current || !count) return;
    const state = useParticleStore.getState();
    const factor = reduced ? 1 : 1-Math.exp(-Math.min(delta,.05)*16);
    let unsettled=false;
    const pickable=['scatter','names','archive'].includes(mode) && !state.selectedRecord;
    let pick=-1, distance=144;
    if(pickable) for(let i=0;i<count;i++) {
      const dx=(current.current[i*4]/w+.5)*size.width-pointer.current.x;
      const dy=(.5-current.current[i*4+1]/h)*size.height-pointer.current.y;
      const d=dx*dx+dy*dy;
      if(d<distance) {distance=d;pick=i;}
    }
    if(pick!==hovered.current) {
      hovered.current=pick;
      useParticleStore.setState({ hoveredRecord:pick>=0?visibleRecords[pick]:null, hoveredScreenPos:pick>=0?{...pointer.current}:null });
      dirty.current=true;
    }
    const detach=mode==='number'&&!reduced ? Math.max(0,Math.min(1,(state.chapterProgress-.13)*1.8)) : 0;
    const archiveRect=mode==='archive'?document.querySelector('.archive-stage')?.getBoundingClientRect():null;
    const archiveY=archiveRect ? (.5-(archiveRect.top+archiveRect.height/2)/size.height)*h : -h*.07;
    for(let i=0;i<count;i++) {
      let tx=targets[i*4],ty=targets[i*4+1],tz=targets[i*4+2],ts=targets[i*4+3];
      if(mode==='archive') ty+=archiveY+h*.07;
      if(detach>0) {
        tx=THREE.MathUtils.lerp(tx,(random(i)-.5)*w*.85,detach);
        ty=THREE.MathUtils.lerp(ty,(random(i,1)-.5)*h*.58,detach);
        ts=THREE.MathUtils.lerp(ts,.095,detach);
      }
      if(i===pick) { ts*=1.65; tz+=2; }
      for(let k=0;k<4;k++) {
        const target=k===0?tx:k===1?ty:k===2?tz:ts, index=i*4+k;
        const diff=target-current.current[index];
        if(Math.abs(diff)>.001) unsettled=true;
        current.current[index]+=diff*factor;
      }
      dummy.position.set(current.current[i*4],current.current[i*4+1],current.current[i*4+2]);
      dummy.scale.setScalar(Math.max(.001,current.current[i*4+3])); dummy.updateMatrix();
      mesh.current.setMatrixAt(i,dummy.matrix);
      const matching=mode==='archive'&&(query.trim()||sort!=='none')&&matchIds.has(visibleRecords[i]?.id);
      const faint=mode==='archivist'||mode==='stats'||(pick>=0&&i!==pick)||(mode==='archive'&&(query.trim()||sort!=='none')&&!matching);
      const isNumber = mode === 'number';
      const baseColor = isNumber ? '#3a4437' : (i % 17 === 0 ? '#586b53' : '#7d887a');
      const matchColor = '#185d32';
      const faintColor = '#d9d7cc';
      color.set(i===pick||matching ? matchColor : faint ? faintColor : baseColor);
      mesh.current.setColorAt(i,color);
    }
    mesh.current.instanceMatrix.needsUpdate=true;
    if(mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate=true;
    dirty.current=false;
    if(unsettled) invalidate();
  });
  return <instancedMesh ref={mesh} args={[geometry,material,count]} frustumCulled={false} />;
}
