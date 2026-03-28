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

