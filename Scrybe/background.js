chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
  if (msg.action === "saveToken") {
    // Only overwrite the stored refresh token when the sender actually sent one,
    // so an older cached login page can't null out a good refresh token.
    chrome.storage.local.get(["sb_refresh"], (existing) => {
      chrome.storage.local.set({
        sb_token:   msg.token,
        sb_user:    msg.user,
        sb_refresh: msg.refreshToken || existing.sb_refresh || null,
      }, () => sendResponse({ ok: true }));
    });
    return true;
  }

  // Sign-out from the website. Without this the extension keeps a dead session
  // that can never be refreshed, forcing a manual re-login.
  if (msg.action === "logout") {
    chrome.storage.local.remove(["sb_token", "sb_user", "sb_refresh"], () =>
      sendResponse({ ok: true })
    );
    return true;
  }
});