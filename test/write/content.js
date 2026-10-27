// Global stop flag — sidebar sends { action: "stop" } to set this
let stopTyping = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "stop") {
    stopTyping = true;
    sendResponse({ stopped: true });
    return;
  }

  if (message.action !== "type") return;
  stopTyping = false;

  const { text, wpm } = message;
  const msPerChar = (60 / (wpm * 5)) * 1000;

  // ═══════════════════════════════════════════════════════════════════════════
  // KEYBOARD LAYOUT DATA
  // ═══════════════════════════════════════════════════════════════════════════

  const KEY_NEIGHBORS = {
    a: ["q","w","s","z"],          b: ["v","g","h","n"],
    c: ["x","d","f","v"],          d: ["s","e","r","f","c","x"],
    e: ["w","r","d","s"],          f: ["d","r","t","g","v","c"],
    g: ["f","t","y","h","b","v"],  h: ["g","y","u","j","n","b"],
    i: ["u","o","k","j"],          j: ["h","u","i","k","n","m"],
    k: ["j","i","o","l","m"],      l: ["k","o","p",";"],
    m: ["n","j","k",","],          n: ["b","h","j","m"],
    o: ["i","p","l","k"],          p: ["o","l",";"],
    q: ["w","a"],                  r: ["e","t","f","d"],
    s: ["a","w","e","d","x","z"],  t: ["r","y","g","f"],
    u: ["y","i","j","h"],          v: ["c","f","g","b"],
    w: ["q","e","a","s"],          x: ["z","s","d","c"],
    y: ["t","u","h","g"],          z: ["a","s","x"],
    " ": ["v","b","n","c","m"],
    ",": ["m","l","."],            ".": [",","/","l"],
    ";": ["l","p","/"],            "'": [";","p"],
  };

  const KEY_FINGER = {
    q:0,a:0,z:0, w:1,s:1,x:1, e:2,d:2,c:2,
    r:3,f:3,v:3,t:3,g:3,b:3,
    y:4,h:4,n:4,u:4,j:4,m:4,
    i:5,k:5,",":5, o:6,l:6,".":6, p:7,";":7,"'":7,
    " ":4,
  };

  const FAR_KEYS = new Set(["q","p","z","1","2","9","0"]);
  const MID_KEYS = new Set(["t","g","r","u","h","n","b","y"]);

  const FAST_BIGRAMS = new Set([
    "th","he","in","er","an","re","on","en","at","es",
    "ed","nd","to","or","ea","ti","ar","te","ng","al",
    "it","as","is","ha","se","ou","of","le","ve","de","co",
  ]);
  const SLOW_BIGRAMS = new Set([
    "un","lo","ol","ki","ce","ec","fr","rf","gr","mu","ju","hy",
  ]);
  const COMMON_WORDS = new Set([
    "the","and","that","have","for","not","with","you","this","but",
    "his","from","they","say","her","she","will","one","all","would",
    "there","their","what","out","about","who","get","which","when",
    "make","can","like","time","just","him","know","take","into",
    "your","good","some","could","them","see","other","than","then",
    "now","look","only","come","its","over","also","back","after",
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  function randNormal() {
    return (
      Math.sqrt(-2 * Math.log(Math.random())) *
      Math.cos(2 * Math.PI * Math.random())
    );
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function rand(lo, hi)     { return lo + Math.random() * (hi - lo); }

  // Log-normal IKI — matches real keystroke dynamics research
  function iki(mult = 1) {
    const base  = msPerChar * mult;
    const sigma = 0.32;
    const lm    = Math.log(base) - (sigma * sigma) / 2;
    return clamp(Math.exp(lm + sigma * randNormal()), 28, base * 4);
  }

  function wordDifficulty(word) {
    const w = word.toLowerCase().replace(/[^a-z]/g, "");
    if (w.length <= 3) return 0;
    if (w.length <= 5) return 0.25;
    if (w.length <= 8) return 0.55;
    return 0.9;
  }

  function holdDuration(char) {
    if (char === "Backspace") return Math.round(rand(50, 95));
    if (char === " ")         return Math.round(rand(55, 130));
    if (char === "\n")        return Math.round(rand(55, 115));
    const lower    = char.toLowerCase();
    const isUpper  = char !== lower;
    const base     = isUpper ? rand(75, 150) : rand(45, 120);
    const farBonus = FAR_KEYS.has(lower) ? rand(8, 25) : 0;
    return Math.round(base + farBonus);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WORD META
  // ═══════════════════════════════════════════════════════════════════════════

  function buildWordMeta(text) {
    const meta = Array.from({ length: text.length }, () => ({
      posInWord: 0, wordLen: 0, word: "", isCommon: false,
    }));
    let i = 0;
    while (i < text.length) {
      if (/[a-zA-Z']/.test(text[i])) {
        let j = i;
        while (j < text.length && /[a-zA-Z']/.test(text[j])) j++;
        const word     = text.slice(i, j);
        const isCommon = COMMON_WORDS.has(word.toLowerCase());
        for (let k = i; k < j; k++) {
          meta[k] = { posInWord: k - i, wordLen: word.length, word, isCommon };
        }
        i = j;
      } else {
        i++;
      }
    }
    return meta;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SEQUENCE BUILDER
  // ═══════════════════════════════════════════════════════════════════════════

  function buildSequence(text) {
    const seq = [];
    const wordMeta = buildWordMeta(text);

    let warmup    = Math.floor(rand(5, 14));
    let burst     = 0;
    let fatigue   = 0;
    let charsTyped = 0;
    let prevChar   = "";
    let prevFinger = -1;

    // Typo budget: roughly 1 typo per ~120 chars (always corrected immediately)
    // Real essay writers make ~0.5–1.5% error rate, nearly all self-corrected
    const BASE_TYPO_RATE = 0.008; // ~0.8% per character

    let i = 0;
    while (i < text.length) {
      const char   = text[i];
      const lower  = char.toLowerCase();
      const meta   = wordMeta[i];
      const finger = KEY_FINGER[lower] ?? -1;
      const isUpper = char !== lower && char === char.toUpperCase();

      // ── Base delay ───────────────────────────────────────────────────────
      let delay;
      if (warmup > 0) {
        delay = iki(rand(1.5, 2.2)); warmup--;
      } else if (burst > 0) {
        delay = iki(rand(0.38, 0.58)); burst--;
      } else {
        delay = iki(1);
      }

      // ── Fatigue (very mild — essay writing, not a marathon) ──────────────
      fatigue = Math.min(1, charsTyped / 2500);
      delay  *= (1 + fatigue * 0.15);

      // ── Bigram timing ────────────────────────────────────────────────────
      const bigram = prevChar + lower;
      if (FAST_BIGRAMS.has(bigram))      delay *= rand(0.58, 0.80);
      else if (SLOW_BIGRAMS.has(bigram)) delay *= rand(1.18, 1.50);

      // Same-finger penalty
      if (finger !== -1 && finger === prevFinger) delay *= rand(1.2, 1.55);

      // Hand-alternation bonus
      if (finger !== -1 && prevFinger !== -1) {
        const ph = prevFinger <= 3 ? 0 : 1;
        const ch = finger      <= 3 ? 0 : 1;
        if (ph !== ch) delay *= rand(0.84, 0.96);
      }

      // ── Key distance ─────────────────────────────────────────────────────
      if (FAR_KEYS.has(lower))      delay *= rand(1.08, 1.30);
      else if (MID_KEYS.has(lower)) delay *= rand(1.02, 1.12);

      // Double-letter slowdown
      if (lower === prevChar && lower !== " ") delay *= rand(1.12, 1.40);

      // Shift overhead
      if (isUpper) delay += rand(35, 100);

      // ── Structural pauses ────────────────────────────────────────────────
      if (".!?".includes(prevChar)) {
        delay += rand(180, 650);
        if (Math.random() < 0.18) delay += rand(300, 1000); // re-reading pause
      } else if (",;:".includes(prevChar)) {
        delay += rand(45, 160);
      } else if (prevChar === "\n") {
        delay += rand(200, 800);
      }
      if (char === "\n") delay += rand(120, 450);

      // ── Word-boundary hesitation ─────────────────────────────────────────
      if (meta.posInWord === 0 && meta.wordLen > 0) {
        const diff = meta.isCommon ? 0 : wordDifficulty(meta.word);
        delay += diff * rand(50, 180);
        if (meta.isCommon && Math.random() < 0.50) burst = meta.wordLen - 1;
      }

      // ── Random micro/macro pauses ────────────────────────────────────────
      if (Math.random() < 0.010) delay += rand(400, 2000);  // brief distraction
      if (Math.random() < 0.003) delay += rand(2000, 5000); // spacing out

      // ── Burst trigger ────────────────────────────────────────────────────
      if (burst === 0 && Math.random() < 0.06) burst = Math.floor(rand(3, 8));

      delay = Math.max(25, delay);

      // ── Typo logic ───────────────────────────────────────────────────────
      // Only on real typeable letters, not spaces/newlines/punctuation
      const neighbors = KEY_NEIGHBORS[lower];
      const isLetter  = /[a-z]/.test(lower);
      const typoRate  = BASE_TYPO_RATE * (1 + fatigue * 0.5);

      // Transposition (swap with next char) — most natural typo
      const canTranspose = isLetter && i + 1 < text.length && /[a-z]/.test(text[i+1]);
      const doTranspose  = canTranspose && Math.random() < typoRate * 0.4;

      // Substitution (nearby key) — second most common
      const doSubstitute = !doTranspose && isLetter && neighbors && Math.random() < typoRate * 0.6;

      if (doTranspose) {
        // Type next char first, then current, then immediately fix both
        const next = text[i + 1];
        seq.push({ char: next, delay,       holdMs: holdDuration(next) });
        seq.push({ char,       delay: iki(0.65), holdMs: holdDuration(char) });
        // Pause as person notices the swap, then backspace twice and retype
        seq.push({ char: "Backspace", delay: rand(120, 380), holdMs: 65 });
        seq.push({ char: "Backspace", delay: rand(40,  90),  holdMs: 65 });
        seq.push({ char,       delay: iki(0.9),  holdMs: holdDuration(char) });
        seq.push({ char: next, delay: iki(0.75), holdMs: holdDuration(next) });
        i += 2;

      } else if (doSubstitute) {
        // Type wrong nearby key, notice immediately, backspace, retype correctly
        const wrongLower = neighbors[Math.floor(Math.random() * neighbors.length)];
        const wrongChar  = isUpper ? wrongLower.toUpperCase() : wrongLower;
        seq.push({ char: wrongChar,   delay,            holdMs: holdDuration(wrongChar) });
        seq.push({ char: "Backspace", delay: rand(80, 300), holdMs: 65 });
        seq.push({ char,              delay: iki(0.88),  holdMs: holdDuration(char) });
        i++;

      } else {
        seq.push({ char, delay, holdMs: holdDuration(char) });
        i++;
      }

      prevChar   = lower;
      prevFinger = finger;
      charsTyped++;
    }

    return seq;
  }

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

  setTimeout(() => {
    const sequence = buildSequence(text);
    let idx = 0;

    function typeNext() {
      if (stopTyping) { sendResponse({ stopped: true }); return; }
      if (idx >= sequence.length) { sendResponse({ done: true }); return; }

      const { char, delay, holdMs } = sequence[idx++];
      setTimeout(() => {
        if (stopTyping) { sendResponse({ stopped: true }); return; }
        dispatchKey(editorDoc, char, holdMs);
        typeNext();
      }, delay);
    }

    typeNext();
  }, rand(250, 750));

  return true;
});