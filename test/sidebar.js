function refresh() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (tabs[0]) {
      document.getElementById("title").textContent = tabs[0].title || "—";
      document.getElementById("url").textContent = tabs[0].url || "—";
    }
  });
}

document.getElementById("refreshBtn").addEventListener("click", refresh);
refresh();