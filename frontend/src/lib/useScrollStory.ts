'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useParticleStore, type SceneMode } from './particleStore';
export const CHAPTERS: { id: string; label: string; mode: SceneMode }[] = [
  { id: 'number', label: 'البداية', mode: 'number' },
  { id: 'crowd', label: 'خارطة الذاكرة', mode: 'scatter' },
  { id: 'declaration', label: 'اسم واحد', mode: 'names' },
  { id: 'stats', label: 'سِجل الإحصاء', mode: 'stats' },
  { id: 'archivist', label: 'حارس الأرشيف', mode: 'archivist' },
  { id: 'finale', label: 'ما يبقى', mode: 'finale' },
];
export function useScrollStory() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let rafId: number;

    const sync = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - vh);
      const focus = vh * 0.4;
      
      let active = CHAPTERS[0];
      for (const chapter of CHAPTERS) {
        const el = document.getElementById(chapter.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focus) {
            active = chapter;
          }
        }
      }

      const activeEl = document.getElementById(active.id);
      const rect = activeEl?.getBoundingClientRect();
      const progress = rect ? Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - vh * 0.3))) : 0;

      useParticleStore.setState({
        mode: active.mode,
        chapterProgress: progress,
        scrollProgress: scrollY / docHeight,
      });
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(sync);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', sync, { passive: true });

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: sync,
      onRefresh: sync,
    });

    const observer = new ResizeObserver(() => {
      ScrollTrigger.refresh();
      sync();
    });

    const main = document.querySelector('main');
    if (main) observer.observe(main);

    sync();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', sync);
      trigger.kill();
      observer.disconnect();
    };
  }, []);
}
