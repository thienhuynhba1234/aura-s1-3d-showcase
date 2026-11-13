import { CHAPTERS } from '../../data/productData';

export default function Navbar({ activeChapter, onNavigateChapter, onOpenPreorder }) {
  return (
    <header className="navbar" id="top-navbar">
      <button
        type="button"
        id="nav-brand-btn"
        className="brand-mark"
        onClick={() => onNavigateChapter(CHAPTERS[0])}
        aria-label="Quay về đầu trang AURA S1"
      >
        <span className="brand-dot" aria-hidden="true" />
        <span className="brand-title">AURA S1</span>
        <span className="brand-sub">STUDIO ANC</span>
      </button>

      <nav className="nav-links" aria-label="Điều hướng các chương">
        {CHAPTERS.map((chapter) => {
          const isActive = activeChapter === chapter.id;
          return (
            <button
              key={chapter.id}
              type="button"
              id={`nav-link-${chapter.id}`}
              className={`nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavigateChapter(chapter)}
            >
              <span className="nav-index">{chapter.index}</span>
              <span>{chapter.shortLabel}</span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        id="nav-preorder-btn"
        className="nav-cta"
        onClick={onOpenPreorder}
      >
        Đặt trước
      </button>
    </header>
  );
}
