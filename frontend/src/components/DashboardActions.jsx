import { createPortal } from "react-dom";

export default function DashboardActions({
  onCreate,
  onAssign,
  disableAssign,
  onClose
}) {

  return createPortal(
    <>
      {/* BACKDROP */}
      <div className="sheet-backdrop" onClick={onClose} />

      {/* SHEET */}
      <div className="bottom-sheet">
        <div className="sheet-handle" />

        <div className="sheet-content">

          <input
            className="sheet-search"
            placeholder="Global Search"
          />

          <button
            className="primary"
            onClick={() => {
              onClose?.();
              onCreate?.();
            }}
          >
            New Booking
          </button>

          <button
            disabled={disableAssign}
            onClick={() => {
              onClose?.();
              onAssign?.();
            }}
          >
            Assign Work Order
          </button>

          <button className="sheet-close" onClick={onClose}>
            Close
          </button>

        </div>
      </div>
    </>,
    document.body
  );
}
