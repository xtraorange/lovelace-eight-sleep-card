function getEightSleepCardStyles(tapActionExpand, useThemeColors = false) {
  const cardBackground = useThemeColors
    ? "var(--ha-card-background, var(--card-background-color, #1c1c1c))"
    : "radial-gradient(circle at top center, rgba(255,255,255,0.05), transparent 42%), linear-gradient(180deg, #0b0b0b 0%, #030303 100%)";
  const cardTextColor = useThemeColors
    ? "var(--primary-text-color)"
    : "white";
  const borderColor = useThemeColors
    ? "var(--divider-color, rgba(255,255,255,0.12))"
    : "rgba(255,255,255,0.05)";
  const insetHighlight = useThemeColors
    ? "none"
    : "inset 0 1px 0 rgba(255,255,255,0.04)";
  const outerShadow = useThemeColors
    ? "var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.2))"
    : "0 8px 30px rgba(0,0,0,0.35)";
  const mutedText = useThemeColors
    ? "var(--secondary-text-color)"
    : "rgba(255,255,255,0.7)";
  const panelBackground = useThemeColors
    ? "color-mix(in srgb, var(--ha-card-background, #1c1c1c) 85%, var(--primary-text-color) 15%)"
    : "rgba(255,255,255,0.03)";
  const panelBorder = useThemeColors
    ? "var(--divider-color, rgba(255,255,255,0.12))"
    : "rgba(255,255,255,0.05)";

  return `
      <style>
        :host {
          display: block;
        }

        ha-card {
          background: ${cardBackground};
          color: ${cardTextColor};
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid ${borderColor};
          box-shadow: ${insetHighlight}, ${outerShadow};
          position: relative;
        }

        .clickable {
          cursor: ${tapActionExpand ? "pointer" : "default"};
        }

        .wrap {
          padding: 18px;
        }

        .header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .title {
          font-size: 15px;
          font-weight: 700;
          color: var(--primary-text-color, rgba(255,255,255,0.94));
          letter-spacing: 0.2px;
        }

        .room-temp {
          font-size: 12px;
          color: ${mutedText};
          white-space: nowrap;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          background: ${panelBackground};
          border: 1px solid ${panelBorder};
          font-size: 11px;
          color: ${mutedText};
          white-space: nowrap;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: pulseDot 1.8s ease-in-out infinite;
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.22); opacity: 1; }
        }

        .power-button,
        .close-button {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid ${panelBorder};
          background: ${panelBackground};
          color: var(--primary-text-color, white);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
        }

        .power-button:hover,
        .close-button:hover {
          background: color-mix(in srgb, ${panelBackground} 75%, var(--primary-text-color, #fff) 25%);
        }

        .bed-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
          margin: 10px 0 16px;
        }

        svg {
          width: 100%;
          max-width: 520px;
          height: auto;
          display: block;
        }

        .details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .panel {
          background: ${panelBackground};
          border: 1px solid ${panelBorder};
          border-radius: 18px;
          padding: 12px;
          min-width: 0;
        }

        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
        }

        .name-wrap {
          min-width: 0;
        }

        .name {
          font-size: 13px;
          font-weight: 700;
          color: var(--primary-text-color, rgba(255,255,255,0.95));
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .location {
          font-size: 11px;
          color: ${mutedText};
          margin-top: 2px;
          text-transform: capitalize;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mode-badge {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          flex: 0 0 auto;
        }

        .big {
          font-size: 24px;
          font-weight: 800;
          line-height: 1.05;
          margin-bottom: 4px;
        }

        .mode {
          font-size: 12px;
          color: ${mutedText};
          margin-bottom: 10px;
        }

        .meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 10px;
        }

        .meta-item {
          font-size: 11px;
          color: ${mutedText};
        }

        .meta-item strong {
          display: block;
          margin-top: 2px;
          color: var(--primary-text-color, rgba(255,255,255,0.88));
          font-size: 12px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .metric {
          min-width: 0;
        }

        .metric-label {
          font-size: 11px;
          color: ${mutedText};
        }

        .metric-value {
          margin-top: 2px;
          color: var(--primary-text-color, rgba(255,255,255,0.9));
          font-size: 12px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.78);
          backdrop-filter: blur(8px);
          z-index: 20;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
        }

        .overlay-card {
          width: 100%;
          height: 100%;
          overflow: auto;
          padding: 18px;
          box-sizing: border-box;
        }

        .overlay-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .overlay-title {
          font-size: 16px;
          font-weight: 700;
        }

        .expanded-layout {
          display: grid;
          gap: 14px;
        }

        .expanded-section {
          background: ${panelBackground};
          border: 1px solid ${panelBorder};
          border-radius: 18px;
          padding: 14px;
        }

        .expanded-title {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 10px;
          color: var(--primary-text-color, rgba(255,255,255,0.93));
        }

        .expanded-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px 12px;
        }

        @media (max-width: 700px) {
          .details {
            grid-template-columns: 1fr;
          }

          .expanded-grid {
            grid-template-columns: 1fr;
          }

          .header {
            grid-template-columns: 1fr;
          }

          .header-actions {
            justify-content: flex-start;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 500px) {
          .details {
            grid-template-columns: 1fr;
          }
        }
      </style>
  `;
}
