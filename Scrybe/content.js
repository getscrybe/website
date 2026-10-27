// Guard against double-injection (manifest injects this file once and the side
// panel's executeScript re-injects it, so state lives on window and the message
// listener is only ever registered one time per page).
if (!window.__scrybeLoaded) {
  window.__scrybeLoaded = true;
  window.__scrybeStopTyping = false;
  window.__scrybeTypingSession = null;
}

var stopTyping = window.__scrybeStopTyping;
var typingSession = window.__scrybeTypingSession; // { pause, resume, stop, isPaused } while a typing run is active

// The timing model normally comes from typing-timing.js (injected before this
// file by both the manifest and executeScript). If that injection ever fails or
// lands out of order, fall back to a plain per-character timer so a typing run
// can never die because the humanization module was missing.
if (typeof window.ScrybeTiming === "undefined") {
  (function (root) {
    const rand = (lo, hi) => lo + Math.random() * (hi - lo);

    function createTiming(msPerChar) {
      function holdFor(char) {
        if (char === "Backspace") return Math.round(rand(45, 85));
        if (char === " ")         return Math.round(rand(55, 115));
        if (char === "\n")        return Math.round(rand(55, 105));
        const lower = char.toLowerCase();
        return lower === char ? Math.round(rand(45, 105)) : Math.round(rand(80, 140));
      }

      function buildSequence(text) {
        const seq = [];
        for (let i = 0; i < text.length; i++) {
          seq.push({ char: text[i], delay: Math.max(28, msPerChar * rand(0.82, 1.35)), holdMs: holdFor(text[i]), progress: 1 });
        }
        return seq;
      }

      function splitNatural(seq) {
        let total = 0;
        for (let i = 0; i < seq.length; i++) total += seq[i].delay;
        return { totalMs: total, baseMs: total, pauseMs: 0 };
      }

      function retimeToTarget(seq, targetMs) {
        if (!seq.length || !(targetMs > 0)) return;
        const total = splitNatural(seq).totalMs;
        if (total <= 0) return;
        const k = targetMs / total;
        for (let i = 0; i < seq.length; i++) seq[i].delay = Math.max(5, seq[i].delay * k);
      }

      return { buildSequence, splitNatural, retimeToTarget };
    }

    root.ScrybeTiming = { createTiming };
  })(typeof globalThis !== "undefined" ? globalThis : self);
}

// Re-injection must not stack a second listener that answers "type" twice.
if (!window.__scrybeListenerAttached) {
  window.__scrybeListenerAttached = true;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "stop") {
    if (typingSession) typingSession.stop();
    else { stopTyping = true; window.__scrybeStopTyping = true; }
    sendResponse({ stopped: true });
    return;
  }

  if (message.action === "pause") {
    if (typingSession) {
      typingSession.pause();
      sendResponse({ paused: typingSession.isPaused() });
    } else {
      sendResponse({ paused: false });
    }
    return;
  }

  if (message.action === "resume") {
    if (typingSession && typingSession.isPaused()) {
      typingSession.resume();
      sendResponse({ resumed: true });
    } else {
      sendResponse({ resumed: false });
    }
    return;
  }

  if (message.action !== "type") return;
  stopTyping = false;
  window.__scrybeStopTyping = false;

  const { text, wpm } = message;
  const msPerChar = (60 / (wpm * 5)) * 1000;

  // The keystroke timing model itself lives in typing-timing.js, which the side
  // panel also loads so the duration estimate it shows comes from these exact
  // numbers rather than a second implementation that could drift.
  const timing = window.ScrybeTiming.createTiming(msPerChar);

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT DISPATCH
  // ═══════════════════════════════════════════════════════════════════════════

  function dispatchKey(doc, char, holdMs) {
    const isBackspace = char === "Backspace";
    const isNewline   = char === "\n";
    const isUpper     = !isBackspace && !isNewline && char >= "A" && char <= "Z";

    let key, keyCode, charCode;
    if (isBackspace) { key = "Backspace"; keyCode = 8;  charCode = 0;  }
    else if (isNewline) { key = "Enter";  keyCode = 13; charCode = 13; }
    else { key = char; keyCode = char.charCodeAt(0); charCode = keyCode; }

    const down = { key, keyCode, which: keyCode, charCode, shiftKey: isUpper, bubbles: true, cancelable: true };

    doc.body.dispatchEvent(new KeyboardEvent("keydown", down));
    if (!isBackspace) doc.body.dispatchEvent(new KeyboardEvent("keypress", { ...down, charCode }));

    if (isBackspace) {
      doc.body.dispatchEvent(new InputEvent("input", { inputType: "deleteContentBackward", bubbles: true }));
    } else if (isNewline) {
      doc.body.dispatchEvent(new InputEvent("input", { inputType: "insertParagraph", bubbles: true }));
    } else {
      doc.body.dispatchEvent(new InputEvent("input", { data: char, inputType: "insertText", bubbles: true }));
    }

    setTimeout(() => {
      doc.body.dispatchEvent(new KeyboardEvent("keyup", { key, keyCode, which: keyCode, shiftKey: isUpper, bubbles: true }));
    }, holdMs);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN
  // ═══════════════════════════════════════════════════════════════════════════

  const editor = document.querySelector(".docs-texteventtarget-iframe");
  if (!editor) { sendResponse({ error: "Could not find doc editor" }); return; }

  const editorDoc = editor.contentDocument;
  editorDoc.body.focus();

  const rand = (lo, hi) => lo + Math.random() * (hi - lo);

  setTimeout(() => {
    const sequence = timing.buildSequence(text);

    // Hit a requested duration by re-timing the built run. Omitted entirely for
    // free tier, and a target equal to the natural length is a no-op inside
    // retimeToTarget, so both leave the rhythm untouched.
    timing.retimeToTarget(sequence, message.targetDurationMs || 0);

    const total    = text.length;          // progress is measured against the real string
    let idx = 0;
    let completeChars = 0;                 // chars of the string actually landed
    let lastPct = -1;
    let paused = false;
    let timer = null;
    let pending = null;   // step waiting to be dispatched while paused
    let done = false;

    function reportProgress() {
      try {
        const pct = Math.min(100, Math.round(completeChars / total * 100));
        if (pct === lastPct) return;
        lastPct = pct;
        chrome.runtime.sendMessage({ type: "scrybe-progress", pct }, () => {});
      } catch (e) { /* messaging not required */ }
    }

    function finishStopped() {
      if (done) return;
      done = true;
      typingSession = null;
      sendResponse({ stopped: true });
    }

    function finishDone() {
      if (done) return;
      done = true;
      typingSession = null;
      completeChars = total;
      reportProgress();
      sendResponse({ done: true });
    }

    function scheduleStep() {
      if (stopTyping) { finishStopped(); return; }
      if (idx >= sequence.length) { finishDone(); return; }

      const item = pending || sequence[idx++];
      pending = item;

      timer = setTimeout(() => {
        timer = null;
        pending = null;
        if (paused) return;
        if (stopTyping) { finishStopped(); return; }
        dispatchKey(editorDoc, item.char, item.holdMs);
        if (item.progress) completeChars += item.progress;
        reportProgress();
        scheduleStep();
      }, item.delay);
    }

    typingSession = {
      isPaused: () => paused,
      pause() {
        if (paused || done || stopTyping) return paused;
        paused = true;
        if (timer) { clearTimeout(timer); timer = null; }
        return paused;
      },
      resume() {
        if (!paused || done || stopTyping) return false;
        paused = false;
        scheduleStep();
        return true;
      },
      stop() {
        stopTyping = true;
        window.__scrybeStopTyping = true;
        if (paused) { paused = false; scheduleStep(); }
      }
    };

    reportProgress();
    scheduleStep();
  }, rand(250, 750));

  return true;
});

} // end one-time listener registration