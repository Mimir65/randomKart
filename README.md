# DEADLOCK CHALLENGE ROOM — v0.5

A compact arcade-style Deadlock challenge room. Russian UI, responsive layout, challenge pools, individual difficulty, simultaneous reveal, one reroll per player.

## Run locally
Open `index.html` in a browser. For best results, use VS Code Live Server.

## Important: local room limitation
Without a backend, rooms are stored in the browser's `localStorage` and synchronized with `BroadcastChannel`. This is only a same-browser / same-profile demo. It does **not** let a friend on another device join using the code.

## Enable real online rooms
This package currently ships with the local demo flow. To enable cross-device rooms, connect a Supabase project and add a Realtime-backed room table / adapter in `app.js`. Do not paste service-role keys into frontend code. Only the public anon key is safe for browser use when paired with correct Row Level Security policies.

## Publish with GitHub Pages
1. Create a new GitHub repository, e.g. `deadlock-challenge`.
2. Upload `index.html`, `style.css`, and `app.js` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose `main` and `/ (root)`, then Save.
6. Wait for the Pages URL to appear.

## Edit challenge cards
Open `app.js` and edit the `challenges` object. It contains `easy`, `normal`, and `hard` arrays. Each card is `[TITLE, DESCRIPTION]`.

Unofficial fan-made project. Not affiliated with Valve.
