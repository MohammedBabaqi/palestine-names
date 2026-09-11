'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import OpeningNumberScene from '@/components/narrative/OpeningNumberScene';
import LivingCrowdScene from '@/components/narrative/LivingCrowdScene';
import DeclarationScene from '@/components/narrative/DeclarationScene';
import PhysicalDataScene from '@/components/narrative/PhysicalDataScene';
import LivingArchiveScene from '@/components/narrative/LivingArchiveScene';
import ArchivistLetterScene from '@/components/narrative/ArchivistLetterScene';
import QuietFinaleScene from '@/components/narrative/QuietFinaleScene';
import RecordDialog from '@/components/archive/RecordDialog';
import { useScrollStory } from '@/lib/useScrollStory';
import { useParticleStore } from '@/lib/particleStore';
import { api } from '@/lib/api';
const HumanParticleCanvas = dynamic(() => import('@/components/particles/HumanParticleCanvas'), { ssr: false });
export default function Home() {
  useScrollStory();
  useEffect(() => {
    let alive = true;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => useParticleStore.setState({ reducedMotion: media.matches });
    update();
    media.addEventListener('change', update);
    Promise.all([api.getCount(), api.getSample(2400), api.getStatistics()]).then(([count, sample, statistics]) => {
      if (alive) useParticleStore.setState({ total: count.count, records: sample.records, statistics, dataStatus: 'ready' });
    }).catch(() => { if (alive) useParticleStore.setState({ dataStatus: 'error' }); });
    return () => { alive = false; media.removeEventListener('change', update); };
  }, []);
  return <>
    <a className="skip-link" href="#archive">انتقل إلى البحث في الأسماء</a>
    <HumanParticleCanvas /><Navbar />
    <main id="main-content"><OpeningNumberScene /><LivingCrowdScene /><DeclarationScene /><LivingArchiveScene /><PhysicalDataScene /><ArchivistLetterScene /><QuietFinaleScene /></main>
    <RecordDialog />
  </>;
}
