// ═══════════════════════════════════════════════════════════════════════════
//  TYPING TIMING MODEL
//
//  Pure keystroke-timing logic. No DOM, no chrome.* APIs, no side effects —
//  which is the whole point: content.js uses it to actually type, and the
//  side panel uses it to estimate how long a run will take, from the same
//  numbers. If the two ever diverged the duration slider would lie.
// ═══════════════════════════════════════════════════════════════════════════
(function (root) {
  "use strict";

  // Guarded: content.js is injected both by the manifest and by
  // executeScript, so this file can run twice in the same page.
  if (root.ScrybeTiming) return;

  // ── KEYBOARD LAYOUT DATA ──────────────────────────────────────────────────
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

  // Typo budget: roughly 1 typo per ~120 chars (always corrected immediately).
  // Real essay writers make ~0.5–1.5% error rate, nearly all self-corrected.
  const BASE_TYPO_RATE = 0.015;

  // Duration estimates are reported on a 5s grid so a recompute can never
  // make the readout or the slider jitter by a second or two.
  const DURATION_STEP_MS = 5000;

  // ── HELPERS ───────────────────────────────────────────────────────────────
  function randNormal() {
    return (
      Math.sqrt(-2 * Math.log(Math.random())) *
      Math.cos(2 * Math.PI * Math.random())
    );
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function rand(lo, hi)     { return lo + Math.random() * (hi - lo); }

  // Build one item for the sequence. `pausePart` is how much of `delay` is
  // thinking time rather than finger movement — the split the duration slider
  // leans on to change pace without turning the run into a machine.
  function mkItem(char, delay, holdMs, progress, pausePart) {
    const d = Math.max(0, delay);
    const p = clamp(pausePart || 0, 0, Math.max(0, d - 5));
    return { char, delay: d, base: d - p, pause: p, holdMs, progress: progress || 0 };
  }

  // ═════════════════════════════════════════════════════════════════════════
  //  SEQUENCE BUILDER
  // ═════════════════════════════════════════════════════════════════════════

  function createTiming(msPerChar) {
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

    // Characters until the current sentence ends — used to scale how long a
    // writer "thinks" before starting the next sentence.
    function countToSentenceEnd(text, from) {
      for (let j = from; j < text.length; j++) {
        if ("?!.".includes(text[j]) || text[j] === "\n") return j - from;
      }
      return text.length - from;
    }

    function buildSequence(text) {
      const seq = [];
      const wordMeta = buildWordMeta(text);

      let warmup    = Math.floor(rand(5, 14));
      let burst     = 0;
      let fatigue   = 0;
      let hesitant  = 0;       // chars right after a thinking pause — typed slower
      let charsTyped = 0;
      let prevChar   = "";
      let prevFinger = -1;

      let i = 0;
      while (i < text.length) {
        const char   = text[i];
        const lower  = char.toLowerCase();
        const meta   = wordMeta[i];
        const finger = KEY_FINGER[lower] ?? -1;
        const isUpper = char !== lower && char === char.toUpperCase();

        // ── Base delay ─────────────────────────────────────────────────────
        let delay;
        if (warmup > 0) {
          delay = iki(rand(1.5, 2.2)); warmup--;
        } else if (burst > 0) {
          delay = iki(rand(0.30, 0.45)); burst--;
        } else {
          delay = iki(1);
        }

        // Accumulates only the "thinking" additions below, so the item can be
        // split into finger time vs. pause time once the total is known.
        let pauseAcc = 0;

        // ── Fatigue (very mild — essay writing, not a marathon) ────────────
        fatigue = Math.min(1, charsTyped / 2500);
        delay  *= (1 + fatigue * 0.15);

        // ── Bigram timing ──────────────────────────────────────────────────
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

        // ── Key distance ───────────────────────────────────────────────────
        if (FAR_KEYS.has(lower))      delay *= rand(1.08, 1.30);
        else if (MID_KEYS.has(lower)) delay *= rand(1.02, 1.12);

        // Double-letter slowdown
        if (lower === prevChar && lower !== " ") delay *= rand(1.12, 1.40);

        // Shift overhead — mechanical key cost, not thinking, so it stays base.
        if (isUpper) delay += rand(35, 100);

        // ── Thinking pauses ────────────────────────────────────────────────
        // These are the "what do I write next?" moments. Real writers pause,
        // re-read their prompt, and stew on the next sentence or paragraph.
        if (prevChar === "\n") {
          // Starting a new paragraph: map out the next block before writing it.
          const p = rand(700, 2600);
          delay += p; pauseAcc += p;
          if (Math.random() < 0.30) {
            const q = rand(1500, 4500);
            delay += q; pauseAcc += q;
          }
        } else if (".!?".includes(prevChar)) {
          // New sentence: the pause scales with how long/elaborate it is.
          const ahead = countToSentenceEnd(text, i);
          const p = rand(350, 850) + ahead * rand(2, 6);
          delay += p; pauseAcc += p;
          if (Math.random() < 0.18) { const q = rand(1200, 4200); delay += q; pauseAcc += q; }
          if (Math.random() < 0.12) { const q = rand(500, 1600);  delay += q; pauseAcc += q; }
          hesitant = 2;                                          // first letters come out carefully
        } else if (",;".includes(prevChar)) {
          const p = rand(90, 300);
          delay += p; pauseAcc += p;
        } else if (prevChar === ":") {
          const p = rand(150, 420);
          delay += p; pauseAcc += p;
        }
        if (char === "\n") { const p = rand(120, 380); delay += p; pauseAcc += p; }

        // Slow, deliberate first strokes right after a long think
        if (hesitant > 0) { delay *= rand(1.15, 1.45); hesitant--; }

        // ── Word-boundary hesitation ───────────────────────────────────────
        if (meta.posInWord === 0 && meta.wordLen > 0) {
          const diff = meta.isCommon ? 0 : wordDifficulty(meta.word);
          const p = diff * rand(60, 200);
          delay += p; pauseAcc += p;

          // False start: occasionally begin the wrong word, catch it, and erase
          // it — a classic "thinking while typing" tell.
          const atSentenceStart = i === 0 || "?!.".includes(prevChar) || prevChar === "\n";
          const falseStartChance = atSentenceStart ? 0.05 : 0.02;
          if (meta.wordLen >= 3 && Math.random() < falseStartChance) {
            const k = meta.wordLen >= 5
              ? Math.floor(rand(2, Math.min(6, meta.wordLen) + 1))
              : 2;
            for (let j = 0; j < k; j++) {
              const c = text[i + j];
              seq.push(mkItem(c, iki(rand(0.3, 0.5)), holdDuration(c), 0, 0));
            }
            for (let j = 0; j < k; j++) {
              const gap = rand(40, 110);   // drawn once — also the pause part
              seq.push(mkItem("Backspace", gap, 70, 0, gap));
            }
            const stare = rand(350, 1000);   // staring at the erased half-word
            delay += stare; pauseAcc += stare;
          }

          // Common words often get typed in one quick, automatic burst.
          if (meta.isCommon && Math.random() < 0.50) burst = meta.wordLen - 1;
        }

        // Mid-word stumble on longer, less familiar words.
        if (burst === 0 && meta.wordLen > 4 && !meta.isCommon && meta.posInWord > 0 && Math.random() < 0.05) {
          const p = rand(120, 520);
          delay += p; pauseAcc += p;
        }
        // Second letter of any word ≥ 6 chars engages a touch slower.
        if (burst === 0 && meta.posInWord === 1 && meta.wordLen >= 6) {
          const p = rand(70, 240);
          delay += p; pauseAcc += p;
        }

        // ── Random micro/macro pauses ──────────────────────────────────────
        // Never interrupt a burst — fast stretches flow until a word boundary.
        if (burst === 0) {
          if (Math.random() < 0.010) { const p = rand(400, 2000);   delay += p; pauseAcc += p; }
          if (Math.random() < 0.006) { const p = rand(1200, 4200);  delay += p; pauseAcc += p; }
          if (Math.random() < 0.0035){ const p = rand(2500, 6500);  delay += p; pauseAcc += p; }
        }

        // Tiring near the end of a long essay — wraps up a little slower.
        if (burst === 0 && text.length > 500 && charsTyped > text.length * 0.85) {
          delay *= rand(1.05, 1.25);
        }

        // ── Burst trigger ──────────────────────────────────────────────────
        // More frequent now, and a burst always runs through the end of the
        // current word — fast stretches never cut off mid-word.
        if (burst === 0 && Math.random() < 0.09) {
          burst = Math.max(meta.wordLen - meta.posInWord, Math.floor(rand(6, 14)));
        }

        delay = Math.max(25, delay);

        // Split the total. The remainder is finger time. Both floors keep the
        // two halves non-negative so retiming can never emit a negative delay.
        pauseAcc = clamp(pauseAcc, 0, Math.max(0, delay - 5));
        const baseAcc = delay - pauseAcc;

        // ── Typo logic ─────────────────────────────────────────────────────
        // Only on real typeable letters, not spaces/newlines/punctuation.
        const neighbors = KEY_NEIGHBORS[lower];
        const isLetter  = /[a-z]/.test(lower);
        const atSentenceStart = i === 0 || "?!.".includes(prevChar) || prevChar === "\n";

        // Error rate is not uniform: hard/rare words attract more mistakes,
        // common words fewer, and fast burst stretches are sloppier.
        let typoRate = BASE_TYPO_RATE * (1 + fatigue * 0.5);
        if (meta.isCommon)          typoRate *= 0.45;
        else if (meta.wordLen >= 8) typoRate *= 1.9;
        else if (meta.wordLen >= 5) typoRate *= 1.2;
        if (meta.posInWord === 0)   typoRate *= 1.35;
        if (burst > 0)              typoRate *= 1.8;

        const canTranspose = isLetter && i + 1 < text.length && /[a-z]/.test(text[i+1]);
        const doTranspose  = canTranspose && Math.random() < typoRate * 0.30;
        const doSubstitute = !doTranspose && isLetter && neighbors && Math.random() < typoRate * 0.45;
        const doDouble     = !doTranspose && !doSubstitute && isLetter && Math.random() < typoRate * 0.20;
        const doCapSlip    = !doTranspose && !doSubstitute && !doDouble && atSentenceStart && isUpper && Math.random() < 0.05;
        const doDblSpace   = !doTranspose && !doSubstitute && !doDouble && !doCapSlip && char === " " && text[i+1] && /[a-zA-Z]/.test(text[i+1]) && Math.random() < 0.05;

        if (doTranspose) {
          // Type next char first, then current, then immediately fix both
          const next = text[i + 1];
          seq.push(mkItem(next,       delay,         holdDuration(next), 0, pauseAcc));
          seq.push(mkItem(char,        iki(0.65),     holdDuration(char), 0, 0));
          // Pause as person notices the swap, then backspace twice and retype
          const swapGap = rand(150, 420);
          const fixGap  = rand(40, 90);
          seq.push(mkItem("Backspace", swapGap, 65, 0, swapGap));
          seq.push(mkItem("Backspace", fixGap,  65, 0, fixGap));
          seq.push(mkItem(char,        iki(0.9),      holdDuration(char),  1, 0));
          seq.push(mkItem(next,        iki(0.75),     holdDuration(next), 1, 0));
          i += 2;

        } else if (doSubstitute) {
          // Type wrong nearby key, notice it, backspace, retype correctly
          const wrongLower = neighbors[Math.floor(Math.random() * neighbors.length)];
          const wrongChar  = isUpper ? wrongLower.toUpperCase() : wrongLower;
          seq.push(mkItem(wrongChar,   delay,         holdDuration(wrongChar), 0, pauseAcc));
          const subGap = rand(90, 340);
          seq.push(mkItem("Backspace", subGap, 65, 0, subGap));
          seq.push(mkItem(char,        iki(0.88),     holdDuration(char), 1, 0));
          i++;

        } else if (doDouble) {
          // Doubled key (sticky finger): the extra press is noticed and deleted
          seq.push(mkItem(char,       iki(0.5),       holdDuration(char), 1, 0));
          seq.push(mkItem(char,       iki(0.32),      holdDuration(char), 0, 0));
          const dblGap = rand(140, 700);
          seq.push(mkItem("Backspace", dblGap, 65, 0, dblGap));
          i++;

        } else if (doCapSlip) {
          // Lowercase slip opening a sentence, caught and fixed quickly
          seq.push(mkItem(lower,       iki(0.8),       holdDuration(lower), 0, 0));
          const capGap = rand(120, 460);
          seq.push(mkItem("Backspace", capGap, 65, 0, capGap));
          seq.push(mkItem(char,        iki(0.9),       holdDuration(char),  1, 0));
          i++;

        } else if (doDblSpace) {
          // Double-tapped spacebar — the extra space is deleted a beat later
          seq.push(mkItem(" ",        iki(1),          holdDuration(" "), 1, 0));
          seq.push(mkItem(" ",        iki(0.30),       holdDuration(" "), 0, 0));
          const spcGap = rand(300, 900);
          seq.push(mkItem("Backspace", spcGap, 65, 0, spcGap));
          i++;

        } else {
          seq.push(mkItem(char, delay, holdDuration(char), 1, pauseAcc));
          i++;
        }

        prevChar   = lower;
        prevFinger = finger;
        charsTyped++;
      }

      return seq;
    }

    // Total natural time for a built sequence, split by how much of it was
    // thinking rather than typing.
    function splitNatural(seq) {
      let total = 0, base = 0, pause = 0;
      for (let i = 0; i < seq.length; i++) {
        total += seq[i].delay;
        base  += seq[i].base;
        pause += seq[i].pause;
      }
      return { totalMs: total, baseMs: base, pauseMs: pause };
    }

    // Retime a built sequence to hit `targetMs` exactly.
    //
    // Pauses absorb most of the change (exponent > 1) because that is what a
    // faster or slower writer actually looks like — fewer long thinks, not a
    // uniformly jittery stream of keystrokes. Character rate moves only as much
    // as it must to land on the target.
    function retimeToTarget(seq, targetMs) {
      if (!seq.length || !(targetMs > 0)) return;

      const nat = splitNatural(seq);
      if (nat.totalMs <= 0) return;

      const k = targetMs / nat.totalMs;
      // Already natural — leave the rhythm completely untouched.
      if (k > 0.995 && k < 1.005) return;

      const kPause = clamp(Math.pow(k, 1.35), 0, 4);
      let kBase = nat.baseMs > 0 ? (targetMs - nat.pauseMs * kPause) / nat.baseMs : 1;
      kBase = clamp(kBase, 0.5, 2.5);

      let achieved = 0;
      for (let i = 0; i < seq.length; i++) {
        const it = seq[i];
        it.delay = Math.max(5, it.base * kBase + it.pause * kPause);
        achieved += it.delay;
      }

      // By construction this is already the target unless a clamp bound. The
      // requested duration is the contract, so correct the residual uniformly
      // rather than overriding the clamps.
      if (achieved > 0 && Math.abs(achieved - targetMs) > targetMs * 0.01) {
        const corr = targetMs / achieved;
        for (let i = 0; i < seq.length; i++) {
          seq[i].delay = Math.max(5, seq[i].delay * corr);
        }
      }
    }

    return { buildSequence, splitNatural, retimeToTarget };
  }

  // ── ESTIMATOR ─────────────────────────────────────────────────────────────
  // How long will this text take to type at this speed, with no retiming?
  //
  // The model is heavy-tailed (the random macro pauses are what make it read
  // as human), so a single sample swings by seconds. Take the median of a few
  // runs instead of the mean and snap to the 5s grid so the number the user
  // sees is stable while they type.
// Cost control: the model is very close to linear in character count (every
// contribution is either per-character or per-boundary), so a long text can be
// estimated on its first ESTIMATE_SLICE_CHARS characters and scaled up. That
// keeps a single recompute bounded no matter how much the user pastes.
const ESTIMATE_SLICE_CHARS = 6000;

function estimateNaturalMs(text, wpm) {
  const t = String(text || "");
  if (!t.trim()) return 0;

  const w = clamp(parseInt(wpm, 10) || 80, 1, 800);
  const msPerChar = (60 / (w * 5)) * 1000;

  let sample = t;
  let scale  = 1;
  if (t.length > ESTIMATE_SLICE_CHARS) {
    // Snap to a word boundary — cutting mid-word changes the pause density of
    // the tail that got dropped.
    sample = t.slice(0, ESTIMATE_SLICE_CHARS);
    const brk = sample.lastIndexOf(" ");
    if (brk > ESTIMATE_SLICE_CHARS * 0.75) sample = sample.slice(0, brk);
    scale = t.length / sample.length;
  }

  // Median of several runs, not one. The model is heavy-tailed — the random
  // macro pauses are what make it read as human — so a single sample swings by
  // seconds and even three still wander enough to make the readout flicker.
  const samples = 5;
  const runs = [];
  for (let s = 0; s < samples; s++) {
    const seq = createTiming(msPerChar).buildSequence(sample);
    let total = 0;
    for (let i = 0; i < seq.length; i++) total += seq[i].delay;
    runs.push(total);
  }
  runs.sort((a, b) => a - b);

  const median = runs[Math.floor(samples / 2)];
  const raw    = median * scale;

  return Math.max(DURATION_STEP_MS, Math.round(raw / DURATION_STEP_MS) * DURATION_STEP_MS);
}

  root.ScrybeTiming = { createTiming, estimateNaturalMs, DURATION_STEP_MS };
})(typeof globalThis !== "undefined" ? globalThis : self);