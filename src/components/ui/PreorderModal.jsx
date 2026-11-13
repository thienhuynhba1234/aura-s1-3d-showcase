import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { COLORWAYS, PRODUCT_PRICE_VALUE } from '../../data/productData';

function formatVND(amount) {
  return `${amount.toLocaleString('vi-VN')} ₫`;
}

export default function PreorderModal({
  isOpen,
  onClose,
  selectedColorway,
  onSelectColorway,
}) {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalPrice = PRODUCT_PRICE_VALUE * quantity;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      id="preorder-modal-backdrop"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preorder-modal-title"
    >
      <div
        className="modal-panel"
        id="preorder-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="modal-kicker">ĐẶT TRƯỚC PHIÊN BẢN STUDIO 2026</p>
            <h3 id="preorder-modal-title" className="modal-title">
              AURA S1 — {selectedColorway.name}
            </h3>
          </div>
          <button
            type="button"
            id="modal-close-btn"
            className="modal-close"
            onClick={handleClose}
            aria-label="Đóng hộp thoại đặt trước"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="modal-success" id="preorder-success-state">
            <CheckCircle2 size={40} className="success-icon" />
            <h4>Đã ghi nhận yêu cầu đặt trước</h4>
            <p>
              Cảm ơn <strong>{customerName}</strong>. Đơn giữ suất{' '}
              <strong>
                {quantity}x AURA S1 ({selectedColorway.name})
              </strong>{' '}
              trị giá <strong>{formatVND(totalPrice)}</strong> đã được xác nhận
              gửi về <strong>{customerEmail}</strong>.
            </p>
            <button
              type="button"
              id="modal-done-btn"
              className="btn-primary"
              onClick={handleClose}
            >
              Tiếp tục khám phá 3D
            </button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-field-group">
              <span className="modal-label">Phiên bản hoàn thiện</span>
              <div className="modal-color-pills">
                {COLORWAYS.map((cw) => (
                  <button
                    key={cw.id}
                    type="button"
                    id={`modal-color-${cw.id}`}
                    className={`modal-color-pill ${
                      selectedColorway.id === cw.id ? 'is-selected' : ''
                    }`}
                    onClick={() => onSelectColorway(cw)}
                  >
                    <span
                      className="pill-swatch"
                      style={{ backgroundColor: cw.swatch }}
                    />
                    <span>{cw.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-summary-row">
              <div>
                <span className="modal-label">Số lượng</span>
                <div className="qty-stepper">
                  <button
                    type="button"
                    id="qty-decrease-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Giảm số lượng"
                  >
                    −
                  </button>
                  <span id="qty-value">{quantity}</span>
                  <button
                    type="button"
                    id="qty-increase-btn"
                    onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                    aria-label="Tăng số lượng"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="modal-total">
                <span className="modal-label">Tổng tạm tính</span>
                <strong>{formatVND(totalPrice)}</strong>
              </div>
            </div>

            <div className="modal-field-group">
              <label htmlFor="preorder-name" className="modal-label">
                Họ và tên
              </label>
              <input
                id="preorder-name"
                type="text"
                required
                placeholder="Nguyễn Minh Anh"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="modal-field-group">
              <label htmlFor="preorder-email" className="modal-label">
                Email nhận thông báo giao hàng
              </label>
              <input
                id="preorder-email"
                type="email"
                required
                placeholder="minhanh@studio.vn"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              id="modal-submit-btn"
              className="btn-primary modal-submit"
            >
              Xác nhận giữ suất đợt 1 · Dự kiến giao 12/2026
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
