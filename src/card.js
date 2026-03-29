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
    this._singleSleeperMode = false;
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
      this._config.left?.side_entity,

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
      this._config.right?.side_entity,

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
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return `${Math.round(parsed * 10) / 10}°`;
    }
    return `${value}°`;
  }

  _formatRoomTemp(value) {
    if (isEightSleepMissingValue(value)) {
      return "—";
    }
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return `${Math.round(parsed)}°`;
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

    if (!hasWater) {
      return { label: "Needs Water", color: "#ef4444" };
    }

    return { label: "Ready", color: "#22c55e" };
  }

  _normalizeSideType(value) {
    const raw = String(value || "").toLowerCase();
    if (raw.includes("both")) return "both";
    if (raw.includes("left")) return "left";
    if (raw.includes("right")) return "right";
    return "";
  }

  _sideHasData(side) {
    return [
      side.targetTemp,
      side.bedTemp,
      side.sleepStage,
      side.heartRate,
      side.breathRate,
      side.hrv,
      side.timeSlept,
      side.fitnessScore,
      side.qualityScore,
      side.routineScore,
      side.nextAlarm,
      side.presenceStart,
      side.presenceEnd,
    ].some((value) => value && value !== "—");
  }

  _cloneSideForBoth(source) {
    return {
      ...source,
      name: "Both Sides",
      sideType: "both",
    };
  }

  _resolveSides(left, right) {
    const manualSingleSleeper = !!this._config.one_person_both_sides;
    const leftIsBoth = left.sideType === "both";
    const rightIsBoth = right.sideType === "both";
    const leftHasData = this._sideHasData(left);
    const rightHasData = this._sideHasData(right);

    let source = null;
    if (leftIsBoth) {
      source = left;
    } else if (rightIsBoth) {
      source = right;
    } else if (manualSingleSleeper && leftHasData && !rightHasData) {
      source = left;
    } else if (manualSingleSleeper && rightHasData && !leftHasData) {
      source = right;
    } else if (manualSingleSleeper && leftHasData) {
      source = left;
    } else if (manualSingleSleeper && rightHasData) {
      source = right;
    }

    if (!source) {
      this._singleSleeperMode = false;
      return { left, right };
    }

    const both = this._cloneSideForBoth(source);
    this._singleSleeperMode = true;
    return { left: both, right: both };
  }

  _buildSide(sideConfig) {
    const personEntity = this._entity(sideConfig.person_entity);
    const personName =
      sideConfig.name ||
      personEntity?.attributes?.friendly_name ||
      "Side";

    const personPicture = personEntity?.attributes?.entity_picture || "";
    const sideType = this._normalizeSideType(this._state(sideConfig.side_entity, ""));

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
      sideType,
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

    const rawLeft = this._buildSide(this._config.left);
    const rawRight = this._buildSide(this._config.right);
    const { left, right } = this._resolveSides(rawLeft, rawRight);

    const status = this._statusInfo();
    const roomTemp = this._formatRoomTemp(this._state(this._config.hub?.room_temp_entity, null));
    const hasWater = this._presenceOn(this._state(this._config.hub?.has_water_entity, null));
    const isPriming = this._presenceOn(this._state(this._config.hub?.is_priming_entity, null));
    const needsPriming = this._presenceOn(this._state(this._config.hub?.needs_priming_entity, null));
    const lastPrime = this._formatDateish(this._state(this._config.hub?.last_prime_entity, null));

    const showRoomTemp = this._config.show_room_temp && this._config.hub?.room_temp_entity;
    const showPower = !!this._config.power_entity;

    const hub = {
      status,
      roomTemp,
      hasWater,
      isPriming,
      needsPriming,
      lastPrime,
    };

    this.shadowRoot.innerHTML = `
      ${getEightSleepCardStyles(this._config.tap_action_expand, this._config.use_theme_colors)}
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

          ${renderEightSleepCompactPanels(this, left, right, hub)}
        </div>

        ${renderEightSleepExpandedOverlay(this, left, right, hub)}
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




