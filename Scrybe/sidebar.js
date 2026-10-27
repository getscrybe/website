// ─────────────────────────────────────────────
//  SUPABASE CONFIG
// ─────────────────────────────────────────────
const SUPABASE_URL  = "https://ajswovsdbdeohuyyucyo.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqc3dvdnNkYmRlb2h1eXl1Y3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMTEwNDYsImV4cCI6MjA4OTg4NzA0Nn0.N5NyNjP1fc7fxZm08DbNAlx-hGOlfCYXrlpezt_EG9c";

const TIER_LIMITS = {
  free:      { essays: 2,        maxWords: 500,      maxWpm: 60,  canPickDuration: false, pasteType: { sessionsPerDay: 2, maxWords: 250 } },
  pro:       { essays: 20,       maxWords: 5000,     maxWpm: Infinity, canPickDuration: true,  pasteType: { sessionsPerDay: 20, maxWords: 5000 } },
  unlimited: { essays: 200, maxWords: Infinity, maxWpm: Infinity, canPickDuration: true,  pasteType: { sessionsPerDay: Infinity, maxWords: Infinity } },
};

// Target duration control, expressed as multiples of the natural run length.
// The slider carries a *position* (0-1000), not seconds — see positionToMs —
// so that Natural always lands dead centre no matter how the ends are weighted.
const DURATION_FAST  = 0.55;
const DURATION_SLOW  = 2.2;
// Bounds are milliseconds, matching positionToMs. Named with a _MS suffix on
// purpose — these were originally seconds and silently clamped every duration
// to 10.8s when the unit changed underneath them.
const DURATION_FLOOR_MS = 10 * 1000;      // a slider that reaches 0 is meaningless
const DURATION_CEIL_MS  = 3 * 60 * 60 * 1000; // 3h sanity cap, not a paywall
const DURATION_MID   = 500;   // slider position of the natural pace

const UPGRADE_URL = "https://getscrybe.net/purchase.html";

const REVIEW_STORAGE_KEY = "review_nudge_v1";
const REVIEW_STORE_ID     = "imelbhmelocdbjoobiogfallkokomoao";
const REVIEW_MIN_RUNS     = 2;
const REVIEW_MAX_SHOWS    = 2;
const REVIEW_SNOOZE_MS    = 30 * 24 * 60 * 60 * 1000;
const REVIEW_URL = (() => {
  const url = new URL(`https://chromewebstore.google.com/detail/${REVIEW_STORE_ID}/reviews/my-review`);
  url.searchParams.set("utm_source", "extension");
  url.searchParams.set("utm_medium", "post_typing");
  url.searchParams.set("utm_campaign", "review_request");
  return url.toString();
})();

// Matches the badge in the user bar, so a limit note saying "Pro" and a badge
// saying "Pro" are visibly the same plan.
function labelForTier(tier) {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

// ─────────────────────────────────────────────
//  SESSION STATE
// ─────────────────────────────────────────────
let currentUser   = null;  // { id, email, name }
let currentToken  = null;  // Supabase JWT
let currentRefresh = null; // Supabase refresh token (for silent renewal)
let currentTier  = "free";
let essayCount   = 0;
let pasteTypeCount = 0;
let pasteTypeResetAt = null; // timestamp in ms
let pasteTypeResetTimer = null;
let clearing     = false; // re-entry guard for clearSession()

// ─────────────────────────────────────────────
//  REFS
// ─────────────────────────────────────────────
const pageLogin         = document.getElementById("pageLogin");
const pageForm          = document.getElementById("pageForm");
const pageOutline       = document.getElementById("pageOutline");
const pageDraft         = document.getElementById("pageDraft");
const pagePreview       = document.getElementById("pagePreview");

const loginBtn          = document.getElementById("loginBtn");

// The account strip lives in every signed-in page's header, so it is one
// concept rendered four times rather than four distinct widgets. Hold the
// NodeLists and write to all of them; the login page has none, which is why it
// is absent from the list.
const acctStrips      = Array.from(document.querySelectorAll("[data-acct]"));
const acctEssayEls    = Array.from(document.querySelectorAll("[data-acct-essay]"));
const acctPasteEls    = Array.from(document.querySelectorAll("[data-acct-paste]"));
const acctTierEls     = Array.from(document.querySelectorAll("[data-acct-tier]"));
const acctUpgradeEls  = Array.from(document.querySelectorAll("[data-acct-upgrade]"));

const subjectEl         = document.getElementById("subject");
const otherWrap         = document.getElementById("otherSubjectWrap");
const otherSubjectEl    = document.getElementById("otherSubject");
const wordCountEl       = document.getElementById("wordCount");
const wordCountCrown    = document.getElementById("wordCountCrown");
const wordCountCrownText= document.getElementById("wordCountCrownText");
const wordCountMeter    = document.getElementById("wordCountMeter");
const wordCountFill     = document.getElementById("wordCountFill");
const wordCountMeterLabel = document.getElementById("wordCountMeterLabel");
const customCapBanner     = document.getElementById("customCapBanner");
const customCapTitle      = document.getElementById("customCapTitle");
const customCapSub        = document.getElementById("customCapSub");
const customCapUpgrade    = document.getElementById("customCapUpgrade");
const gradeLevelEl      = document.getElementById("gradeLevel");
const rubricEl          = document.getElementById("rubric");
const instructionsEl    = document.getElementById("instructions");
const outlineToggle     = document.getElementById("outlineToggle");
const outlineSw         = document.getElementById("outlineSw");
const outlineCrown      = document.getElementById("outlineCrown");
const genBtn            = document.getElementById("genBtn");
const pasteTypeBtnEl    = document.getElementById("pasteTypeBtn");
const outlineNextBtn    = document.getElementById("outlineNextBtn");
const draftBackBtn      = document.getElementById("draftBackBtn");
const outlineBackBtn    = document.getElementById("outlineBackBtn");
const applyBtn          = document.getElementById("applyBtn");
const approveBtn        = document.getElementById("approveBtn");
const backBtn           = document.getElementById("backBtn");
const typeBtn           = document.getElementById("typeBtn");
const pauseBtn          = document.getElementById("pauseBtn");
const stopBtn           = document.getElementById("stopBtn");
const typeControlsEl    = document.querySelector(".type-controls");
const statusEl          = document.getElementById("status");
const reviewNudgeEl     = document.getElementById("reviewNudge");
const reviewNudgeReviewBtn = document.getElementById("reviewNudgeReview");
const reviewNudgeDismissBtn = document.getElementById("reviewNudgeDismiss");
const draftTextEl       = document.getElementById("draftText");
const changesNoteEl     = document.getElementById("changesNote");
const essayEl           = document.getElementById("essayText");
const customTextEl      = document.getElementById("customText");
const wordCountBadge    = document.getElementById("wordCountBadge");
const customWordCountBadge = document.getElementById("customWordCountBadge");
const typingAnim        = document.getElementById("typingAnim");
const typingAnimLabel   = document.getElementById("typingAnimLabel");
const outlineBox        = document.getElementById("outlineBox");
const genOverlay        = document.getElementById("genOverlay");
const draftOverlay      = document.getElementById("draftOverlay");
const wpmEl             = document.getElementById("wpm");
const wpmCrown          = document.getElementById("wpmCrown");
const wpmCrownText      = document.getElementById("wpmCrownText");
const durationTrackEl    = document.getElementById("durationTrack");
const durationRangeEl    = document.getElementById("durationRange");
const durationFillEl     = document.getElementById("durationFill");
const durationTickEl     = document.getElementById("durationTick");
const durationLockEl     = document.getElementById("durationLock");
const durationValueEl    = document.getElementById("durationValue");
const durationEffEl      = document.getElementById("durationEffective");
const durationLabelEl    = document.getElementById("durationLabel");
const durationFastEndEl  = document.getElementById("durationFastEnd");
const durationSlowEndEl  = document.getElementById("durationSlowEnd");
const durationNaturalEl  = document.getElementById("durationNatural");
const durationNaturalTimeEl = document.getElementById("durationNaturalTime");
const durationFieldEl    = document.getElementById("durationField");
const typingProgress    = document.getElementById("typingProgress");
const typingProgressFill  = document.getElementById("typingProgressFill");
const typingProgressLabel = document.getElementById("typingProgressLabel");
const skeletonOverlay     = document.getElementById("skeletonOverlay");
const skeletonOverlayLabel = document.getElementById("skeletonOverlayLabel");
const confettiEl            = document.getElementById("confetti");

// ─────────────────────────────────────────────
//  COSMETIC HELPERS — toasts, skeletons, progress, confetti
// ─────────────────────────────────────────────
const TOAST_ICONS = {
  ok:   '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.5 3.5L13 5"/></svg>',
  err:  '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>',
  warn: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3L14 13H2z"/><path d="M8 7v3M8 12v.01"/></svg>'
};

// `action` renders an inline button that routes the user somewhere immediately —
// used for the paywall toasts so "upgrade" is one tap from where the wall hit,
// instead of a to-be-remembered URL.
function showToast(message, type = "ok", action = null) {
  const stack = document.getElementById("toastStack");
  if (!stack) return;
  if (scrollHintEl) {
    scrollHintEl.classList.add("dismissed");
    scrollHintEl.classList.remove("visible");
  }
  const dismiss = (toast) => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 260);
  };
  const toast = document.createElement("div");
  toast.className = "toast " + type;
  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.innerHTML = TOAST_ICONS[type] || TOAST_ICONS.ok;
  toast.appendChild(icon);
  const body = document.createElement("div");
  body.className = "toast-body";
  const msg = document.createElement("span");
  msg.className = "toast-msg";
  msg.textContent = message;
  body.appendChild(msg);
  if (action) {
    const btn = document.createElement("button");
    btn.className = "toast-action";
    btn.textContent = action.label;
    btn.addEventListener("click", () => {
      dismiss(toast);
      if (action.onClick) action.onClick();
    });
    body.appendChild(btn);
  }
  toast.appendChild(body);

  // Explicit close. The slider nudge re-fires while the handle is being dragged
  // and a user who has read it needs to get rid of it now rather than wait out
  // the auto-dismiss — which kept reappearing under the cursor.
  const close = document.createElement("button");
  close.className = "toast-close";
  close.type = "button";
  close.setAttribute("aria-label", "Dismiss");
  close.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>';
  close.addEventListener("click", () => dismiss(toast));
  toast.appendChild(close);

  stack.appendChild(toast);
  setTimeout(() => dismiss(toast), action ? 5000 : 3200);
}

function getReviewNudgeState() {
  return new Promise((resolve) => {
    chrome.storage.local.get([REVIEW_STORAGE_KEY], (data) => {
      const stored = data?.[REVIEW_STORAGE_KEY];
      resolve(stored && typeof stored === "object" ? stored : {});
    });
  });
}

function setReviewNudgeState(state) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [REVIEW_STORAGE_KEY]: state }, resolve);
  });
}

function showReviewNudge() {
  if (!reviewNudgeEl || !reviewNudgeEl.hidden) return;
  if (scrollHintEl) {
    scrollHintEl.classList.add("dismissed");
    scrollHintEl.classList.remove("visible");
  }
  reviewNudgeEl.hidden = false;
  requestAnimationFrame(() => reviewNudgeEl.classList.add("visible"));
  setTimeout(refreshScrollHint, 0);
}

function hideReviewNudge() {
  if (!reviewNudgeEl) return;
  reviewNudgeEl.classList.remove("visible");
  reviewNudgeEl.hidden = true;
  setTimeout(refreshScrollHint, 0);
}

function reviewNudgeIsDue(state, now = Date.now()) {
  if (state.clickedAt) return false;
  if ((Number(state.completedRuns) || 0) < REVIEW_MIN_RUNS) return false;
  if ((Number(state.showCount) || 0) >= REVIEW_MAX_SHOWS) return false;
  if (!state.lastShownAt) return true;
  return now - state.lastShownAt >= REVIEW_SNOOZE_MS;
}

async function maybeShowReviewNudge() {
  if (typingActive) return;
  if (pagePreview.classList.contains("page-hidden")) return;
  const state = await getReviewNudgeState();
  if (!reviewNudgeIsDue(state)) return;
  state.showCount = (Number(state.showCount) || 0) + 1;
  state.lastShownAt = Date.now();
  await setReviewNudgeState(state);
  showReviewNudge();
}

async function recordCompletedTypingRun() {
  const state = await getReviewNudgeState();
  state.completedRuns = (Number(state.completedRuns) || 0) + 1;
  await setReviewNudgeState(state);
  setTimeout(() => {
    maybeShowReviewNudge().catch((err) => console.error("maybeShowReviewNudge error:", err));
  }, 1200);
}

async function dismissReviewNudge() {
  hideReviewNudge();
  const state = await getReviewNudgeState();
  state.dismissedAt = Date.now();
  await setReviewNudgeState(state);
}

async function openReviewPage() {
  hideReviewNudge();
  chrome.tabs.create({ url: REVIEW_URL });
  const state = await getReviewNudgeState();
  state.clickedAt = Date.now();
  await setReviewNudgeState(state);
}

if (reviewNudgeReviewBtn) {
  reviewNudgeReviewBtn.addEventListener("click", () => {
    openReviewPage().catch((err) => console.error("openReviewPage error:", err));
  });
}

if (reviewNudgeDismissBtn) {
  reviewNudgeDismissBtn.addEventListener("click", () => {
    dismissReviewNudge().catch((err) => console.error("dismissReviewNudge error:", err));
  });
}

// ─────────────────────────────────────────────
//  RUNTIME ERROR SURFACING
// ─────────────────────────────────────────────
// Failures used to die silently: after an extension update an already-open side
// panel's context is invalidated and the Type/Stop buttons just stop responding
// with no visible reason. Surface anything that would otherwise be invisible.
function reportRuntimeError(err, context) {
  const raw   = (err && err.message) || String(err);
  const stale = /extension context invalidated/i.test(raw);
  const label = stale
    ? "Sidebar is stale after the update — close it and reopen it from the Scrybe icon."
    : raw;
  console.error("[scrybe]", context || "runtime error", err);
  showToast(label, "err");
}

window.addEventListener("error", (e) => reportRuntimeError((e && e.error) || (e && e.message) || e, "uncaught error"));
window.addEventListener("unhandledrejection", (e) => reportRuntimeError(e && e.reason, "unhandled rejection"));

// Shimmer placeholder lines inside the outline box
function renderSkeletonLines(container, count) {
  container.innerHTML = "";
  const label = document.createElement("div");
  label.className = "outline-status";
  label.textContent = "Writing draft…";
  container.appendChild(label);
  for (let i = 0; i < count; i++) {
    const line = document.createElement("div");
    line.className = "skeleton";
    line.style.width = (55 + Math.random() * 40) + "%";
    container.appendChild(line);
  }
}

function showSkeletonOverlay(label) {
  if (skeletonOverlayLabel) skeletonOverlayLabel.textContent = label || "Writing draft…";
  skeletonOverlay.classList.add("active");
}

function hideSkeletonOverlay() {
  skeletonOverlay.classList.remove("active");
}

// Live typing progress (driven by content.js messages)
function updateTypingProgress(pct) {
  typingProgress.classList.add("active");
  typingProgressFill.style.width = Math.max(0, Math.min(100, pct)) + "%";
  typingProgressLabel.textContent = Math.round(pct) + "%";
}

function resetTypingProgress() {
  typingProgress.classList.remove("active");
  typingProgressFill.style.width = "0%";
  typingProgressLabel.textContent = "0%";
}

// Lightweight confetti burst (no libraries, CSS-driven)
function fireConfetti() {
  if (!confettiEl || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#0066cc", "#0077ed", "#34c759", "#ff9500", "#a259ff", "#ff3b30"];
  confettiEl.innerHTML = "";
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = (Math.random() * 0.4).toFixed(2) + "s";
    piece.style.animationDuration = (0.9 + Math.random() * 0.8).toFixed(2) + "s";
    piece.style.setProperty("--drift", (Math.random() * 80 - 40).toFixed(1) + "px");
    confettiEl.appendChild(piece);
  }
  setTimeout(() => { confettiEl.innerHTML = ""; }, 2400);
}

// Progress messages streamed from content.js while it types into the doc
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "scrybe-progress" && typeof msg.pct === "number") {
    updateTypingProgress(msg.pct);
  }
  sendResponse({ ok: true });
});

// ─────────────────────────────────────────────
//  PAGE TRANSITIONS
// ─────────────────────────────────────────────
const pages = [pageLogin, pageForm, pageOutline, pageDraft, pagePreview];

function goTo(page) {
  pages.forEach(p => {
    p.classList.remove("page-enter", "page-exit");
    if (p !== page) p.classList.add("page-hidden");
  });
  page.classList.remove("page-hidden");
  page.classList.add("page-enter");
  setTimeout(() => page.classList.remove("page-enter"), 300);
  refreshScrollHint();
}

// ─────────────────────────────────────────────
//  SCROLL HINT — tells users a page can scroll
// ─────────────────────────────────────────────
const scrollHintEl = document.getElementById("scrollHint");

function refreshScrollHint() {
  if (!scrollHintEl) return;
  const page = pages.find(p => !p.classList.contains("page-hidden"));
  if (!page) return;
  const overflows = page.scrollHeight > page.clientHeight + 4;
  const dismissed = scrollHintEl.classList.contains("dismissed");
  scrollHintEl.classList.toggle("visible", overflows && !dismissed);
}

pages.forEach(page => {
  page.addEventListener("scroll", () => {
    scrollHintEl.classList.add("dismissed");
    scrollHintEl.classList.remove("visible");
  });
});

window.addEventListener("resize", refreshScrollHint);
window.addEventListener("load", refreshScrollHint);
setTimeout(refreshScrollHint, 400);

// Outline and Draft are steps inside the Generate flow, so going back from
// either lands on the Generate form with the mode nav following suit.
outlineBackBtn.addEventListener("click", () => { setActiveMode("generate"); goTo(pageForm); });
draftBackBtn.addEventListener("click",   () => { setActiveMode("generate"); goTo(outlineOn ? pageOutline : pageForm); });

// Track what page preview was reached from so back goes to the right place.
// null means we arrived via the Type nav and there is nothing to go back to —
// the back button hides rather than becoming a dead control.
let previewOrigin = null;

function goToPreview(from) {
  previewOrigin = from || null;
  goTo(pagePreview);
  backBtn.style.display = previewOrigin ? "" : "none";
}

backBtn.addEventListener("click", () => { if (previewOrigin) goTo(previewOrigin); });

// ─────────────────────────────────────────────
//  AUTH — LOAD SESSION + TOKEN REFRESH
// ─────────────────────────────────────────────

// Decode JWT payload without a library
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch { return null; }
}

// Returns true if token expires within the next 5 minutes
function tokenExpiresSoon(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  return (payload.exp * 1000) - Date.now() < 5 * 60 * 1000;
}

// Real Supabase token refresh. Supabase returns a new access token AND a
// rotated refresh token, so both are stored. Returns false when no refresh
// token is available or the refresh is rejected.
async function refreshToken() {
  if (!currentRefresh) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        "apikey":       SUPABASE_ANON,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: currentRefresh }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    if (!json.access_token) return false;
    currentToken   = json.access_token;
    currentRefresh = json.refresh_token || currentRefresh;
    if (json.user) {
      currentUser = {
        id:    json.user.id,
        email: json.user.email,
        name:  (json.user.user_metadata && json.user.user_metadata.name) || json.user.email,
      };
    }
    chrome.storage.local.set({ sb_token: currentToken, sb_refresh: currentRefresh, sb_user: currentUser });
    return true;
  } catch { return false; }
}

async function silentRefresh() {
  if (!currentToken) return false;
  // Try a real refresh first — the access token is renewed for another hour.
  if (await refreshToken()) return true;
  try {
    // No refresh token available — check whether the access token is still valid.
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        "apikey":        SUPABASE_ANON,
        "Authorization": `Bearer ${currentToken}`,
      }
    });
    if (res.ok) return true;
    // 401 means the token is dead — try the dev auto-login before giving up
    if (res.status === 401) {
      if (await devAutoLogin()) return true;
    } else {
      return false; // server hiccup — keep the session, retry later
    }
  } catch { return false; } // network hiccup — keep the session, retry later
  clearSession();
  return false;
}

// Drop every trace of the session and return to the login page. Also resets the
// cached tier/count so a stale paid session can never linger in the panel.
//
// The `clearing` guard prevents re-entry: storage.local.remove() fires onChanged,
// which calls clearSession() again. Chrome normally doesn't emit a change for an
// already-absent key, but we don't want correctness to depend on that.
function clearSession() {
  if (clearing) return;
  clearing = true;

  chrome.storage.local.remove(["sb_token", "sb_user", "sb_refresh"]);
  currentToken   = null;
  currentUser    = null;
  currentRefresh = null;
  currentTier    = "free";
  essayCount     = 0;
  pasteTypeCount   = 0;
  pasteTypeResetAt = null;
  if (pasteTypeResetTimer) {
    clearTimeout(pasteTypeResetTimer);
    pasteTypeResetTimer = null;
  }
  // Blank the strips too. Harmless before, when they lived on one page and the
  // login page simply didn't have one — but they are now in four headers, so a
  // stale quota from the previous session would still be in the DOM if the next
  // paint happened before the profile reloads.
  setAccountStripVisible(false);
  goTo(pageLogin);

  clearing = false;
}

// ─────────────────────────────────────────────
//  DEV AUTO-LOGIN (local testing only)
//  Only activates if storage contains `dev_creds`
//  = { email, password } for a real Supabase user.
//  Never set in production, so this is a no-op there.
// ─────────────────────────────────────────────
async function devAutoLogin() {
  return new Promise(resolve => {
    chrome.storage.local.get(["dev_creds"], async (data) => {
      if (!data.dev_creds || !data.dev_creds.email || !data.dev_creds.password) {
        resolve(false);
        return;
      }
      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_ANON,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.dev_creds.email, password: data.dev_creds.password }),
        });
        if (!res.ok) { console.error("devAutoLogin failed: HTTP " + res.status); resolve(false); return; }
        const json = await res.json();
        if (!json.access_token || !json.user) { console.error("devAutoLogin failed: no access_token in response"); resolve(false); return; }
        currentToken = json.access_token;
        currentRefresh = json.refresh_token || null;
        currentUser = {
          id:    json.user.id,
          email: json.user.email,
          name:  (json.user.user_metadata && json.user.user_metadata.name) || json.user.email,
        };
        chrome.storage.local.set({ sb_token: currentToken, sb_refresh: currentRefresh, sb_user: currentUser });
        resolve(true);
      } catch (err) { console.error("devAutoLogin error:", err); resolve(false); }
    });
  });
}

async function loadSession() {
  return new Promise(resolve => {
    chrome.storage.local.get(["sb_token", "sb_user", "sb_refresh"], async (data) => {
      if (data.sb_token && data.sb_user) {
        currentToken   = data.sb_token;
        currentUser    = data.sb_user;
        currentRefresh = data.sb_refresh || null;
        resolve(true);
      } else {
        resolve(await devAutoLogin());
      }
    });
  });
}

// Check token validity before every API call
async function ensureValidToken() {
  if (!currentToken) {
    if (!(await devAutoLogin())) { goTo(pageLogin); return false; }
  }
  if (tokenExpiresSoon(currentToken)) {
    const ok = await silentRefresh();
    if (!ok) return false;
  }
  return true;
}

// Proactive background refresh — check every 4 minutes
setInterval(async () => {
  if (!currentToken) return;
  if (tokenExpiresSoon(currentToken)) {
    if (await silentRefresh()) {
      // The token changed, so the tier/count we read with the old one may be
      // stale. Re-read the profile so a refresh never leaves free/0 on screen.
      renderProfileResult(await fetchProfile());
    }
  }
}, 4 * 60 * 1000);

// Single place that turns a fetchProfile status into UI, so no caller can
// accidentally leave a stale "Free" badge on screen.
function renderProfileResult(status) {
  if (status === "ok")   updateAccountStrips();
  if (status === "error") renderProfilePending();
}

// Returns "ok" when the profile loaded, "auth" when the session is dead (the
// caller should stop), or "error" on a transient failure (keep the session and
// whatever the panel is already showing).
//
// Retries once on transient failures — a single blip shouldn't leave the panel
// stuck showing "sync" when a second request would succeed.
async function fetchProfile() {
  let result = await fetchProfileOnce();
  if (result !== "error") return result;

  await new Promise(r => setTimeout(r, 1200));
  return fetchProfileOnce();
}

async function fetchProfileOnce() {
  if (!currentToken || !currentUser) return "auth";

  const url  = `${SUPABASE_URL}/rest/v1/users?id=eq.${currentUser.id}&select=tier,essay_count`;
  const auth = () => ({ apikey: SUPABASE_ANON, Authorization: `Bearer ${currentToken}` });

  let res;
  try {
    res = await fetch(url, { headers: auth() });
  } catch (err) {
    console.error("fetchProfile network error:", err);
    return "error";
  }

  // A 401 body is an error object, not a row list — treat it as an auth
  // failure and try to recover before concluding anything about the profile.
  if (res.status === 401 || res.status === 403) {
    const recovered = await ensureValidToken();
    if (!recovered) return "auth";
    try {
      res = await fetch(url, { headers: auth() });
    } catch (err) {
      console.error("fetchProfile retry network error:", err);
      return "error";
    }
    if (!res.ok) {
      // Refresh succeeded but the row is still unreadable — treat as dead session.
      clearSession();
      return "auth";
    }
  } else if (!res.ok) {
    // 5xx / rate limit / offline. Never overwrite a paying user's tier with
    // "free" because the network hiccuped.
    console.error(`fetchProfile failed: HTTP ${res.status}`);
    return "error";
  }

  let rows;
  try {
    rows = await res.json();
  } catch (err) {
    console.error("fetchProfile parse error:", err);
    return "error";
  }

  if (rows && rows.length > 0) {
    currentTier = rows[0].tier || "free";
    essayCount  = rows[0].essay_count || 0;
    return "ok";
  }

  // Genuine empty result — the profile row really does not exist yet, so
  // provision it. Only reachable on a successful request.
  try {
    const createRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {
        ...auth(),
        "Content-Type": "application/json",
        "Prefer":       "return=minimal",
      },
      body: JSON.stringify({
        id:    currentUser.id,
        email: currentUser.email,
        tier:  "free",
        essay_count: 0,
      })
    });
    if (!createRes.ok) {
      console.error(`fetchProfile create-row failed: HTTP ${createRes.status}`);
      return "error";
    }
  } catch (err) {
    console.error("fetchProfile create-row error:", err);
    return "error";
  }

  currentTier = "free";
  essayCount  = 0;
  return "ok";
}

async function incrementEssayCount() {
  if (!currentToken || !currentUser) return;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_essay_count`, {
      method: "POST",
      headers: {
        "apikey":        SUPABASE_ANON,
        "Authorization": `Bearer ${currentToken}`,
        "Content-Type":  "application/json",
        "Prefer":        "return=representation",
      },
      body: JSON.stringify({ user_id: currentUser.id })
    });

    // Adopt the server's value so the display can't drift. Only fall back to a
    // local ++ when the RPC succeeded but returned nothing usable — never on a
    // failed call, which would inflate the count on every retry.
    const body = await res.json().catch(() => null);
    const serverCount = Array.isArray(body) ? body[0]?.essay_count : body?.essay_count;

    if (res.ok && typeof serverCount === "number") {
      essayCount = serverCount;
    } else if (res.ok) {
      essayCount++;
    } else {
      console.error(`incrementEssayCount failed: HTTP ${res.status}`);
      return;
    }
    updateAccountStrips();
  } catch (err) {
    console.error("incrementEssayCount error:", err);
  }
}

// Reads the daily paste-and-type usage counters for the signed-in user, then
// repaints the user bar so tier gating sees the fresh numbers.
//
// Retries once on transient failures — same policy as fetchProfile() — and only
// repaints when we actually got an answer, so a hiccup can't wipe the chip the
// user is already looking at.
async function fetchPasteTypeUsage() {
  let result = await fetchPasteTypeUsageOnce();
  if (result === "error") {
    await new Promise(r => setTimeout(r, 1200));
    result = await fetchPasteTypeUsageOnce();
  }

  // "unavailable" still repaints: it means "zeroed", which the gate must respect.
  if (result === "ok" || result === "unavailable") {
    updateAccountStrips();
    schedulePasteTypeResetRefresh();
  }
  return result;
}

async function fetchPasteTypeUsageOnce() {
  if (!currentToken || !currentUser) return "auth";

  const url  = `${SUPABASE_URL}/rest/v1/users?id=eq.${currentUser.id}&select=pastetype_count,pastetype_reset_at`;
  const auth = () => ({ apikey: SUPABASE_ANON, Authorization: `Bearer ${currentToken}` });

  let res;
  try {
    res = await fetch(url, { headers: auth() });
  } catch (err) {
    console.error("fetchPasteTypeUsage network error:", err);
    return "error";
  }

  if (res.status === 401 || res.status === 403) {
    const recovered = await ensureValidToken();
    if (!recovered) return "auth";
    try {
      res = await fetch(url, { headers: auth() });
    } catch (err) {
      console.error("fetchPasteTypeUsage retry network error:", err);
      return "error";
    }
    if (!res.ok) {
      if (res.status === 400) {
        console.warn("fetchPasteTypeUsage: pastetype columns not deployed, treating as unused");
        return zeroPasteTypeUsage("unavailable");
      }
      return "error";
    }
  } else if (res.status === 400) {
    // Column-level rejection on the first attempt — same schema gap, no retry.
    console.warn("fetchPasteTypeUsage: pastetype columns not deployed, treating as unused");
    return zeroPasteTypeUsage("unavailable");
  } else if (!res.ok) {
    console.error(`fetchPasteTypeUsage failed: HTTP ${res.status}`);
    return "error";
  }

  let rows;
  try {
    rows = await res.json();
  } catch (err) {
    console.error("fetchPasteTypeUsage parse error:", err);
    return "error";
  }

  if (rows && rows.length > 0) {
    pasteTypeCount   = rows[0].pastetype_count || 0;
    pasteTypeResetAt = rows[0].pastetype_reset_at
      ? new Date(rows[0].pastetype_reset_at).getTime()
      : null;
    // The row may still hold yesterday's count because the server resets it
    // lazily inside the increment RPC. Without this, the locked button would
    // prevent that RPC from ever running again.
    expirePasteTypeUsage();
    return "ok";
  }

  // Genuine empty result — no usage recorded yet.
  return zeroPasteTypeUsage("ok");
}

function zeroPasteTypeUsage(status) {
  pasteTypeCount   = 0;
  pasteTypeResetAt = null;
  return status;
}

// Bumps the daily paste-and-type session counter server-side, then adopts the
// returned values so the panel never has to guess what the new count is.
//
// Never throws: a failure here must not interrupt a typing session that already
// completed successfully, so it just leaves the cached count alone.
async function incrementPasteTypeCount() {
  if (!currentToken || !currentUser) return;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_pastetype_count`, {
      method: "POST",
      headers: {
        "apikey":        SUPABASE_ANON,
        "Authorization": `Bearer ${currentToken}`,
        "Content-Type":  "application/json",
        "Prefer":        "return=representation",
      },
      body: JSON.stringify({ user_id: currentUser.id }),
    });

    // The RPC may not be deployed yet. Treat that as "counter unavailable"
    // instead of breaking the panel.
    if (!res.ok) {
      console.error(`incrementPasteTypeCount failed: HTTP ${res.status}`);
      return;
    }

    const body = await res.json().catch(() => null);
    const row  = Array.isArray(body) ? body[0] : body;

    // A scalar-returning RPC comes back as a bare number, not a row.
    const count = typeof body === "number"
      ? body
      : row?.pastetype_count;

    if (typeof count === "number") pasteTypeCount = count;
    if (row?.pastetype_reset_at) {
      pasteTypeResetAt = new Date(row.pastetype_reset_at).getTime();
    }

    updateAccountStrips();
    schedulePasteTypeResetRefresh();
  } catch (err) {
    console.error("incrementPasteTypeCount error:", err);
  }
}

// Clears usage once the server's reset time has passed. This deliberately runs
// against the cached timestamp as well as fresh reads: a side panel can stay
// open for days, and the button must unlock without a reload.
function expirePasteTypeUsage(now = Date.now()) {
  if (pasteTypeResetAt && now >= pasteTypeResetAt) {
    pasteTypeCount   = 0;
    pasteTypeResetAt = null;
  }
}

function schedulePasteTypeResetRefresh() {
  if (pasteTypeResetTimer) {
    clearTimeout(pasteTypeResetTimer);
    pasteTypeResetTimer = null;
  }
  if (!pasteTypeResetAt) return;

  const delay = pasteTypeResetAt - Date.now();
  if (delay <= 0) {
    expirePasteTypeUsage();
    updateAccountStrips();
    return;
  }
  // setTimeout fires immediately on delays above 2^31-1 ms.
  if (delay > 2147483647) return;

  pasteTypeResetTimer = setTimeout(() => {
    expirePasteTypeUsage();
    updateAccountStrips();
  }, delay + 1000);
}

// ─────────────────────────────────────────────
//  AUTH — ACCOUNT STRIP & TIER UI
//
//  The strip is rendered into all four signed-in page headers, so every write
//  below loops. Signed-out is the one case that has to reach further than the
//  header: the login page has no strip at all, and the others must be hidden,
//  so sign-out toggles the class on every strip and hides the whole group.
// ─────────────────────────────────────────────
function setAccountStripVisible(visible) {
  acctStrips.forEach(el => el.classList.toggle("tier-hidden", !visible));
}

function updateAccountStrips() {
  if (!currentUser) { setAccountStripVisible(false); return; }

  setAccountStripVisible(true);

  const limits = TIER_LIMITS[currentTier] || TIER_LIMITS.free;
  const maxE   = limits.essays;
  const usedPct = maxE === Infinity ? 0 : essayCount / maxE;

  // Essay usage chip. "Essays 2 / 5" was too wide for a header at 260px, so the
  // capped case is the bare fraction; the tooltip carries the full sentence.
  acctEssayEls.forEach(el => {
    if (maxE === Infinity) {
      el.textContent = `${essayCount} essays`;
      el.className   = "essay-usage";
    } else {
      el.textContent = `${essayCount} / ${maxE}`;
      el.className   = "essay-usage" +
        (usedPct >= 1 ? " usage-full" : usedPct >= 0.8 ? " usage-warn" : "");
    }
    el.title = maxE === Infinity
      ? "Essays generated this month"
      : `${essayCount} of ${maxE} essays used this month`;
  });

  // Paste & Type daily session chip
  renderPasteTypeUsage(limits);

  // Tier badge
  acctTierEls.forEach(el => {
    el.textContent = currentTier.charAt(0).toUpperCase() + currentTier.slice(1);
    el.className   = `tier-badge tier-badge-${currentTier}`;
  });

  // Upgrade button — hide for unlimited
  acctUpgradeEls.forEach(el => {
    el.style.display = currentTier === "unlimited" ? "none" : "flex";
  });

  applyTierGating();
}

// Daily paste-and-type session chip. Kept separate from the essay chip because
// the two quotas sit on different periods — essays reset monthly, these reset
// daily — so a shared chip would read as one number with two meanings.
function renderPasteTypeUsage(limits) {
  expirePasteTypeUsage();
  const pt   = limits.pasteType;
  const maxS = pt ? pt.sessionsPerDay : Infinity;

  acctPasteEls.forEach(el => {
    // Tier predates the pasteType block — hide rather than render a wrong number.
    if (maxS === undefined) {
      el.style.display = "none";
      return;
    }
    el.style.display = "";

    if (maxS === Infinity) {
      el.textContent = `Paste ${pasteTypeCount}`;
      el.className   = "essay-usage";
    } else {
      const pct = pasteTypeCount / maxS;
      el.textContent = `Paste ${pasteTypeCount} / ${maxS}`;
      el.className   = "essay-usage" +
        (pct >= 1 ? " usage-full" : pct >= 0.8 ? " usage-warn" : "");
    }

    const resetsIn = pasteTypeResetAt ? pasteTypeResetAt - Date.now() : null;
    el.title = resetsIn && resetsIn > 0
      ? `Resets in ${Math.ceil(resetsIn / 60000)} min`
      : "Daily paste & type sessions";
  });
}

// Rendered when the profile couldn't be loaded (network hiccup, 5xx). We must NOT
// show "Free" here — that would tell a paying user they're not paying. Keep the
// strip visible with an indeterminate badge and let the next retry settle it.
function renderProfilePending() {
  if (!currentUser) { setAccountStripVisible(false); return; }

  setAccountStripVisible(true);

  acctEssayEls.forEach(el => {
    el.textContent = "sync…";
    el.className   = "essay-usage";
    el.title       = "";
  });

  acctPasteEls.forEach(el => {
    el.textContent = "sync…";
    el.className   = "essay-usage";
    el.title       = "";
  });

  acctTierEls.forEach(el => {
    el.textContent = "sync";
    el.className   = "tier-badge tier-badge-unknown";
  });

  // Don't offer an upgrade we can't justify, and don't claim the user is at
  // their limit — leave the button hidden until the tier is known.
  acctUpgradeEls.forEach(el => { el.style.display = "none"; });
}

function applyTierGating() {
  const limits  = TIER_LIMITS[currentTier] || TIER_LIMITS.free;
  const isFree  = currentTier === "free";
  const atLimit = limits.essays !== Infinity && essayCount >= limits.essays;

  // Word count crown — label comes from TIER_LIMITS so it can't drift from
  // the cap the input is actually enforcing.
  wordCountCrown.classList.toggle("tier-hidden", !isFree);
  // The crown badge carries the cap, so we just ensure its text is accurate.
  if (isFree && limits.maxWords !== Infinity) {
    wordCountCrownText.textContent = `${limits.maxWords.toLocaleString()} max`;
    wordCountCrown.title = `Free plan: ${limits.maxWords.toLocaleString()} words per essay. Click to upgrade.`;
  }

  // WPM crown (on preview page)
  wpmCrown.classList.toggle("tier-hidden", !isFree);
  if (isFree && limits.maxWpm !== Infinity) {
    wpmCrownText.textContent = `${limits.maxWpm} max`;
    wpmCrown.title = `Free plan: ${limits.maxWpm} wpm max. Click to upgrade.`;
  }

  // Duration — one bar for everyone; the free tier just can't move it.
  durationTrackEl.classList.toggle("dur-locked", !canPickDuration());
  durationRangeEl.setAttribute("aria-disabled", String(!canPickDuration()));
  if (!canPickDuration()) {
    durationTrackEl.title = "Free plan runs at your natural pace. Click to upgrade.";
    // Make sure a previously-paid handle does not stay where it was.
    durationRangeEl.value = String(DURATION_MID);
    durationTouched = false;
  } else {
    durationTrackEl.title = "";
  }

  // Outline toggle — lock for free
  if (isFree) {
    outlineCrown.classList.remove("tier-hidden");
    outlineToggle.classList.add("locked");
    if (outlineOn) {
      outlineOn = false;
      outlineSw.classList.remove("on");
      outlineToggle.classList.remove("on");
    }
  } else {
    outlineCrown.classList.add("tier-hidden");
    outlineToggle.classList.remove("locked");
  }

  // Generate button — upgrade state when at essay limit
  if (atLimit) {
    genBtn.textContent = "👑 Upgrade to Generate More →";
    genBtn.classList.add("gen-btn-upgrade");
  } else {
    genBtn.textContent = "Generate →";
    genBtn.classList.remove("gen-btn-upgrade");
  }

  // Paste & Type button — locked once the daily session quota is spent.
  // maxWords is enforced at start time in the typeBtn handler, because the
  // custom-text field can grow past the cap after this runs.
  applyPasteTypeGating(limits);

  // Both capped fields and the duration range depend on the tier.
  updateWordCountMeter();
  updateCustomWordBadge();
  refreshDuration();
}

// Sessions still available today, or Infinity when uncapped. Returns 0 when the
// tier has no pasteType block, which callers read as "blocked".
function pasteTypeSessionsLeft() {
  expirePasteTypeUsage();
  const limits = TIER_LIMITS[currentTier] || TIER_LIMITS.free;
  const pt     = limits.pasteType;
  if (!pt) return 0;
  if (pt.sessionsPerDay === Infinity) return Infinity;
  return pt.sessionsPerDay - pasteTypeCount;
}

function applyPasteTypeGating(limits) {
  const pt = limits.pasteType;

  // Nothing disables this button, so make sure a stale state can't survive.
  pasteTypeBtnEl.disabled = false;

  // Tier predates the pasteType block — leave the button at its default label
  // rather than invent a limit we don't know.
  if (!pt) {
    pasteTypeBtnEl.textContent = "Type Text →";
    return;
  }

  const sessionsLeft = pasteTypeSessionsLeft();

  if (sessionsLeft <= 0) {
    // Same treatment as the essay limit: relabel as an upgrade, keep it
    // clickable so the handler can send the user to the purchase page.
    pasteTypeBtnEl.textContent = "👑 Upgrade for More Sessions →";
  } else if (sessionsLeft === Infinity) {
    pasteTypeBtnEl.textContent = "Type Text →";
  } else {
    pasteTypeBtnEl.textContent = `Type Text → (${sessionsLeft} left)`;
  }
}

// Free-tier word cap for the Paste & Type input, or Infinity when uncapped.
// 0 means the feature is fully blocked.
function pasteTypeWordCap() {
  const limits = TIER_LIMITS[currentTier] || TIER_LIMITS.free;
  const pt     = limits.pasteType;
  if (!pt) return Infinity;
  return pt.maxWords ?? Infinity;
}

function isPasteTypeActive() {
  return tabCustom && tabCustom.classList.contains("active");
}

// ─────────────────────────────────────────────
//  BOOT
// ─────────────────────────────────────────────
(async () => {
  try {
  const hasSession = await loadSession();
  if (!hasSession) {
    goTo(pageLogin);
    return;
  }
  // A stored token may be hours old — validate before trusting it, otherwise a
  // 401 downstream gets misread as "no profile row" and downgrades to free.
  if (!(await ensureValidToken())) {
    goTo(pageLogin);
    return;
  }
  renderProfileResult(await fetchProfile());
  await fetchPasteTypeUsage();
  // The typewriter is the product, so it is where a signed-in session starts.
  enterTypeMode();
  } catch (err) {
    reportRuntimeError(err, "startup");
  }
})();

// A suspended or sleeping machine can delay the reset timer, so re-check the
// window every time the panel is brought back into view.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible" || !currentUser) return;
  expirePasteTypeUsage();
  updateAccountStrips();
  schedulePasteTypeResetRefresh();
});

// Listen for token arriving after login, and for sign-out from the website
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes.sb_token) return;

  // Sign-out: the website cleared the token. Drop the cached session instead of
  // leaving a stale paid session on screen.
  if (!changes.sb_token.newValue) {
    clearSession();
    return;
  }

  chrome.storage.local.get(['sb_token', 'sb_user', 'sb_refresh'], async (data) => {
    try {
    if (data.sb_token && data.sb_user) {
      currentToken   = data.sb_token;
      currentUser    = data.sb_user;
      currentRefresh = data.sb_refresh || null;
      renderProfileResult(await fetchProfile());
      await fetchPasteTypeUsage();
      enterTypeMode();
    }
    } catch (err) {
      reportRuntimeError(err, "session refresh");
    }
  });
});

// ─────────────────────────────────────────────
//  LOGIN BUTTON
// ─────────────────────────────────────────────
loginBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: "https://getscrybe.net/login.html" });
});

// ─────────────────────────────────────────────
//  UPGRADE BUTTON
// ─────────────────────────────────────────────
acctUpgradeEls.forEach(el => {
  el.addEventListener("click", () => {
    chrome.tabs.create({ url: UPGRADE_URL });
  });
});

// ─────────────────────────────────────────────
//  TYPE TEXT SHORTCUT (secondary button on the Generate page)
// ─────────────────────────────────────────────
pasteTypeBtnEl.addEventListener("click", () => {
  // Out of daily sessions — route to the upgrade page instead of opening the
  // editor, matching how the Generate button behaves at its essay limit.
  if (pasteTypeSessionsLeft() <= 0) {
    chrome.tabs.create({ url: UPGRADE_URL });
    return;
  }

  enterTypeMode();
  setTimeout(() => customTextEl.focus(), 50);
});

// ─────────────────────────────────────────────
//  SUBJECT
// ─────────────────────────────────────────────
subjectEl.addEventListener("change", () => {
  if (subjectEl.value === "other") {
    otherWrap.classList.add("visible");
    otherSubjectEl.focus();
  } else {
    otherWrap.classList.remove("visible");
  }
});

function getSubject() {
  if (subjectEl.value === "other") return otherSubjectEl.value.trim() || "Other";
  return subjectEl.value || "General";
}

// ─────────────────────────────────────────────
//  NUMERIC GUARDS
// ─────────────────────────────────────────────
function enforceNumeric(el, min, max) {
  el.addEventListener("keydown", (e) => {
    const allowed = ["Backspace","Delete","Tab","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"];
    if (allowed.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  });
  el.addEventListener("input", () => {
    let raw = el.value.replace(/\D/g, "");
    const maxLen = String(max).length;
    if (raw.length > maxLen) raw = raw.slice(0, maxLen);
    if (raw !== "" && parseInt(raw) > max) raw = String(max);
    el.value = raw;
  });
  el.addEventListener("blur", () => {
    const v = parseInt(el.value);
    if (!isNaN(v) && v < min) el.value = String(min);
  });
}

enforceNumeric(wordCountEl, 50, 99999);
enforceNumeric(wpmEl, 1, 800);

// Cap word count for free tier on blur/input
wordCountEl.addEventListener("change", enforceTierWordCap);
wordCountEl.addEventListener("blur",   enforceTierWordCap);

// `input` runs before the `input`-meter listener registered further down, so the
// clamp lands first and the meter then reads the corrected value — no flash of a
// full bar. enforceNumeric's own input listener also truncates digits; a leading
// "9" can exceed the cap on its own (e.g. 9 then 50), so this is not redundant.
wordCountEl.addEventListener("input", enforceTierWordCap);

wordCountEl.addEventListener("blur", () => { wordCapToastShown = false; });

// Latched so a fast typist pushing past the cap gets one message rather than a
// toast per keystroke. Cleared as soon as the value is back under the cap, and
// on blur, so the next deliberate attempt speaks up again.
let wordCapToastShown = false;

function enforceTierWordCap() {
  const limits = TIER_LIMITS[currentTier] || TIER_LIMITS.free;
  // No meter update here any more: the live meter moved to the Type page and
  // reads the pasted text, so this input has nothing left to drive.
  if (limits.maxWords === Infinity) { wordCapToastShown = false; return; }
  const val = parseInt(wordCountEl.value);
  if (!isNaN(val) && val > limits.maxWords) {
    // Clamping mid-typing used to wait for blur, which meant the user could sit
    // on an invalid 900 for as long as they liked with only a 9px badge for
    // company. Correcting on `input` is what makes the ceiling feel like a
    // ceiling. The toast says why, since the snap-back is otherwise silent.
    wordCountEl.value = String(limits.maxWords);
    flashElement(wordCountEl, "input-cap-flash");
    flashElement(wordCountCrown, "lock-flash");
    if (!wordCapToastShown) {
      wordCapToastShown = true;
      showToast(
        `${labelForTier(currentTier)} plan caps essays at ${limits.maxWords.toLocaleString()} words.`,
        "warn", { label: "Upgrade", onClick: openUpgrade });
    }
  } else if (!isNaN(val) && val < limits.maxWords) {
    wordCapToastShown = false;
  }
}

wordCountEl.addEventListener("blur", () => { wordCapToastShown = false; });

// Cap WPM for free tier on blur/input
wpmEl.addEventListener("change", enforceTierWpmCap);
wpmEl.addEventListener("blur",   enforceTierWpmCap);

function enforceTierWpmCap() {
  const limits = TIER_LIMITS[currentTier] || TIER_LIMITS.free;
  if (limits.maxWpm === Infinity) return;
  const val = parseInt(wpmEl.value);
  if (!isNaN(val) && val > limits.maxWpm) {
    wpmEl.value = String(limits.maxWpm);
    flashElement(wpmEl, "input-cap-flash");
    flashElement(wpmCrown, "lock-flash");
    // Clamping the field fires no `change` event, so the natural duration has
    // to be recomputed here or it stays stuck on the pre-clamp pace.
    refreshDuration();
  }
}

function flashElement(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth; // reflow to restart animation
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 750);
}

// ─────────────────────────────────────────────
//  FREE-TIER LIMIT VISIBILITY
//
//  The old behaviour clamped the input on blur, which meant the limit only
//  announced itself after the user had already tried to exceed it. Now both
//  capped fields show the ceiling live, with the crown badges as the upgrade
//  affordance — they already looked clickable, so they had better be.
// ─────────────────────────────────────────────
function limitState(pct) {
  return pct >= 1 ? " usage-full" : pct >= 0.8 ? " usage-warn" : "";
}

// Live word meter for the pasted text on the Type page.
//
//  This used to be the Generate form's word-count meter and read #wordCount
//  against TIER_LIMITS[].maxWords. The Generate page now carries only the crown
//  badge, because a number under the input restated the badge sitting right
//  above it — so the meter moved here, where the text is actually countable.
//  Both halves of that move matter: the cap is the pasteType cap, not the essay
//  cap, and the source is the pasted text rather than a requested figure.
//  (It also retires a duplicate-ID bug — #wordCountMeter existed on both pages,
//  so getElementById only ever bound this function to the Generate copy and the
//  Type page's meter never rendered.)
// `words` is passed in from the textarea's input handler, which has already
// counted them; left off, the meter counts for itself (tier changes, boot).
function updateWordCountMeter(words) {
  const cap    = pasteTypeWordCap();
  const capped = cap !== Infinity;

  wordCountMeter.classList.toggle("tier-hidden", !capped);
  if (!capped) return;

  if (words === undefined) {
    words = customTextEl.value.trim().split(/\s+/).filter(Boolean).length;
  }
  const pct = cap > 0 ? words / cap : 0;

  wordCountFill.style.width = (Math.min(1, pct) * 100).toFixed(1) + "%";
  wordCountFill.className    = "limit-meter-fill" + limitState(pct);
  wordCountMeterLabel.textContent = `${words.toLocaleString()} / ${cap.toLocaleString()}`;
  wordCountMeterLabel.className   = "limit-meter-label" + limitState(pct);
}

// Pasted text on the Type page, capped by the pasteType block rather than the
// essay block — a different number for the same user, which is exactly why the
// old shared wording was so easy to misread.
function updateCustomWordBadge() {
  const cap   = pasteTypeWordCap();
  const words = customTextEl.value.trim().split(/\s+/).filter(Boolean).length;

  if (words === 0) {
    customWordCountBadge.textContent = "— words";
    customWordCountBadge.className   = "word-count-badge";
    customWordCountBadge.title       = "Words in your text";
    updateCapBanner(0, cap);
    return;
  }

  if (cap === Infinity) {
    customWordCountBadge.textContent = `${words.toLocaleString()} words`;
    customWordCountBadge.className   = "word-count-badge";
    customWordCountBadge.title       = "Words in your text";
    updateCapBanner(words, cap);
    return;
  }

  const pct = cap > 0 ? words / cap : 0;
  const over = pct > 1;

  // "PRO" marks the limit itself; "OVER" marks having gone past it. Two states
  // because the remedy differs — trim it, or upgrade.
  customWordCountBadge.textContent =
    `${words.toLocaleString()} / ${cap.toLocaleString()}${over ? " · OVER" : pct >= 1 ? " · PRO" : ""}`;
  // at-cap/over-cap carry a filled pill as well as a colour, which is what makes
  // this the loudest element in the panel once the limit is reached. The old
  // grey mono chip was easy to read straight past.
  customWordCountBadge.className   =
    "word-count-badge" + limitState(pct) + (over ? " over-cap" : pct >= 1 ? " at-cap" : "");
  customWordCountBadge.title = over
    ? `Over the ${cap.toLocaleString()} word limit — click to upgrade`
    : pct >= 1
      ? `At the ${cap.toLocaleString()} word limit — click to upgrade`
      : `${(cap - words).toLocaleString()} words left on this plan`;

  updateCapBanner(words, cap);
}

// Banner under the text box. Appears as soon as the count reaches the cap rather
// than when Start Typing refuses, so the user is never one click away from being
// told off.
function updateCapBanner(words, cap) {
  if (cap === Infinity || words < cap) {
    customCapBanner.classList.add("tier-hidden");
    return;
  }

  const over = words > cap;
  const proCap = (TIER_LIMITS.pro.pasteType || {}).maxWords;

  customCapBanner.classList.remove("tier-hidden");
  customCapBanner.classList.toggle("over", over);
  customCapTitle.textContent = over
    ? `${words.toLocaleString()} words is over this plan's ${cap.toLocaleString()}`
    : `This plan types up to ${cap.toLocaleString()} words`;
  customCapSub.textContent = over
    ? "Trim the text to continue, or upgrade to type up to " + (proCap === Infinity ? "any length" : proCap.toLocaleString() + " words") + "."
    : (proCap === Infinity
        ? "Upgrade to type text of any length."
        : `Upgrade to type up to ${proCap.toLocaleString()} words.`);
}

// Every crown badge is an upgrade link, including the ones that predate this.
wordCountCrown.addEventListener("click",    () => chrome.tabs.create({ url: UPGRADE_URL }));
wpmCrown.addEventListener("click",         () => chrome.tabs.create({ url: UPGRADE_URL }));
customWordCountBadge.addEventListener("click", () => {
  // Only the capped state is an upsell; otherwise just focus the text.
  if (pasteTypeWordCap() !== Infinity) chrome.tabs.create({ url: UPGRADE_URL });
  else customTextEl.focus();
});

customCapUpgrade.addEventListener("click", () => chrome.tabs.create({ url: UPGRADE_URL }));

// ─────────────────────────────────────────────
//  OUTLINE TOGGLE
// ─────────────────────────────────────────────
let outlineOn = false;

outlineToggle.addEventListener("click", () => {
  const isFree = currentTier === "free";
  if (isFree) {
    // Flash the crown and open upgrade page
    flashElement(outlineCrown, "lock-flash");
    chrome.tabs.create({ url: UPGRADE_URL });
    return;
  }
  outlineOn = !outlineOn;
  outlineSw.classList.toggle("on", outlineOn);
  outlineToggle.classList.toggle("on", outlineOn);
});

// ─────────────────────────────────────────────
//  VALIDATION
// ─────────────────────────────────────────────
function markError(el) {
  el.classList.add("input-error");
  el.addEventListener("input",  () => el.classList.remove("input-error"), { once: true });
  el.addEventListener("change", () => el.classList.remove("input-error"), { once: true });
}

function validate() {
  let hasError = false;
  if (!subjectEl.value)                                             { markError(subjectEl);      hasError = true; }
  if (subjectEl.value === "other" && !otherSubjectEl.value.trim()) { markError(otherSubjectEl); hasError = true; }
  if (!parseInt(wordCountEl.value))                                 { markError(wordCountEl);    hasError = true; }
  if (!instructionsEl.value.trim())                                 { markError(instructionsEl); hasError = true; }
  return !hasError;
}

// ─────────────────────────────────────────────
//  BUILD PROMPT
// ─────────────────────────────────────────────
function gradeLevelGuide(level) {
  const guides = {
    "9":       "9th-grade level: keep it simple; clear, direct sentences; everyday academic vocabulary; short paragraphs; avoid rare or fancy words.",
    "10":      "10th-grade level: straightforward academic vocabulary; mostly simple-to-medium sentences with a few complex ones.",
    "11":      "11th-grade level: solid academic vocabulary; varied sentence lengths; comfortable complex sentences; some subject-specific terms.",
    "12":      "12th-grade level: strong academic vocabulary; confident complex sentences; precise wording; mature but not ornate.",
    "college": "College level: sophisticated, precise vocabulary; full range of sentence structures; nuanced and confident academic writing.",
  };
  return guides[level] || guides["college"];
}

// Auto-picked per humanize variant, so best-of-N scoring also picks the style.
const WRITING_STYLES = [
  {
    name: "Direct and argumentative",
    desc: "This writer takes a clear stance early and defends it forcefully. Sentences lean shorter; claims are stated plainly (\"the data does not support that view\"), and counterpoints are dismissed rather than entertained. Word choices are exact but never fancy. A few paragraphs run long, others are short.",
  },
  {
    name: "Measured and analytical",
    desc: "A careful, even-handed writer. Weighs both sides before concluding, hedges honestly (\"the evidence mostly points to\", \"on balance\"), and mixes long deliberate sentences with short ones. Reaches for concrete details and qualified claims over absolutes.",
  },
  {
    name: "Concise and plainspoken",
    desc: "Gets straight to the point and stays there. Short paragraphs, plain words, minimal ornament. Often skips transitions altogether or uses \"so\", \"but\", \"then\". Sounds like someone who wants the draft done but still makes the argument clearly.",
  },
  {
    name: "Personal and reflective",
    desc: "First-person and a little introspective. Uses \"I think\", \"what stood out to me\", and occasional informal asides. Reaches for the exact word, mixes precise academic terms with everyday ones, and is comfortable saying what surprised or bothered them.",
  },
  {
    name: "Scholarly but natural",
    desc: "Keeps a formal academic register with natural human rhythm: varied sentence lengths, plain phrasing where possible, no stiffness. Reads like a strong paper written in one sitting by a real person, not a template.",
  },
];

function styleGuide(style) {
  return `Writing style — ${style.name}: ${style.desc}`;
}

function buildPrompt(includeOutline) {
  const subject      = getSubject();
  const grade        = document.getElementById("grade").value;
  const gradeLevel   = gradeLevelEl.value;
  const wordCount    = parseInt(wordCountEl.value);
  const rubric       = rubricEl.value.trim();
  const instructions = instructionsEl.value.trim();
  const lines = [];

  lines.push(`You are an expert academic writer. Write a high quality ${grade}-level essay on the following for the subject: ${subject}.`);
  lines.push("");

  if (instructions) {
    lines.push("## Assignment Instructions");
    lines.push(instructions);
    lines.push("");
  }

  if (rubric) {
    lines.push("## Rubric / Grading Criteria");
    lines.push("Address every criterion listed below thoroughly:");
    lines.push(rubric);
    lines.push("");
  }

  if (includeOutline) {
    lines.push("## Format");
    lines.push("First write a structured outline with Roman numerals (Introduction, Body points, Conclusion).");
    lines.push("Then write the separator exactly: ---ESSAY---");
    lines.push("Then write the full essay.");
    lines.push("");
  }

  lines.push("## Requirements");
  lines.push(`- Write about ${wordCount} words. The hard maximum is ${wordCount} words — do not exceed it.`);
  lines.push(`- Grade target: ${grade}`);
  lines.push(`- ${gradeLevelGuide(gradeLevel)}`);
  lines.push(`- Strong thesis statement in the introduction`);
  lines.push(`- Each body paragraph must have a clear topic sentence, evidence, and analysis`);
  lines.push(`- Use subject-specific vocabulary and examples relevant to ${subject}`);
  lines.push(`- Formal academic tone throughout`);
  lines.push(`- No bullet points or headers in the essay itself`);
  lines.push(`- Conclusion must synthesize the argument, not just restate it`);
  lines.push(`- Plain text only, no markdown, no bold, no italics, no asterisks`);

  return lines.join("\n");
}

// ─────────────────────────────────────────────
//  DEEPSEEK CALL
// ─────────────────────────────────────────────
async function callDeepSeek(prompt, temperature = 0.7) {
  const valid = await ensureValidToken();
  if (!valid) throw new Error("Session expired — please sign in again.");
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/generate-essay`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentToken}`,
      },
      body: JSON.stringify({ prompt, temperature }),
    }
  );
  const raw = await response.text();
  if (!response.ok) throw new Error(`Server error ${response.status}: ${raw}`);
  return JSON.parse(raw).choices[0].message.content
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1");
}

// ─────────────────────────────────────────────
//  AI-TELL ANALYZER + BEST-OF-N HUMANIZER
//  Detection signals grounded in the published
//  AI-detection literature (perplexity, burstiness,
//  hedge density, transition fingerprint, structural
//  tells). Rules ported from MIT-licensed projects:
//  blader/humanizer, harshaneel/humanize (50+ sources),
//  imsv1301/unmask-ai, brandonwise/humanizer
// ─────────────────────────────────────────────

const AI_TELL_WORDS = [
  // core AI vocabulary
  "delve", "delving", "leverage", "leveraged", "leveraging", "utilize", "utilizing",
  "robust", "comprehensive", "streamline", "streamlining", "foster", "fostered",
  "fostering", "facilitate", "facilitating", "pivotal", "nuanced", "multifaceted",
  "enduring", "garner", "vibrant", "tapestry", "tapestries", "testament", "interplay",
  "intricate", "intricacies", "showcase", "showcased", "showcasing", "underscore",
  "underscores", "underscored", "underscoring", "transformative", "paradigm", "synergy",
  "holistic", "seamless", "seamlessly", "cutting-edge", "state-of-the-art", "elevate",
  "elevating", "embark", "embarking", "realm", "navigate", "navigating", "ever-evolving",
  "meticulous", "profound", "deeply rooted", "evolving landscape", "landscape of",
  "in the realm of", "a myriad of", "a plethora of", "sets the stage", "focal point",
  "indelible mark", "key turning point", "setting the stage",
  // hedge / softener clusters
  "it is important to note", "it is worth noting", "it is worth mentioning", "notably",
  "in many cases", "generally speaking", "it can be argued",
  // filler / formula openers and closers
  "in today's", "in today’s", "in conclusion", "in summary", "to summarize",
  "it goes without saying", "needless to say", "at the end of the day", "at its core",
  "turns out", "it turns out that",
  // AI transition fingerprint
  "furthermore", "moreover", "additionally", "it is clear that", "this highlights",
  "this underscores", "as previously mentioned",
  // promotional register
  "breathtaking", "must-visit", "stunning", "boasts a rich", "renowned for",
  "groundbreaking", "nestled in the heart of", "in the heart of",
  // persuasive authority tropes
  "the real question is", "what really matters", "fundamentally", "the deeper issue",
  "the heart of the matter", "in reality",
];

const AI_TELL_PATTERNS = [
  ["em dash", /\u2014/g, 2],
  ["negation framing ('not X, it's Y')", /\bnot (just|about|merely)\b[^.!?]{1,70}\bit['\u2019]s\b/gi, 2],
  ["negation framing ('it's not X, it's Y')", /\bit['\u2019]s not (about|just)\b[^.!?]{1,70}\b(it['\u2019]s|but)\b/gi, 2],
  ["'-ing' padding", /\b(highlighting|underscoring|emphasizing|symbolizing|ensuring|reflecting|showcasing|fostering|cultivating|contributing to|exemplifying)\b/gi, 1],
  ["rhetorical opener", /^(in today['\u2019]s|when it comes to|it is important to note|it is worth noting|undoubtedly|in the ever-evolving|in this essay|this essay will)/im, 1],
  ["signpost phrase", /\b(dive into|let['\u2019]s dive in|goes without saying|as we delve|last but not least|without further ado)\b/gi, 1],
  ["significance padding", /\b(is|serves as|stands as|plays)\s+(a\s+|as\s+)?(crucial|vital|key|pivotal|essential|significant)\s+(role|moment|part)\b/gi, 2],
  ["transition opener", /^(furthermore|moreover|additionally|in addition|on the other hand)\s*,/gim, 2],
  ["'this + highlight/underscore'", /\bthis\s+(highlights|underscores|demonstrates|emphasizes)\s+the\s+importance\b/gi, 2],
  ["legacy verdict ('that legacy matters')", /\blegacy (matters|mattered)\b/gi, 2],
  ["significance verdict ('matters enormously')", /\b(matters|mattered) enormously\b/gi, 2],
  ["'real and transformative' verdict", /\b(was|were) real and (transformative|profound|significant|meaningful|lasting)\b/gi, 2],
  ["verdict clause ('that showed just how limited')", /\bthat (showed|shows|proves|proved|demonstrates|demonstrated|highlighted|underscored)( just)? how (limited|important|powerful|significant)\b/gi, 2],
  ["moral-power cliché", /\bmoral (power|weight|authority|force)\b/gi, 2],
];

const CONNECTOR_WORDS = [
  "however", "therefore", "thus", "consequently", "nevertheless", "furthermore",
  "moreover", "additionally", "in addition", "in conclusion", "as a result",
  "for instance", "for example",
];

const HEDGE_WORDS = [
  "often", "generally", "typically", "in many cases", "it can be argued",
  "can often", "may lead to", "tends to", "one might", "it is possible that",
];

const HUMANIZE_VARIANTS = 3;
const HUMANIZE_MAX_FIX_ROUNDS = 2;
const HUMANIZE_FIX_THRESHOLD = 5;
const HUMANIZE_MIN_COV = 0.30;

function sentenceLengths(text) {
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.split(/\s+/).filter(Boolean).length);
}

function burstinessCoV(lengths) {
  if (lengths.length < 4) return 0.5;
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  if (!mean) return 0;
  const variance = lengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lengths.length;
  return Math.sqrt(variance) / mean;
}

function countSimilarRuns(lengths) {
  let runs = 0;
  for (let i = 0; i + 2 < lengths.length; i++) {
    if (Math.abs(lengths[i] - lengths[i + 1]) <= 5 &&
        Math.abs(lengths[i + 1] - lengths[i + 2]) <= 5) runs++;
  }
  return runs;
}

function sentenceOpenerDiversity(text) {
  const openers = text.split(/[.!?]+/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => (s.split(/\s+/)[0] || "").toLowerCase().replace(/[^a-z]/g, ""));
  if (!openers.length) return 1;
  return new Set(openers).size / openers.length;
}

function textMentions(low, phrase) {
  if (/[ \u2019'-]/.test(phrase) || phrase.includes(".")) return low.includes(phrase);
  return new RegExp("\\b" + phrase + "\\b").test(low);
}

function countOccurrences(low, list) {
  let n = 0;
  list.forEach(phrase => {
    if (/[ \u2019'-]/.test(phrase) || phrase.includes(".")) {
      let i = low.indexOf(phrase);
      while (i !== -1) { n++; i = low.indexOf(phrase, i + 1); }
    } else {
      const m = low.match(new RegExp("\\b" + phrase + "\\b", "g"));
      if (m) n += m.length;
    }
  });
  return n;
}

function repeatedTrigrams(low) {
  const words = low.split(/\s+/)
    .map(w => w.replace(/[^a-z]/g, ""))
    .filter(Boolean);
  const seen = new Set();
  let reps = 0;
  for (let i = 0; i + 2 < words.length; i++) {
    const key = words[i] + " " + words[i + 1] + " " + words[i + 2];
    if (seen.has(key)) reps++;
    else seen.add(key);
  }
  return reps;
}

function analyzeHumanTells(text) {
  const low = text.toLowerCase();
  const lengths = sentenceLengths(text);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const wordHits = AI_TELL_WORDS.filter(w => textMentions(low, w));

  const patternHits = [];
  AI_TELL_PATTERNS.forEach(([name, re, weight]) => {
    const matches = text.match(re);
    if (matches && matches.length) patternHits.push({ name, count: matches.length, weight });
  });

  const connectorCount = countOccurrences(low, CONNECTOR_WORDS);
  const hedgeCount = countOccurrences(low, HEDGE_WORDS);
  const cov = burstinessCoV(lengths);
  const similarRuns = countSimilarRuns(lengths);
  const openerDiversity = sentenceOpenerDiversity(text);
  const trigramReps = repeatedTrigrams(low);

  let score = 0;
  score += wordHits.length;
  score += patternHits.reduce((a, p) => a + p.weight * p.count, 0);
  if (connectorCount >= 3) score += connectorCount - 2;
  if (hedgeCount >= 2) score += hedgeCount - 1;
  if (cov < HUMANIZE_MIN_COV) score += 2;
  if (wordCount >= 150 && similarRuns >= 3) score += 2;
  if (wordCount >= 150 && !lengths.some(l => l < 8)) score += 2;
  if (wordCount >= 80 && openerDiversity < 0.5) score += 2;
  if (trigramReps > 0) score += 1;

  return {
    score, cov, wordHits, patternHits,
    connectorCount, hedgeCount, similarRuns, openerDiversity, trigramReps,
    lengths, wordCount,
  };
}

// ─────────────────────────────────────────────
//  HUMANIZE — best-of-N rewrite + verify loop
// ─────────────────────────────────────────────

// Deterministic cleanup applied to every final essay: no dashes, no huge words.
const SIMPLIFY_MAP = {
  "utilize": "use", "utilizes": "uses", "utilizing": "using", "utilized": "used",
  "subsequently": "then", "consequently": "so", "therefore": "so", "thus": "so",
  "nevertheless": "still", "nonetheless": "still", "moreover": "also",
  "furthermore": "also", "additionally": "also",
  "demonstrate": "show", "demonstrates": "shows", "demonstrated": "showed", "demonstrating": "showing",
  "obtain": "get", "obtains": "gets", "obtained": "got", "obtaining": "getting",
  "numerous": "many", "commence": "start", "commences": "starts", "commenced": "started",
  "commencing": "starting", "endeavor": "try", "endeavors": "tries", "endeavored": "tried",
  "endeavoring": "trying", "pivotal": "key", "crucial": "key", "vital": "key",
  "essential": "key", "paramount": "key", "facilitate": "help", "facilitates": "helps",
  "facilitating": "helping", "facilitated": "helped", "meticulous": "careful",
  "profound": "deep", "cognizant": "aware", "imperative": "important",
  "fundamental": "basic", "substantial": "big",
};

function stripDashes(text) {
  return text
    .replace(/\s*[\u2014\u2013]\s*/g, ", ")
    .replace(/([A-Za-z])\s+-\s+(?=[A-Za-z])/g, "$1, ")
    .replace(/\s*,(\s*,)+/g, ",")
    .replace(/\s*,([.!?])/g, "$1")
    .trim();
}

function simplifyVocabulary(text) {
  text = text.replace(/\bin addition\b/gi, m => /^[A-Z]/.test(m) ? "Also" : "also");
  text = text.replace(/\baforementioned\b/gi, m => /^[A-Z]/.test(m) ? "Mentioned earlier" : "mentioned earlier");
  const out = text.split(/(\s+)/).map(token => {
    if (!/[A-Za-z]/.test(token)) return token;
    const m = token.match(/^([^A-Za-z]*)([A-Za-z][A-Za-z'\u2019-]*)([^A-Za-z]*)$/);
    if (!m) return token;
    const [, pre, word, post] = m;
    const rep = SIMPLIFY_MAP[word.toLowerCase()];
    if (!rep) return token;
    const replaced = /^[A-Z]/.test(word) ? rep.charAt(0).toUpperCase() + rep.slice(1) : rep;
    return pre + replaced + post;
  });
  return out.join("");
}

function postProcessEssay(text) {
  return simplifyVocabulary(stripDashes(text));
}

// LLMs routinely overshoot word counts, so enforce the limit deterministically.
// Truncates at a sentence boundary when possible; hard-cuts only as a fallback.
function capWordCount(text, maxWords) {
  if (!text) return text;
  if (!maxWords || maxWords <= 0) return text;
  const wordList = text.trim().split(/\s+/).filter(Boolean);
  if (wordList.length <= maxWords) return text.trim().replace(/[ \t]{2,}/g, " ");

  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
  let out = "";
  let count = 0;
  for (const s of sentences) {
    const n = s.split(/\s+/).filter(Boolean).length;
    if (count + n > maxWords) break;
    out += s;
    count += n;
  }
  out = out.trim().replace(/[ \t]{2,}/g, " ");
  if (out) return out;
  return wordList.slice(0, maxWords).join(" ");
}

function buildHumanizePrompt(draft, gradeLevel, style) {
  return `Rewrite this essay so it reads like one real person wrote it in a single sitting — not generated text — while keeping the original content intact. Use this writing style:

${styleGuide(style)}

Grade: ${gradeLevelGuide(gradeLevel)}

The result must also score as human on AI-writing detectors (GPTZero / Turnitin-style), which measure perplexity (how predictable each word is), burstiness (how varied sentence lengths are), and look for AI vocabulary, formulaic structure, and uniform rhythm.

Keep the style's voice consistent across the whole essay — every paragraph should sound like the same mind produced it. Vary the architecture from paragraph to paragraph: do not build more than one or two paragraphs on the exact same topic-sentence-to-evidence-to-analysis-to-link shape, and vary paragraph lengths (one short, 3-5 sentence paragraph is fine and human). Sometimes open a paragraph with the concrete detail, a question, or a plain claim instead of the topic sentence.

Hard rules (never break these):
- Keep the core arguments, thesis, evidence, and every fact exactly the same. Never invent facts, quotes, names, numbers, or citations.
- Keep the word count the same as the original essay. Never exceed the original essay's word count.
- No em dashes (—) at all. Never use dashes to separate clauses.
- No "not just X, it's Y" or "it's not about X, it's about Y" framing. Say what something IS, not what it ISN'T.
- No AI-vocabulary words or phrases: delve, leverage, utilize, robust, comprehensive, streamline, foster, facilitate, pivotal, nuanced, multifaceted, testament, tapestry, showcase, underscore, furthermore, moreover, additionally, "in conclusion", "in today's", "it is important to note", "it is worth noting", "dive into", "plays a crucial role", "this highlights", "not only X but also Y".
- Ban these formulaic openers: "One of the most", "This essay will", "In today's society", "In conclusion", "To conclude", "Overall," (as a paragraph opener), "It is important to note that", "plays a crucial/important/significant role".
- Ban significance-verdict sentences that only exist to pronounce how important or lasting something was: "the victories were real and transformative", "that legacy matters enormously", "this showed just how limited legislative change can be", "these were fundamental changes", "a landmark moment". To show something mattered, name a concrete consequence (a number, a law, a reaction, a before-and-after) instead of pronouncing a verdict.
- Avoid tag-on verdict clauses glued with "and" or "but" (e.g. "X proved real economic and moral power, and that energy pushed the victories forward"). If a clause only adds a verdict, cut the whole clause or split the sentence.
- Avoid moral-power and abstraction clusters ("real economic and moral power", "entrenched poverty", "wielded real power", "dismantled the legal framework").
- Use straight apostrophes only (') — never curly ones.
- Plain text only. No markdown, bold, italics, asterisks, bullet points, or headers.

How to sound human (still guarded by the style):
- Concrete over abstract: whenever you explain what something means, tie it to a specific, plain fact — a number, a name, a date, a concrete action — not a significance verdict. Prefer the Human examples over the AI ones:
  AI: "The legal and political victories were real and transformative."
  Human: "Black voter registration in the South shot up."
  AI: "It dismantled the legal framework of segregation, and that legacy matters enormously."
  Human: "You can see the impact in the numbers."
- Default to short, plain sentences (under ~18 words) when they carry the point. Split most compound sentences joined by "and" or "but" into two. A few long sentences are fine, but long-and-abstract is not.
- Word choice (perplexity): pick unexpected-but-natural words, not the safest generic option. Replace vague fillers like "significant", "important", "various", "many" with something specific to the essay. A person reaches for the precise word, and sometimes an ordinary one.
- Rhythm (burstiness): vary sentence length a lot. No 3 consecutive sentences within 5 words of the same length. Every ~150-word stretch needs at least one very short sentence (under 8 words) and at least one long one (over 30 words). Vary how sentences START — do not begin several sentences in a row with "The", "This", "It", or "One".
- Let a handful of small imperfections, informal moments, and personal reactions appear naturally wherever they fit — do not manufacture them mechanically in one spot.
- Hedge only when genuinely uncertain; assert claims directly, as the style allows.
- Use at most two transition words like "however", "therefore", "so", "in addition" across the whole essay. Connect with "but", "so", "then", or nothing.
- Make the conclusion land naturally — even slightly unfinished — rather than announcing it.

After the rewritten essay, add a line containing exactly ---AUDIT---, then list any AI-tells still remaining in your rewrite (banned words, em dashes, negation framing, significance or legacy verdicts, uniform sentence rhythm, repeated openers, overused transitions, formulaic paragraph shapes). If none remain, write "none".

Essay to rewrite:
${draft}`;
}

function buildFixPrompt(essay, analysis, extraAudit) {
  const items = [];
  if (analysis.wordHits.length) items.push("Banned AI words: " + analysis.wordHits.join(", "));
  analysis.patternHits.forEach(p => items.push("Pattern \"" + p.name + "\" appears " + p.count + "x"));
  if (analysis.connectorCount >= 3) items.push("Too many transition words (" + analysis.connectorCount + " total: however/therefore/furthermore/moreover/additionally etc.). Keep at most 2.");
  if (analysis.hedgeCount >= 2) items.push("Too many hedges (" + analysis.hedgeCount + "): often/generally/typically/it can be argued. Assert directly.");
  if (analysis.cov < HUMANIZE_MIN_COV) items.push("Sentence rhythm too uniform (length variation coefficient " + analysis.cov.toFixed(2) + "; human range is roughly 0.4-0.8). Vary sentence lengths.");
  if (analysis.wordCount >= 150 && analysis.similarRuns >= 3) items.push(analysis.similarRuns + " groups of 3+ consecutive sentences have similar lengths. Break up the rhythm.");
  if (analysis.wordCount >= 150 && !analysis.lengths.some(l => l < 8)) items.push("No short sentences anywhere. Add at least one short sentence or fragment.");
  if (analysis.wordCount >= 80 && analysis.openerDiversity < 0.5) items.push("Too many sentences start the same way (opener variety " + analysis.openerDiversity.toFixed(2) + "). Vary sentence openings.");
  if (analysis.trigramReps > 0) items.push("A 3-word phrase is repeated. Remove the repetition.");
  if (extraAudit) items.push("Model audit: " + extraAudit);
  return [
    "Fix ONLY the AI-tells listed below in the essay. Do not change facts, arguments, thesis, or the overall word count. Keep the current voice and style.",
    "Remaining AI-tells:",
    ...items.map(i => "- " + i),
    "Return only the corrected essay, plain text, nothing else. No markdown, no headers, no bullets.",
    "Essay:",
    essay,
  ].join("\n");
}

function splitEssayAndAudit(raw) {
  const parts = raw.split(/\s*-{2,}\s*AUDIT\s*-{2,}\s*/i);
  const essay = parts.length > 1 ? (parts[0] || "").trim() : raw.trim();
  const audit = parts.length > 1 && !/^none$/i.test((parts[1] || "").trim())
    ? (parts[1] || "").trim()
    : "";
  return { essay, audit };
}

async function humanize(draft, gradeLevel, maxWords) {
  // Best-of-N: generate variants in parallel, score each locally, ship the best.
  const temps = [0.8, 0.9, 1.0];
  const variants = await Promise.all(
    temps.slice(0, HUMANIZE_VARIANTS).map(t => {
      const style = WRITING_STYLES[Math.floor(Math.random() * WRITING_STYLES.length)];
      return callDeepSeek(buildHumanizePrompt(draft, gradeLevel, style), t)
        .then(splitEssayAndAudit)
        .catch(() => null);
    })
  );

  let best = null;
  variants.forEach(candidate => {
    if (!candidate || !candidate.essay) return;
    candidate.analysis = analyzeHumanTells(candidate.essay);
    if (!best || candidate.analysis.score < best.analysis.score) best = candidate;
  });

  const draftWords = draft.split(/\s+/).filter(Boolean).length;
  const isDegenerate = !best || !best.essay
    || best.essay.split(/\s+/).filter(Boolean).length < Math.max(20, Math.floor(draftWords * 0.6));

  // Never ship a failed or gutted variant — fall back to the original draft.
  if (isDegenerate) {
    best = { essay: draft, audit: "", analysis: analyzeHumanTells(draft) };
  }

  let essay = best.essay;
  let analysis = best.analysis;
  let extraAudit = best.audit;

  for (let i = 0; i < HUMANIZE_MAX_FIX_ROUNDS; i++) {
    const hasEmDash = analysis.patternHits.some(p => p.name === "em dash");
    if (analysis.score < HUMANIZE_FIX_THRESHOLD && !hasEmDash) break;

    const currentWords = essay.split(/\s+/).filter(Boolean).length;
    const fixed = (await callDeepSeek(buildFixPrompt(essay, analysis, extraAudit), 0.7))
      .split(/\s*-{2,}\s*AUDIT\s*-{2,}\s*/i)[0].trim();

    const fixedWords = fixed.split(/\s+/).filter(Boolean).length;
    if (!fixed || fixedWords < Math.max(20, Math.floor(currentWords * 0.6))) break;

    essay = fixed;
    extraAudit = "";
    analysis = analyzeHumanTells(essay);
  }

  // Guaranteed cleanup: no dashes, no huge words, no matter what the model did.
  return capWordCount(postProcessEssay(essay), maxWords);
}

// ─────────────────────────────────────────────
//  OVERLAY HELPERS
// ─────────────────────────────────────────────
function showOverlay(el, title) {
  el.querySelector(".gen-overlay-title").textContent = title;
  el.classList.add("active");
}

function hideOverlay(el) {
  el.classList.remove("active");
}

// ─────────────────────────────────────────────
//  GENERATE BUTTON
// ─────────────────────────────────────────────
genBtn.addEventListener("click", async () => {
  // If at essay limit, clicking goes to upgrade
  const limits  = TIER_LIMITS[currentTier] || TIER_LIMITS.free;
  const atLimit = limits.essays !== Infinity && essayCount >= limits.essays;
  if (atLimit) {
    chrome.tabs.create({ url: UPGRADE_URL });
    return;
  }

  if (!validate()) return;

  // Enforce word count cap before generating
  const requestedWords = parseInt(wordCountEl.value);
  if (limits.maxWords !== Infinity && requestedWords > limits.maxWords) {
    wordCountEl.value = String(limits.maxWords);
    flashElement(wordCountEl, "input-cap-flash");
    flashElement(wordCountCrown, "lock-flash");
    return;
  }

  genBtn.disabled = true;

  // Show loading UI before the slow API call:
  // outline flow → navigate straight to the outline page with shimmer lines;
  // direct-draft flow → skeleton card overlay.
  if (outlineOn) {
    goTo(pageOutline);
    renderSkeletonLines(outlineBox, 7);
  } else {
    showSkeletonOverlay("Writing draft…");
  }

  try {
    if (outlineOn) {
      const raw         = await callDeepSeek(buildPrompt(true), 0.7);
      const parts       = raw.split(/---ESSAY---/i);
      const outlineText = parts[0].trim();
      const draftText   = parts.length > 1 ? parts[1].trim() : raw;

      outlineBox.innerHTML = "";
      outlineText.split("\n").forEach(line => {
        if (!line.trim()) return;
        const p = document.createElement("p");
        p.className = "outline-line";
        p.textContent = line;
        outlineBox.appendChild(p);
      });

      draftTextEl.value = capWordCount(draftText, requestedWords);
    } else {
      const draft = await callDeepSeek(buildPrompt(false), 0.7);
      draftTextEl.value = capWordCount(draft, requestedWords);
      hideSkeletonOverlay();
      goTo(pageDraft);
    }

    // Increment essay count in Supabase
    await incrementEssayCount();

  } catch (err) {
    hideSkeletonOverlay();
    if (outlineOn) goTo(pageForm);
    console.error(err);
    showToast(err.message, "err");
  } finally {
    genBtn.disabled = false;
  }
});

// ─────────────────────────────────────────────
//  OUTLINE → DRAFT
// ─────────────────────────────────────────────
outlineNextBtn.addEventListener("click", () => {
  goTo(pageDraft);
});

// ─────────────────────────────────────────────
//  APPLY CHANGES
// ─────────────────────────────────────────────
applyBtn.addEventListener("click", async () => {
  const currentDraft = draftTextEl.value.trim();
  const notes        = changesNoteEl.value.trim();

  if (!notes) {
    markError(changesNoteEl);
    changesNoteEl.focus();
    return;
  }

  applyBtn.disabled   = true;
  approveBtn.disabled = true;
  showOverlay(draftOverlay, "Applying changes…");

  try {
    const revisePrompt = `You are editing an academic essay based on the revision notes below.
Revision notes:
${notes}
Rules:
- Apply every requested change faithfully
- Keep the overall word count roughly the same
- Preserve the current essay's existing voice and style throughout — do not make it more formal or more casual than it already is
- Do NOT add markdown, bold, italics, or asterisks
- Return only the revised essay, nothing else
Current essay:
${currentDraft}`;

    const revised = await callDeepSeek(revisePrompt, 0.75);
    draftTextEl.value         = capWordCount(postProcessEssay(revised), parseInt(wordCountEl.value) || undefined);
    changesNoteEl.value       = "";
    changesNoteEl.placeholder = "Changes applied — request more or approve below";
    hideOverlay(draftOverlay);
  } catch (err) {
    hideOverlay(draftOverlay);
    console.error(err);
    showToast(err.message, "err");
  } finally {
    applyBtn.disabled   = false;
    approveBtn.disabled = false;
  }
});

// ─────────────────────────────────────────────
//  APPROVE — humanize then go to preview
// ─────────────────────────────────────────────
approveBtn.addEventListener("click", async () => {
  const draft = draftTextEl.value.trim();
  if (!draft) return;

  approveBtn.disabled = true;
  applyBtn.disabled   = true;
  showOverlay(draftOverlay, "Humanizing…");

  try {
    const essay = await humanize(draft, gradeLevelEl.value, parseInt(wordCountEl.value) || undefined);
    essayEl.value = essay;
    updateWordBadge();
    hideOverlay(draftOverlay);
    setActiveMode("type");
    goToPreview(pageDraft);
    // Only now is there an essay to switch to, so unlock the sub-tabs.
    revealEssay();
  } catch (err) {
    hideOverlay(draftOverlay);
    console.error(err);
    showToast(err.message, "err");
  } finally {
    approveBtn.disabled = false;
    applyBtn.disabled   = false;
  }
});

// ─────────────────────────────────────────────
//  WORD COUNT BADGE
// ─────────────────────────────────────────────
function updateWordBadge() {
  const words = essayEl.value.trim().split(/\s+/).filter(Boolean).length;
  wordCountBadge.textContent = words.toLocaleString() + " words";
}

essayEl.addEventListener("input", updateWordBadge);

// Custom text word count — see the meter wiring further down for the live
// cap readout that replaced the plain word count.
//
// The toast fires on the *crossing*, not on every keystroke past the cap: a
// per-keystroke toast would stack up in the one place the user is trying to
// work. latchedCap goes true the moment the count reaches the cap and resets
// only when the user comes back under it, so trimming and re-pasting tells them
// again — which is the behaviour they need when they have just edited it down.
let latchedCap = false;
let lastCustomWords = 0;

// A single input event carrying >25 new words is a paste, not typing. Worth its
// own message: "you pasted 900 words" and "you typed past 250" are different
// problems with different fixes.
const PASTE_WORD_JUMP = 25;

function checkCustomCapToast(words, delta) {
  const cap = pasteTypeWordCap();
  if (cap === Infinity) { latchedCap = false; return; }

  if (words >= cap && !latchedCap) {
    latchedCap = true;
    const pasted = delta >= PASTE_WORD_JUMP;
    const proCap = (TIER_LIMITS.pro.pasteType || {}).maxWords;
    const headroom = proCap === Infinity
      ? "any length"
      : `${proCap.toLocaleString()} words`;
    showToast(
      pasted
        ? `Pasted ${words.toLocaleString()} words — this plan types ${cap.toLocaleString()} at a time.`
        : `This plan types ${cap.toLocaleString()} words at a time.`,
      "warn", { label: "Upgrade", onClick: openUpgrade });
    flashElement(customWordCountBadge, "lock-flash");
  } else if (words < cap) {
    latchedCap = false;
  }
}

customTextEl.addEventListener("input", () => {
  const words = customTextEl.value.trim().split(/\s+/).filter(Boolean).length;
  checkCustomCapToast(words, words - lastCustomWords);
  lastCustomWords = words;
  updateCustomWordBadge();
  // Same count, reused — the meter is a second readout of this one number.
  updateWordCountMeter(words);
  scheduleDurationRefresh();
});

essayEl.addEventListener("input", scheduleDurationRefresh);

// ─────────────────────────────────────────────
//  MODE NAV + PREVIEW TABS
//
//  Two levels of navigation:
//    · mode nav  — Type Text | Generate Essay. Top level, on every page that
//                  offers a choice. Type is the product; Generate is the
//                  alternative, so Type owns the default state everywhere.
//    · sub-tabs  — Your Text | AI Essay. Only exists once there is a generated
//                  essay to switch to, so a fresh user sees one text box and
//                  nothing else competing for attention.
// ─────────────────────────────────────────────
const tabEssay    = document.getElementById("tabEssay");
const tabCustom   = document.getElementById("tabCustom");
const panelEssay  = document.getElementById("panelEssay");
const panelCustom = document.getElementById("panelCustom");
const previewSubTabs = document.getElementById("previewSubTabs");
const modeBars    = Array.from(document.querySelectorAll("[data-mode-nav]"));

let hasEssay = false;

function activateTab(which) {
  const showEssay = which === "essay";
  tabEssay.classList.toggle("active", showEssay);
  tabCustom.classList.toggle("active", !showEssay);
  panelEssay.style.display  = showEssay ? "" : "none";
  panelCustom.style.display = showEssay ? "none" : "";
  // A tab switch is discrete, so recompute now rather than 200ms later — this
  // is also the first paint of the page, which must not show a stale duration.
  refreshDuration();
}

tabEssay.addEventListener("click",  () => activateTab("essay"));
tabCustom.addEventListener("click", () => activateTab("custom"));

// Called once a draft is approved. Unlocks the sub-tabs and shows the essay.
function revealEssay() {
  hasEssay = true;
  previewSubTabs.classList.remove("tier-hidden");
  activateTab("essay");
}

function setActiveMode(mode) {
  modeBars.forEach(bar => {
    bar.querySelectorAll(".mode-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });
  });
}

// Single entry point for "show the typewriter". Used by the landing path, the
// sign-out/sign-in listeners, and the Generate page's secondary Type button, so
// there is one definition of what the default screen is.
function enterTypeMode() {
  setActiveMode("type");
  goToPreview(null);
  activateTab("custom");
}

modeBars.forEach(bar => {
  bar.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.mode === "type") {
        enterTypeMode();
      } else {
        setActiveMode("generate");
        goTo(pageForm);
      }
    });
  });
});

function getActiveTypingText() {
  const isCustom = tabCustom.classList.contains("active");
  return isCustom ? customTextEl.value : essayEl.value;
}

// ─────────────────────────────────────────────
//  TARGET DURATION
//
//  The baseline is how long this text takes at the chosen WPM under the normal
//  pause model — which is precisely what content.js types when we send no
//  target at all. Both sides read typing-timing.js, so the "Natural" mark on
//  the track is the real number, not an estimate of an estimate.
//
//  Paid tiers get the whole fast→slow range around that baseline. Free tier
//  gets the baseline and nothing else.
// ─────────────────────────────────────────────
let naturalDurationMs = 0;
let durationTouched   = false;   // has the handle been moved off Natural?
let durationTimer     = null;

// ── RUN CLOCK ───────────────────────────────────────────────────────────────
// The countdown that replaces the static target while a run is in flight.
// Wall-clock rather than progress-derived: retimeToTarget already guarantees the
// run hits its target in real time, so elapsed time is the honest measure, and it
// stays smooth between progress messages (which arrive only on whole-percent
// changes). Paused time is excluded — otherwise a paused run burns its budget.
const runClock = {
  targetMs: 0,
  startedAt: 0,
  pausedMs: 0,
  pausedAt: 0,
  paused: false,
  timer: null,
};

function runElapsedMs() {
  if (!runClock.startedAt) return 0;
  const end = runClock.paused ? runClock.pausedAt : Date.now();
  return Math.max(0, end - runClock.startedAt - runClock.pausedMs);
}

function startRunClock(targetMs) {
  stopRunClock();
  runClock.targetMs  = targetMs > 0 ? targetMs : 0;
  runClock.startedAt = Date.now();
  runClock.pausedMs  = 0;
  runClock.pausedAt  = 0;
  runClock.paused    = false;
  // 250ms keeps the seconds digit from looking like it stutters, without
  // spending a frame budget on a panel that is otherwise idle.
  runClock.timer = setInterval(tickRunClock, 250);
  tickRunClock();
}

function pauseRunClock() {
  if (!runClock.startedAt || runClock.paused) return;
  runClock.paused   = true;
  runClock.pausedAt = Date.now();
  tickRunClock();
}

function resumeRunClock() {
  if (!runClock.startedAt || !runClock.paused) return;
  runClock.pausedMs += Date.now() - runClock.pausedAt;
  runClock.paused   = false;
  runClock.pausedAt = 0;
  tickRunClock();
}

function stopRunClock() {
  if (runClock.timer) { clearInterval(runClock.timer); runClock.timer = null; }
  runClock.startedAt = 0;
  runClock.targetMs  = 0;
  runClock.paused    = false;
  runClock.pausedMs  = 0;
  runClock.pausedAt  = 0;
  durationFieldEl.classList.remove("dur-counting", "dur-paused", "run-inert");
  // Hand the readout back to the static target. Idempotent: refreshDuration
  // rewrites the same value, so this only matters when stopping a run the user
  // had dragged the bar on before.
  updateDurationReadout();
}

// The single writer for the big readout. updateDurationReadout delegates here so
// the clock and a slider drag can never both be painting the same element.
function renderDurationReadout(ms) {
  if (!ms) { durationValueEl.textContent = ""; return; }
  durationValueEl.textContent = formatClock(ms);
}

function tickRunClock() {
  if (!runClock.startedAt) return;

  // Free tier sends no target, so the countdown runs off the natural estimate.
  // That is accurate rather than a placeholder: with no retiming, content.js
  // types at exactly the pace the estimate models.
  const total = runClock.targetMs || naturalDurationMs;
  if (!total) return;

  const remaining = Math.max(0, total - runElapsedMs());

  if (runClock.paused) {
    durationLabelEl.textContent = "Paused";
    durationFieldEl.classList.add("dur-paused");
    durationFieldEl.classList.remove("dur-counting");
  } else {
    durationLabelEl.textContent = "Left";
    durationFieldEl.classList.remove("dur-paused");
    durationFieldEl.classList.add("dur-counting");
    durationEffEl.textContent = `${Math.floor(runElapsedMs() / 1000)}s elapsed`;
  }

  renderDurationReadout(remaining);
}

function formatClock(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function currentWpm() {
  return parseInt(wpmEl.value, 10) || 80;
}

function canPickDuration() {
  const limits = TIER_LIMITS[currentTier] || TIER_LIMITS.free;
  return limits.canPickDuration !== false;
}

// Slider position (0..1000) -> milliseconds.
//
// Geometric, not linear. The meaningful range is multiplicative (2.2x down to
// 0.55x of a run), and geometric interpolation puts the natural pace exactly at
// DURATION_MID so the handle can start centred and still reach both ends.
//
// Direction matches a speed control: left is slower (a longer run), right is
// faster (a shorter one). The handle stores a position rather than a time on
// purpose — when the text or speed changes it keeps its ratio, so "1.5x slower
// than natural" stays 1.5x slower across an edit instead of pinning to a stale
// number of seconds.
function positionToMs(pos, naturalMs) {
  if (!naturalMs) return 0;
  const u = (pos - DURATION_MID) / DURATION_MID;            // -1 .. +1
  const k = u <= 0 ? Math.pow(DURATION_SLOW, -u) : Math.pow(DURATION_FAST, u);
  const ms = naturalMs * k;
  return Math.min(DURATION_CEIL_MS, Math.max(DURATION_FLOOR_MS, ms));
}

// The estimate carries ~±15s of noise even medianed, which would make the
// readout and the handle twitch on every keystroke. Ignore jitter and keep the
// settled value; a genuinely new essay or a WPM change always moves it far
// more than the tolerance.
function adoptNaturalMs(ms) {
  if (!ms) { naturalDurationMs = 0; return false; }
  if (!naturalDurationMs) { naturalDurationMs = ms; return true; }
  const tol = Math.max(5000, ms * 0.04);
  if (Math.abs(ms - naturalDurationMs) <= tol) return false;
  naturalDurationMs = ms;
  return true;
}

// Cheap part — safe to run on every drag event. Reads the handle and updates
// text only; must not touch the estimator, which costs ~15ms and would make
// dragging the slider stutter.
function updateDurationReadout() {
  const words = getActiveTypingText().trim().split(/\s+/).filter(Boolean).length;
  const pos   = parseInt(durationRangeEl.value, 10);
  const ms    = positionToMs(pos, naturalDurationMs);

  // A run in flight owns the big number. Everything else here (the ends, the
  // fill, the effective wpm) still tracks the handle, so the bar keeps showing
  // what the *next* run would do without fighting the countdown for the value.
  if (!runClock.startedAt) {
    durationLabelEl.textContent = "ETA";
    renderDurationReadout(ms);
    // With no text the slot keeps saying what to do about it. This used to be
    // set by the caller *before* this function ran, which then blanked it —
    // so the empty state never actually showed its own hint.
    durationEffEl.textContent = words && ms
      ? `≈${Math.round(words / (ms / 60000))} wpm`
      : "add text to set a target";
  }

  // Fill runs outward from the centre detent to wherever the handle is, so the
  // travelled distance from natural is the visible thing — not just the number.
  const mid = (pos / 1000) * 100;
  durationFillEl.style.left  = `${Math.min(mid, 50)}%`;
  durationFillEl.style.width = `${Math.abs(mid - 50)}%`;
  durationFillEl.style.opacity = ms ? "1" : "0";
  durationTickEl.classList.toggle("at-handle", pos === DURATION_MID);
  durationNaturalEl.classList.toggle("at-natural", pos === DURATION_MID);

  // Both ends carry the real time they land on. This is the whole reason the
  // control became usable: a drag now has an answer in minutes at each stop.
  if (!naturalDurationMs) {
    durationFastEndEl.textContent = "—";
    durationSlowEndEl.textContent = "—";
    durationNaturalTimeEl.textContent = "—";
  } else {
    // positionToMs: pos 0 is DURATION_SLOW x natural (left, longer run), pos 1000
    // is DURATION_FAST x natural (right, shorter run).
    durationSlowEndEl.textContent     = formatClock(positionToMs(0, naturalDurationMs));
    durationFastEndEl.textContent     = formatClock(positionToMs(1000, naturalDurationMs));
    durationNaturalTimeEl.textContent = formatClock(naturalDurationMs);
  }
}

// Full recompute — re-estimates the natural duration and re-seats the handle.
// Only needed when the text, the speed, or the tier changes.
function refreshDuration() {
  clearTimeout(durationTimer);

  const text = getActiveTypingText();
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  const est = window.ScrybeTiming ? window.ScrybeTiming.estimateNaturalMs(text, currentWpm()) : 0;
  const hasText = words > 0 && est > 0;

  // Nothing pasted yet. Leave the readout blank rather than filling it with a
  // placeholder dash — an empty slot reads as "not set yet", a dash reads as a
  // broken value. The bar stays centred and inert until there is text to pace.
  if (!hasText) {
    durationRangeEl.disabled = true;
    durationRangeEl.value = String(DURATION_MID);
    durationTickEl.classList.remove("at-handle");
    durationNaturalEl.classList.add("at-natural");
    naturalDurationMs = 0;
    durationTouched = false;
    // The readout owns the empty state now — value, caption and hint together.
    updateDurationReadout();
    return;
  }

  durationRangeEl.disabled = false;
  adoptNaturalMs(est);

  // Returning the handle to Natural re-arms syncing, so editing the text
  // afterwards moves it again instead of stranding it at a stale spot.
  if (!durationTouched || parseInt(durationRangeEl.value, 10) === DURATION_MID) {
    durationRangeEl.value = String(DURATION_MID);
    durationTouched = false;
  }

  durationTickEl.title = `Natural: ${formatClock(naturalDurationMs)}`;

  updateDurationReadout();
}

// Debounced variant for keystrokes — the estimator is cheap but not free, and
// every character in a long paste would otherwise re-estimate the whole run.
function scheduleDurationRefresh() {
  clearTimeout(durationTimer);
  durationTimer = setTimeout(refreshDuration, 200);
}

// Milliseconds actually sent to content.js. Free tier sends 0, which means "use
// the natural pacing" — identical to sending the baseline, but it keeps the
// no-retime path exercised and obvious.
function selectedDurationMs() {
  if (!canPickDuration()) return 0;
  return positionToMs(parseInt(durationRangeEl.value, 10), naturalDurationMs);
}

// Free users see the bar and can try to use it. Rather than hiding the control
// behind an upsell, let them grab it and answer immediately — the lock glyph
// plus this toast tell them the feature is paid, and why the handle snapped back.
let durationNudgeAt = 0;

function openUpgrade() {
  chrome.tabs.create({ url: UPGRADE_URL });
}

// The toast carries its own tap target — tell the user the feature is paid and
// let them act on it in the same breath, instead of describing a journey.
function nudgeDurationUpgrade() {
  const now = Date.now();
  // One toast per second of holding the key down, not one per pointer event.
  if (now - durationNudgeAt < 1000) return;
  durationNudgeAt = now;
  showToast("Setting a target duration is a Pro feature — free typing runs at your natural pace.",
    "warn", { label: "Upgrade", onClick: openUpgrade });
  flashElement(durationLockEl, "dur-nudge");
}

function blockIfGated(e) {
  if (canPickDuration()) return false;
  if (e) e.preventDefault();
  nudgeDurationUpgrade();
  return true;
}

durationRangeEl.addEventListener("pointerdown", (e) => blockIfGated(e));
durationRangeEl.addEventListener("keydown", (e) => {
  // Only intercept keys that would move a range input.
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]
      .includes(e.key)) blockIfGated(e);
});

// The lock badge doubles as the free tier's upgrade tap: it covers the knob,
// so clicking it goes straight to the purchase page without a dead end.
durationLockEl.addEventListener("click", () => {
  if (!canPickDuration()) openUpgrade();
});

// Reset-to-natural. Hitting 500 exactly by dragging a 1000-step slider is not a
// reasonable thing to ask of anyone, so the centre marker is a button too.
durationNaturalEl.addEventListener("click", () => {
  if (!canPickDuration()) { nudgeDurationUpgrade(); return; }
  if (parseInt(durationRangeEl.value, 10) === DURATION_MID) return;
  durationRangeEl.value = String(DURATION_MID);
  durationTouched = false;
  updateDurationReadout();
});

durationRangeEl.addEventListener("input", () => {
  // `input` cannot be prevented, so on the gated tiers snap straight back.
  if (!canPickDuration()) {
    durationRangeEl.value = String(DURATION_MID);
    durationTouched = false;
    updateDurationReadout();
    nudgeDurationUpgrade();
    return;
  }
  durationTouched = parseInt(durationRangeEl.value, 10) !== DURATION_MID;
  updateDurationReadout();
});

wpmEl.addEventListener("input",  scheduleDurationRefresh);
wpmEl.addEventListener("change", refreshDuration);
wpmEl.addEventListener("blur",   refreshDuration);

// ─────────────────────────────────────────────
//  TYPING STATE
// ─────────────────────────────────────────────
function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = type || "";
}

const PAUSE_SVG = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3h2.6v10H5zM8.4 3H11v10H8.4z"/></svg>';
const PLAY_SVG  = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3.2l9 4.8-9 4.8z"/></svg>';

let typingPaused = false;
let typingActive = false;   // mirrors setTypingState; used by the run-inert toggle

function setPauseState(paused) {
  typingPaused = paused;
  pauseBtn.classList.toggle("paused", paused);
  pauseBtn.title = paused ? "Resume" : "Pause";
  pauseBtn.innerHTML = paused ? PLAY_SVG : PAUSE_SVG;
  typingAnim.classList.toggle("paused", paused);
  typingAnimLabel.textContent = paused ? "Paused…" : "Typing…";
  typingProgress.classList.toggle("paused", paused);

  // The countdown has to agree with the bar. Only driven from here (and the
  // initial start), never from the click handler, so a refused pause message
  // can't leave the clock stopped while the run continues.
  if (paused) pauseRunClock();
  else if (runClock.startedAt) resumeRunClock();
}

function setTypingState(isTyping) {
  typingActive = isTyping;
  if (isTyping) hideReviewNudge();
  typeBtn.disabled       = isTyping;
  typeBtn.style.display  = isTyping ? "none" : "block";
  stopBtn.style.display  = isTyping ? "inline-flex" : "none";
  stopBtn.disabled       = !isTyping;
  pauseBtn.style.display = isTyping ? "inline-flex" : "none";
  pauseBtn.disabled      = !isTyping;
  backBtn.disabled       = isTyping;
  typingAnim.classList.toggle("active", isTyping);
  if (typeControlsEl) typeControlsEl.classList.toggle("typing", isTyping);
  if (!isTyping) {
    stopRunClock();
    resetTypingProgress();
    setPauseState(false);
  }
}

// ─────────────────────────────────────────────
//  START TYPING
// ─────────────────────────────────────────────
typeBtn.addEventListener("click", () => {
  try {
  const text = getActiveTypingText();
  const rawWpm = parseInt(wpmEl.value) || 80;

  if (!text.trim())           { setStatus("No text to type.", "err"); return; }
  if (!parseInt(wpmEl.value)) { markError(wpmEl); wpmEl.focus(); return; }

  // Enforce WPM cap for free tier
  const limits = TIER_LIMITS[currentTier] || TIER_LIMITS.free;
  let wpm = rawWpm;
  if (limits.maxWpm !== Infinity && wpm > limits.maxWpm) {
    wpm = limits.maxWpm;
    wpmEl.value = String(wpm);
    flashElement(wpmEl, "input-cap-flash");
    flashElement(wpmCrown, "lock-flash");
  }

  // Paste & Type quotas — only apply when typing the user's own text, never to
  // a generated essay. Captured here because the preview tab can change while
  // the run is in flight.
  const isCustomRun = isPasteTypeActive();

  if (isCustomRun) {
    if (pasteTypeSessionsLeft() <= 0) {
      setStatus("❌ Daily Paste & Type sessions used.", "err");
      return;
    }

    // Never truncate pasted text — the user wrote it. Refuse the run instead.
    const cap   = pasteTypeWordCap();
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (cap !== Infinity && words > cap) {
      setStatus(`❌ ${words.toLocaleString()} words exceeds the ${cap.toLocaleString()} word limit — click the count to upgrade.`, "err");
      flashElement(customWordCountBadge, "input-cap-flash");
      flashElement(customWordCountBadge, "lock-flash");
      return;
    }
  }

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url?.includes("docs.google.com")) {
      setStatus("❌ Open a Google Doc first.", "err");
      return;
    }

    setTypingState(true);
    setPauseState(false);
    setStatus("", "");
    typingAnimLabel.textContent = "Typing…";
    updateTypingProgress(0);

    // The target is resolved *before* the run so the countdown has a real
    // budget, and it includes the scripting + sequence-build latency that
    // follows — otherwise the first seconds of every run read as over budget.
    // Gated tiers pass 0 and fall back to the natural estimate.
    const runTargetMs = selectedDurationMs();
    startRunClock(runTargetMs);
    durationFieldEl.classList.toggle("run-inert", typingActive && !canPickDuration());

    chrome.scripting.executeScript(
      { target: { tabId: tab.id }, files: ["typing-timing.js", "content.js"] },
      () => {
        if (chrome.runtime.lastError) {
          setStatus("❌ " + chrome.runtime.lastError.message, "err");
          setTypingState(false);
          return;
        }
        setTimeout(() => {
          chrome.tabs.sendMessage(tab.id, { action: "type", text, wpm, targetDurationMs: selectedDurationMs() }, (response) => {
            if (chrome.runtime.lastError) {
              setStatus("❌ " + chrome.runtime.lastError.message, "err");
              setTypingState(false);
              return;
            }

            // Only a run that ran to completion spends a daily session.
            // Stopping early, or a crash in the doc, must not burn the quota.
            const completed = !response?.stopped;

            if (!completed) {
              setStatus("", "");
            } else {
              setStatus("✓ Done!", "ok");
              showToast("Essay complete!", "ok");
              fireConfetti();
              recordCompletedTypingRun().catch((err) => console.error("recordCompletedTypingRun error:", err));
            }

            setTypingState(false);

            if (completed && isCustomRun) incrementPasteTypeCount();
          });
        }, 150);
      }
    );
  });
  } catch (err) {
    setTypingState(false);
    reportRuntimeError(err, "starting typing");
  }
});

// ─────────────────────────────────────────────
//  PAUSE / RESUME
// ─────────────────────────────────────────────
pauseBtn.addEventListener("click", () => {
  if (pauseBtn.disabled) return;
  try {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    const action = typingPaused ? "resume" : "pause";
    chrome.tabs.sendMessage(tab.id, { action }, (resp) => {
      if (chrome.runtime.lastError) {
        reportRuntimeError(chrome.runtime.lastError, "pause/resume typing");
        return;
      }
      if (resp?.paused) setPauseState(true);
      else if (resp?.resumed) setPauseState(false);
      else if (action === "pause") setPauseState(true);
    });
  });
  } catch (err) {
    reportRuntimeError(err, "pause/resume typing");
  }
});

// ─────────────────────────────────────────────
//  STOP TYPING
// ─────────────────────────────────────────────
stopBtn.addEventListener("click", () => {
  try {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.tabs.sendMessage(tab.id, { action: "stop" }, () => {
      if (chrome.runtime.lastError) {
        setTypingState(false);
        reportRuntimeError(chrome.runtime.lastError, "stopping typing");
        return;
      }
      setStatus("", "");
    });
  });
  } catch (err) {
    reportRuntimeError(err, "stopping typing");
  }
});
