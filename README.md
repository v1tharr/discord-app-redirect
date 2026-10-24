# discord-app-redirect

Firefox extension that sends Discord links straight to the desktop app.

Click a `discord.com/channels/...`, `discord.com/invite/...` or `discord.gg/...`
link anywhere (Telegram, mail, a forum) and it opens in the Discord app instead
of a browser tab.

## Why not a userscript

A userscript only sees pages that are already loaded, and only reacts to clicks
inside them. A link opened from another app lands in a fresh tab straight on
discord.com, so there is nothing for the script to intercept. This extension
cancels the navigation itself, hands a `discord://` URL to the OS, and closes
the empty tab.

## Install

Temporary, for testing: `about:debugging` -> This Firefox -> Load Temporary
Add-on -> pick `manifest.json`.

Permanent: release Firefox only runs signed extensions, so either submit it to
addons.mozilla.org (unlisted is fine) or use Developer Edition / Nightly with
`xpinstall.signatures.required` set to `false`.

The first time, Firefox asks whether to open Discord. Tick "always allow".

## Behaviour

- `discord.com/channels/<guild>/<channel>/<message>` -> `discord://-/channels/...`
- `discord.com/invite/<code>`, `discord.gg/<code>` -> `discord://-/invite/<code>`
- Works for `ptb.` and `canary.` subdomains too.
- Only tabs opened without an opener (links from other apps) are closed.
  If you click a Discord link inside a page, that page stays.
- Discord login and `discord.com/app` are not touched, so the web version still
  works when you open it yourself.

## License

MIT
