'use client';
import { Component, type ReactNode, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import HumanInstancedMesh from './HumanInstancedMesh';
import { useParticleStore } from '@/lib/particleStore';
class CanvasBoundary extends Component<{children: ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  componentDidCatch() { useParticleStore.setState({webglReady:false}); }
  render() { return this.state.failed?null:this.props.children; }
}
export default function HumanParticleCanvas() {
  const record=useParticleStore(s=>s.hoveredRecord);
  const pos=useParticleStore(s=>s.hoveredScreenPos);
  const reduced=useParticleStore(s=>s.reducedMotion);
  useEffect(()=>{document.documentElement.dataset.reducedMotion=String(reduced);},[reduced]);
  return <>
    <div id="human-particle-canvas" aria-hidden="true" style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}}>
      <CanvasBoundary><Canvas orthographic frameloop="always" dpr={[1,1.5]} camera={{position:[0,0,100],zoom:100,near:.1,far:200}} gl={{antialias:true,alpha:true,powerPreference:'low-power'}} onCreated={({gl})=>{
        useParticleStore.setState({webglReady:true});
        gl.domElement.addEventListener('webglcontextlost',()=>useParticleStore.setState({webglReady:false}));
      }} fallback={null}><HumanInstancedMesh /></Canvas></CanvasBoundary>
    </div>
    <div className="canvas-scrim" aria-hidden="true" />
  </>;
}
