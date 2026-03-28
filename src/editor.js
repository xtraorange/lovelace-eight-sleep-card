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
        this._findMatch(entityIds, [["bed", "presence"], ["bed_presence"], ["presence"]]),
      bed_state_entity:
        existing.bed_state_entity ||
        this._findMatch(entityIds, [["bed", "state"], ["bed_state"]]),
      bed_state_type_entity:
        existing.bed_state_type_entity ||
        this._findMatch(entityIds, [["bed", "state", "type"], ["bed_state_type"], ["state", "type"]]),
      target_temp_entity:
        existing.target_temp_entity ||
        this._findMatch(entityIds, [
          ["target", "heating", "temp"],
          ["target", "heating", "temperature"],
          ["target", "temperature"],
          ["target", "temp"],
        ]),
      bed_temp_entity:
        existing.bed_temp_entity ||
        this._findMatch(entityIds, [["bed", "temperature"], ["bed", "temp"], ["current", "bed", "temp"]]),
      sleep_stage_entity:
        existing.sleep_stage_entity ||
        this._findMatch(entityIds, [["current", "sleep", "stage"], ["sleep", "stage"], ["stage"]]),
      heart_rate_entity:
        existing.heart_rate_entity ||
        this._findMatch(entityIds, [["current", "heart", "rate"], ["heart", "rate"], ["heartrate"]]),
      breath_rate_entity:
        existing.breath_rate_entity ||
        this._findMatch(entityIds, [["current", "breath", "rate"], ["breath", "rate"], ["breathrate"], ["resp", "rate"]]),
      hrv_entity:
        existing.hrv_entity ||
        this._findMatch(entityIds, [["current", "hrv"], ["hrv"]]),
      time_slept_entity:
        existing.time_slept_entity ||
        this._findMatch(entityIds, [["time", "slept"], ["slept"]]),
      sleep_fitness_score_entity:
        existing.sleep_fitness_score_entity ||
        this._findMatch(entityIds, [["current", "sleep", "fitness", "score"], ["sleep", "fitness", "score"], ["fitness", "score"]]),
      sleep_quality_score_entity:
        existing.sleep_quality_score_entity ||
        this._findMatch(entityIds, [["current", "sleep", "quality", "score"], ["sleep", "quality", "score"], ["quality", "score"]]),
      routine_score_entity:
        existing.routine_score_entity ||
        this._findMatch(entityIds, [["current", "sleep", "routine", "score"], ["routine", "score"]]),
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
        this._findMatch(entityIds, [["has", "water"], ["has_water"], ["water"]]),
      is_priming_entity:
        existing.is_priming_entity ||
        this._findMatch(entityIds, [["is", "priming"], ["is_priming"], ["priming"]]),
      needs_priming_entity:
        existing.needs_priming_entity ||
        this._findMatch(entityIds, [["needs", "priming"], ["needs", "prime"], ["need", "priming"], ["need_priming"]]),
      last_prime_entity:
        existing.last_prime_entity ||
        this._findMatch(entityIds, [["last", "prime"], ["last_prime"]]),
      room_temp_entity:
        existing.room_temp_entity ||
        this._findMatch(entityIds, [["room", "temperature"], ["room", "temp"], ["room_temperature"]]),
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
            ${this._toggle("Use theme colors", "use_theme_colors", !!this._valueAt("use_theme_colors"))}
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
