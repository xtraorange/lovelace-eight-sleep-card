# Eight Sleep Card

A Home Assistant Lovelace custom card for visualizing an Eight Sleep Pod with left/right sleeper data, person avatars, bed status, compact metrics, and an expanded detail view.

## Features

- Left and right side support
- Visual editor in Home Assistant
- Device-based setup with auto-discovery of matching Eight Sleep entities
- Optional person avatars using Home Assistant person entities
- Bed status indicator with pulsing status dot
- Optional power button that can call a script, switch, button, or toggleable entity
- Compact view plus expanded detail overlay
- HACS-ready repository layout

## HACS installation

This repository is structured as a HACS Dashboard plugin repository. To install it as a custom repository:

1. Open HACS in Home Assistant.
2. Open the menu in the top right and choose **Custom repositories**.
3. Add the repository URL.
4. Select **Dashboard** as the category.
5. Install **Eight Sleep Card**.
6. Refresh your browser.

Then add the resource if HACS does not add it automatically:

- **URL:** `/hacsfiles/lovelace-eight-sleep-card/eight-sleep-card.js`
- **Type:** `JavaScript module`

## Manual installation

1. Copy `dist/eight-sleep-card.js` to:

   ```text
   /config/www/eight-sleep-card.js
   ```

2. Add a dashboard resource:

   ```yaml
   url: /local/eight-sleep-card.js
   type: module
   ```

3. Refresh the browser.

## Update behavior

For the standard Home Assistant update flow (including frontend reload prompts/fixes when available), prefer installing via HACS with the `/hacsfiles/...` resource.

Manual `/local/...` resources can behave differently across browsers and app sessions because they are not managed through HACS.

## Basic usage

After installation, add the card through the dashboard card picker as **Eight Sleep Card**.

You can also configure it manually:

```yaml
type: custom:eight-sleep-card
title: Eight Sleep
left:
  name: James
  device_id: YOUR_LEFT_DEVICE_ID
  person_entity: person.james
right:
  name: Kirsten
  device_id: YOUR_RIGHT_DEVICE_ID
  person_entity: person.kirsten
hub:
  device_id: YOUR_HUB_DEVICE_ID
```

The editor will try to auto-fill the matching Eight Sleep entities for each selected device.

## Current status

This repository is scaffolded and HACS-ready for use as a custom repository.

Good next steps for publishing:

- Create a GitHub release
- Add screenshots or GIFs to the README
- Add a real build pipeline if you split the code into source files later
- Add repository topics like `home-assistant`, `lovelace`, and `hacs`

## Notes

This card is intended for the newer Eight Sleep integration that exposes side-specific sensors such as bed presence, bed state type, bed temperature, target temperature, sleep stage, HRV, heart rate, breath rate, and related metrics.
