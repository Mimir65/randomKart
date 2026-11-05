# DEADLOCK CHALLENGE ROOM — v0.6

## Modes
- Solo: no room required. Choose difficulty and category, draw a challenge, mark it complete, then get a new one.
- Duo: create/join a room, each player chooses difficulty and draws a card. Cards reveal when both players draw. Each player confirms completion; when both confirm, the next round begins with new cards.

## Challenge pool
Edit `challenges` in `app.js`. Each entry is `[TITLE, DESCRIPTION, CATEGORY]`.
Categories: `heroes`, `items`, `gameplay`, `chaos`.

## Local and online rooms
Solo works directly in the browser. Duo rooms currently use localStorage + BroadcastChannel and are limited to the same browser/profile. Cross-device rooms require a realtime backend such as Supabase; this version does not pretend that local rooms are online.

## Publish on GitHub Pages
Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repository root, then go to Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.

Unofficial fan-made project. Not affiliated with Valve.
