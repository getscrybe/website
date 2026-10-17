# The High-Converting Website Playbook

*A capstone synthesis of foundational CRO research, quantified industry benchmarks, and advanced optimization tactics — written to be applied to any site: SaaS, ecommerce, lead-gen, or content.*

---

## Executive Summary

This playbook is a field manual for turning any website into a machine that converts more of the traffic you already pay for. It synthesizes three research files into one operational document: **Part 1** covers the conversion fundamentals (value proposition, structure, copywriting, CTAs, psychology, trust, forms); **Part 2** gives you the numbers — the benchmarks to set goals against and the quantified levers ranked by uplift so you can spend effort where the data says it pays; **Part 3** goes into the engine room (speed and Core Web Vitals, mobile, personalization, checkout engineering, behavioral tools, testing discipline, and AI-era tactics); **Part 4** is a concrete 30-day implementation plan; **Part 5** is a yes/no audit checklist you can run against any page this afternoon; and the final section lists every source consulted. How to use it: **scan the part that matches your current bottleneck, apply the checklists, and let the benchmark table set your targets.** Every major tactic carries a source tag — `[Baymard]`, `[WordStream]`, `[NN/g]`, `[HubSpot]`, `[Copyhackers]`, `[GoodUI]`, `[CXL]`, `[Google]` — and `[GENERAL]` marks widely-cited industry knowledge that could not be re-verified during the research session. Where the data gives a number, it's stated so your priorities can be data-driven, not vibes-driven. The thesis in one line: **most conversion problems are clarity, friction, and trust problems — and most of them are fixable without buying more traffic.**

---

# Part 1 — The Conversion Fundamentals

Everything in a converting page reduces to one loop: the visitor arrives, understands the value fast, feels it's credible and low-risk, and takes one obvious next step. Part 1 builds that loop from the ground up.

## 1.1 Value Proposition & Clarity

**The value proposition is the single most important copy block on your page.** Copyhackers calls it the North Star that "attracts and anchors potential customers" — and it's not set in stone; it's the first thing to iterate on. [Copyhackers] Your value prop is the answer to one question a skimmer asks in the first five seconds: *"What's in it for me, and is it credible?"* If the answer isn't obvious, nothing else on the page can save you.

**Non-negotiables for a strong value prop:**

- **Clarity over cleverness, everywhere.** "Leading with clarity, not cleverness" is the standard. The fill-in-the-blank discipline: *"You're here because {problem}. Here's how we fix it."* [HubSpot]
- **Specificity beats generic.** "If you can articulate the problem better than your reader can, they'll trust that you can solve it too." Concrete numbers, timeframes, and outcomes ("in 48 hours," "17 templates," "9 in 10") beat vague superlatives — precision reads as a verifiability cue. [HubSpot] [GENERAL]
- **Meet people where they are.** Reflect the visitor's current struggle or active problem, not just product attributes. [HubSpot]
- **Pair every feature with its outcome:** `{Feature} so you can {benefit}` — "Automate your payroll audits *so you can* stop stressing over errors." [HubSpot]

### Reusable value-proposition formulas (copy-paste and fill in)

| Formula | Pattern | Example |
|---|---|---|
| **The classic slot-filler** | `For {target} who {need or opportunity}, {Name} is {product category} that {benefit}.` | "For content teams with aggressive publishing schedules and high standards, Airstory is the content creation software that helps teams build on each other's ideas to produce incredible articles, blog posts and ebooks." |
| **VAD** | `Verb, Application, Differentiator` | "Drop research directly into blog posts and articles." |
| **The differentiator** | `We do X, but the difference is {primary differentiator}.` | "We do payroll, but the difference is the audits are automated." |
| **The adjective way** | `The {adjective} way for {who} to {verb}, {outcome}.` | "The no-brainer way for writers to turn ideas into blog posts, articles and ebooks — for better content marketing." |
| **Proven-instance bridge** | `{Proven industry example} for/of {new domain}.` | "Evernote meets Google Docs, for writers." |
| **Direct help** | `We help X do Y doing Z.` / `We're the ones that {differentiator}.` | "We help ecommerce teams ship faster by automating QA." |
| **Superlative + qualifier** | `{Superlative} {category} {qualifiers}.` | "The smartest writing software for content teams." |
| **Customer-Problem-Solution** | State the customer's problem → the solution → the mechanism. | "Payroll errors are costing you hours. AuditDox automates them in minutes." |
| **What.How.Why.** | Name the product/category → what it does → *so you can {outcome}.* | "AuditDox automates payroll audits so you can stop stressing over errors." |
| **Enormous problem stack** | Enormous problem → Solution → Core differentiator → Credibility. | See long-form sales pages and pitch decks. |

[Copyhackers formulas]

## 1.2 Landing Page Structure & the Hero

### The above-the-fold data (the fold still matters)

- **57% of all page-viewing time is spent above the fold; 74% in the first two screenfuls; 81% in the first three.** Attention concentrates at the top of the page. (Down from 80% above the fold in NN/g's 2010 study — long pages have diluted but not killed the effect.) [NN/g]
- **The top half of the viewport beats the bottom half:** more than 65% of above-the-fold viewing time goes to the top half of the screen (75%+ on SERPs). The closer information sits to the top, the more likely it is to be read. [NN/g]
- **The "fold barrier" has pushed down to roughly the third screenful** — people rarely go beyond it, and the interaction cost of scrolling reduces the chance lower content is seen. [NN/g]
- **Watch for "false floors":** minimalist layouts that look like the page has ended (an illusion of completeness that blocks scrolling). Add signifiers — cut-off text, a partial next section — that invite scrolling. [NN/g]
- **Unbounce's rule: keep the action above the fold.** Headline + USP + a strong CTA must be visible without scrolling — but don't cram: "too much above the fold can make it difficult to see your CTA." [Unbounce]
- **GoodUI's nuance: the "squeeze everything above the fold" idea is fading.** Long pages are normal, and a soft CTA at top plus a prominent one at the bottom is a strong pattern. [GoodUI]

### The canonical build order (in conversion importance)

HubSpot's core landing page structure, in order: **1) Headline that clearly states value → 2) image/graphic that reinforces it → 3) quick description or bullets → 4) CTA or lead form (ideally above the fold) → 5) social proof (logos/testimonials).** Everything else is optional on top of this foundation. [HubSpot]

**A page must cover five things:** pain point, your solution, features, benefits, and social proof. "It's not about cramming every detail above the fold, it's about building the narrative in a way that earns trust fast and answers the biggest questions upfront." [HubSpot]

**Match layout to consideration level:**
- **Cheap offers:** headline + a few scannable bullets + form above the fold.
- **Complex offers (trial, consult):** layer testimonial, feature list, explainer video.
- The rule: **"More friction? More clarity."** [HubSpot]

### Hero section rules

- **Hero = value prop + CTA, immediately — especially on mobile.** "Above the fold is prime real estate, so I make sure the value prop and CTA show up immediately, especially on mobile." [HubSpot]
- **Show the product in action in the hero.** Demonstrate the product/service doing its job rather than abstract stock imagery; humans + real usage read as more credible. [Unbounce]
- **Live/ambient data can substitute for reading.** One landing page with a live-updating price grid ("the background became the pitch") drove scroll depth +61% in a week — turning the value prop into a visual, verifiable asset. [HubSpot case study]
- **Counterpoint: don't rush the hero CTA for high-consideration offers.** A prematurely placed hero button can undercut persuasion — "Consider removing the CTA from the hero and writing the page with a traditional copywriting formula in mind instead." People *will* click early CTAs, but an early button can interrupt the persuasive arc. [Copyhackers]
- **The 5-second test:** if someone skims the page in 5 seconds, will they understand the value? [HubSpot]
- **One-column narrative layout** guides readers predictably top → bottom and converges on a single CTA; multi-column risks scattering attention away from the core purpose. [GoodUI #1]

## 1.3 Copywriting Frameworks

Use a framework so your page has a persuasive arc, not a feature dump. The frameworks below go from short-form to long-form. [Copyhackers]

| Framework | Expansion | Best use |
|---|---|---|
| **AID(A)** | Attention → Interest → Desire → Action | The classic. The D is the step most pages skip: "a lot of businesses address the A, I and A in AIDA… but forget entirely about the D." |
| **AIDCA** | Attention → Interest → Desire → **Conviction** → Action | Skeptical audiences who need proof inserted before the ask. |
| **AIDPPC (Robert Collier)** | Attention → Interest → Description → Persuasion → **Proof** → Close | Uses Proof where AIDA leaves it implied. |
| **PAS** | **Problem → Agitate → Solution** | Dan Kennedy: "the most reliable copywriting formula for sales ever invented." Works from tweets to long sales pages. |
| **CSI** | **Challenge → Solution → Invitation** | PAS variant; the Invitation is the CTA. |
| **PAPA** | **Problem → Advantages → Proof → Action** | Home/lead-gen pages where "painting a picture" (the 4Ps "Picture") can read as scammy. |
| **AICPBSSAWN** | Attention → Interest → **Credibility** → Proof → Benefits → **Scarcity** → Action → **Warn** → **Now** | Long-form. Note the explicit credibility, scarcity, warn, and now steps. |
| **Star Story Solution** | Character-focused narrative | Early Apple ads; story-led products. |
| **Bob Stone's 7-step / Frank Egner's 9-point** | Structured sales-letter steps | Classic direct-response sales pages. |
| **Perry Belcher 21-part** | Full sales-letter formula | The CTA appears at step **#19** — after offer, bonuses, value stacking, price, scarcity and guarantee. "You should not be in a rush to supply a CTA." |
| **FAB** | **Feature → Advantage → Benefit** | Deeper sections where the prospect is higher in awareness and has a checklist of must-have features. |

**Bullets are "fascinations."** Direct-response writers treat bullets as so compelling they magnify desire — a plain "benefit" bullet promotes the feature; a fascination hooks emotion. [Copyhackers]

### Reusable headline formulas (copy-paste and fill in)

Headlines do more work than anything else on the page — and are one of the highest-ROI things to test (see Part 2). These are swipe-file-derived; every subhead and crosshead deserves the same formula discipline as the main H1. [Copyhackers] [HubSpot]

1. `{Product Name} is a {category} that {different thing it does best}` — "Airstory is writing software that lets you send great ideas straight to your document." (TechCrunch-style)
2. `For {target} who {need or opportunity}, {Name} is {product category} that {benefit}.` — the value-prop formula as headline.
3. `Who Else Wants {Most Desirable Outcome or Benefit}?`
4. `The Only {Keyword Phrase} Made Exclusively to {Most Desirable Outcome}`
5. `Get the {Unusual Adjective} Power of {Product Category} Without {Pain}` — "Get the astonishing power of eye tracking technology… without the high costs" (Crazy Egg).
6. `Get Rid of {Problem} Once and For All`
7. `How to Permanently Stop {Painful/Embarrassing Thing}, Even if You've Tried Everything!`
8. `{Objection}. But it works.` — "Ugly. And it works."
9. `How to {get incredible result} and {do unexpected thing as a result}.`
10. `To the {role} who will settle for nothing less than {world-class outcome}`
11. `How Your {Service Provider} Is Ripping You Off. (And what to do about it right now.)`
12. `I Found a {Adjective} Way to {Get Incredible Outcome}`
13. `The Ultimate Guide to {Good, Bad, or Desirable Thing}` / `What Everybody Ought to Know About {Thing}`
14. `X Lessons I Learned from {Person or Unusual Experience}`
15. `Little Known Ways to {Outcome}` / `The Secret of {Desirable Thing}`

**Curiosity/tease formats (use sparingly, keep the hook in the subhead):**

16. `I Stopped {Doing Common Thing} Today. You Should Too. Here's Why.`
17. `I spent {time} {working toward goal}. I just {quit}. Here's why.`
18. `{Surprising fact}. But here's what I'd do differently.`
19. `Is {Trending Topic} a Scam?`
20. Q&A/direct-address (still effective for services): *"Tired of reconciling payroll errors every month and still feeling like something's missing?"* [HubSpot]

### Clarity & scanning rules (NN/g F-pattern)

Most users will skim, not read. [NN/g]
- Put the most important points in the **first two paragraphs**.
- Use headings/subheadings; **start headings with the information-bearing words** — if only the first two words are read, readers still get the gist.
- **Bold key phrases.**
- Write **descriptive link text**, not "click here" / "more."
- Match the headline/copy/design to the **ad you're running** — this is Unbounce's #1 landing page best practice (full treatment in Part 3, message match). Long ad → long-matching page; for many distinct ads, use variant pages or dynamic text replacement. [Unbounce]

## 1.4 CTA Best Practices

"Buttons are the site of conversion online — you can't convert without clicking at least one button." [Copyhackers] Treat them as the most tested element on the page.

### Button copy

- **Specific beats vague.** "Specific CTAs like 'Get the guide' or 'Reserve your spot' almost always outperform vague ones like 'Learn more.' The clearer the next step, the more likely people are to take it." [HubSpot]
- **The "I Want" button:** write the button as the visitor's own words — "I want to ___" ("I want to get a new car") or "I want you to ___" ("I want you to show me the newest cars"). Keep the first-person "me" in the button. Start commercial buttons with "get," then match the phrase to the prospect's desire. [Copyhackers]
- **RAD check before placing a button:** **R**equire (the visitor has the info required before clicking — don't place a premature button), **A**cquire (make the target easy to click), **D**esire (the button must promise what the visitor actually wants). [Copyhackers]
- **Hook, Line and Sinker:** 1) hook with a no-BS direct CTA ("Download our free whitepaper"), 2) a low-commitment offer, 3) a closer ("click here for more resources"). [Copyhackers/WordStream]
- **First-person vs second-person:** the famous Michael Aagaard A/B test reported "Start my free trial" beating "Start your free trial" by a wide margin (as much as ~90% in some reported variants). Labeled `[GENERAL]` because it wasn't re-fetched in the research session — but it remains a prime button-copy test candidate. [GENERAL]

**Quick CTA copy patterns table:**

| Pattern | Formula / Example | Source |
|---|---|---|
| Specific verb + object | "Get the guide" / "Reserve your spot" (vs "Learn more") | HubSpot |
| First-person | "Start my free trial" / "Create my account" | GENERAL (Aagaard test) |
| "I want" fill-in | "I want to drive a better car" | Copyhackers |
| Get'em then delight | "Get {free thing}… without {pain}" | Copyhackers |
| Loss-frame | "Stop paying for {waste}" | GENERAL/GoodUI |
| Time-frame | "Get results in 30 days" | GENERAL |

### Color, contrast, size & affordance

- **CTAs should look like buttons** — bold, contrasting color, recognizable shape — so they pop out from the page. [Unbounce]
- **Raise contrast so the CTA dominates:** use tone (darker vs lighter), depth (drop shadows/gradients), or complementary color-wheel pairings. [GoodUI #11]
- **Keep interactive styles distinct and consistent:** clickable / selected / plain-text must be visually distinct and applied consistently (e.g., blue = clickable). Don't blur the styles. [GoodUI #6]
- **Reserve emphasis for the primary CTA.** Any element can be emphasized via size, contrast, irregular shapes, auto-focus, sticky/floating position, directional arrows — "but you cannot have everything scream on a page." [GoodUI #56]
- **Fitts's Law:** larger click targets and closer-to-intent placement are easier and faster to hit — especially relevant for mobile thumb zones (Part 3). [GENERAL]

### Placement

- **One focused CTA per page beats competing asks.** "One strong CTA always outperforms multiple competing asks. If I want someone to download an ebook, I'm not also asking them to sign up for a newsletter or book a call." [HubSpot] [Unbounce]
- **Repeat the CTA down the page (not per-screen).** One soft actionable item at top, another prominent one at bottom — "when people reach the bottom, they pause and think what to do next — a potential solid place to make an offer or close a deal." Don't repeat 10x on one screen. [GoodUI #5]
- **Sticky/floating CTA:** recurring mobile tests treat the sticky bottom CTA as a primary pattern for mobile lead-gen (currently being validated via the Trustworthy Replication Project). [GoodUI leaked tests]
- **Minimize competing links above the CTA.** On tunnel-style pages, every link above the primary CTA risks leaking the visitor away; more links = more exits. [GoodUI #16]
- **Action-oriented language:** be direct and confident — avoid "perhaps," "maybe," "interested?", "want to?"; tell people what to do next. Use action verbs tied to the outcome ("Get," "Start," "Reserve," "Download"). [GoodUI #10] [HubSpot]

### CTA microcopy / "click triggers"

Click triggers are the small lines around the CTA that ease hesitation at the decision moment. A single line under the button ("Only takes 30 seconds") can meaningfully lift conversion. [HubSpot]

Working examples: "Free download, no signup required," "Join 10,000+ marketers using this template," "Limited spots available," "Cancel anytime, no strings attached," money-back guarantee, easy unsubscribe, happy-customer quote, "what to expect" blurb, price slashing, privacy policy. **The trigger must match the offer and never overpromise.** [HubSpot]

## 1.5 Conversion Psychology

Each principle below comes with a practical application tip. These are the mechanisms behind the tactics; deploy them deliberately, not as decoration.

### Social proof

**Mechanism:** "creates or reinforces trust and drives users to action via the persuasive power of herd behavior… and psychological phenomena that drive normative behavior." Types: testimonials (written/video), user reviews, customer ratings, embedded social mentions ("Customers also bought," counts/counters), "as seen in" logos. [Copyhackers]

**Five studies worth internalizing** [Copyhackers]:
1. **Hospital hand-washing field study** (14 weeks, 7 signs, n=246,098): only the **Authority** and **Social Proof** signs significantly increased hand washing. The winning social-proof message was pure herd/bandwagon: *"Our hospital visitors disinfect their hands."*
2. **eID adoption:** a social-proof callout made people **3.96x more likely** to adopt digital ID; 77% opted for the eID option where the callout was present.
3. **Social proof works hardest when people are conflicted/unsure** — and **decisions were made faster** when social proof was present. A nudge is pointless when someone already knows what they want, and ineffective when they think they're smarter than the herd.
4. **What shoppers rank first on B2C sites:** (1) fast & accurate search, (2) **reviews by verified buyers**, (3) digital security certificates, (4) privacy policies, (5) trust factors like online support. Essential usability is the *only* factor ranked above verified-buyer reviews — verified reviews are the strongest trust/conversion lever after basic usability.
5. **"AI proof":** 85% of participants agreed with a humanoid robot's assessment — decision shortcuts, not just numbers.

**Practical tip:** make testimonials feel real — full names, job titles, place of residence, purchase date, biographical detail, portraits, or video. [Unbounce] Use testimonial-writing formulas: **TEASE** (short-form), the **4 Ss** (AWAI), and story-form testimonials (initial belief → transformation → result). Gather raw customer feedback first, then edit with sign-off. [Copyhackers] Keep proof **relevant, verifiable, and consistent with the offer** — fake or mismatched proof backfires.

### Scarcity & urgency

**Mechanism:** scarcity ("Only 5 items left!") and urgency ("Sale ends in 3 hours!") trigger FOMO; they create perceived value increase (limited = valuable) and prompt decision-making by minimizing procrastination. [Copyhackers]

**Practical tip:** two hard rules — **authenticity** (real discounts, real stock) and **avoid overuse** (constant "last chance" messaging desensitizes and erodes trust). [Copyhackers] In long-form formulas, scarcity is a deliberate late-page move — injected right before price/guarantee/CTA (AICPBSSAWN "Scarcity"; Belcher's 21-part). [Copyhackers]

### Authority

**Mechanism:** credentials persuade. "List off your credentials, including proof, results, examples, testimonials" (VSL template); "present your credentials" (Perry Belcher). Authority is one of Cialdini's principles and one of the two signs that measurably worked in the hospital field study. [Copyhackers]

**Practical tip:** show expertise claims, "as seen in" logos, author/expert bylines, and certifications near the decision point. [GENERAL]

### Reciprocity

**Mechanism:** the rule of reciprocity — "being nice to someone by offering a small token of appreciation can come back in your favour down the road." [GoodUI #2]

**Practical tip:** give a gift before closing the sale — lead magnets, free guides/tools/templates, valuable content before asks, free trials. [GENERAL]

### Loss aversion

**Mechanism (Kahneman–Tversky prospect theory):** losses loom ~2x larger than equivalent gains. "Warn" steps ("what happens if you don't act") are standard in conversion formulas (AICPBSSAWN's Warn; Belcher's "give a warning"; VSL "FOMO/deadline"). [Copyhackers + GENERAL]

**Practical tip:** frame outcomes as protection/cost-avoidance as well as gains — "stop wasting money / stop stressful errors" beats "save money / gain peace" in many audiences. [GENERAL]

### Anchoring

**Mechanism:** the first-seen price anchors subsequent judgments. [GENERAL]

**Practical tip:** show the higher/regular or premium price before the actual one; use price illusions that shape valuation — framing words ("only," "affordable," "a small fee of"); break price into per-unit/per-day terms ($1/day vs $30/month; 30¢/page vs $30/book); charm pricing (ending in 9); fewer digits ($30 vs $30.00). [GoodUI #51] In value stacking, build up the value of solution + bonuses *before* revealing price. [Copyhackers]

### Hick's law — choice reduction

**Mechanism:** "the more choices there are, the harder decision-making becomes" — with more choice, satisfaction drops as expectation, regret and self-blame rise. [GoodUI #75, citing ConversionXL]

**Practical tip:** recommend a **default option** when showing multiple offers to battle analysis paralysis [GoodUI #7]; on pricing tables, limit the number of properties compared, space them clearly, and ask for a single decision [GoodUI #57]. Test it though — the famous jam study has struggled to replicate. [GoodUI #75]

### Von Restorff effect (isolation)

**Mechanism:** an element that differs from its surroundings (color, shape, size) gets disproportionately more attention — the psychological foundation for making one CTA "pop" via contrast. [GENERAL + GoodUI #11/#56]

**Practical tip:** make exactly one element the isolated, high-contrast exception on the page — your primary CTA. [GoodUI #11/#56]

### Decoy effect

**Mechanism (Huber–Payne–Puto):** add a deliberately inferior (or overpriced) middle option to make the target option look better value. Classic good-better-best pricing uses the "better" plan as the anchor and a decoy "premium" to justify it. [GENERAL]

**Practical tip:** in three-tier pricing, the middle tier is usually the target; make the top tier's price make the middle look like a steal. [GENERAL]

### Other proven micro-mechanisms (GoodUI)

- **Smaller commitments** ("foot in the door"): a series of small yesses beats one big ask; "no contract" messaging lowers the barrier. [GoodUI #44]
- **But-You-Are-Free / reaffirming choice:** explicitly saying "it's your choice / you are free to refuse" can lift compliance (some studies ~2x); strongest face-to-face and adjacent to the request. [GoodUI #54]
- **Curiosity loops:** teasers create desire — but only if you don't give away the whole answer. [GoodUI #49]
- **Set completion / goal gradient:** progress indicators and collection/goal framing motivate ("step X of Y," finite collectible sets). [GoodUI #58/#59]
- **Authenticity beats polish-of-lies:** stock photos with fake smiles undermine trust; a mix of good and bad reviews can help; precise non-round numbers read as more believable. [GoodUI #65]
- **Storytelling** beats raw fact-listing for memorability and emotion. [GoodUI #64]

## 1.6 Trust Signals & Credibility

- **Trust is built through clarity, tone, and polish.** Sloppy formatting, broken links, and inconsistent messaging are instant red flags. [HubSpot]
- **Security signals rank high with shoppers:** after usability and verified reviews, shoppers value **digital security certificates** and **privacy policies** above other trust factors (online support last). [Copyhackers social proof study 4]
- **Trust badges** (SSL/payment badges, certifications) are a general category of proof — with the hierarchy above: usability → verified reviews → security certificates → privacy policies → support. HTTPS is the baseline default for any modern site. [GENERAL]
- **Guarantees are risk-removers in every big persuasion formula:** "reduce risk with a guarantee" and "create a great guarantee… this critical risk-reducer" appear near the decision point (before the CTA) in both the 21-part and 12-step templates — guarantees are a specific form of click trigger. [Copyhackers + HubSpot] A strong, specific guarantee has quantified lift behind it — see Part 2.
- **Transparent pricing beats the scramble:** lead with the value, reveal price late but clearly, and pair with risk-reversal. Pricing transparency + anchoring done artfully. [Copyhackers; GENERAL]
- **"As seen in" logos** — a form of authority/social proof; the optional 5th element of the core landing structure. [HubSpot + GENERAL]
- **Authentic testimonials:** real names, job titles, locations, dates, photos/video — unverifiable or stock-looking proof backfires. [Unbounce + GoodUI #65]
- **Message mismatch kills trust:** the page must follow through on the ad's promise or the visitor bails. [Unbounce]

## 1.7 Form Optimization

### Field reduction

- **Fewer fields convert better:** "each field you ask for runs the risk of making your visitors turn around and give up" — question the necessity of every field; move optional fields after submission. [GoodUI #13]
- **Trim to essentials for speed:** if submission rate underperforms, "start with the form… trimming it down to the essentials (like just name and email) makes a big difference." [HubSpot]
- **The trade-off:** fewer fields reduce friction, but "sometimes one extra qualifier helps lead quality" — balance volume vs. quality. [HubSpot]

### Multi-step vs single-step

- **Multi-step forms reduce friction for lead-gen:** "nobody likes paperwork… the same goes for long forms" — splitting into steps also structures data collection so you gather information incrementally. [Unbounce lead-gen]
- **Multi-step = goal-gradient wins:** progress ("step 1 of X") leverages set-completion motivation. [GENERAL + GoodUI #58/#59]
- **Progressive disclosure:** show only relevant fields/segments. [GoodUI #43]
- **Don't over-split:** each extra step adds a boundary; keep steps few, labeled, and reversible. [GENERAL]

### Placement & friction

- **Form or CTA ideally above the fold** (especially mobile). [HubSpot]
- **Microcopy / click triggers near the submit:** privacy line, "only takes 30 seconds," "no spam," "cancel anytime." [HubSpot + Unbounce]
- **Privacy reassurance is expected:** privacy policy link and "We'll never share your email" statements near the form. [Unbounce lead-gen]
- **Explain fields with context** (what's needed, example input, why) — never placeholder-as-label only. [GoodUI #68]
- **Inline validation beats delayed errors:** catch errors as they happen, in context, instead of forcing recall after submit. Enable corrections/retries without wiping input. [GoodUI #22, #72]
- **Make math easy:** no manual calculations; autocomplete/format-aware fields. [GENERAL + GoodUI #53]
- **Thank-you/re-engagement after submit:** a thank-you page/popup confirms submission and opens next-action opportunities. [Unbounce lead-gen]
- **Watch drop-off beyond submission rate:** track scroll depth, time on page, and form drop-off rate, not just headline conversion rate. [Unbounce]

---

# Part 2 — The Numbers

Set targets from benchmarks; spend effort where the quantified levers point. This section has two halves: (a) what "good" looks like, and (b) what each lever is worth.

## 2.1 Conversion Benchmarks by Site Type

### Landing pages

| Metric | Value | Source |
|---|---|---|
| Average landing page conversion rate, all industries | **2.35%** | WordStream (thousands of Google Ads accounts, $3B annual spend) |
| Top 25% of pages convert at | **5.31%+** | WordStream |
| Top 10% of pages convert at | **11.45%+** | WordStream |
| Top performers vs average | 2–3x the average; top-10% run 3–5x their industry average | WordStream |
| Unbounce on-platform average (Q4 2024) | **~6.6%** | Unbounce (built/optimized pages — higher because it's their platform) |
| Honest median for the general web | **~2–4%** | Derived from WordStream + Unbounce bands |

Treat WordStream's 2.35% and Unbounce's 6.6% as the two ends of the "average" band. **Your target: beat the top-25% bar (5.3%+), not the average.** [WordStream] [Unbounce]

### By site type

| Type | Typical rate | Notes | Source |
|---|---|---|---|
| Legal | ~5% | — | [GENERAL / commonly cited] |
| Financial services | ~5% | — | [GENERAL / commonly cited] |
| B2B services | ~3% | — | [GENERAL / commonly cited] |
| Travel | ~3% | — | [GENERAL / commonly cited] |
| Ecommerce (session → order) | ~2–3% desktop, ~1–2% mobile | Many large merchants operate below 2% | [GENERAL / commonly cited] |
| SaaS free-trial signup (visitor → signup) | **1–5%** | — | [GENERAL / commonly cited] |
| B2B lead-capture form | **1.5–4%** | — | [GENERAL / commonly cited] |
| B2B demo-booked | <1% is normal | North-star is qualified-demo rate, not raw form fills | [GENERAL / commonly cited] |
| Lead-magnet landing pages (email ↔ PDF/course/checklist) | **10–25%** | When magnet is highly relevant and page is single-CTA; 25%+ exceptional | [GENERAL / commonly cited] |
| Content-site email opt-in | **1–3%** of total visitors | Dedicated landing pages perform far higher | [GENERAL / commonly cited] |

### Mobile ecommerce structure

- Mobile accounts for **~60–70% of ecommerce traffic** but only about **1/3 of desktop's conversion rate** — traffic share and conversion are structurally mismatched. [GENERAL / commonly cited]

## 2.2 The Quantified Levers — ranked table

How to read this: each row is a lever, its typical documented uplift, the mechanism, and sourcing notes. Ranked roughly by reliability of evidence and size of effect.

| Rank | Tactic | Typical uplift / effect | Mechanism | Notes |
|---|---|---|---|---|
| 1 | **Checkout UX / friction removal** | **+35.26% conversion** potential for the average large ecommerce site; ~**$260B** recoverable in US+EU orders (of ~$738B ecommerce); average site has ~**39 potential improvements** | Cart abandonment at **70.22%** average (50 studies, range 56.8–84.3%) is driven by costs, account walls, long forms, distrust — all design-fixable | Baymard (fetched). Single biggest quantified lever in the dataset |
| 2 | **Page speed** | **53%** of mobile visits abandoned if load >3s; **~100ms delay ≈ −7%** conversions; **+8.4%** retail / **+9.2%** travel conversions per **0.1s** improvement; **~0.5pp conversion lost per second** of load; sub-1s pages convert ~**2.5x** better than 5s pages | Attention/time economics; faster pages get more viewing time and less dropout | [GENERAL / commonly cited] (Google, Akamai, Deloitte, Portent) |
| 3 | **Headlines** | Typical A/B wins **+10–40%** relative; extreme cases **>+100%**; headline read ~**5x** more than body copy (~80% of readers never get past it) | The headline frames everything; it's the first (often only) thing read | [GENERAL / commonly cited] (Copyblogger, VWO/CXL/GrowthHackers roundups) |
| 4 | **Cart abandonment recovery (exit-intent rescue)** | Exit-intent popups convert **~9–12%** of targeted visitors vs **~3.8%** for all popup types | Captures shoppers at the moment of highest dropout intent; doesn't interrupt browsing | [GENERAL / commonly cited] (Sumo, OptinMonster, Picreel) |
| 5 | **Social proof / testimonials** | **~34% average conversion uplift** (academic Bayesian Belief Network study); vendor case roundups **+10–40%**; star ratings with count beat vague praise | Reduces uncertainty; verified reviews rank #2 trust factor after basic usability | [GENERAL / commonly cited] |
| 6 | **Guarantee** | Strong, specific guarantee lifted orders **~32%** in a MECLABS subscription test | Risk reversal at the decision point | [GENERAL / commonly cited] (MECLABS/MarketingExperiments) |
| 7 | **Form-field reduction** | Removing one field (4→3) increased conversions **~11.9%** (HubSpot test); each unnecessary field costs ~**0.5–5%** of fills; ideal checkout is **12–14 form elements (7–8 fields)** vs US average **23.48 (14.88)**; most checkouts can cut **20–60%** of shown elements | Each field is a micro-commitment and a friction point | Baymard (fetched) + [GENERAL / commonly cited] HubSpot |
| 8 | **Video on landing pages** | Vendor figure: adding/replacing landing-page video ≈ **+80%** conversions (EyeView); **~81%** say they've been convinced by a brand's video; ~96% have watched an explainer | Explains complex products fast; best above the fold for complex offers | [GENERAL / commonly cited] (EyeView, Wyzowl) — vendor figure, not peer-reviewed; "video always wins" is overstated |
| 9 | **Message match (ad → page)** | Vendor roundups typically show **20–60% conversion differences** on message-match A/B tests at equal traffic | Promise-to-reality gap kills trust; also improves Google Quality Score (lower CPCs) | [GENERAL / commonly cited] |
| 10 | **Payment options (wallets/BNPL)** | One-click/saved payment **~30–40%+** above manual card entry for repeat buyers; BNPL typically **+20–30% AOV and +15–35% conversion** on eligible baskets | Removes card-entry friction and "can't afford now" abandonment; **9%** abandon for "not enough payment methods" | Baymard (9% fetched) + [GENERAL / commonly cited] (Stripe, Adyen, merchant reports) |
| 11 | **One-page vs multi-step checkout** | One-page wins often **+20–30%** — but only when the original multi-step had no progress feedback; mechanism is total form elements, not page count | Fewer elements, visible progress | [GENERAL / commonly cited] |
| 12 | **Personalization** | Top-line revenue lift **~10–15%** at **5–8x ROI**; Amazon attributes ~**35%** of revenue to recommendations; returning visitors convert **2–3x** new ones | Relevance; recognition; recommendation | [GENERAL / commonly cited] (McKinsey, Epsilon, Segment, Accenture) |
| 13 | **Exit-intent / popup strategy** | Average popup conversion **~3.81%**; top campaigns hit **30–40%**; incentive popups convert ~2–3x non-incentive | Trigger timing + incentive | [GENERAL / commonly cited] (OptinMonster) |

### Where the drop-off actually happens (funnel benchmarks)

- **Ecommerce:** of sessions, ~**5–10%** view a product, ~**3–7%** add to cart, and ~**25–30% of carts** convert (complementary to the 70% abandonment figure). Net session → purchase lands at ~**1–2%**. [GENERAL / commonly cited]
- **The single biggest drop** is cart → checkout entry and checkout → purchase: with 70% abandonment, roughly **2 in 7 carts** make it through; half of those who enter checkout abandon within it — driven by costs, account walls, long forms, and distrust. [GENERAL / commonly cited]
- **SaaS/B2B:** ~**50–70% of visitors bounce** from landing pages; of the rest, only 1–5% click the primary CTA; of those, a fraction complete the form → free-trial/demo conversion of ~1–3% is a good target. [GENERAL / commonly cited]
- **Premature interruption shifts drop-off earlier:** popups that interrupt before the user gains value trigger instant close/search-escape behavior. [NN/g (fetched)]

### Cart abandonment reasons (Baymard — fetched)

Average documented abandonment: **70.22%** (50 studies; individual range ~56.8% to **84.27%**). Reason breakdown (excluding "just browsing"):

| Reason | % of abandoners |
|---|---|
| Extra costs too high (shipping, tax, fees) | **40%** |
| Delivery too slow | **20%** |
| Didn't trust site with card info | **19%** |
| Forced account creation | **18%** |
| Too long / complicated checkout | **17%** |
| Site errors / crashed | **17%** |
| Returns policy not satisfactory | **13%** |
| Couldn't see/calculate total up-front | **12%** |
| Card declined | **10%** |
| Not enough payment methods | **9%** |

[Baymard] The top four drivers — surprise costs, slow shipping, distrust, forced account creation — are all solvable with design and transparency, and they outnumber the "just browsing" abandonments that are mostly unavoidable.

## 2.3 A/B Testing Sample-Size Reality

- **95% confidence** is the standard threshold; **80% statistical power** is the standard used by testing tools. [CXL]
- **Worked example (Evan Miller's calculator, defaults):** baseline **10.2%**, minimum detectable effect **+3pp (→13.2%, ~+29% relative)** at 80% power / 95% significance requires **2,545 visitors per variation** (~5,090 total). [Evan Miller]
- **The brutal implication:** at a **2% baseline**, detecting a +20% relative lift (2.0→2.4%) needs roughly **~30,000 visitors per variation**. Most sites should optimize for an MDE of **≥20–30% relative**, use Bayesian or sequential methods at low traffic, and never launch a "winner" found in under a few thousand conversions. [Derived from Evan Miller / CXL]
- **Don't peek:** repeated peeking inflates alpha (false positives). Pre-determine sample size and stopping point before launch. [CXL]
- **Confidence intervals:** "20% ± 2%" = ±2pp margin; if two variations' intervals overlap, keep testing — results are not distinguishable. [CXL]

---

# Part 3 — Advanced Engine Room

The fundamentals get you to average. This part is where you build a compounding edge: speed, mobile, personalization, checkout engineering, behavioral tools, testing discipline, and AI.

## 3.1 Page Speed & Core Web Vitals

### Why it matters — quantified

- **53% of mobile visits are abandoned when a page takes >3s to load** (Google/Think with Google research). [GENERAL / Google]
- **~100ms of added delay ≈ −7% conversions** (Akamai, widely cited). [GENERAL]
- **0.1s speed improvement ≈ +8.4% retail conversions, +9.2% travel conversions** — Deloitte/Google "Milliseconds Make Millions" (2020). [GENERAL]
- Conversion drops ~**0.5 percentage points per second** of load time across ~100k analyzed pages (Portent 2019); **sub-1s pages convert ~2.5x better than 5s pages**. [GENERAL]
- Practical rule: **treat sub-2s load as a requirement; each second you shave is worth roughly 0.3–0.5pp of conversion.** [Derived]

### The three Core Web Vitals (Google's framework)

| Metric | What it measures | "Good" threshold |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Perceived loading speed | **≤2.5s** [Google web.dev] |
| **INP** (Interaction to Next Paint) | Responsiveness to taps/clicks/keystrokes across the page's whole life (replaces FID) | **≤200ms** [Google web.dev] |
| **CLS** (Cumulative Layout Shift) | Visual stability | **≤0.1** [GENERAL per Google metric definitions] |

Google frames these for two purposes: **field** measurement of real-user experience and **lab** measurement in the development cycle. Measure in the field (CrUX/RUM), not just Lighthouse; a mobile 3G/4G profile matters 2–3x more than desktop when optimizing for mobile shoppers. [Google web.dev] [GENERAL]

### LCP optimization techniques

The largest element is usually the hero image — make it the optimization priority. [Google web.dev]
- Set `fetchpriority="high"` on the hero image; use `<link rel="preload" as="image">`; move it high in the DOM (avoid render-blocking).
- **Serve modern formats:** AVIF/WebP via CDN with `srcset`/`sizes` responsive breakpoints; never upscale.
- **Don't let the LCP element depend on late JS or late CSS;** avoid client-side-only rendering of the LCP content.
- **Image CDN + caching** + `width`/`height` attributes (or `aspect-ratio` CSS) — this also kills CLS at the same time.
- **Reduce TTFB:** static/prebuild, edge caching, fast origin, resource hints (`dns-prefetch`, `preconnect`).
- **Trim render-blocking CSS/JS:** inline critical CSS, defer third-party scripts, code-split vendor bundles.

### CLS & INP quick wins

- **CLS:** reserve space for images, ads, embeds, and late-loading above-the-fold content; never inject banners/delivery-date bars above the fold late; animate transforms instead of layout properties.
- **INP:** keep the main thread free — shrink/async third-party scripts, avoid long tasks (>50ms), debounce input handlers, keep interactions on click handlers instead of heavy effect code, and don't ship megabytes of JS. **Mobile CPUs are ~5–8x slower than desktop at executing the same JS.** [GENERAL]
- Set INP as the quality bar for **every element the customer touches** — it's a whole-page-lifetime metric. [Google web.dev]

## 3.2 Mobile Conversion Optimization

### Behavior & reading on mobile

- Users read in an **F-shaped pattern** — front-load key information, put the most important words first, assume the rest is scanned. [NN/g]
- On mobile, viewport is small and patience is short: **headline + value prop must fit the first ~2 screenfuls**; paragraph blocks become near-invisible text walls. [GENERAL]

### The thumb zone (the empirical basis for mobile layout)

Steven Hoober's observational research: roughly **~49% of people use one thumb**, ~15–20% cradle or use two thumbs/fingers. The natural primary reach area on a ~5"+ phone is the **bottom-center "nucleated" band**. [GENERAL]
- **Put primary CTAs (Add to cart, Checkout, Buy) in the bottom ~1/3 of the screen** — naturally reached areas.
- Put destructive/rare actions (delete, account) at the top.
- Keep nav/primary actions within one-handed thumb reach.
- Left- vs right-handed users distribute reach differently → **center CTAs when ambiguous.**
- **Touch targets:** Apple HIG and Material guidelines push a **minimum ~44–48px tap target** with ≥8px spacing; undersized targets cause repeated taps, mis-taps, and fat thumbs. [GENERAL]

### Mobile checkout (high-impact bundle)

Mobile abandonment is driven by friction: longer forms, small inputs, no guest option, surprise costs, slow loads. [GENERAL]
- **Auto-init full keyboard** (`inputmode`/`autocomplete`), large touch targets.
- **Sticky "secure checkout" summary.**
- **Wallets (Apple Pay / Google Pay) as default-visible first option.**
- **Guest checkout by default.**
- **Delivery-cost transparency above the fold.**
- **Persistent cart:** a mobile cart bar pinning item count + "Checkout" as you scroll increases return-to-cart and reduces cart loss.
- **Trust signals near the pay button** (secure lock, card logos, return policy) — not buried in the footer.

### Responsive vs adaptive vs app-like UX

- **Responsive** (one page, CSS breakpoints) is the default and generally the right call for scale/maintenance. [GENERAL]
- **Adaptive** (distinct templates per device class) wins for heavily different task patterns (mobile checkout vs desktop dashboard) but costs more to maintain. [GENERAL]
- **"RESS"** (REsponsive + Server Side) hybrid — responsive rendering with device-aware features (images, nav) — is a pragmatic middle ground. [GENERAL]
- **App-like UX on the web:** persistent bottom tab bars, skeleton loading, native gesture feel, offline-tolerant assets (service workers), progressive/critical-first content — reduces perceived latency even when the network is slow. [GENERAL]
- **Skip the "we have an app" trap:** most traffic still converts on mobile web; use app-install prompts sparingly — interrupting a purchase flow with an install prompt costs the order. [GENERAL]
- **Mobile performance budget:** page weight ≤ ~1.5–2MB combined, served conditionally; treat every 100kb and every third-party tag on mobile as a conversion tax. [GENERAL]

### The mobile abandonment data

- **Barilliance's long-run panel: mobile carts fail to convert 85.65% of the time** vs desktop 73.07%; "more digital buyers now shop on smartphones than desktops." [Barilliance]
- Industry norm: ~60–70% of ecommerce traffic is mobile but mobile conversion ≈ 1/3 of desktop's — faster mobile UX is the highest-leverage speed work for most stores. [GENERAL]

## 3.3 Personalization & Marketing Alignment

### Message match — ad-to-page continuity

- Google's Quality Score **explicitly rewards landing-page relevance** to the ad/keyword: better message match → stronger Quality Score → **lower CPCs and higher ad positions**. [GENERAL / Google]
- **Post-click rule:** the page headline should **repeat the ad's exact headline/value claim**; keep the offer, price, or framing identical; remove the promise-to-reality gap. Mismatched ad→page traffic converts dramatically worse than matched (vendor roundups: **20–60% conversion differences** at equal traffic). [GENERAL]

**Concrete matched-page checklist:**
- Same product/service name and offer wording as the ad.
- Same price band, shipping terms, discount-code validity visible in the first screen.
- Same target audience persona the ad selected — don't "rebrand" the offer mid-click.
- CTA uses the ad's verb ("Get your quote" → button says "Get My Quote").
- Keep the source signal (campaign/UTM) on the page so CTAs and offers stay consistent.

### Post-click optimization

- "Post-click" splits performance between the ad (pre-click) and the page (post-click); serious CRO programs treat the post-click page as a first-class surface — **dedicated landing pages per ad group/angle** instead of routing every click to the homepage. [GENERAL]
- Practical levers: single primary CTA per page; form placement tuned to intent stage; regional/currency landing pages; **dynamic keyword insertion** in the headline (echo the searched term); trust/ASA placement after the click; deferring navigation links that offer escape routes. [GENERAL]
- **Measure post-click conversion by ad group, not headline-level aggregate** — unprofitable ad groups usually mean message mismatch, not bad media. [GENERAL]

### Funnel-stage handoff

- **TOP (cold):** educate + social proof + lead magnet; don't hard-sell.
- **MOFU (warm):** proof, comparison, objection-handling content; ask for the "next step."
- **BOFU (hot/retargeting):** price, offer deadline, risk reversal, single clear buy/checkout CTA.
- **Handoff mechanics:** retargeting audiences should land on the *last relevant state* — viewed product → product page with remembered cart; cart-abandoned → cart recovery page/offer — not a generic homepage.
- **Sync the offer** across ad → page → order confirmation → email; any contradiction (price, discount, shipping estimate) breaks trust at the exact moment before the order.

### Where to personalize (highest ROI first)

1. **Traffic source / campaign** — carry UTM/ad-group context into the page; echo the ad's promise.
2. **Geo** — city/country offers, currency, local stock/delivery, language-region phrasing, season-to-category.
3. **Returning vs new visitors** — new: education + trust + first-order incentive; returning: recognition ("Welcome back"), wishlist continuation, reorder/replenishment, cart-reminder state. Returning visitors convert **2–3x** new ones on the same offer; personalize the landing, not just the email. [GENERAL]
4. **Behavioral / recommendation layer** — view history → "recently viewed / similar"; cart contents → "frequently bought together"; browse depth → intensify or de-risk the offer.
5. **Device/context** — mobile (speed, tap-first framing) vs desktop (details, compare).

### The personalization numbers [GENERAL / commonly cited]

- **80%** of consumers are more likely to purchase with a personalized experience (Epsilon).
- **91%** more likely to shop with brands that remember them; **~35%** more likely to spend (Accenture).
- **71%** expect personalization; **76%** get frustrated when it's absent (McKinsey).
- **49%** made an impulse purchase after a personalized recommendation; **~44%** become repeat buyers after one (Segment).
- Top-line lift **~10–15% revenue at 5–8x ROI** (McKinsey); Amazon attributes ~**35%** of revenue to recommendations.
- Vendor survey (Evergage "State of Personalization"): **~39%** reported >25% sales uplift; majority >85–90% reported measurable improvement — directional only.

### Implementation realities [GENERAL]

- Personalization must not violate message-match discipline — a personalized offer that contradicts the ad is still a mismatched page.
- Start **rules-based, low-risk** (source, geo, return-state) before ML; most lift comes from the first two or three layers; the 1:1 long tail gets expensive fast.
- **Test personalization with personalization-off control cells** — naive before/after comparisons massively overstate lift (seasonality, ad mix).
- **Privacy:** prefer first-party signals (account, cart, source) over cross-site tracking; post-third-party-cookie browsers reward site-owned signals.

## 3.4 Checkout & Cart Optimization

### The scale of the problem (Baymard — fetched)

- **Global average cart abandonment: ~70.2%** (50 studies, range 56.8–84.3%); Baymard's own 14-year tracking sits at **70.19%**.
- **Only 2% of the 344 benchmarked top US/EU checkout flows rated "good"**; 65% "mediocre or worse"; none reached "perfect."
- The average site has **~32 distinct checkout improvements** available (344-site benchmark, 30,000+ elements scored; a 60-site subset found ~39 areas).
- Combined usability test sessions indicate **~35% potential conversion-rate lift** — ≈ **$260B recoverable** orders in the US+EU across $738B of ecommerce.
- Benchmark depth: 200,000+ hours of UX research; 18,000+ annotated design examples; 700+ guidelines.

### Guest checkout & account handling

- **18% of abandoners were forced to create an account** (fetched).
- **Guest checkout by default, with "delayed account creation":** offer account creation *after* the order, or as a non-blocking "save my details" checkbox — never as a gating step. [Baymard + GENERAL]
- If you must offer "continue as guest" vs "sign in": merchants typically see materially higher guest conversion; only accounts with obvious pre-fill benefits (reorder, address book) beat a frictionless guest path. [GENERAL]

### Form length & the one-page debate

- Ideal checkout: **12–14 form elements (7–8 actual fields)**; the average US checkout shows **23.48 elements (14.88 fields)** — a **20–60% reduction is achievable** for most stores. [Baymard]
- **Single-page vs multi-step is not the lever — total form elements and step comprehension are.** A tight single page and a tight 3-step flow can perform equally; bloated flows of any layout lose. [GENERAL]
- Practical reductions [Baymard + GENERAL]:
  - Auto-validate address via postal lookup (never a blank "Address line 2").
  - Combine billing = shipping checkbox; collapse payment fields behind card type; format card number/expiry automatically — **72% of sites fail at expiration-date entry**, substantially delaying orders. [Baymard]
  - **CAPTCHAs: 8% failure rate, ~29% when case-sensitive — kill them at checkout entirely.** [Baymard]
  - **98% of sites fail to adapt validation-error messages contextually; 34% don't retain card data after a validation error** — both cause restarts and drop-offs. [Baymard]
  - On errors: highlight **only** error fields (error-fields-only pattern) and persist entered values after reload. [Baymard]

### Payment options — wallets, BNPL, coverage

- **9% of abandonment is "not enough payment methods"** (fetched).
- **Wallets:** Apple Pay / Google Pay remove card entry (the #1 form-filling friction), carry strong trust cues, and speed the flow by ~30+ seconds on mobile when enabled as default. One-click/saved-payment conversion runs **~30–40%+ above manual card entry** for repeat buyers (Stripe, Adyen). [GENERAL]
- **BNPL** (Klarna, Afterpay, Affirm, PayPal Pay in 4): merchants commonly report **~+20–30% AOV and +15–35% conversion** on eligible baskets; watchouts — retailer-funded fees, return/refund complexity, policy stringency. A/B before assuming. [GENERAL]
- **Local/alternative methods** (iDEAL, Sofort, bank transfer) if serving non-US markets — absence is a structural conversion cap. [GENERAL]
- Show accepted payment logos + trust badges adjacent to the pay button; **never request payment method until shipping/address is resolved** (avoids double-entry). [GENERAL]

### Shipping & surcharge transparency

- **40% extra costs too high; 12% couldn't calculate total up-front; 20% delivery too slow** — the single costliest cluster in Baymard's data. [Baymard]
- **A transparent shipping/duty calculator with estimated total shown at cart level and carried unbroken through checkout is the single highest-ROI checkout change for most merchants. Never reveal fees at the final step.** [GENERAL]
- Test shipping-decoy/anchoring (free-shipping threshold, "free over $X"), delivery-date promises, and express options; transparency beats surprise almost every time. [GENERAL]

## 3.5 Behavioral Tools (on-site engagement tech)

### Exit-intent overlays

- **Exit-intent** (mouse-leave/scroll-up on desktop; back-swipe/history-trigger and app-switch on mobile) is the most reliable popup trigger — it captures shoppers at the moment of highest dropout intent without interrupting active browsing. [GENERAL]
- Vendor benchmarks (Sumo, OptinMonster, Picreel): exit-intent overlays convert **~9–12%** of targeted visitors for email capture; timed popups average far lower (~3–4%). [GENERAL]
- **Best-use:** (1) cart-abandonment rescue offer ("complete your order — 10% before you leave"), (2) email capture, (3) segmentation survey. **Worst-use:** pushing the *same offer* that already failed to convert, or firing exit popups on post-checkout/confirmation pages. [GENERAL]
- Design the overlay mobile-first (full-screen sheet with a thumb-reach CTA) or it will bounce more conversions than it saves. [GENERAL]

### Scroll-triggered elements

Scroll depth is a proxy for engagement, not intent. Trigger nice-to-have content (extra proof, FAQ anchor, email capture) after **50–75% scroll**; reserve 100% scroll for "still here" users only. Don't add CTAs that fight the primary page CTA. [GENERAL]

### Sticky CTAs & persistent elements

- A sticky "Add to cart / Checkout" bar on long mobile product pages typically lifts cart-add and removes the scroll-back-up cost. [GENERAL]
- Watch cumulative friction: sticky bars consume mobile viewport, can inflate CLS if sized late, and can obscure nav. A/B including "sticky appears only after 1–2 product images scrolled." [GENERAL]

### Live chat, chatbots & conversational capture

- Mechanism over marketing numbers: **answer objections before the visitor asks.** [GENERAL]
- Directional stats (Zendesk-era surveys, Comm100, eDigital Research, Forrester-derived): ~**50–79% of consumers say live chat availability increases likelihood of buying**; ~**half of shoppers abandon when they can't get fast answers**. Treat as directional; the mechanism is what matters. [GENERAL]
- Placement: start automated (FAQs/order-status), **warm-transfer to human for high-intent moments** (checkout questions, price negotiation); bots that can't resolve in ~2 steps should triage to human, not loop. [GENERAL]
- **Data play:** export chat intents + closest-question-without-conversion into a "top unanswered objections" list that feeds headline/FAQ A/B copy. [GENERAL]

### Heatmaps, session recordings & click analytics

- Heatmaps (scroll, click, move) + session recordings localize friction cheaply: dead zones below the fold, phantom clicks (non-clickable look-like-buttons), rage clicks, and "clicked Save then reload" loops. [GENERAL]
- **Method:** downsample recordings (e.g., 1–2%) and review a few dozen; NN/g's "~5 users catch 80%+ of usability problems" argument applies to qualitative review. Pair recordings with CWV field data to separate *perceived* friction from *real* slowness. [GENERAL + NN/g]
- **Rage clicks + logout storms** (tracked by Hotjar/Mouseflow/FullStory) are leading indicators of form/redesign failures — wire them into regression alerts. [GENERAL]

### On-site surveys

Small, well-targeted surveys (single s-score question at exit; CSAT after purchase; "why didn't you buy?" after 2-min idle on checkout) produce the highest signal-to-noise of any qualitative tool — and they feed copy, offer design, and objection lists. Keep to **1–3 questions**, only on the segment where the answer changes a decision. [GENERAL]

## 3.6 Testing & Experimentation

### Prioritization frameworks

- **ICE:** score every hypothesis **I**mpact × **C**onfidence × **E**ase (1–10 each); sort descending. ACE/PIE swap dimensions (Potential/Importance/Ease; Assumption/Importance/Cost). Adjust the Ease weighting up if your release cadence is slow. [GENERAL]
- **Layer priorities with the Baymard framing:** run design-fix candidates (which have known, benchmarked baseline failures, e.g., "40% abandon for costs") ahead of speculative copy/layout creative. **Data you can fetch cheaply (session recordings, survey, checkout-attribute data) should precede every test.** [GENERAL]

### Hypothesis generation

Format every experiment as: **Because [evidence: data/qual/insight], we expect [change] to [impact metric] for [segment], and we'll know by [guardrail metric + threshold].** [GENERAL]

Hypothesis sources, in order of expected value: field analytics/CWV (friction you can see) → Baymard-style benchmark failures → session recordings/heatmap → survey verbatims → ad-message top objection logs (chat + FAQ + support) → creative brainstorms. [GENERAL]

**One lever per test.** Guardrail metrics (bounce, LCP, CLS) on every test so wins aren't secretly borrowed from another metric. [GENERAL]

### Statistical discipline (CXL — fetched)

- **95% confidence is the standard threshold**; a "95% chance of beating original" means: assuming no true difference, this-sized difference would occur by chance 5% of the time. Don't trust dashboards that only report p-value / "chance to beat control." [CXL]
- **~80% statistical power** is the standard used by testing tools — the probability of detecting a real effect. Low power → you miss real winners (Type II). [CXL]
- **Don't peek at results as they accumulate** — repeated peeking inflates alpha (alpha-error inflation); **pre-commit to sample size and a fixed horizon** before the test starts. [CXL]
- **Confidence intervals / margin of error:** "20% ± 2%" has a 2% margin you must live with; **if two variants' intervals overlap, keep testing.** [CXL]
- **Regression to the mean:** winners often fade toward the mean — a fashion retailer's test flipped during a sale week and only recovered ~4 weeks later. Run full weeks; account for seasonal spikes. [CXL]
- Practical translation: for page-level tests at 2–4% baseline, an MDE of ~5% relative needs **thousands of conversions per variant**. [CXL-derived]

### Testing cadence & tools

- Mature programs run **1–2 shipped experiments per week per major flow** (2–8 concurrent tests), reviewed on a fixed release cadence; growth norms run 50–150+ winning tests/yr at ecommerce scale — but velocity matters only after statistical discipline. [GENERAL]
- **Cadence rules:** one test at a time on high-traffic pages; parallel tests only in isolated sections; every code release = a regression guardrail checkpoint (recorded session + CWV alerts). [GENERAL]
- **Tooling:** server-side/edge testing (Optimizely/VWO/AB Tasty/Kameleoon/Convert or an internal harness) vs client-side (tag-based) affects speed bias and INP — prefer edge/server-side for templates that render most of the page. Note: Google Optimize was sunset in 2023. [GENERAL]
- **Don't let tooling drive strategy:** heatmap + survey + Baymard-style benchmarks tell you *what* to test; the platform just executes. [GENERAL]

## 3.7 AI-Era Tactics

### AI-generated copy variation

- LLMs are the cheapest hypothesis generator that exists: generate **20–50 headline/subhead/CTA variations** per ad group or landing-page template in minutes, then test the shortlist. [GENERAL]
- **Discipline points:** improve a copy *system* (message match, objection handling, tone), not just swap words — weak AI variants lose to decent human copy. Treat AI as draft, human as editor: objection-accuracy and claims verification (no invented specs) are human responsibilities. [GENERAL]
- **Expectation-setting:** vendor anecdote roundups show run-of-the-mill LLM copy tests landing **~0 to +10–15%** relative to control — directionally helpful, not the "5x" marketing teasers. [GENERAL]
- AI-powered ad copy features (Google Ads generative assets, Meta AI creative) automate variation volume at the ad level — combine with post-click message-match so AI doesn't create *more* mismatch. [GENERAL]

### Dynamic personalization & recommendations at scale

- ML recommendation models let you test thousands of personalized variants where manual A/B can't — but personalization still needs control-cell discipline. [GENERAL]
- **Practical adoption path:** rules-based personalization wins first, then ML on the top 2–3 revenue flows (home recs, PDP cross-sell, email). Measure against a **holdout of unpersonalized traffic**. [GENERAL]
- **Generative search/chat interfaces** (site search with LLM summarization, guided question flows) are the frontier; early merchants report strong engagement and basket metrics — but benchmark them against classic facet/search before declaring victory. [GENERAL]

### AI chat assistants (agentic CX)

- Modern AI chat goes beyond FAQ bots: intent triage, product-selection help ("find me a waterproof trail shoe under $150"), order/return handling, and — critically — **seamless handoff to a human for high-intent moments** (checkout objections). [GENERAL]
- Market figures (widely cited; validate before quoting): Juniper-era estimates put chatbot cost savings in the billions annually; Gartner-family forecasts say agentic/digital assistance will absorb a large share of service requests within a few years. **Treat as directional.** [GENERAL]
- **Measured-impact practice:** wire chat outcomes (resolved / transferred / converted within session) into the experiment dashboard; the fastest ROI is closing the "I couldn't find the answer → left" gap that live-chat analytics exposes. [GENERAL]

### Staying evidence-first in the AI era

The AI era amplifies speed of variation, not the truth of results. The rules that protect you: **holdout groups, pre-committed sample sizes, guardrail metrics (LCP/INP/CLS at AI-rendered surfaces — AI widgets are heavy JS and a classic INP/CLS risk), and message-match discipline.** Whatever AI tool you adopt, the measurement contract is identical to classic CRO: **evidence → hypothesis → experiment → decision.** [GENERAL]

---

# Part 4 — 30-Day Playbook (Action Plan)

Run this as a sequence. Weeks 1–2 are audit + high-velocity wins; week 3 is engineering; week 4 is your first rigorous test. Each week lists the *what* and the *why* (the mechanism/data).

## Week 1 — Audit & Analytics Setup (Foundation)

**Goal:** know your baseline numbers and where friction physically lives.

**Day 1–2 — Baseline sanity.**
- Confirm analytics fires on every page (pageview, form submit, add-to-cart, checkout steps, purchase). Tag goals/events for: headline conversion rate, form submission rate, checkout step drop-off, cart abandonment, scroll depth.
- Record your current conversion rate(s) and note where you sit against the benchmark table (Part 2.1). Set a target: top-25% bar (5.31%+ landing pages) or ecommerce 2–3%+.
- Run a **5-second test** on your top 3 pages: can a stranger state the value prop from a skim? [HubSpot]

**Day 3–4 — Speed sanity.**
- Run field Core Web Vitals (CrUX / RUM) — not just Lighthouse. Record LCP / INP / CLS against the ≤2.5s / ≤200ms / ≤0.1 thresholds. [Google]
- Page-weight audit: JS/CSS/images total; count third-party tags (each is a conversion tax on mobile). [GENERAL]

**Day 5 — Behavioral instrumentation.**
- Install heatmaps + session recordings (Hotjar/Mouseflow/FullStory or equivalent); downsample recordings to 1–2% for review. [GENERAL]
- Enable an exit-intent survey (single question: "Why are you leaving?") and a post-purchase CSAT (1–3 questions). [GENERAL]
- Set up a rage-click/frustration alert as a regression canary. [GENERAL]

**Week 1 output:** a one-page baseline snapshot (conversion %, funnel drop-off, CWV status, top 3 friction findings from recordings + survey).

## Week 2 — Quick Wins (Clarity, CTA, Form, Social Proof)

**Goal:** highest-ROI copy/layout changes that don't need engineering.

- **Headline + hero:** rewrite the H1 with a formula from Part 1.3 (clarity over cleverness); add the value-prop line under it; if you're running ads, echo the ad's exact claim (message match). Expected direction: headline tests typically win +10–40% relative. [GENERAL]
- **Single CTA discipline:** remove competing asks — one primary CTA per page, soft at top + prominent at bottom. [HubSpot] [GoodUI #5]
- **Button copy:** move to a specific, first-person CTA ("Get the guide," "Start my free trial"); add a click-trigger line under the button ("Only takes 30 seconds"). [HubSpot] [Copyhackers]
- **Form trim:** remove at least one field; move optional fields post-submit; add inline validation and a privacy microcopy line. Direction: one field removed ≈ +11.9% (HubSpot). [GoodUI] [HubSpot]
- **Social proof injection:** add verified-looking testimonials (real names/titles/dates/photo) near the CTA and in the hero strip; add "as seen in" logos. Direction: +10–40% typical. [Unbounce] [GENERAL]
- **Guarantee/risk reversal:** add a specific guarantee or risk-reversal line above the CTA. Direction: ~+32% in a MECLABS subscription test. [GENERAL]
- **Trust strip:** security certificates, privacy policy link, payment logos near forms/checkout. [Copyhackers]

## Week 3 — Speed + Mobile (Engineering)

**Goal:** remove the "physics" friction — speed and thumbs.

- **LCP:** apply the hero-image playbook (fetchpriority="high", preload, WebP/AVIF, width/height, CDN). Target LCP ≤2.5s. [Google]
- **CLS:** reserve space for all images/ads/embeds; kill late-injected above-the-fold banners. Target ≤0.1.
- **INP:** trim third-party JS, code-split, async non-critical scripts. Target ≤200ms. [Google]
- **Mobile pass:** confirm 44–48px tap targets, thumb-zone CTA placement (bottom ~1/3), sticky checkout summary, wallets visible, guest checkout default, delivery-cost transparency above the fold. [GENERAL]
- **Checkout trim (ecommerce):** cut form elements toward the 12–14 ideal; kill CAPTCHAs; auto-format card fields; persist values on error. [Baymard]

## Week 4 — First Rigorous A/B Test

**Goal:** one statistically defensible win that sets the discipline for everything after.

- **Pick ONE lever** from the Part 2 table (headline is the classic first test — high upside, low effort). [GENERAL]
- **Write the hypothesis** in the required format: *Because [evidence], we expect [change] to [metric] for [segment], and we'll know by [guardrail + threshold].* [GENERAL]
- **Pre-commit the numbers:** use a sample-size calculator (baseline, MDE, 80% power, 95% confidence); decide the stopping point before launch. At a 2% baseline, size for a ≥20–30% relative MDE. [Evan Miller] [CXL]
- **Run one test at a time** on high-traffic pages; full week(s) to cover weekly cycles. **Do not peek.** [CXL]
- **Ship the winner only if it clears the threshold** and guardrails (bounce, LCP, CLS) hold. Log it. Queue the next test from the Week-1 friction findings.

## The 10 Highest-ROI Actions — "Start Here" Cheat Sheet

Ranked by expected direction of impact for most sites. Each direction of impact is the expected movement, not a guarantee.

| # | Action | Expected direction of impact | Why (mechanism) |
|---|---|---|---|
| 1 | Fix message match on every ad-driven page (echo the ad's headline/offer/price) | Conversion up 20–60% vs mismatched | Promise-to-reality gap; also lowers CPC via Quality Score |
| 2 | Cut checkout/lead-form elements toward the 12–14 ideal | Abandonment down; checkout conversion up (avg site has ~39 fixable areas) | Baymard: 70% abandonment, mostly design-fixable |
| 3 | Make guest checkout the default; kill forced accounts | +material conversion on gated flows | 18% of abandoners cite forced accounts |
| 4 | Show total cost (shipping/tax) early and unbroken | Cart→checkout conversion up | 40% abandon for extra costs; 12% for hidden totals |
| 5 | Get sub-2s loads; fix LCP/INP/CLS | Conversion up ~0.5pp/sec shaved; 53% mobile bounce if >3s | Attention/time economics |
| 6 | Rewrite the headline to a clarity formula + specific claim | Conversion up 10–40% typical | Headline read 5x more than body |
| 7 | Remove one form field; add inline validation | Conversion up ~10%+ typical | Each field costs ~0.5–5% of fills |
| 8 | Add verified-looking social proof near the CTA | Conversion up 10–40% typical | Verified reviews = #2 trust factor |
| 9 | Add a specific guarantee / risk-reversal | Orders up ~30% typical | Guarantees are the strongest risk-remover |
| 10 | Set up exit-intent rescue + recovery email | Recover a slice of the 70% abandoned carts | Captures highest-dropout-intent moment |

---

# Part 5 — Audit Checklist

Run this against **any page** — landing pages, product pages, checkouts, homepages. Answer honestly; every "No" is a test candidate. Grouped by section.

## Structure & Clarity

- [ ] The value prop is stated in the H1/subhead within the first ~2 seconds of viewing.
- [ ] A skimmer can understand the value in 5 seconds (5-second test passes). [HubSpot]
- [ ] The page covers: pain point, solution, features, benefits, social proof. [HubSpot]
- [ ] The page is one-column narrative converging on a single CTA (no scattered multi-column attention). [GoodUI #1]
- [ ] The major CTA and key content are above the fold (top of page = high-priority content). [NN/g]
- [ ] No "false floor" — the page visually invites scrolling (partial next section visible). [NN/g]
- [ ] Page length matches consideration level (cheap offer = short; complex = layered). [HubSpot]
- [ ] No more than one primary CTA / one action being asked. [HubSpot] [GoodUI #16]
- [ ] Product shown in action (not abstract stock imagery). [Unbounce]
- [ ] Content is scannable: short sentences, bullets, bolded key phrases, information-bearing headings. [NN/g] [GoodUI #69]

## Copy

- [ ] Headline uses a formula (Part 1.3) with clarity over cleverness. [HubSpot]
- [ ] Copy covers a full persuasive arc (AIDA/PAS/PAPA or similar), not a feature dump. [Copyhackers]
- [ ] Every feature is linked to a benefit (`{Feature} so you can {benefit}`). [HubSpot]
- [ ] Numbers are specific and concrete ("in 48 hours," "17 templates") — not vague superlatives. [GENERAL]
- [ ] Copy is error-free; formatting is clean; links work. [HubSpot]
- [ ] No filler: every sentence earns its place. [GoodUI #69]
- [ ] The page meets the visitor where they are (their struggle, not just product attributes). [HubSpot]
- [ ] Ad-driven pages match the ad's headline, offer, price, and CTA verb. [Unbounce]
- [ ] Objections are addressed in-page (FAQ, comparison, risk reversal). [GENERAL]

## CTA

- [ ] Button copy is specific and action-oriented ("Get the guide," "Start my free trial"). [HubSpot]
- [ ] Button speaks in the visitor's voice ("I want…") or first-person where tested. [Copyhackers]
- [ ] CTA is the highest-contrast, isolated element on the page. [GoodUI #11/#56]
- [ ] CTA looks like a button (shape, color, depth). [Unbounce]
- [ ] Interactive styles are distinct and consistent (clickable vs selected vs plain). [GoodUI #6]
- [ ] CTA repeated on long pages: soft at top, prominent at bottom. [GoodUI #5]
- [ ] No competing links/asks above the primary CTA. [GoodUI #16]
- [ ] Click-trigger microcopy present under the button ("Only takes 30 seconds," "Cancel anytime"). [HubSpot]
- [ ] Mobile: CTA within thumb reach (bottom ~1/3); tap target ≥44–48px. [GENERAL]
- [ ] No premature hero CTA on high-consideration offers (persuasion arc intact). [Copyhackers]

## Trust & Social Proof

- [ ] Verified-buyer reviews/testimonials visible (real names, titles, dates, photo/video). [Copyhackers] [Unbounce]
- [ ] Security certificates + privacy policy visible near forms/payment. [Copyhackers]
- [ ] "As seen in" / authority logos present where relevant. [HubSpot + GENERAL]
- [ ] A specific guarantee or risk-reversal sits before the CTA. [Copyhackers]
- [ ] Pricing is transparent (or clearly revealed at the right point, anchored). [Copyhackers]
- [ ] Scarcity/urgency is authentic and not overused. [Copyhackers]
- [ ] Social proof is relevant to the audience and verifiable — nothing fake. [Cialdini/GENERAL]

## Forms

- [ ] Form has only necessary fields (essentials: name + email; move the rest post-submit). [GoodUI #13] [HubSpot]
- [ ] Multi-step forms show progress ("step 1 of X") and don't over-split. [GoodUI #58/#59] [GENERAL]
- [ ] Field labels/explanations with context — no placeholder-as-label. [GoodUI #68]
- [ ] Inline validation catches errors in context; input not wiped on error. [GoodUI #22/#72]
- [ ] Microcopy near submit: privacy line, time estimate, "no spam," "cancel anytime." [HubSpot + Unbounce]
- [ ] Thank-you page/popup confirms submission and offers a next action. [Unbounce]
- [ ] Form or CTA above the fold (especially mobile). [HubSpot]
- [ ] Math made easy: autocomplete, format-aware fields, no manual calculations. [GENERAL + GoodUI #53]

## Speed & Core Web Vitals

- [ ] LCP ≤ 2.5s (field-measured). [Google]
- [ ] INP ≤ 200ms. [Google]
- [ ] CLS ≤ 0.1. [GENERAL/Google]
- [ ] Hero image uses fetchpriority="high" + preload + WebP/AVIF + width/height. [Google]
- [ ] Render-blocking CSS/JS trimmed; third-party scripts deferred/async. [Google]
- [ ] TTFB reduced (edge caching, fast origin, preconnect/dns-prefetch). [Google]
- [ ] No megabytes of JS; mobile page weight ≤ ~1.5–2MB. [GENERAL]
- [ ] No layout shift from late-loaded banners/embeds/ads. [GENERAL]

## Mobile

- [ ] Headline + value prop fit the first ~2 mobile screenfuls. [GENERAL]
- [ ] Primary CTAs in the bottom-center thumb zone. [GENERAL]
- [ ] Touch targets ≥44–48px with spacing. [GENERAL]
- [ ] Wallets (Apple/Google Pay) visible and default-first. [GENERAL]
- [ ] Guest checkout by default (ecommerce). [Baymard + GENERAL]
- [ ] Delivery cost transparency above the fold. [Baymard]
- [ ] Sticky checkout summary / persistent cart bar present. [GENERAL]
- [ ] Trust signals (lock, card logos, return policy) near the pay button. [GENERAL]
- [ ] No app-install prompt interrupting a purchase flow. [GENERAL]
- [ ] Mobile Core Web Vitals pass on a 3G/4G profile. [GENERAL]

## Checkout (ecommerce)

- [ ] Total form elements toward the 12–14 ideal (cut 20–60% where possible). [Baymard]
- [ ] Guest checkout = default; account creation delayed/post-order. [Baymard]
- [ ] Address auto-validation (postal lookup); no blank "Address line 2." [Baymard]
- [ ] Billing = shipping checkbox; payment fields collapsed. [Baymard]
- [ ] Card fields auto-format (number/expiry). [Baymard]
- [ ] No CAPTCHAs at checkout. [Baymard]
- [ ] Validation errors highlight only error fields and retain entered values. [Baymard]
- [ ] Total cost (shipping/tax/fees) shown at cart and carried unbroken to checkout. [Baymard]
- [ ] Enough payment methods (wallets, BNPL, local methods as needed). [Baymard + GENERAL]
- [ ] Payment logos + trust badges adjacent to the pay button. [GENERAL]
- [ ] Progress indication on multi-step flows (or tight single page). [Baymard/GENERAL]

## Analytics & Testing

- [ ] Conversion events tracked end-to-end (pageview → form/ATC → checkout → purchase). [GENERAL]
- [ ] Funnel drop-off visible by step (cart→checkout, checkout→purchase). [GENERAL]
- [ ] Scroll depth, form drop-off, and time-on-page tracked. [Unbounce]
- [ ] Heatmaps + session recordings active; reviewed recently. [GENERAL]
- [ ] Rage-click/frustration alerts configured. [GENERAL]
- [ ] Exit + post-purchase surveys live. [GENERAL]
- [ ] Hypothesis written in the required format before any test. [GENERAL]
- [ ] Sample size + stopping point pre-committed before test launch. [CXL]
- [ ] Tests run at 95% confidence / 80% power; no peeking. [CXL]
- [ ] Guardrail metrics (bounce, LCP, CLS) on every test. [GENERAL]
- [ ] Test results logged; regression to the mean respected before declaring winners. [CXL]

---

# Sources & Further Reading

## Fetched / Verified (200 OK in the research session)

1. NN/g — *Scrolling and Attention* (2018 eyetracking): https://www.nngroup.com/articles/scrolling-and-attention/
2. NN/g — *F-Shaped Pattern of Reading on the Web: Misunderstood, But Still Relevant (Even on Mobile)* (2017): https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
3. HubSpot — *How to create a landing page with high ROI [expert and data-backed tips]*: https://blog.hubspot.com/marketing/landing-page-best-practices
4. Unbounce — *Landing Page Best Practices To Create High-Converting Pages* (11 essentials + lead-gen section): https://unbounce.com/conversion-rate-optimization/landing-page-best-practices/
5. Unbounce — *Landing page benchmarks* (Q4 2024): https://unbounce.com/landing-page-benchmarks/
6. Copyhackers — *Every Copywriting Formula Ever (The Ultimate Guide to No-Pain Copywriting)*: https://copyhackers.com/2015/10/copywriting-formula/
7. Copyhackers — *Social Proof: 5 new studies that prove its continued persuasive power*: https://copyhackers.com/2023/04/social-proof/
8. Copyhackers — *Copywriting for Startups: 7 Lessons To Drive Conversions*: https://copyhackers.com/2023/09/copywriting-for-startups/
9. GoodUI — pattern library & leaked A/B tests (Jakub Linowski): https://goodui.org/
10. WordStream — *What Is a Good Conversion Rate?*: https://www.wordstream.com/blog/ws/2014/03/17/what-is-a-good-conversion-rate
11. Baymard Institute — *50 Cart Abandonment Rate Statistics* (2026; 70.22% average; abandonment reasons; ideal form length): https://baymard.com/lists/cart-abandonment-rate
12. Baymard Institute — *Cart & Checkout Usability* (checkout UX benchmark, 344 sites, ~35% potential lift): https://baymard.com/checkout-usability
13. Baymard Institute — *Reasons for Cart Abandonment*: https://baymard.com/blog/ecommerce-checkout-usability-report-and-benchmark
14. Baymard Institute — *70 Cart & Checkout UX Articles collection* (credit-card expiry 72%, CAPTCHA 8%/29%, validation-error 98%/34% figures): https://baymard.com/blog/collections/cart-and-checkout
15. CXL — *A/B Testing Statistics: An Easy-to-Understand Guide* (power, alpha-error inflation, fixed horizon, confidence intervals, regression to the mean): https://cxl.com/blog/ab-testing-statistics/
16. Evan Miller — *A/B Sample Size Calculator*: https://www.evanmiller.org/ab-testing/sample-size.html
17. Google web.dev — *Web Vitals*: https://web.dev/articles/vitals
18. Google web.dev — *Largest Contentful Paint (LCP)*: https://web.dev/articles/lcp
19. Google web.dev — *Optimize Largest Contentful Paint*: https://web.dev/articles/optimize-lcp
20. Google web.dev — *Interaction to Next Paint (INP, FID replacement)*: https://web.dev/articles/inp
21. Google web.dev — *Why does speed matter?*: https://web.dev/articles/why-speed-matters
22. NN/g — *Popups: 10 Problematic Trends and Alternatives*: https://www.nngroup.com/articles/popups/
23. Barilliance — *Complete List of Cart Abandonment Rate Statistics 2006–2023* (mobile 85.65%, desktop 73.07%): https://www.barilliance.com/abandoned-cart-email-statistics/
24. Google / Think with Google — mobile speed & marketing insight destination (original mobile-speed research referenced from this property): https://www.thinkwithgoogle.com/

## Attempted but Blocked/Unavailable (figures marked [GENERAL / commonly cited] above)

- CXL blog (conversionxl.com → cxl.com): landing-page copywriting + CRO articles — 404 in this session.
- Optimizely: CRO glossary/insights — unreachable (308 redirect / blocked).
- NN/g *Above the Fold* and *Hero Image* articles — 404 (used *Scrolling and Attention* instead).
- Unbounce CTA-specific article — server timeout; Coverflow/Baymard checkout-usability path — 404.
- Copyhackers older landing-page-copyweaving post — 404 (used newer posts).
- Invesp (form-fields and cart-abandonment articles) — multiple paths 404.
- OptinMonster popup-statistics pages — multiple paths 404.
- Portent page-load-time study — paths 404.
- HubSpot form-fields experiment — paths 404.
- Think with Google mobile-speed research — content not served.
- Sumo popup-conversion study — redirected off-topic.
- VWO social-proof / testing-mistakes articles — paths 404.
- Baymard mobile-abandonment article — paths 404.

## Named Works Referenced (not fetched)

- Cialdini, *Influence* (7 principles of persuasion).
- Kahneman & Tversky — prospect theory (loss aversion, anchoring).
- Huber–Payne–Puto — decoy/attraction effect.
- Fitts's law (target acquisition); Hick's law (choice reduction).
- Michael Aagaard — first-person CTA A/B test (widely reported).
- Steven Hoober — mobile thumb-zone observational research.
- Apple HIG / Material Design — touch-target guidelines.

---

*End of playbook. Next step: run the Part 5 audit on your highest-traffic page today, and pick the first lever from the Part 4 cheat sheet.*
