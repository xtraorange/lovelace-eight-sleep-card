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

