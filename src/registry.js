customElements.define("eight-sleep-card", EightSleepCard);
customElements.define("eight-sleep-card-editor", EightSleepCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "eight-sleep-card",
  name: "Eight Sleep Card",
  description: "A dual-side Eight Sleep card with a visual editor and device-based setup",
  preview: true,
});
