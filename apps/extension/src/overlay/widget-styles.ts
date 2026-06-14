export const widgetStyles = `
.gnomon-root {
  position: fixed;
  right: 18px;
  bottom: 88px;
  z-index: 2147483647;
  width: min(360px, calc(100vw - 24px));
  color: #0f172a;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.35;
}
.gnomon-card {
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(14px);
}
.gnomon-card-expanded {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  width: min(448px, 100vw);
  height: 100vh;
  height: 100dvh;
  flex-direction: column;
  border-width: 0 0 0 1px;
  border-radius: 0;
  box-shadow: -18px 0 48px rgba(15, 23, 42, 0.22);
}
.gnomon-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.22);
}
.gnomon-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
}
.gnomon-mark {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #0f172a;
  color: #ffffff;
  font-size: 12px;
}
.gnomon-toggle {
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 6px;
}
.gnomon-toggle:hover {
  background: rgba(15, 23, 42, 0.08);
}
.gnomon-card-expanded .gnomon-header {
  flex-shrink: 0;
  padding: 14px 16px;
}
.gnomon-content {
  min-height: 0;
}
.gnomon-card-expanded .gnomon-content {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.gnomon-compact {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px;
  font-size: 12px;
}
.gnomon-card-expanded .gnomon-compact,
.gnomon-card-expanded .gnomon-section {
  padding-right: 16px;
  padding-left: 16px;
}
.gnomon-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #334155;
  padding: 3px 8px;
  font-weight: 600;
}
.gnomon-pill.good { background: #dcfce7; color: #166534; }
.gnomon-pill.warn { background: #fef3c7; color: #92400e; }
.gnomon-pill.bad { background: #fee2e2; color: #991b1b; }
.gnomon-section {
  padding: 10px 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.22);
}
.gnomon-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.gnomon-metric {
  border-radius: 7px;
  background: #f8fafc;
  padding: 8px;
}
.gnomon-label {
  color: #64748b;
  font-size: 11px;
}
.gnomon-value {
  margin-top: 2px;
  color: #0f172a;
  font-size: 14px;
  font-weight: 700;
}
.gnomon-list {
  display: grid;
  gap: 6px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}
.gnomon-list li {
  border-radius: 7px;
  background: #f8fafc;
  padding: 7px 8px;
  font-size: 12px;
}
.gnomon-list strong {
  display: block;
  margin-bottom: 2px;
  font-size: 12px;
}
.gnomon-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.22);
}
.gnomon-card-expanded .gnomon-actions {
  flex-shrink: 0;
  padding: 14px 16px;
}
.gnomon-button {
  border: 0;
  border-radius: 6px;
  background: #0f172a;
  color: #ffffff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 10px;
}
.gnomon-button.secondary {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
}
.gnomon-compare {
  display: grid;
  gap: 8px;
}
.gnomon-textbox {
  max-height: 92px;
  overflow: auto;
  border-radius: 7px;
  background: #f8fafc;
  padding: 8px;
  color: #334155;
  font-size: 12px;
  white-space: pre-wrap;
}
.gnomon-card-expanded .gnomon-textbox {
  max-height: 160px;
}
.gnomon-empty {
  padding: 12px;
  color: #64748b;
  font-size: 12px;
}
@media (max-width: 520px) {
  .gnomon-root {
    right: 12px;
    bottom: 24px;
    width: min(360px, calc(100vw - 24px));
  }
  .gnomon-card-expanded {
    left: 0;
    width: 100vw;
    border-left-width: 0;
  }
}
@media (prefers-color-scheme: dark) {
  .gnomon-root { color: #f8fafc; }
  .gnomon-card {
    border-color: rgba(71, 85, 105, 0.65);
    background: rgba(15, 23, 42, 0.96);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.34);
  }
  .gnomon-card-expanded {
    box-shadow: -18px 0 48px rgba(0, 0, 0, 0.42);
  }
  .gnomon-header,
  .gnomon-section,
  .gnomon-actions { border-color: rgba(71, 85, 105, 0.65); }
  .gnomon-mark { background: #f8fafc; color: #0f172a; }
  .gnomon-toggle:hover { background: rgba(248, 250, 252, 0.08); }
  .gnomon-pill { background: #1e293b; color: #cbd5e1; }
  .gnomon-pill.good { background: #064e3b; color: #a7f3d0; }
  .gnomon-pill.warn { background: #78350f; color: #fde68a; }
  .gnomon-pill.bad { background: #7f1d1d; color: #fecaca; }
  .gnomon-metric,
  .gnomon-list li,
  .gnomon-textbox { background: #020617; color: #cbd5e1; }
  .gnomon-label,
  .gnomon-empty { color: #94a3b8; }
  .gnomon-value { color: #f8fafc; }
  .gnomon-button.secondary {
    border-color: #475569;
    background: #020617;
    color: #f8fafc;
  }
}
`;
