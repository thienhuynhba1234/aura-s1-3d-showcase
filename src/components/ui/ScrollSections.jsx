import { ArrowDown, ArrowUpRight, Layers, RotateCw } from 'lucide-react';
import {
  CHAPTERS,
  COLORWAYS,
  EXPLODED_LAYERS,
  PRODUCT_PRICE_TEXT,
  TECH_SPECS,
} from '../../data/productData';

export default function ScrollSections({
  selectedColorway,
  onSelectColorway,
  activeLayer,
  onHoverLayer,
  manualExplode,
  onToggleExplode,
  orbitEnabled,
  onToggleOrbit,
  onNavigateChapter,
  onOpenPreorder,
}) {
  return (
    <main id="scroll-content">
      {/* CHƯƠNG 01: HERO */}
      <section
        id="section-hero"
        className="chapter-section align-left"
        data-chapter="hero"
      >
        <div className="chapter-panel hero-panel">
          <p className="chapter-kicker">01 — KIẾN TRÚC ÂM THANH THAM CHIẾU</p>
          <h1 className="hero-title">
            Tĩnh lặng tuyệt đối.
            <br />
            Âm thanh nguyên bản.
          </h1>
          <p className="chapter-body">
            AURA S1 kết hợp khung hợp kim nhôm chuẩn hàng không với màng loa
            Beryllium 40mm và công nghệ chống ồn thích ứng thời gian thực.
            Cuộn xuống để khám phá từng lớp chế tác trong không gian 3D.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              id="hero-explore-btn"
              className="btn-primary"
              onClick={() => onNavigateChapter(CHAPTERS[1])}
            >
              <span>Khám phá thiết kế</span>
              <ArrowDown size={16} />
            </button>
            <button
              type="button"
              id="hero-preorder-btn"
              className="btn-secondary"
              onClick={onOpenPreorder}
            >
              <span>Đặt trước — {PRODUCT_PRICE_TEXT}</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* CHƯƠNG 02: CRAFTSMANSHIP */}
      <section
        id="section-craftsmanship"
        className="chapter-section align-right"
        data-chapter="craftsmanship"
      >
        <div className="chapter-panel">
          <p className="chapter-kicker">02 — CHẾ TÁC &amp; VẬT LIỆU</p>
          <h2 className="chapter-title">
            Nhôm nguyên khối CNC.
            <br />
            Khớp xoay không vít.
          </h2>
          <p className="chapter-body">
            Vòm đầu uốn cong công thái học phân bổ trọng lượng đồng đều, kết nối
            với thanh trượt thép không gỉ và càng chữ Y gia công chính xác từng
            micron. Bề mặt anodized phay xước chống bám vân tay theo thời gian.
          </p>

          <div className="material-list">
            <div className="material-row">
              <span className="material-label">Khung vỏ</span>
              <span className="material-value">Nhôm Series-6000 Anodized</span>
            </div>
            <div className="material-row">
              <span className="material-label">Khớp truyền động</span>
              <span className="material-value">Thép không gỉ 316L xoay 90°</span>
            </div>
            <div className="material-row">
              <span className="material-label">Đệm tiếp xúc</span>
              <span className="material-value">Da cừu thật &amp; Memory Foam</span>
            </div>
          </div>
        </div>
      </section>

      {/* CHƯƠNG 03: EXPLODED ACOUSTICS */}
      <section
        id="section-exploded"
        className="chapter-section align-left"
        data-chapter="exploded"
      >
        <div className="chapter-panel exploded-panel">
          <div className="panel-header-row">
            <div>
              <p className="chapter-kicker">03 — CẤU TRÚC ÂM HỌC 5 LỚP</p>
              <h2 className="chapter-title">Giải phẫu từng tầng linh kiện.</h2>
            </div>
            <button
              type="button"
              id="section-explode-lock-btn"
              className={`chip-toggle ${manualExplode ? 'is-active' : ''}`}
              onClick={onToggleExplode}
            >
              <Layers size={14} />
              <span>{manualExplode ? 'Đã khóa tách lớp' : 'Khóa tách lớp'}</span>
            </button>
          </div>

          <p className="chapter-body">
            Di chuột hoặc chạm vào từng lớp bên dưới để làm nổi bật vị trí linh
            kiện tương ứng trên mô hình 3D.
          </p>

          <div className="layer-stack" role="list">
            {EXPLODED_LAYERS.map((layer) => {
              const isHighlighted = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  id={`exploded-layer-btn-${layer.id}`}
                  className={`layer-item ${isHighlighted ? 'is-highlighted' : ''}`}
                  onMouseEnter={() => onHoverLayer(layer.id)}
                  onMouseLeave={() => onHoverLayer(null)}
                  onFocus={() => onHoverLayer(layer.id)}
                  onBlur={() => onHoverLayer(null)}
                  onClick={() =>
                    onHoverLayer(isHighlighted ? null : layer.id)
                  }
                >
                  <span className="layer-code">{layer.code}</span>
                  <span className="layer-text">
                    <strong>{layer.title}</strong>
                    <small>{layer.detail}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CHƯƠNG 04: ANC & SPECS */}
      <section
        id="section-specs"
        className="chapter-section align-right"
        data-chapter="specs"
      >
        <div className="chapter-panel">
          <p className="chapter-kicker">04 — CÔNG NGHỆ &amp; THÔNG SỐ</p>
          <h2 className="chapter-title">
            Khử ồn chủ động -48dB.
            <br />
            Bền bỉ suốt 45 giờ.
          </h2>
          <p className="chapter-body">
            Hệ thống 6 micro thu âm đa hướng liên tục lấy mẫu tạp âm môi trường
            48.000 lần mỗi giây, triệt tiêu tiếng ồn tần số thấp mà không làm
            biến dạng âm sắc tự nhiên của bản thu.
          </p>

          <div className="specs-grid">
            {TECH_SPECS.map((spec) => (
              <div key={spec.label} className="spec-cell">
                <span className="spec-value">{spec.value}</span>
                <span className="spec-label">{spec.label}</span>
                <span className="spec-note">{spec.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHƯƠNG 05: CONFIGURATOR & PRE-ORDER */}
      <section
        id="section-configurator"
        className="chapter-section align-left"
        data-chapter="configurator"
      >
        <div className="chapter-panel">
          <p className="chapter-kicker">05 — TÙY BIẾN &amp; ĐẶT TRƯỚC</p>
          <h2 className="chapter-title">Chọn sắc thái của riêng bạn.</h2>
          <p className="chapter-body">
            Chuyển đổi trực tiếp giữa 3 lớp hoàn thiện thủ công trên mô hình 3D
            hoặc kích hoạt chế độ xoay 360° để kiểm tra mọi góc cạnh trước khi
            đặt hàng.
          </p>

          <div className="colorway-selector" role="radiogroup" aria-label="Chọn màu tai nghe">
            {COLORWAYS.map((cw) => {
              const isSelected = selectedColorway.id === cw.id;
              return (
                <button
                  key={cw.id}
                  type="button"
                  id={`config-color-${cw.id}`}
                  role="radio"
                  aria-checked={isSelected}
                  className={`colorway-option ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelectColorway(cw)}
                >
                  <span
                    className="colorway-dot"
                    style={{
                      backgroundColor: cw.swatch,
                      borderColor: cw.swatchRing,
                    }}
                  />
                  <span className="colorway-meta">
                    <strong>{cw.name}</strong>
                    <small>{cw.subtitle}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="config-footer-actions">
            <button
              type="button"
              id="config-preorder-btn"
              className="btn-primary"
              onClick={onOpenPreorder}
            >
              <span>Đặt trước — {PRODUCT_PRICE_TEXT}</span>
              <ArrowUpRight size={16} />
            </button>

            <button
              type="button"
              id="config-orbit-btn"
              className={`btn-secondary ${orbitEnabled ? 'is-active' : ''}`}
              onClick={onToggleOrbit}
            >
              <RotateCw size={15} />
              <span>{orbitEnabled ? 'Đang bật Xoay 360°' : 'Xoay 360° tự do'}</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="site-footer" id="site-footer">
        <div className="footer-inner">
          <span className="footer-brand">AURA S1 ACOUSTIC LABS</span>
          <span className="footer-meta">
            Trình diễn 3D thời gian thực bằng React &amp; Three.js · Phiên bản Studio 2026
          </span>
        </div>
      </footer>
    </main>
  );
}
