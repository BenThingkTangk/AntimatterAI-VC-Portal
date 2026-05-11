'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  type RefObject,
} from 'react';
import { salesDominatorChapters, type SalesDominatorChapter } from '../data/salesDominatorChapters';
import { MissionDossier } from './MissionDossier';
import { useDtomBrand } from './DtomBrandShell';

/**
 * DtomPinnedKeynote
 *
 * GSAP ScrollTrigger pinned chapter sequence for ΔTOM Sales Dominator.
 *
 * Desktop: pinned section scrolls through 12 chapters. Left sidebar shows
 * the module navigator; main area shows classified screenshot display and
 * chapter headline. GSAP ScrollTrigger drives chapter advancement. A
 * MissionDossier overlay opens on screenshot click (keyboard accessible).
 *
 * Mobile/tablet (≤860px): Static stacked card sequence, no pinning.
 *
 * Reduced-motion: Static first chapter only, no pinned scrub, no GSAP motion,
 * all content readable. Falls back gracefully when GSAP is unavailable.
 *
 * Per the ΔTOM Brand Standard:
 * - Left rail + topbar + tabs + metric cards are mandatory.
 * - Real screenshot panel is the primary evidence.
 * - Score ring, chapter progress, telemetry are supporting.
 *
 * @example
 * <DtomPinnedKeynote assetBasePath="/dtom-assets" />
 */

export interface DtomPinnedKeynoteProps {
  /**
   * Base URL path where /dtom-assets/sales-dominator/ images are served.
   * Overrides DtomBrandShell context.
   */
  assetBasePath?: string;
  /** Custom chapter data (defaults to all 12 salesDominatorChapters) */
  chapters?: SalesDominatorChapter[];
  /** CSS class on the section wrapper */
  className?: string;
  /** Whether to allow GSAP ScrollTrigger pinning. Default: true */
  pinEnabled?: boolean;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function useIsNarrow(breakpoint = 860): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const check = () => setNarrow(window.innerWidth <= breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return narrow;
}

/**
 * Tiny inline SVG score ring — no external deps.
 */
function ScoreRing({ score }: { score: number }): JSX.Element {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (score / 100) * circ;
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      aria-label={`Score: ${score}`}
      role="img"
    >
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="var(--dtom-color-primary)"
        strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
        style={{ transition: 'stroke-dashoffset 500ms var(--dtom-ease-out)' }}
      />
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fill="var(--dtom-color-primary)"
        fontSize="11"
        fontFamily="var(--dtom-font-mono)"
        fontWeight="700"
      >
        {score}
      </text>
    </svg>
  );
}

export function DtomPinnedKeynote({
  assetBasePath: propAssetBasePath,
  chapters = salesDominatorChapters,
  className = '',
  pinEnabled = true,
}: DtomPinnedKeynoteProps): JSX.Element {
  const ctx = useDtomBrand();
  const base = `${propAssetBasePath ?? ctx.assetBasePath}/sales-dominator`;

  const reducedMotion = useReducedMotion();
  const isNarrow = useIsNarrow();

  const [activeIndex, setActiveIndex] = useState(0);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [dossierChapter, setDossierChapter] = useState<SalesDominatorChapter | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const screenshotBtnRef = useRef<HTMLButtonElement>(null);
  const dossierTriggerRef = useRef<HTMLElement>(null);

  const activeChapter = chapters[activeIndex] ?? chapters[0];

  // Scroll-driven chapter advancement. Self-contained (no GSAP dep) —
  // pinning is handled by CSS `position: sticky` on the stage; this just
  // maps scroll progress within the section to an active chapter index.
  useEffect(() => {
    if (reducedMotion || isNarrow || !pinEnabled) return;
    if (typeof window === 'undefined') return;
    const section = sectionRef.current;
    if (!section) return;

    const chapterCount = chapters.length;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      // Pinned scroll window = section height minus one viewport (sticky stage occupies 100vh).
      const pinnedDistance = Math.max(1, rect.height - viewportH);
      // Progress: 0 when section's top hits viewport top, 1 when bottom hits viewport bottom.
      const scrolled = Math.min(Math.max(-rect.top, 0), pinnedDistance);
      const progress = scrolled / pinnedDistance;
      const idx = Math.min(
        Math.floor(progress * chapterCount),
        chapterCount - 1
      );
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reducedMotion, isNarrow, pinEnabled, chapters.length]);

  const openDossier = useCallback(
    (chapter: SalesDominatorChapter, triggerEl: HTMLElement | null) => {
      setDossierChapter(chapter);
      setDossierOpen(true);
      if (triggerEl) {
        (dossierTriggerRef as React.MutableRefObject<HTMLElement | null>).current = triggerEl;
      }
    },
    []
  );

  const closeDossier = useCallback(() => {
    setDossierOpen(false);
  }, []);

  // Static stacked layout for mobile or reduced-motion
  if (reducedMotion || isNarrow) {
    return (
      <section
        ref={sectionRef}
        className={`dtom-keynote dtom-section ${className}`.trim()}
        aria-label="ΔTOM Sales Dominator — module overview"
      >
        <div className="dtom-container">
          <p className="dtom-system-label" style={{ marginBottom: 'var(--dtom-space-8)' }}>
            ΔTOM SALES DOMINATOR — 12 MODULES
          </p>
          <div
            style={{
              display: 'grid',
              gap: 'var(--dtom-space-6)',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
            }}
          >
            {chapters.map((ch) => (
              <article key={ch.missionCode} className="dtom-command-card">
                <header>
                  <span className="dtom-system-label">{ch.num} — {ch.module}</span>
                  <h3 className="dtom-product-title" style={{ marginTop: 'var(--dtom-space-2)' }}>
                    {ch.title}
                  </h3>
                </header>
                <button
                  type="button"
                  className="dtom-keynote__classified-display"
                  style={{
                    width: '100%',
                    border: '1px solid var(--dtom-color-border-strong)',
                    borderRadius: 'var(--dtom-radius-lg)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'none',
                    padding: 0,
                    display: 'block',
                  }}
                  onClick={(e) => openDossier(ch, e.currentTarget)}
                  aria-label={`Expand ${ch.title} mission dossier`}
                >
                  <img
                    className="dtom-keynote__screenshot"
                    src={`${base}/${ch.image}`}
                    alt={`${ch.title} — ΔTOM Sales Dominator`}
                    loading="lazy"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </button>
                <p className="dtom-lead" style={{ fontSize: 'var(--dtom-text-sm)' }}>
                  {ch.role}
                </p>
              </article>
            ))}
          </div>
        </div>

        {dossierOpen && dossierChapter && (
          <MissionDossier
            open={dossierOpen}
            onClose={closeDossier}
            title={dossierChapter.title}
            missionCode={dossierChapter.missionCode}
            score={dossierChapter.score}
            chapterNum={dossierChapter.num}
            imageSrc={`${base}/${dossierChapter.image}`}
            capabilities={dossierChapter.capabilities}
            triggerRef={dossierTriggerRef as RefObject<HTMLElement>}
          />
        )}
      </section>
    );
  }

  // Pinned desktop layout.
  // Section height = pinned scroll window + 100vh (sticky stage). Each chapter
  // gets `chapterDwellVh` of scroll. Keep it tight so the section ends right
  // when the last chapter has had its moment — no dead trailing scroll.
  const chapterDwellVh = 45;
  const sectionHeightVh = chapters.length * chapterDwellVh + 100;
  return (
    <section
      ref={sectionRef}
      className={`dtom-keynote ${className}`.trim()}
      style={{ height: `${sectionHeightVh}vh` }}
      aria-label="ΔTOM Sales Dominator — pinned chapter keynote"
    >
      {/* Sticky stage */}
      <div ref={stageRef} className="dtom-keynote__stage">
        {/* Left brief / module nav */}
        <aside className="dtom-keynote__brief" aria-label="Module navigator">
          <header className="dtom-keynote__brief-header">
            ΔTOM SALES DOMINATOR
          </header>
          <nav aria-label="Sales Dominator module list">
            {chapters.map((ch, i) => (
              <button
                key={ch.missionCode}
                type="button"
                className={`dtom-keynote__module-item ${
                  i === activeIndex ? 'dtom-keynote__module-item--active' : ''
                }`}
                onClick={() => setActiveIndex(i)}
                aria-current={i === activeIndex ? 'true' : undefined}
                aria-label={`${ch.num} ${ch.module}`}
              >
                <span className="dtom-keynote__module-num">{ch.num}</span>
                <span className="dtom-keynote__module-label">{ch.module}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main viewport */}
        <div className="dtom-keynote__viewport">
          {/* Chapter header bar */}
          <div className="dtom-keynote__chapter-header">
            <h3
              className="dtom-keynote__chapter-title"
              aria-live="polite"
              aria-atomic="true"
            >
              {activeChapter.title}
            </h3>
            <div className="dtom-keynote__chapter-meta">
              <span className="dtom-system-label">{activeChapter.missionCode}</span>
              <ScoreRing score={activeChapter.score} />
            </div>
          </div>

          {/* Classified screenshot display */}
          <button
            ref={screenshotBtnRef}
            type="button"
            className="dtom-keynote__classified-display"
            onClick={(e) => openDossier(activeChapter, e.currentTarget)}
            aria-label={`Expand ${activeChapter.title} mission dossier`}
          >
            <img
              key={activeChapter.image}
              className="dtom-keynote__screenshot"
              src={`${base}/${activeChapter.image}`}
              alt={`${activeChapter.title} — ΔTOM Sales Dominator product screenshot`}
              loading="lazy"
            />
          </button>

          {/* Caption */}
          <p className="dtom-keynote__caption" aria-live="polite">
            {activeChapter.num} · {activeChapter.module} · Mission code: {activeChapter.missionCode}
            {' '}· AtomDominator.com
          </p>
        </div>
      </div>

      {/* Mission Dossier overlay */}
      {dossierOpen && dossierChapter && (
        <MissionDossier
          open={dossierOpen}
          onClose={closeDossier}
          title={dossierChapter.title}
          missionCode={dossierChapter.missionCode}
          score={dossierChapter.score}
          chapterNum={dossierChapter.num}
          imageSrc={`${base}/${dossierChapter.image}`}
          capabilities={dossierChapter.capabilities}
          triggerRef={dossierTriggerRef as RefObject<HTMLElement>}
        />
      )}
    </section>
  );
}

export default DtomPinnedKeynote;
