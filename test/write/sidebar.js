// ─────────────────────────────────────────────
//  REFS
// ─────────────────────────────────────────────
const subjectEl         = document.getElementById("subject");
const otherWrap         = document.getElementById("otherSubjectWrap");
const otherSubjectEl    = document.getElementById("otherSubject");
const wpmEl             = document.getElementById("wpm");
const wordCountEl       = document.getElementById("wordCount");
const rubricEl          = document.getElementById("rubric");
const instructionsEl    = document.getElementById("instructions");
const outlineToggle     = document.getElementById("outlineToggle");
const outlineSw         = document.getElementById("outlineSw");
const genBtn            = document.getElementById("genBtn");
const outlineNextBtn    = document.getElementById("outlineNextBtn");
const draftBackBtn      = document.getElementById("draftBackBtn");
const outlineBackBtn    = document.getElementById("outlineBackBtn");
const applyBtn          = document.getElementById("applyBtn");
const approveBtn        = document.getElementById("approveBtn");
const backBtn           = document.getElementById("backBtn");
const typeBtn           = document.getElementById("typeBtn");
const stopBtn           = document.getElementById("stopBtn");
const statusEl          = document.getElementById("status");
const draftTextEl       = document.getElementById("draftText");
const changesNoteEl     = document.getElementById("changesNote");
const essayEl           = document.getElementById("essayText");
const wordCountBadge    = document.getElementById("wordCountBadge");
const typingAnim        = document.getElementById("typingAnim");
const typingAnimLabel   = document.getElementById("typingAnimLabel");
const outlineBox        = document.getElementById("outlineBox");
const genOverlay        = document.getElementById("genOverlay");
const draftOverlay      = document.getElementById("draftOverlay");
const pageForm          = document.getElementById("pageForm");
const pageOutline       = document.getElementById("pageOutline");
const pageDraft         = document.getElementById("pageDraft");
const pagePreview       = document.getElementById("pagePreview");

// ─────────────────────────────────────────────
//  PAGE TRANSITIONS
// ─────────────────────────────────────────────
const pages = [pageForm, pageOutline, pageDraft, pagePreview];

function goTo(page) {
  pages.forEach(p => {
    p.classList.remove("page-enter", "page-exit");
    if (p !== page) p.classList.add("page-hidden");
  });
  page.classList.remove("page-hidden");
  page.classList.add("page-enter");
  setTimeout(() => page.classList.remove("page-enter"), 300);
}

outlineBackBtn.addEventListener("click", () => goTo(pageForm));
draftBackBtn.addEventListener("click",   () => goTo(outlineOn ? pageOutline : pageForm));
backBtn.addEventListener("click",        () => goTo(pageDraft));

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

// ─────────────────────────────────────────────
//  OUTLINE TOGGLE
// ─────────────────────────────────────────────
let outlineOn = false;

outlineToggle.addEventListener("click", () => {
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
//  BUILD PROMPT (Stage 1 — quality, no humanizing)
// ─────────────────────────────────────────────
function buildPrompt(includeOutline) {
  const subject      = getSubject();
  const grade        = document.getElementById("grade").value;
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
  lines.push(`- Around ${wordCount} words for the essay`);
  lines.push(`- Grade target: ${grade}`);
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
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer sk-7f880dc0867545f7aa2a6562d062a7fa"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature
    })
  });
  const raw = await response.text();
  if (!response.ok) throw new Error(`DeepSeek ${response.status}: ${raw}`);
  return JSON.parse(raw).choices[0].message.content
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1");
}

// ─────────────────────────────────────────────
//  HUMANIZE (Stage 2 — only runs after approval)
// ─────────────────────────────────────────────
async function humanize(draft) {
  const prompt = `Rewrite this essay so it sounds like a real student wrote it but keep it still academic.
Make these specific changes:
- Add one personal opinion sentence like "I think" or "personally I found this surprising"
- Intentionally make one sentence grammatically awkward — like a student who lost track mid-sentence
- Break one long sentence into two fragments on purpose
- Add one filler phrase a student would use like "basically", "for the most part", or "at least that's how I see it"
- Change at least 4 words to simpler synonyms a student would choose
- Make the conclusion feel slightly unfinished, like they ran out of things to say
- Do NOT change the core arguments, thesis, or evidence
- Do NOT change the word count significantly
- Plain text only, no markdown, no bold, no italics, no asterisks
Here is the essay:
${draft}`;
  return callDeepSeek(prompt, 0.9);
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
//  GENERATE BUTTON — Stage 1 only, no humanizing
// ─────────────────────────────────────────────
genBtn.addEventListener("click", async () => {
  if (!validate()) return;
  genBtn.disabled = true;
  showOverlay(genOverlay, "Writing draft…");
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

      draftTextEl.value = draftText;
      hideOverlay(genOverlay);
      goTo(pageOutline);
    } else {
      const draft = await callDeepSeek(buildPrompt(false), 0.7);
      draftTextEl.value = draft;
      hideOverlay(genOverlay);
      goTo(pageDraft);
    }
  } catch (err) {
    hideOverlay(genOverlay);
    console.error(err);
    alert("❌ " + err.message);
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
- Maintain formal academic tone throughout
- Do NOT add markdown, bold, italics, or asterisks
- Return only the revised essay, nothing else
Current essay:
${currentDraft}`;

    const revised = await callDeepSeek(revisePrompt, 0.75);
    draftTextEl.value         = revised;
    changesNoteEl.value       = "";
    changesNoteEl.placeholder = "Changes applied — request more or approve below";
    hideOverlay(draftOverlay);
  } catch (err) {
    hideOverlay(draftOverlay);
    console.error(err);
    alert("❌ " + err.message);
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
    const essay = await humanize(draft);
    essayEl.value = essay;
    updateWordBadge();
    hideOverlay(draftOverlay);
    goTo(pagePreview);
  } catch (err) {
    hideOverlay(draftOverlay);
    console.error(err);
    alert("❌ " + err.message);
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

// ─────────────────────────────────────────────
//  TYPING STATE
// ─────────────────────────────────────────────
function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = type || "";
}

function setTypingState(isTyping) {
  typeBtn.disabled      = isTyping;
  typeBtn.style.display = isTyping ? "none" : "block";
  stopBtn.style.display = isTyping ? "inline-flex" : "none";
  stopBtn.disabled      = !isTyping;
  backBtn.disabled      = isTyping;
  typingAnim.classList.toggle("active", isTyping);
}

// ─────────────────────────────────────────────
//  START TYPING
// ─────────────────────────────────────────────
typeBtn.addEventListener("click", () => {
  const text = essayEl.value;
  const wpm  = parseInt(wpmEl.value) || 80;

  if (!text.trim())          { setStatus("No essay to type.", "err"); return; }
  if (!parseInt(wpmEl.value)) { markError(wpmEl); wpmEl.focus(); return; }

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url?.includes("docs.google.com")) {
      setStatus("❌ Open a Google Doc first.", "err");
      return;
    }

    setTypingState(true);
    typingAnimLabel.textContent = "Typing…";

    chrome.scripting.executeScript(
      { target: { tabId: tab.id }, files: ["content.js"] },
      () => {
        if (chrome.runtime.lastError) {
          setStatus("❌ " + chrome.runtime.lastError.message, "err");
          setTypingState(false);
          return;
        }
        setTimeout(() => {
          chrome.tabs.sendMessage(tab.id, { action: "type", text, wpm }, (response) => {
            if (chrome.runtime.lastError) {
              setStatus("❌ " + chrome.runtime.lastError.message, "err");
            } else if (response?.stopped) {
              setStatus("⏹ Stopped.", "");
            } else {
              setStatus("✓ Done!", "ok");
            }
            setTypingState(false);
          });
        }, 150);
      }
    );
  });
});

// ─────────────────────────────────────────────
//  STOP TYPING
// ─────────────────────────────────────────────
stopBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.tabs.sendMessage(tab.id, { action: "stop" }, () => {
      setStatus("Stopping…", "run");
    });
  });
});