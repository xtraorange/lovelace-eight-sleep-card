const EIGHT_SLEEP_DEFAULT_CONFIG = {
  title: "Eight Sleep",
  avatar_mode: "auto",
  tap_action_expand: true,
  show_room_temp: true,
  show_hub_status: true,
  show_has_water: true,
  show_needs_priming: true,
  show_is_priming: false,
  show_last_prime: false,
  show_bed_temp: true,
  show_target_temp: true,
  show_sleep_stage: true,
  show_time_slept: true,
  show_heart_rate: true,
  show_breath_rate: false,
  show_hrv: false,
  show_scores: false,
  show_next_alarm: false,
  show_presence_times: false,
  show_occupancy_wash: true,
  show_bed_graphic: true,
  show_compact_panels: true,
};

function createEightSleepConfig(config = {}) {
  return {
    ...EIGHT_SLEEP_DEFAULT_CONFIG,
    ...config,
    left: {
      name: "Left",
      ...(config.left || {}),
    },
    right: {
      name: "Right",
      ...(config.right || {}),
    },
    hub: {
      ...(config.hub || {}),
    },
  };
}

function isEightSleepMissingValue(value) {
  if (value === null || value === undefined || value === "") return true;
  const text = String(value).toLowerCase();
  return text === "unknown" || text === "unavailable" || text === "none";
}

function toEightSleepText(value, fallback = "â€”") {
  return isEightSleepMissingValue(value) ? fallback : String(value);
}

function getEightSleepCardStyles(tapActionExpand) {
  return `
      <style>
        :host {
          display: block;
        }

        ha-card {
          background:
            radial-gradient(circle at top center, rgba(255,255,255,0.05), transparent 42%),
            linear-gradient(180deg, #0b0b0b 0%, #030303 100%);
          color: white;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.04),
            0 8px 30px rgba(0,0,0,0.35);
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
          color: rgba(255,255,255,0.94);
          letter-spacing: 0.2px;
        }

        .room-temp {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
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
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          font-size: 11px;
          color: rgba(255,255,255,0.72);
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
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
        }

        .power-button:hover,
        .close-button:hover {
          background: rgba(255,255,255,0.08);
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
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
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
          color: rgba(255,255,255,0.95);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .location {
          font-size: 11px;
          color: rgba(255,255,255,0.56);
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
          color: rgba(255,255,255,0.68);
          margin-bottom: 10px;
        }

        .meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 10px;
        }

        .meta-item {
          font-size: 11px;
          color: rgba(255,255,255,0.56);
        }

        .meta-item strong {
          display: block;
          margin-top: 2px;
          color: rgba(255,255,255,0.88);
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
          color: rgba(255,255,255,0.56);
        }

        .metric-value {
          margin-top: 2px;
          color: rgba(255,255,255,0.9);
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
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 14px;
        }

        .expanded-title {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 10px;
          color: rgba(255,255,255,0.93);
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

function renderEightSleepBedGraphic(card, left, right) {
  if (!card._config.show_bed_graphic) return ``;
  return `
                <div class="bed-wrap">
                  <svg viewBox="0 0 680 470" role="img" aria-label="Eight Sleep bed card">
                    <defs>
                      <linearGradient id="bedShellGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#1a1a1b"></stop>
                        <stop offset="100%" stop-color="#101011"></stop>
                      </linearGradient>

                      <linearGradient id="bedTopGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#121214"></stop>
                        <stop offset="100%" stop-color="#0b0b0d"></stop>
                      </linearGradient>

                      <pattern id="mattressTexture" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
                      </pattern>

                      <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="rgba(0,0,0,0.45)" />
                      </filter>
                    </defs>

                    <path
                      d="M150 78
                         C150 60, 165 48, 184 48
                         L496 48
                         C515 48, 530 60, 530 78
                         L560 366
                         C563 392, 544 412, 518 412
                         L162 412
                         C136 412, 117 392, 120 366
                         Z"
                      fill="url(#bedShellGradient)"
                      filter="url(#softShadow)"
                    ></path>

                    <path
                      d="M172 82
                         C172 70, 181 62, 194 62
                         L486 62
                         C499 62, 508 70, 508 82
                         L534 338
                         C536 356, 522 370, 504 370
                         L176 370
                         C158 370, 144 356, 146 338
                         Z"
                      fill="url(#bedTopGradient)"
                    ></path>

                    <path
                      d="M186 92
                         C186 82, 193 76, 203 76
                         L334 76
                         C344 76, 351 82, 351 92
                         L370 320
                         C371 334, 361 344, 347 344
                         L193 344
                         C179 344, 169 334, 170 320
                         Z"
                      fill="rgba(255,255,255,0.018)"
                    ></path>

                    <path
                      d="M186 92
                         C186 82, 193 76, 203 76
                         L334 76
                         C344 76, 351 82, 351 92
                         L370 320
                         C371 334, 361 344, 347 344
                         L193 344
                         C179 344, 169 334, 170 320
                         Z"
                      fill="url(#mattressTexture)"
                      opacity="0.16"
                    ></path>

                    <path
                      d="M186 92
                         C186 82, 193 76, 203 76
                         L334 76
                         C344 76, 351 82, 351 92
                         L370 320
                         C371 334, 361 344, 347 344
                         L193 344
                         C179 344, 169 334, 170 320
                         Z"
                      fill="none"
                      stroke="${left.color}"
                      stroke-width="3.5"
                      style="filter: drop-shadow(0 0 6px ${left.color}) drop-shadow(0 0 14px ${left.color});"
                    ></path>

                    <path
                      d="M348 92
                         C348 82, 355 76, 365 76
                         L496 76
                         C506 76, 513 82, 513 92
                         L532 320
                         C533 334, 523 344, 509 344
                         L355 344
                         C341 344, 331 334, 332 320
                         Z"
                      fill="rgba(255,255,255,0.018)"
                    ></path>

                    <path
                      d="M348 92
                         C348 82, 355 76, 365 76
                         L496 76
                         C506 76, 513 82, 513 92
                         L532 320
                         C533 334, 523 344, 509 344
                         L355 344
                         C341 344, 331 334, 332 320
                         Z"
                      fill="url(#mattressTexture)"
                      opacity="0.16"
                    ></path>

                    <path
                      d="M348 92
                         C348 82, 355 76, 365 76
                         L496 76
                         C506 76, 513 82, 513 92
                         L532 320
                         C533 334, 523 344, 509 344
                         L355 344
                         C341 344, 331 334, 332 320
                         Z"
                      fill="none"
                      stroke="${right.color}"
                      stroke-width="3.5"
                      style="filter: drop-shadow(0 0 6px ${right.color}) drop-shadow(0 0 14px ${right.color});"
                    ></path>

                    <line
                      x1="340"
                      y1="80"
                      x2="350"
                      y2="340"
                      stroke="rgba(255,255,255,0.12)"
                      stroke-width="3"
                      stroke-linecap="round"
                    ></line>

                    <path
                      d="M206 104
                         C206 94, 214 88, 224 88
                         L306 88
                         C316 88, 324 94, 324 104
                         L324 130
                         C324 140, 316 146, 306 146
                         L224 146
                         C214 146, 206 140, 206 130
                         Z"
                      fill="#f5f5f5"
                    ></path>

                    <path
                      d="M370 104
                         C370 94, 378 88, 388 88
                         L470 88
                         C480 88, 488 94, 488 104
                         L488 130
                         C488 140, 480 146, 470 146
                         L388 146
                         C378 146, 370 140, 370 130
                         Z"
                      fill="#f5f5f5"
                    ></path>

                    ${card._renderAvatar(left, 278, 86)}
                    ${card._renderAvatar(right, 442, 86)}

                    ${card._config.show_occupancy_wash && left.occupied
          ? `
                          <path
                            d="M186 92
                               C186 82, 193 76, 203 76
                               L334 76
                               C344 76, 351 82, 351 92
                               L370 320
                               C371 334, 361 344, 347 344
                               L193 344
                               C179 344, 169 334, 170 320
                               Z"
                            fill="${left.color}"
                            opacity="0.08"
                          ></path>
                        `
          : ``
      }

                    ${card._config.show_occupancy_wash && right.occupied
          ? `
                          <path
                            d="M348 92
                               C348 82, 355 76, 365 76
                               L496 76
                               C506 76, 513 82, 513 92
                               L532 320
                               C533 334, 523 344, 509 344
                               L355 344
                               C341 344, 331 334, 332 320
                               Z"
                            fill="${right.color}"
                            opacity="0.08"
                          ></path>
                        `
          : ``
      }
                  </svg>
                </div>
              `;
}

function renderEightSleepCompactPanels(card, left, right) {
  if (!card._config.show_compact_panels) return ``;
  return `
                <div class="details">
                  <div class="panel">
                    <div class="panel-head">
                      <div class="name-wrap">
                        <div class="name">${left.name}</div>
                        ${card._config.show_location ? `<div class="location">${left.personState}</div>` : ``}
                      </div>
                      <div class="mode-badge" style="background:${left.color}; box-shadow: 0 0 12px ${left.color};"></div>
                    </div>

                    <div class="big">${left.targetTemp}</div>
                    <div class="mode">${left.modeLabel}</div>

                    <div class="meta">
                      <div class="meta-item">Occupied<strong>${left.occupied ? "Yes" : "No"}</strong></div>

                      ${card._config.show_sleep_stage
          ? `<div class="meta-item">Stage<strong>${left.sleepStage}</strong></div>`
          : ``}

                      ${card._config.show_time_slept
          ? `<div class="meta-item">Slept<strong>${left.timeSlept}</strong></div>`
          : ``}

                      ${card._config.show_heart_rate
          ? `<div class="meta-item">Heart Rate<strong>${left.heartRate}</strong></div>`
          : ``}

                      ${card._config.show_breath_rate
          ? `<div class="meta-item">Breath Rate<strong>${left.breathRate}</strong></div>`
          : ``}

                      ${card._config.show_hrv
          ? `<div class="meta-item">HRV<strong>${left.hrv}</strong></div>`
          : ``}

                      ${card._config.show_bed_temp
          ? `<div class="meta-item">Bed Temp<strong>${left.bedTemp}</strong></div>`
          : ``}

                      ${card._config.show_scores
          ? `<div class="meta-item">Fitness<strong>${left.fitnessScore}</strong></div>`
          : ``}

                      ${card._config.show_scores
          ? `<div class="meta-item">Quality<strong>${left.qualityScore}</strong></div>`
          : ``}

                      ${card._config.show_scores
          ? `<div class="meta-item">Routine<strong>${left.routineScore}</strong></div>`
          : ``}

                      ${card._config.show_next_alarm
          ? `<div class="meta-item">Alarm<strong>${left.nextAlarm}</strong></div>`
          : ``}

                      ${card._config.show_presence_times
          ? `<div class="meta-item">In Bed<strong>${left.presenceStart}</strong></div>`
          : ``}

                      ${card._config.show_presence_times
          ? `<div class="meta-item">Out of Bed<strong>${left.presenceEnd}</strong></div>`
          : ``}
                    </div>
                  </div>

                  <div class="panel">
                    <div class="panel-head">
                      <div class="name-wrap">
                        <div class="name">${right.name}</div>
                        ${card._config.show_location ? `<div class="location">${right.personState}</div>` : ``}
                      </div>
                      <div class="mode-badge" style="background:${right.color}; box-shadow: 0 0 12px ${right.color};"></div>
                    </div>

                    <div class="big">${right.targetTemp}</div>
                    <div class="mode">${right.modeLabel}</div>

                    <div class="meta">
                      <div class="meta-item">Occupied<strong>${right.occupied ? "Yes" : "No"}</strong></div>

                      ${card._config.show_sleep_stage
          ? `<div class="meta-item">Stage<strong>${right.sleepStage}</strong></div>`
          : ``}

                      ${card._config.show_time_slept
          ? `<div class="meta-item">Slept<strong>${right.timeSlept}</strong></div>`
          : ``}

                      ${card._config.show_heart_rate
          ? `<div class="meta-item">Heart Rate<strong>${right.heartRate}</strong></div>`
          : ``}

                      ${card._config.show_breath_rate
          ? `<div class="meta-item">Breath Rate<strong>${right.breathRate}</strong></div>`
          : ``}

                      ${card._config.show_hrv
          ? `<div class="meta-item">HRV<strong>${right.hrv}</strong></div>`
          : ``}

                      ${card._config.show_bed_temp
          ? `<div class="meta-item">Bed Temp<strong>${right.bedTemp}</strong></div>`
          : ``}

                      ${card._config.show_scores
          ? `<div class="meta-item">Fitness<strong>${right.fitnessScore}</strong></div>`
          : ``}

                      ${card._config.show_scores
          ? `<div class="meta-item">Quality<strong>${right.qualityScore}</strong></div>`
          : ``}

                      ${card._config.show_scores
          ? `<div class="meta-item">Routine<strong>${right.routineScore}</strong></div>`
          : ``}

                      ${card._config.show_next_alarm
          ? `<div class="meta-item">Alarm<strong>${right.nextAlarm}</strong></div>`
          : ``}

                      ${card._config.show_presence_times
          ? `<div class="meta-item">In Bed<strong>${right.presenceStart}</strong></div>`
          : ``}

                      ${card._config.show_presence_times
          ? `<div class="meta-item">Out of Bed<strong>${right.presenceEnd}</strong></div>`
          : ``}
                    </div>
                  </div>
                </div>
              `;
}

function renderEightSleepExpandedOverlay(card, left, right, expandedLeft, expandedRight, expandedHub) {
  if (!card._expanded) return ``;
  return `
              <div class="overlay" id="overlay">
                <div class="overlay-card">
                  <div class="overlay-header">
                    <div class="overlay-title">${card._config.title}</div>
                    <button class="close-button" title="Close">âœ•</button>
                  </div>

                  <div class="expanded-layout">
                    <div class="expanded-section">
                      <div class="expanded-title">${left.name}</div>
                      <div class="expanded-grid">${expandedLeft}</div>
                    </div>

                    <div class="expanded-section">
                      <div class="expanded-title">${right.name}</div>
                      <div class="expanded-grid">${expandedRight}</div>
                    </div>

                    <div class="expanded-section">
                      <div class="expanded-title">Bed / Hub</div>
                      <div class="expanded-grid">${expandedHub}</div>
                    </div>
                  </div>
                </div>
              </div>
            `;
}

class EightSleepCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("eight-sleep-card-editor");
  }

  static getStubConfig() {
    return createEightSleepConfig();
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._expanded = false;
    this._lastRenderKey = "";
  }

  setConfig(config) {
    this._config = createEightSleepConfig(config);
    this._forceRender();
  }

  set hass(hass) {
    this._hass = hass;
    this._renderIfChanged();
  }

  getCardSize() {
    return this._config?.show_compact_panels === false ? 4 : 6;
  }

  _forceRender() {
    this._lastRenderKey = "";
    this._renderIfChanged();
  }

  _renderIfChanged() {
    if (!this._config || !this._hass) return;
    const key = this._computeRenderKey();
    if (key === this._lastRenderKey) return;
    this._lastRenderKey = key;
    this._render();
  }

  _computeRenderKey() {
    const ids = [
      this._config.left?.person_entity,
      this._config.left?.presence_entity,
      this._config.left?.bed_state_entity,
      this._config.left?.bed_state_type_entity,
      this._config.left?.target_temp_entity,
      this._config.left?.bed_temp_entity,
      this._config.left?.sleep_stage_entity,
      this._config.left?.heart_rate_entity,
      this._config.left?.breath_rate_entity,
      this._config.left?.hrv_entity,
      this._config.left?.time_slept_entity,
      this._config.left?.sleep_fitness_score_entity,
      this._config.left?.sleep_quality_score_entity,
      this._config.left?.routine_score_entity,
      this._config.left?.next_alarm_entity,
      this._config.left?.presence_start_entity,
      this._config.left?.presence_end_entity,

      this._config.right?.person_entity,
      this._config.right?.presence_entity,
      this._config.right?.bed_state_entity,
      this._config.right?.bed_state_type_entity,
      this._config.right?.target_temp_entity,
      this._config.right?.bed_temp_entity,
      this._config.right?.sleep_stage_entity,
      this._config.right?.heart_rate_entity,
      this._config.right?.breath_rate_entity,
      this._config.right?.hrv_entity,
      this._config.right?.time_slept_entity,
      this._config.right?.sleep_fitness_score_entity,
      this._config.right?.sleep_quality_score_entity,
      this._config.right?.routine_score_entity,
      this._config.right?.next_alarm_entity,
      this._config.right?.presence_start_entity,
      this._config.right?.presence_end_entity,

      this._config.hub?.room_temp_entity,
      this._config.hub?.has_water_entity,
      this._config.hub?.is_priming_entity,
      this._config.hub?.needs_priming_entity,
      this._config.hub?.last_prime_entity,
      this._config.power_entity,
    ].filter(Boolean);

    const stateBits = ids.map((id) => {
      const ent = this._hass?.states?.[id];
      return [
        id,
        ent?.state ?? "",
        JSON.stringify(ent?.attributes?.entity_picture ?? ""),
        JSON.stringify(ent?.attributes?.friendly_name ?? ""),
      ].join("|");
    });

    return JSON.stringify({
      cfg: this._config,
      expanded: this._expanded,
      states: stateBits,
    });
  }

  _entity(entityId) {
    if (!entityId || !this._hass?.states) return null;
    return this._hass.states[entityId] || null;
  }

  _state(entityId, fallback = null) {
    const ent = this._entity(entityId);
    return ent ? ent.state : fallback;
  }

  _safeText(value, fallback = "—") {
    return toEightSleepText(value, fallback);
  }

  _formatTemp(value) {
    if (isEightSleepMissingValue(value)) {
      return "—";
    }
    return `${value}°`;
  }

  _formatStage(value) {
    const raw = this._safeText(value, "—");
    if (raw === "—") return raw;
    return raw
      .replace(/_/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  _presenceOn(value) {
    if (value === null || value === undefined) return false;
    return ["on", "true", "home", "occupied", "present", "yes"].includes(
      String(value).toLowerCase()
    );
  }

  _modeColor(stateType) {
    switch (stateType) {
      case "off":
        return "#6b7280";
      case "smart:bedtime":
        return "#38bdf8";
      case "smart:initial":
        return "#8b5cf6";
      case "smart:final":
        return "#f59e0b";
      case "error":
      case "unavailable":
      case "offline":
        return "#ef4444";
      default:
        return "#8b949e";
    }
  }

  _modeLabel(stateType) {
    switch (stateType) {
      case "off":
        return "Off";
      case "smart:bedtime":
        return "Bedtime";
      case "smart:initial":
        return "Initial";
      case "smart:final":
        return "Final";
      case "error":
        return "Error";
      case "offline":
        return "Offline";
      case "unavailable":
        return "Unavailable";
      default:
        return this._safeText(stateType, "Unknown");
    }
  }

  _initials(name) {
    const safe = this._safeText(name, "");
    if (!safe) return "?";
    return (
      safe
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "?"
    );
  }

  _formatDuration(value) {
    const raw = Number(value);
    if (!Number.isFinite(raw)) return this._safeText(value, "—");
    const total = Math.max(0, Math.floor(raw));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  _formatDateish(value) {
    const raw = this._safeText(value, "—");
    if (raw === "—") return raw;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return raw;
    return d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  _statusInfo() {
    const hasWater = this._presenceOn(this._state(this._config.hub?.has_water_entity, null));
    const isPriming = this._presenceOn(this._state(this._config.hub?.is_priming_entity, null));
    const needsPriming = this._presenceOn(this._state(this._config.hub?.needs_priming_entity, null));

    if (needsPriming) {
      return { label: "Needs Priming", color: "#f59e0b" };
    }

    if (isPriming) {
      return { label: "Priming", color: "#8b5cf6" };
    }

    if (hasWater) {
      return { label: "Online", color: "#22c55e" };
    }

    return { label: "Offline", color: "#6b7280" };
  }

  _buildSide(sideConfig) {
    const personEntity = this._entity(sideConfig.person_entity);
    const personName =
      sideConfig.name ||
      personEntity?.attributes?.friendly_name ||
      "Side";

    const personPicture = personEntity?.attributes?.entity_picture || "";
    const personState = personEntity?.state || "—";

    const bedStateType = this._state(sideConfig.bed_state_type_entity, "unknown");
    const occupied = this._presenceOn(this._state(sideConfig.presence_entity, "off"));
    const targetTemp = this._state(sideConfig.target_temp_entity, null);
    const bedTemp = this._state(sideConfig.bed_temp_entity, null);
    const sleepStage = this._state(sideConfig.sleep_stage_entity, null);
    const heartRate = this._state(sideConfig.heart_rate_entity, null);
    const breathRate = this._state(sideConfig.breath_rate_entity, null);
    const hrv = this._state(sideConfig.hrv_entity, null);
    const timeSlept = this._state(sideConfig.time_slept_entity, null);
    const fitnessScore = this._state(sideConfig.sleep_fitness_score_entity, null);
    const qualityScore = this._state(sideConfig.sleep_quality_score_entity, null);
    const routineScore = this._state(sideConfig.routine_score_entity, null);
    const nextAlarm = this._state(sideConfig.next_alarm_entity, null);
    const presenceStart = this._state(sideConfig.presence_start_entity, null);
    const presenceEnd = this._state(sideConfig.presence_end_entity, null);

    const color = this._modeColor(bedStateType);

    return {
      name: personName,
      personPicture,
      initials: this._initials(personName),
      personState: this._safeText(personState, "—"),
      occupied,
      color,
      modeLabel: this._modeLabel(bedStateType),
      targetTemp: this._formatTemp(targetTemp),
      bedTemp: this._formatTemp(bedTemp),
      sleepStage: this._formatStage(sleepStage),
      heartRate: this._safeText(heartRate, "—"),
      breathRate: this._safeText(breathRate, "—"),
      hrv: this._safeText(hrv, "—"),
      timeSlept: this._formatDuration(timeSlept),
      fitnessScore: this._safeText(fitnessScore, "—"),
      qualityScore: this._safeText(qualityScore, "—"),
      routineScore: this._safeText(routineScore, "—"),
      nextAlarm: this._formatDateish(nextAlarm),
      presenceStart: this._formatDateish(presenceStart),
      presenceEnd: this._formatDateish(presenceEnd),
    };
  }

  _renderAvatar(side, x, y) {
    const mode = this._config.avatar_mode || "auto";
    if (mode === "hidden") return "";

    const usePhoto = mode === "photo" || (mode === "auto" && !!side.personPicture);
    const borderGlow = side.occupied ? side.color : "rgba(255,255,255,0.12)";
    const inner = usePhoto
      ? `<img src="${side.personPicture}" style="width:100%;height:100%;object-fit:cover;" />`
      : `<span>${side.initials}</span>`;

    return `
      <foreignObject x="${x}" y="${y}" width="54" height="54">
        <div xmlns="http://www.w3.org/1999/xhtml"
             style="
               width:48px;
               height:48px;
               border-radius:50%;
               overflow:hidden;
               border:2px solid ${side.color};
               box-shadow:
                 0 0 0 2px rgba(0,0,0,0.35),
                 0 0 12px ${borderGlow};
               background:#111;
               display:flex;
               align-items:center;
               justify-content:center;
               color:white;
               font:700 13px system-ui,sans-serif;
             ">
          ${inner}
        </div>
      </foreignObject>
    `;
  }

  _metric(label, value, icon = "") {
    return `
      <div class="metric">
        <div class="metric-label">${icon ? `${icon} ` : ""}${label}</div>
        <div class="metric-value">${value}</div>
      </div>
    `;
  }

  async _handlePowerClick(ev) {
    ev.stopPropagation();
    const entityId = this._config.power_entity;
    if (!entityId || !this._hass?.callService) return;

    const [domain] = entityId.split(".");
    try {
      if (domain === "script") {
        await this._hass.callService("script", "turn_on", { entity_id: entityId });
      } else if (domain === "button") {
        await this._hass.callService("button", "press", { entity_id: entityId });
      } else if (domain === "switch") {
        await this._hass.callService("switch", "toggle", { entity_id: entityId });
      } else if (domain === "input_boolean") {
        await this._hass.callService("input_boolean", "toggle", { entity_id: entityId });
      } else {
        await this._hass.callService("homeassistant", "toggle", { entity_id: entityId });
      }
    } catch (err) {
      console.error("Eight Sleep card power action failed", err);
    }
  }

  _toggleExpanded(ev) {
    if (!this._config.tap_action_expand) return;
    if (ev?.target?.closest?.(".power-button")) return;
    if (ev?.target?.closest?.(".close-button")) return;
    this._expanded = !this._expanded;
    this._forceRender();
  }

  _closeExpanded(ev) {
    ev?.stopPropagation?.();
    this._expanded = false;
    this._forceRender();
  }

  _render() {
    if (!this._config || !this._hass) return;

    const left = this._buildSide(this._config.left);
    const right = this._buildSide(this._config.right);

    const status = this._statusInfo();
    const roomTemp = this._formatTemp(this._state(this._config.hub?.room_temp_entity, null));
    const hasWater = this._presenceOn(this._state(this._config.hub?.has_water_entity, null));
    const isPriming = this._presenceOn(this._state(this._config.hub?.is_priming_entity, null));
    const needsPriming = this._presenceOn(this._state(this._config.hub?.needs_priming_entity, null));
    const lastPrime = this._formatDateish(this._state(this._config.hub?.last_prime_entity, null));

    const showRoomTemp = this._config.show_room_temp && this._config.hub?.room_temp_entity;
    const showPower = !!this._config.power_entity;

    const expandedLeft = [
      this._metric("Target Temperature", left.targetTemp, "🎯"),
      this._metric("Bed Temperature", left.bedTemp, "🛏️"),
      this._metric("Sleep Stage", left.sleepStage, "🌙"),
      this._metric("Time Slept", left.timeSlept, "⏱️"),
      this._metric("Heart Rate", left.heartRate, "❤️"),
      this._metric("Breath Rate", left.breathRate, "🫁"),
      this._metric("HRV", left.hrv, "📈"),
      this._metric("Fitness Score", left.fitnessScore, "💪"),
      this._metric("Quality Score", left.qualityScore, "⭐"),
      this._metric("Routine Score", left.routineScore, "🗓️"),
      this._metric("Next Alarm", left.nextAlarm, "⏰"),
      this._metric("Presence Start", left.presenceStart, "➡️"),
      this._metric("Presence End", left.presenceEnd, "⬅️"),
      this._metric("Location", left.personState, "📍"),
      this._metric("Occupied", left.occupied ? "Yes" : "No", "🧍"),
      this._metric("Mode", left.modeLabel, "🔆"),
    ].join("");

    const expandedRight = [
      this._metric("Target Temperature", right.targetTemp, "🎯"),
      this._metric("Bed Temperature", right.bedTemp, "🛏️"),
      this._metric("Sleep Stage", right.sleepStage, "🌙"),
      this._metric("Time Slept", right.timeSlept, "⏱️"),
      this._metric("Heart Rate", right.heartRate, "❤️"),
      this._metric("Breath Rate", right.breathRate, "🫁"),
      this._metric("HRV", right.hrv, "📈"),
      this._metric("Fitness Score", right.fitnessScore, "💪"),
      this._metric("Quality Score", right.qualityScore, "⭐"),
      this._metric("Routine Score", right.routineScore, "🗓️"),
      this._metric("Next Alarm", right.nextAlarm, "⏰"),
      this._metric("Presence Start", right.presenceStart, "➡️"),
      this._metric("Presence End", right.presenceEnd, "⬅️"),
      this._metric("Location", right.personState, "📍"),
      this._metric("Occupied", right.occupied ? "Yes" : "No", "🧍"),
      this._metric("Mode", right.modeLabel, "🔆"),
    ].join("");

    const expandedHub = [
      this._metric("Bed Status", status.label, "🟢"),
      this._metric("Room Temperature", roomTemp, "🌡️"),
      this._metric("Has Water", hasWater ? "Yes" : "No", "💧"),
      this._metric("Is Priming", isPriming ? "Yes" : "No", "🔄"),
      this._metric("Needs Priming", needsPriming ? "Yes" : "No", "⚠️"),
      this._metric("Last Prime", lastPrime, "🕒"),
    ].join("");

    this.shadowRoot.innerHTML = `
      ${getEightSleepCardStyles(this._config.tap_action_expand)}
      <ha-card class="clickable">
        <div class="wrap" id="main-wrap">
          <div class="header">
            <div class="title-wrap">
              <div class="title">${this._config.title}</div>
              ${showRoomTemp ? `<div class="room-temp">Room ${roomTemp}</div>` : ``}
            </div>

            <div class="header-actions">
              ${this._config.show_hub_status
        ? `
                    <div class="status-pill">
                      <span class="status-dot" style="background:${status.color}; box-shadow: 0 0 12px ${status.color};"></span>
                      <span>${status.label}</span>
                    </div>
                  `
        : ``
      }

              ${showPower
        ? `<button class="power-button" title="Power">⏻</button>`
        : ``
      }
            </div>
          </div>

          ${renderEightSleepBedGraphic(this, left, right)}

          ${renderEightSleepCompactPanels(this, left, right)}
        </div>

        ${renderEightSleepExpandedOverlay(this, left, right, expandedLeft, expandedRight, expandedHub)}
      </ha-card>
    `;

    const powerButton = this.shadowRoot.querySelector(".power-button");
    if (powerButton) {
      powerButton.addEventListener("click", this._handlePowerClick.bind(this));
    }

    const wrap = this.shadowRoot.querySelector("#main-wrap");
    if (wrap && this._config.tap_action_expand) {
      wrap.addEventListener("click", this._toggleExpanded.bind(this));
    }

    const overlay = this.shadowRoot.querySelector("#overlay");
    if (overlay) {
      overlay.addEventListener("click", this._closeExpanded.bind(this));
    }

    const closeButton = this.shadowRoot.querySelector(".close-button");
    if (closeButton) {
      closeButton.addEventListener("click", this._closeExpanded.bind(this));
    }
  }
}

class EightSleepCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._deviceRegistry = [];
    this._entityRegistry = [];
    this._loading = false;
    this._loaded = false;
  }

  setConfig(config) {
    this._config = createEightSleepConfig(config);
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._loadRegistries();
    this._render();
  }

  async _loadRegistries() {
    if (!this._hass?.callWS || this._loading || this._loaded) return;

    this._loading = true;
    this._render();

    try {
      const [devices, entities] = await Promise.all([
        this._hass.callWS({ type: "config/device_registry/list" }),
        this._hass.callWS({ type: "config/entity_registry/list" }),
      ]);
      this._deviceRegistry = Array.isArray(devices) ? devices : [];
      this._entityRegistry = Array.isArray(entities) ? entities : [];
      this._loaded = true;
    } catch (err) {
      console.error("Eight Sleep card editor: failed to load registries", err);
    } finally {
      this._loading = false;
      this._render();
    }
  }

  _cloneConfig() {
    return structuredClone(this._config || {});
  }

  _emitConfigChanged() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  _valueAt(path) {
    const parts = path.split(".");
    let value = this._config;
    for (const part of parts) {
      if (value == null) return "";
      value = value[part];
    }
    return value ?? "";
  }

  _updateConfig(path, value) {
    const next = this._cloneConfig();
    const parts = path.split(".");
    let obj = next;

    while (parts.length > 1) {
      const key = parts.shift();
      if (!obj[key] || typeof obj[key] !== "object") {
        obj[key] = {};
      }
      obj = obj[key];
    }

    obj[parts[0]] = value;
    this._config = next;
    this._emitConfigChanged();
    this._render();
  }

  _slug(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_");
  }

  _deviceName(deviceId) {
    const dev = this._deviceRegistry.find((d) => d.id === deviceId);
    return dev?.name_by_user || dev?.name || dev?.manufacturer || "";
  }

  _entitiesForDevice(deviceId) {
    if (!deviceId) return [];
    return this._entityRegistry
      .filter((entry) => entry.device_id === deviceId && !entry.disabled_by)
      .map((entry) => entry.entity_id);
  }

  _findMatch(entityIds, groups) {
    const normalized = entityIds.map((id) => ({
      id,
      slug: this._slug(id),
    }));

    for (const group of groups) {
      const found = normalized.find((item) =>
        group.every((needle) => item.slug.includes(this._slug(needle)))
      );
      if (found) return found.id;
    }
    return "";
  }

  _discoverSide(deviceId, existing = {}) {
    const entityIds = this._entitiesForDevice(deviceId);

    return {
      ...existing,
      presence_entity:
        existing.presence_entity ||
        this._findMatch(entityIds, [["bed", "presence"], ["presence"]]),
      bed_state_entity:
        existing.bed_state_entity ||
        this._findMatch(entityIds, [["bed", "state"]]),
      bed_state_type_entity:
        existing.bed_state_type_entity ||
        this._findMatch(entityIds, [["bed", "state", "type"], ["state", "type"]]),
      target_temp_entity:
        existing.target_temp_entity ||
        this._findMatch(entityIds, [["target", "temperature"], ["target", "temp"]]),
      bed_temp_entity:
        existing.bed_temp_entity ||
        this._findMatch(entityIds, [["bed", "temperature"], ["bed", "temp"]]),
      sleep_stage_entity:
        existing.sleep_stage_entity ||
        this._findMatch(entityIds, [["sleep", "stage"], ["stage"]]),
      heart_rate_entity:
        existing.heart_rate_entity ||
        this._findMatch(entityIds, [["heart", "rate"], ["heartrate"]]),
      breath_rate_entity:
        existing.breath_rate_entity ||
        this._findMatch(entityIds, [["breath", "rate"], ["breathrate"]]),
      hrv_entity:
        existing.hrv_entity ||
        this._findMatch(entityIds, [["hrv"]]),
      time_slept_entity:
        existing.time_slept_entity ||
        this._findMatch(entityIds, [["time", "slept"], ["slept"]]),
      sleep_fitness_score_entity:
        existing.sleep_fitness_score_entity ||
        this._findMatch(entityIds, [["sleep", "fitness", "score"], ["fitness", "score"]]),
      sleep_quality_score_entity:
        existing.sleep_quality_score_entity ||
        this._findMatch(entityIds, [["sleep", "quality", "score"], ["quality", "score"]]),
      routine_score_entity:
        existing.routine_score_entity ||
        this._findMatch(entityIds, [["routine", "score"]]),
      next_alarm_entity:
        existing.next_alarm_entity ||
        this._findMatch(entityIds, [["next", "alarm"], ["alarm"]]),
      presence_start_entity:
        existing.presence_start_entity ||
        this._findMatch(entityIds, [["presence", "start"]]),
      presence_end_entity:
        existing.presence_end_entity ||
        this._findMatch(entityIds, [["presence", "end"]]),
      side_entity:
        existing.side_entity ||
        this._findMatch(entityIds, [["side"]]),
    };
  }

  _discoverHub(deviceId, existing = {}) {
    const entityIds = this._entitiesForDevice(deviceId);

    return {
      ...existing,
      has_water_entity:
        existing.has_water_entity ||
        this._findMatch(entityIds, [["has", "water"], ["water"]]),
      is_priming_entity:
        existing.is_priming_entity ||
        this._findMatch(entityIds, [["is", "priming"], ["priming"]]),
      needs_priming_entity:
        existing.needs_priming_entity ||
        this._findMatch(entityIds, [["needs", "priming"], ["needs", "prime"]]),
      last_prime_entity:
        existing.last_prime_entity ||
        this._findMatch(entityIds, [["last", "prime"]]),
      room_temp_entity:
        existing.room_temp_entity ||
        this._findMatch(entityIds, [["room", "temperature"], ["room", "temp"]]),
    };
  }

  _applySideDevice(sideKey, deviceId) {
    const next = this._cloneConfig();
    next[sideKey] = {
      ...(next[sideKey] || {}),
      device_id: deviceId,
    };

    const currentName = next[sideKey].name;
    if (!currentName || currentName === "Left" || currentName === "Right") {
      const deviceName = this._deviceName(deviceId);
      if (deviceName) {
        next[sideKey].name = deviceName;
      }
    }

    next[sideKey] = this._discoverSide(deviceId, next[sideKey]);
    this._config = next;
    this._emitConfigChanged();
    this._render();
  }

  _applyHubDevice(deviceId) {
    const next = this._cloneConfig();
    next.hub = {
      ...(next.hub || {}),
      device_id: deviceId,
    };
    next.hub = this._discoverHub(deviceId, next.hub);
    this._config = next;
    this._emitConfigChanged();
    this._render();
  }

  _escapeAttr(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  _textField(label, path, value = "") {
    return `
      <label class="field">
        <span class="label">${label}</span>
        <input class="text-input" type="text" data-path="${path}" value="${this._escapeAttr(value)}" />
      </label>
    `;
  }

  _toggle(label, path, checked) {
    return `
      <label class="toggle-row">
        <span class="label">${label}</span>
        <input type="checkbox" data-path="${path}" ${checked ? "checked" : ""} />
      </label>
    `;
  }

  _selector(label, path, kind) {
    return `
      <div class="field">
        <span class="label">${label}</span>
        <ha-selector data-path="${path}" data-kind="${kind}"></ha-selector>
      </div>
    `;
  }

  _section(title, body) {
    return `
      <div class="section">
        <div class="section-title">${title}</div>
        <div class="grid">${body}</div>
      </div>
    `;
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .wrap {
          display: grid;
          gap: 16px;
          padding: 12px 0;
          font-family: system-ui, sans-serif;
        }

        .section {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 14px;
          background: rgba(255,255,255,0.02);
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--primary-text-color);
        }

        .grid {
          display: grid;
          gap: 12px;
        }

        .field {
          display: grid;
          gap: 6px;
        }

        .label {
          font-size: 12px;
          color: var(--secondary-text-color);
        }

        .text-input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          color: var(--primary-text-color);
          font: inherit;
          outline: none;
        }

        .text-input:focus {
          border-color: var(--primary-color);
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 4px 0;
        }

        .hint {
          font-size: 11px;
          color: var(--secondary-text-color);
          opacity: 0.85;
          line-height: 1.35;
        }

        .loading {
          font-size: 12px;
          color: var(--secondary-text-color);
        }
      </style>

      <div class="wrap">
        ${this._section(
      "General",
      `
            ${this._textField("Title", "title", this._valueAt("title"))}
            ${this._selector("Avatar mode", "avatar_mode", "avatar_mode")}
            ${this._selector("Power entity", "power_entity", "entity")}
            ${this._toggle("Tap card to expand", "tap_action_expand", !!this._valueAt("tap_action_expand"))}
            ${this._toggle("Show bed graphic", "show_bed_graphic", !!this._valueAt("show_bed_graphic"))}
            ${this._toggle("Show compact panels", "show_compact_panels", !!this._valueAt("show_compact_panels"))}
            ${this._toggle("Show occupancy wash", "show_occupancy_wash", !!this._valueAt("show_occupancy_wash"))}
          `
    )}

        ${this._section(
      "Top / Hub Data",
      `
            ${this._toggle("Show room temperature", "show_room_temp", !!this._valueAt("show_room_temp"))}
            ${this._toggle("Show bed status", "show_hub_status", !!this._valueAt("show_hub_status"))}
            ${this._toggle("Show has water", "show_has_water", !!this._valueAt("show_has_water"))}
            ${this._toggle("Show needs priming", "show_needs_priming", !!this._valueAt("show_needs_priming"))}
            ${this._toggle("Show is priming", "show_is_priming", !!this._valueAt("show_is_priming"))}
            ${this._toggle("Show last prime", "show_last_prime", !!this._valueAt("show_last_prime"))}
          `
    )}

        ${this._section(
      "Person / Side Metrics",
      `
            ${this._toggle("Show target temperature", "show_target_temp", !!this._valueAt("show_target_temp"))}
            ${this._toggle("Show bed temperature", "show_bed_temp", !!this._valueAt("show_bed_temp"))}
            ${this._toggle("Show sleep stage", "show_sleep_stage", !!this._valueAt("show_sleep_stage"))}
            ${this._toggle("Show time slept", "show_time_slept", !!this._valueAt("show_time_slept"))}
            ${this._toggle("Show heart rate", "show_heart_rate", !!this._valueAt("show_heart_rate"))}
            ${this._toggle("Show breath rate", "show_breath_rate", !!this._valueAt("show_breath_rate"))}
            ${this._toggle("Show HRV", "show_hrv", !!this._valueAt("show_hrv"))}
            ${this._toggle("Show sleep scores", "show_scores", !!this._valueAt("show_scores"))}
            ${this._toggle("Show next alarm", "show_next_alarm", !!this._valueAt("show_next_alarm"))}
            ${this._toggle("Show presence times", "show_presence_times", !!this._valueAt("show_presence_times"))}
            ${this._toggle("Show person location", "show_location", !!this._valueAt("show_location"))}
          `
    )}

        ${this._section(
      "Left Side",
      `
            ${this._textField("Display name", "left.name", this._valueAt("left.name"))}
            ${this._selector("Left device", "left.device_id", "device")}
            ${this._selector("Left person", "left.person_entity", "person")}
            <div class="hint">Selecting a device auto-fills the matching Eight Sleep entities for this side.</div>
          `
    )}

        ${this._section(
      "Right Side",
      `
            ${this._textField("Display name", "right.name", this._valueAt("right.name"))}
            ${this._selector("Right device", "right.device_id", "device")}
            ${this._selector("Right person", "right.person_entity", "person")}
            <div class="hint">Selecting a device auto-fills the matching Eight Sleep entities for this side.</div>
          `
    )}

        ${this._section(
      "Whole Bed / Hub",
      `
            ${this._selector("Hub device", "hub.device_id", "device")}
            <div class="hint">Selecting the hub device auto-fills room temp, water, and priming sensors when found.</div>
          `
    )}

        ${this._loading ? `<div class="loading">Loading device registry…</div>` : ``}
      </div>
    `;

    this.shadowRoot.querySelectorAll(".text-input").forEach((input) => {
      input.addEventListener("input", (ev) => {
        this._updateConfig(ev.target.dataset.path, ev.target.value);
      });
    });

    this.shadowRoot.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.addEventListener("change", (ev) => {
        this._updateConfig(ev.target.dataset.path, ev.target.checked);
      });
    });

    this.shadowRoot.querySelectorAll("ha-selector").forEach((selectorEl) => {
      const path = selectorEl.dataset.path;
      const kind = selectorEl.dataset.kind;

      selectorEl.hass = this._hass;

      if (kind === "device") {
        selectorEl.selector = { device: {} };
      } else if (kind === "person") {
        selectorEl.selector = { entity: { domain: "person" } };
      } else if (kind === "entity") {
        selectorEl.selector = { entity: {} };
      } else if (kind === "avatar_mode") {
        selectorEl.selector = {
          select: {
            options: [
              { value: "auto", label: "Auto" },
              { value: "photo", label: "Photo" },
              { value: "initials", label: "Initials" },
              { value: "hidden", label: "Hidden" },
            ],
            mode: "dropdown",
          },
        };
      }

      selectorEl.value = this._valueAt(path);

      selectorEl.addEventListener("value-changed", (ev) => {
        const value = ev.detail?.value ?? "";
        if (path === "left.device_id") {
          this._applySideDevice("left", value);
        } else if (path === "right.device_id") {
          this._applySideDevice("right", value);
        } else if (path === "hub.device_id") {
          this._applyHubDevice(value);
        } else {
          this._updateConfig(path, value);
        }
      });
    });
  }
}

customElements.define("eight-sleep-card", EightSleepCard);
customElements.define("eight-sleep-card-editor", EightSleepCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "eight-sleep-card",
  name: "Eight Sleep Card",
  description: "A dual-side Eight Sleep card with a visual editor and device-based setup",
  preview: true,
});
