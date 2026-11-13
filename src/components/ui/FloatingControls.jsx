import { Layers, RotateCcw, RotateCw } from 'lucide-react';
import { CHAPTERS, COLORWAYS } from '../../data/productData';

export default function FloatingControls({
  selectedColorway,
  onSelectColorway,
  manualExplode,
  onToggleExplode,
  orbitEnabled,
  onToggleOrbit,
  onResetView,
  activeChapter,
  scrollProgress,
  onNavigateChapter,
}) {
  return (
    <>
      {/* Vertical Chapter Progress Rail on Right Edge */}
      <aside
        className="progress-rail"
        aria-label="Thanh tiến trình các chương"
        id="chapter-progress-rail"
      >
        <div className="rail-track">
          <div
            className="rail-fill"
            style={{ height: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
        <div className="rail-dots">
          {CHAPTERS.map((chapter) => {
            const isActive = activeChapter === chapter.id;
            return (
              <button
                key={chapter.id}
                type="button"
                id={`rail-dot-${chapter.id}`}
                className={`rail-dot-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onNavigateChapter(chapter)}
                title={`${chapter.index} — ${chapter.shortLabel}`}
                aria-label={`Đi tới chương ${chapter.shortLabel}`}
              >
                <span className="rail-dot" />
                <span className="rail-tooltip">{chapter.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Bottom Floating Studio Dock */}
      <div className="floating-dock" id="floating-studio-dock" role="toolbar" aria-label="Điều khiển mô hình 3D">
        <div className="dock-swatches" aria-label="Chọn nhanh màu sắc">
          {COLORWAYS.map((cw) => {
            const active = selectedColorway.id === cw.id;
            return (
              <button
                key={cw.id}
                type="button"
                id={`dock-swatch-${cw.id}`}
                className={`dock-swatch-btn ${active ? 'is-active' : ''}`}
                onClick={() => onSelectColorway(cw)}
                title={cw.name}
                aria-label={`Chọn màu ${cw.name}`}
              >
                <span
                  className="dock-swatch-fill"
                  style={{ backgroundColor: cw.swatch }}
                />
              </button>
            );
          })}
        </div>

        <span className="dock-divider" aria-hidden="true" />

        <button
          type="button"
          id="dock-explode-btn"
          className={`dock-action-btn ${manualExplode ? 'is-active' : ''}`}
          onClick={onToggleExplode}
          aria-pressed={manualExplode}
        >
          <Layers size={15} />
          <span>Tách lớp 3D</span>
        </button>

        <button
          type="button"
          id="dock-orbit-btn"
          className={`dock-action-btn ${orbitEnabled ? 'is-active' : ''}`}
          onClick={onToggleOrbit}
          aria-pressed={orbitEnabled}
        >
          <RotateCw size={15} />
          <span>{orbitEnabled ? 'Xoay 360°: BẬT' : 'Xoay 360°'}</span>
        </button>

        {orbitEnabled && (
          <button
            type="button"
            id="dock-reset-btn"
            className="dock-action-btn"
            onClick={onResetView}
            title="Đặt lại góc nhìn theo cuộn trang"
            aria-label="Đặt lại góc nhìn"
          >
            <RotateCcw size={15} />
          </button>
        )}
      </div>
    </>
  );
}
