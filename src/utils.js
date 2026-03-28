function isEightSleepMissingValue(value) {
  if (value === null || value === undefined || value === "") return true;
  const text = String(value).toLowerCase();
  return text === "unknown" || text === "unavailable" || text === "none";
}

function toEightSleepText(value, fallback = "â€”") {
  return isEightSleepMissingValue(value) ? fallback : String(value);
}

