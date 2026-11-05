# DEADLOCK CHALLENGE ROOM — v0.8 HARD MODE

The homepage opens directly on the challenge card. There is no difficulty or category selection: every draw comes from one mixed hard-only deck.

## Challenge pool
63 hard challenges. Examples: max/min mouse sensitivity, remove Shift, remove Space, stay on lane for 10 minutes, no deaths before 12 minutes, no ult for 15 minutes, no boots all match, five successful ganks, multiple Mid Boss attempts, off-meta builds, hero picked by teammate.

Edit `challengeDeck` in `app.js`; each card is `[TITLE, DESCRIPTION]`.

## Flow
Draw a card → complete it → press the completion button → draw the next card. Recently drawn challenges are not repeated until the pool cycles.

## Duo
Duo entry is secondary, below the main challenge panel. Current room implementation is local-only (same browser/profile); cross-device rooms need a realtime backend such as Supabase.

## Publish
Replace `index.html`, `style.css`, `app.js`, and `README.md` in the root of your GitHub repository.

Unofficial fan-made project. Not affiliated with Valve.
