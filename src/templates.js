function panelFlag(card, key, view) {
  if (view === "overview") {
    const overrideKey = `${key}_overview`;
    if (overrideKey in card._config) return !!card._config[overrideKey];
  }
  return !!card._config[key];
}

function panelIcon(card, view, key) {
  const enabled = view === "overview" ? card._config.show_icons_overview : card._config.show_icons_main;
  if (!enabled) return "";
  return `${key} `;
}

function panelItem(card, view, label, value, icon) {
  return `<div class="meta-item">${panelIcon(card, view, icon)}${label}<strong>${value}</strong></div>`;
}

function renderEightSleepSidePanel(card, side, view) {
  const showTarget = panelFlag(card, "show_target_temp", view);
  const showBed = panelFlag(card, "show_bed_temp", view);
  const showStage = panelFlag(card, "show_sleep_stage", view);
  const showSlept = panelFlag(card, "show_time_slept", view);
  const showHeart = panelFlag(card, "show_heart_rate", view);
  const showBreath = panelFlag(card, "show_breath_rate", view);
  const showHrv = panelFlag(card, "show_hrv", view);
  const showScores = panelFlag(card, "show_scores", view);
  const showAlarm = panelFlag(card, "show_next_alarm", view);
  const showPresenceTimes = panelFlag(card, "show_presence_times", view);

  return `
    <div class="panel">
      <div class="panel-head">
        <div class="name-wrap">
          <div class="name">${side.name}</div>
        </div>
        <div class="mode-badge" style="background:${side.color}; box-shadow: 0 0 12px ${side.color};"></div>
      </div>

      ${showTarget
      ? `
            <div class="big-label">Target Temp</div>
            <div class="big">${side.targetTemp}</div>
          `
      : ``}
      ${showBed
      ? `
            <div class="big-label">Bed Temp</div>
            <div class="big big-secondary">${side.bedTemp}</div>
          `
      : ``}
      <div class="mode">${panelIcon(card, view, "🔆")}${side.modeLabel}</div>

      <div class="meta">
        ${panelItem(card, view, "Occupied", side.occupied ? "Yes" : "No", "🛌")}
        ${showStage ? panelItem(card, view, "Stage", side.sleepStage, "🌙") : ``}
        ${showSlept ? panelItem(card, view, "Slept", side.timeSlept, "⏱️") : ``}
        ${showHeart ? panelItem(card, view, "Heart Rate", side.heartRate, "❤️") : ``}
        ${showBreath ? panelItem(card, view, "Breath Rate", side.breathRate, "🫁") : ``}
        ${showHrv ? panelItem(card, view, "HRV", side.hrv, "📈") : ``}
        ${showScores ? panelItem(card, view, "Fitness", side.fitnessScore, "💪") : ``}
        ${showScores ? panelItem(card, view, "Quality", side.qualityScore, "⭐") : ``}
        ${showScores ? panelItem(card, view, "Routine", side.routineScore, "🗓️") : ``}
        ${showAlarm ? panelItem(card, view, "Alarm", side.nextAlarm, "⏰") : ``}
        ${showPresenceTimes ? panelItem(card, view, "In Bed", side.presenceStart, "➡️") : ``}
        ${showPresenceTimes ? panelItem(card, view, "Out of Bed", side.presenceEnd, "⬅️") : ``}
      </div>
    </div>
  `;
}

function renderEightSleepHubPanel(card, hub, view) {
  const showHubStatus = panelFlag(card, "show_hub_status", view);
  const showRoomTemp = panelFlag(card, "show_room_temp", view);
  const showHasWater = panelFlag(card, "show_has_water", view);
  const showNeedsPriming = panelFlag(card, "show_needs_priming", view);
  const showIsPriming = panelFlag(card, "show_is_priming", view);
  const showLastPrime = panelFlag(card, "show_last_prime", view);

  return `
    <div class="panel">
      <div class="panel-head">
        <div class="name-wrap">
          <div class="name">Bed / Hub</div>
          <div class="location">${panelIcon(card, view, "🟢")}${hub.status.label}</div>
        </div>
        <div class="mode-badge" style="background:${hub.status.color}; box-shadow: 0 0 12px ${hub.status.color};"></div>
      </div>

      <div class="meta">
        ${showHubStatus ? panelItem(card, view, "Status", hub.status.label, "🛟") : ``}
        ${showRoomTemp ? panelItem(card, view, "Room Temp", hub.roomTemp, "🌡️") : ``}
        ${showHasWater ? panelItem(card, view, "Has Water", hub.hasWater ? "Yes" : "No", "💧") : ``}
        ${showNeedsPriming ? panelItem(card, view, "Needs Priming", hub.needsPriming ? "Yes" : "No", "⚠️") : ``}
        ${showIsPriming ? panelItem(card, view, "Is Priming", hub.isPriming ? "Yes" : "No", "🔄") : ``}
        ${showLastPrime ? panelItem(card, view, "Last Prime", hub.lastPrime, "🕒") : ``}
      </div>
    </div>
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

                    <path d="M150 78 C150 60, 165 48, 184 48 L496 48 C515 48, 530 60, 530 78 L560 366 C563 392, 544 412, 518 412 L162 412 C136 412, 117 392, 120 366 Z" fill="url(#bedShellGradient)" filter="url(#softShadow)"></path>
                    <path d="M172 82 C172 70, 181 62, 194 62 L486 62 C499 62, 508 70, 508 82 L534 338 C536 356, 522 370, 504 370 L176 370 C158 370, 144 356, 146 338 Z" fill="url(#bedTopGradient)"></path>

                    <path d="M186 92 C186 82, 193 76, 203 76 L334 76 C344 76, 351 82, 351 92 L370 320 C371 334, 361 344, 347 344 L193 344 C179 344, 169 334, 170 320 Z" fill="rgba(255,255,255,0.018)"></path>
                    <path d="M186 92 C186 82, 193 76, 203 76 L334 76 C344 76, 351 82, 351 92 L370 320 C371 334, 361 344, 347 344 L193 344 C179 344, 169 334, 170 320 Z" fill="url(#mattressTexture)" opacity="0.16"></path>
                    <path d="M186 92 C186 82, 193 76, 203 76 L334 76 C344 76, 351 82, 351 92 L351 320 C351 334, 347 344, 333 344 L193 344 C179 344, 169 334, 170 320 Z" fill="none" stroke="${left.color}" stroke-width="3.5" style="filter: drop-shadow(0 0 6px ${left.color}) drop-shadow(0 0 14px ${left.color});"></path>

                    <path d="M348 92 C348 82, 355 76, 365 76 L496 76 C506 76, 513 82, 513 92 L532 320 C533 334, 523 344, 509 344 L355 344 C341 344, 331 334, 332 320 Z" fill="rgba(255,255,255,0.018)"></path>
                    <path d="M348 92 C348 82, 355 76, 365 76 L496 76 C506 76, 513 82, 513 92 L532 320 C533 334, 523 344, 509 344 L355 344 C341 344, 331 334, 332 320 Z" fill="url(#mattressTexture)" opacity="0.16"></path>
                    <path d="M348 92 C348 82, 355 76, 365 76 L496 76 C506 76, 513 82, 513 92 L532 320 C533 334, 523 344, 509 344 L365 344 C351 344, 348 334, 348 320 Z" fill="none" stroke="${right.color}" stroke-width="3.5" style="filter: drop-shadow(0 0 6px ${right.color}) drop-shadow(0 0 14px ${right.color});"></path>

                    <line x1="349" y1="80" x2="349" y2="344" stroke="rgba(255,255,255,0.14)" stroke-width="2.5" stroke-linecap="round"></line>
                    <line x1="351" y1="80" x2="351" y2="344" stroke="rgba(255,255,255,0.14)" stroke-width="2.5" stroke-linecap="round"></line>

                    <path d="M206 104 C206 94, 214 88, 224 88 L306 88 C316 88, 324 94, 324 104 L324 130 C324 140, 316 146, 306 146 L224 146 C214 146, 206 140, 206 130 Z" fill="#f5f5f5"></path>
                    <path d="M370 104 C370 94, 378 88, 388 88 L470 88 C480 88, 488 94, 488 104 L488 130 C488 140, 480 146, 470 146 L388 146 C378 146, 370 140, 370 130 Z" fill="#f5f5f5"></path>

                    ${card._singleSleeperMode
      ? card._renderAvatar(left, 360, 86)
      : `${card._renderAvatar(left, 278, 86)}${card._renderAvatar(right, 442, 86)}`}

                    ${card._config.show_occupancy_wash && left.occupied ? `<path d="M186 92 C186 82, 193 76, 203 76 L334 76 C344 76, 351 82, 351 92 L370 320 C371 334, 361 344, 347 344 L193 344 C179 344, 169 334, 170 320 Z" fill="${left.color}" opacity="0.08"></path>` : ``}
                    ${card._config.show_occupancy_wash && right.occupied ? `<path d="M348 92 C348 82, 355 76, 365 76 L496 76 C506 76, 513 82, 513 92 L532 320 C533 334, 523 344, 509 344 L355 344 C341 344, 331 334, 332 320 Z" fill="${right.color}" opacity="0.08"></path>` : ``}
                  </svg>
                </div>
              `;
}

function renderEightSleepCompactPanels(card, left, right, hub) {
  if (!card._config.show_compact_panels) return ``;
  const sides = card._singleSleeperMode ? [left] : [left, right];
  return `
                <div class="details ${card._singleSleeperMode ? "single-side" : ""}">
                  ${sides.map((side) => renderEightSleepSidePanel(card, side, "main")).join("")}
                </div>
              `;
}

function renderEightSleepExpandedOverlay(card, left, right, hub) {
  if (!card._expanded) return ``;
  const sides = card._singleSleeperMode ? [left] : [left, right];
  return `
              <div class="overlay" id="overlay">
                <div class="overlay-card">
                  <div class="overlay-header">
                    <div class="overlay-title">${card._config.title}</div>
                    <button class="close-button" title="Close">✕</button>
                  </div>
                  <div class="details ${card._singleSleeperMode ? "single-side" : ""}">
                    ${sides.map((side) => renderEightSleepSidePanel(card, side, "overview")).join("")}
                  </div>
                  <div class="expanded-layout">
                    ${renderEightSleepHubPanel(card, hub, "overview")}
                  </div>
                </div>
              </div>
            `;
}
