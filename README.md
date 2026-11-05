# DEADLOCK CHALLENGE ROOM — v0.7

## Main screen
The challenge generator is now the main feature directly under the intro. No category picker and no difficulty picker: every card is drawn from one mixed deck.

## Challenge deck
There are 65 challenges in `challengeDeck` inside `app.js`. Add or edit cards as `[TITLE, DESCRIPTION]`.
Includes mouse sensitivity to maximum, disabling Shift, disabling Space, hero, item, gameplay, and chaos challenges.

## Completing a challenge
Draw one card, complete it, press **ЗАДАНИЕ ВЫПОЛНЕНО — СЛЕДУЮЩЕЕ**, then draw a new card. The last-used cards are not repeated until the pool has cycled.

## Duo
The Duo room entry is a secondary button in the main challenge panel. Duo rooms currently use localStorage + BroadcastChannel and are limited to the same browser/profile. Cross-device play needs a realtime backend such as Supabase.

## Publish
Replace `index.html`, `style.css`, `app.js`, and `README.md` in the root of your GitHub repository. GitHub Pages will redeploy automatically.

Unofficial fan-made project. Not affiliated with Valve.
