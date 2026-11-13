import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import StudioScene from './components/three/StudioScene';
import Navbar from './components/ui/Navbar';
import ScrollSections from './components/ui/ScrollSections';
import FloatingControls from './components/ui/FloatingControls';
import PreorderModal from './components/ui/PreorderModal';
import { CHAPTERS, COLORWAYS } from './data/productData';

function getChapterByProgress(progress) {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (progress >= CHAPTERS[i].range[0] - 0.02) {
      return CHAPTERS[i].id;
    }
  }
  return CHAPTERS[0].id;
}

export default function App() {
  const scrollProgressRef = useRef(0);
  const lenisRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(CHAPTERS[0].id);
  const [selectedColorway, setSelectedColorway] = useState(COLORWAYS[0]);
  const [manualExplode, setManualExplode] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);
  const [orbitEnabled, setOrbitEnabled] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [preorderOpen, setPreorderOpen] = useState(false);

  // Initialize Lenis smooth scroll & sync with 3D scene ref
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
    });
    lenisRef.current = lenis;

    const updateProgress = (rawProgress) => {
      const clamped = Math.max(0, Math.min(1, rawProgress));
      scrollProgressRef.current = clamped;

      const nextChapter = getChapterByProgress(clamped);
      setActiveChapter((prev) => (prev === nextChapter ? prev : nextChapter));
      setScrollProgress((prev) =>
        Math.abs(prev - clamped) > 0.008 || clamped === 0 || clamped === 1
          ? clamped
          : prev
      );
    };

    lenis.on('scroll', ({ progress }) => {
      updateProgress(progress);
    });

    // Fallback listener so programmatic window.scrollTo (or keyboard scroll) updates immediately
    const onNativeScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        updateProgress(window.scrollY / maxScroll);
      }
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onNativeScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause smooth scrolling while the Pre-order modal is open
  useEffect(() => {
    if (!lenisRef.current) return;
    if (preorderOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [preorderOpen]);

  const handleNavigateChapter = useCallback((chapter) => {
    setOrbitEnabled(false);
    const el = document.getElementById(`section-${chapter.id}`);

    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, {
        offset: 0,
        duration: 1.2,
      });
      return;
    }

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = maxScroll * chapter.scrollTarget;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScrollY, { duration: 1.2 });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  }, []);

  const handleToggleExplode = useCallback(() => {
    setManualExplode((prev) => !prev);
  }, []);

  const handleToggleOrbit = useCallback(() => {
    setOrbitEnabled((prev) => !prev);
  }, []);

  const handleResetView = useCallback(() => {
    setOrbitEnabled(false);
    setResetSignal((n) => n + 1);
  }, []);

  return (
    <div className="app-shell">
      {/* Background radial studio vignette */}
      <div className="studio-backdrop" aria-hidden="true" />

      {/* Fixed 3D Three.js Canvas */}
      <StudioScene
        scrollProgressRef={scrollProgressRef}
        colorway={selectedColorway}
        manualExplode={manualExplode}
        activeLayer={activeLayer}
        orbitEnabled={orbitEnabled}
        resetSignal={resetSignal}
      />

      {/* Top Navigation */}
      <Navbar
        activeChapter={activeChapter}
        onNavigateChapter={handleNavigateChapter}
        onOpenPreorder={() => setPreorderOpen(true)}
      />

      {/* Scroll-driven Storytelling Content */}
      <ScrollSections
        selectedColorway={selectedColorway}
        onSelectColorway={setSelectedColorway}
        activeLayer={activeLayer}
        onHoverLayer={setActiveLayer}
        manualExplode={manualExplode}
        onToggleExplode={handleToggleExplode}
        orbitEnabled={orbitEnabled}
        onToggleOrbit={handleToggleOrbit}
        onNavigateChapter={handleNavigateChapter}
        onOpenPreorder={() => setPreorderOpen(true)}
      />

      {/* Floating Controls & Progress Rail */}
      <FloatingControls
        selectedColorway={selectedColorway}
        onSelectColorway={setSelectedColorway}
        manualExplode={manualExplode}
        onToggleExplode={handleToggleExplode}
        orbitEnabled={orbitEnabled}
        onToggleOrbit={handleToggleOrbit}
        onResetView={handleResetView}
        activeChapter={activeChapter}
        scrollProgress={scrollProgress}
        onNavigateChapter={handleNavigateChapter}
      />

      {/* Pre-order Modal */}
      <PreorderModal
        isOpen={preorderOpen}
        onClose={() => setPreorderOpen(false)}
        selectedColorway={selectedColorway}
        onSelectColorway={setSelectedColorway}
      />
    </div>
  );
}
