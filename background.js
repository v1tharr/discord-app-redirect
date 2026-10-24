// Tabs that were opened with no opener, e.g. a link clicked in Telegram.
// Only these get closed after the hand-off, so we never kill a page
// the user was actually reading.
const orphanTabs = new Set();

browser.tabs.onCreated.addListener((tab) => {
  if (tab.openerTabId === undefined) orphanTabs.add(tab.id);
});
browser.tabs.onRemoved.addListener((id) => orphanTabs.delete(id));

function toAppUrl(rawUrl) {
  const { hostname, pathname } = new URL(rawUrl);

  if (hostname === "discord.gg") {
    // discord.gg/<code>
    return pathname.length > 1 ? `discord://-/invite${pathname}` : null;
  }
  if (pathname.startsWith("/channels/") || pathname.startsWith("/invite/")) {
    return `discord://-${pathname}`;
  }
  return null;
}

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const appUrl = toAppUrl(details.url);
    if (!appUrl) return {};

    const wasOrphan = orphanTabs.delete(details.tabId);
    browser.tabs.update(details.tabId, { url: appUrl });

    // Give Firefox a moment to pass the URL to the OS before closing.
    if (wasOrphan) {
      setTimeout(() => browser.tabs.remove(details.tabId), 500);
    }
    return { cancel: true };
  },
  {
    urls: [
      "*://*.discord.com/channels/*",
      "*://*.discord.com/invite/*",
      "*://*.discordapp.com/channels/*",
      "*://discord.gg/*",
    ],
    types: ["main_frame"],
  },
  ["blocking"]
);
