# Quantitative Conversion Research — Benchmarks, Statistics & Quantified Case Results

Dense reference of conversion benchmarks and quantified uplift data for ecommerce, SaaS, B2B lead-gen, landing pages, content sites, and email capture. Fetched figures are cited with source + URL; figures that could not be verified from a live fetch today are labeled **[GENERAL / commonly cited]** (widely repeated by reputable CRO vendors) and should be validated before you stake a build on them.

---

## 1. Average conversion rates by industry / type

**Overall landing page averages**
- Average landing page conversion rate across all industries: **2.35%**; top 25% of pages convert at **5.31%+**; top 10% at **11.45%+**. Analysis of thousands of Google Ads accounts with a combined **$3B annual spend** shows top performers converting at 2–3x the average, and top-10% pages running **3–5x** their industry average. — WordStream, https://www.wordstream.com/blog/ws/2014/03/17/what-is-a-good-conversion-rate
- Unbounce's own-platform benchmark (Q4 2024): average landing page conversion rate **~6.6%** across all industries — a higher figure because it's based on Unbounce-built (optimized) pages, not the broader web. Treat WordStream 2.35% and Unbounce 6.6% as the two ends of the "average" band; the honest median for general web is ~2–4%. — Unbounce, https://unbounce.com/landing-page-benchmarks/
- **[GENERAL / commonly cited]** Benchmark firms (e.g., WordStream, Invesp) typically report: legal **~5%**, financial services **~5%**, B2B services **~3%**, ecommerce **~2–3%**, travel **~3%**. The WordStream industry table is image-based and could not be scraped, but the source is real.

**Ecommerce**
- **[GENERAL / commonly cited]** Ecommerce checkout conversion (sessions → completed order) averages **~2–3%** on desktop and **~1–2%** on mobile. Many large merchants operate below 2%.
- **[GENERAL / commonly cited]** Mobile accounts for **~60–70% of ecommerce traffic** but only ~1/3 of desktop's conversion rate — mobile traffic share and conversion are structurally mismatched.

**SaaS / B2B lead-gen**
- **[GENERAL / commonly cited]** SaaS free-trial signup rates (visitor → signup) typically **1–5%**; B2B lead-capture form conversion typically **1.5–4%**; content-download/lead-magnet landing pages often **10–25%**.
- **[GENERAL / commonly cited]** B2B buying cycles mean page-view→demo-booked rates of well under **1%** are normal; the correct north-star is qualified-demo rate, not raw form fills.

**Content sites**
- **[GENERAL / commonly cited]** Content sites monetize via email capture rather than purchases; opt-in rates of **1–3% of total visitors** are typical, with dedicated landing pages performing far higher (see Section 4).

---

## 2. Quantified uplift of specific tactics

### Page load speed → conversion
- **[GENERAL / commonly cited]** Google's "mobile speed" research: **53% of mobile site visits are abandoned if a page takes >3 seconds** to load.
- **[GENERAL / commonly cited]** Portent 2019 study of ~100k pages: conversion rate declines roughly **0.5 percentage points per second** of load time (pages at ~1s convert ~2.5x better than pages at ~5s).
- **[GENERAL / commonly cited]** Akamai (2017): a **100 ms** delay in load time decreases conversions **~7%**.
- **[GENERAL / commonly cited]** Deloitte (2020): a **0.1s** load-time improvement lifts retail conversions **+8.4%** and +9.2% for travel.
- Actionable: treat sub-2s load as a requirement; each second you shave is worth roughly 0.3–0.5pp of conversion.

### Form fields → conversion drop
- Baymard checkout research: average US checkout flow shows **23.48 form elements by default** (14.88 counting only form fields), yet an ideal flow is **12–14 form elements (7–8 fields)** — and most checkouts can cut **20–60%** of shown form elements without losing data. — Baymard Institute, https://baymard.com/lists/cart-abandonment-rate
- Baymard: **17% of US online shoppers have abandoned an order because the checkout was "too long / complicated."** — Baymard, https://baymard.com/lists/cart-abandonment-rate
- **[GENERAL / commonly cited]** HubSpot A/B test: removing a single field (4→3 fields) increased form conversions **~11.9%**. Rule of thumb: each unnecessary field costs ~0.5–5% of fills; every extra field beyond ~4–5 degrades completion.

### Video on landing pages
- **[GENERAL / commonly cited]** EyeView (video CRO vendor): adding/replacing a landing page with video increased conversions **~80%** (widely cited vendor figure, not peer-reviewed).
- **[GENERAL / commonly cited]** Wyzowl: **~81%** of people say they've been convinced to buy a product/service by watching a brand's video; ~96% have watched an explainer video to learn about a product. The "video always wins" claim is overstated — video performs best above the fold for complex products.

### Social proof / testimonials
- **[GENERAL / commonly cited]** Academic Bayesian Belief Network model study: **social proof (testimonials, ratings) produced a ~34% average conversion uplift** — the most-cited quantified figure for testimonials.
- **[GENERAL / commonly cited]** Vendor case studies (VWO/CXL roundups) routinely report testimonial and review uplift in the **+10% to +40%** band; star ratings with count outperform vague praise.

### Guarantee
- **[GENERAL / commonly cited]** MECLABS/MarketingExperiments: a strong, specific guarantee lifted orders ~**32%** in a subscription test; risk-reversal language converts better than no guarantee for higher-priced/uncertain-purchase products.

### Headlines
- **[GENERAL / commonly cited]** Copyblogger: **the headline is read ~5x more than the body copy** (i.e., ~80% of readers never get past the headline).
- **[GENERAL / commonly cited]** Real A/B headline tests (VWO/CXL/GrowthHackers case roundups) typically win by **+10% to +40%** relative, with extreme cases over **+100%** when the control headline is weak. Headline is usually the single highest-ROI thing to test.

### Exit-intent popups
- **[GENERAL / commonly cited]** Exit-intent popups consistently outperform timed/scroll popups; vendor benchmarks (Sumo, OptinMonster, Picreel) put average exit-popup conversion around **9–12%**, versus ~3.8% for all popup types (see Section 4).

### Cart abandonment (Baymard — fetched)
- Average documented cart abandonment rate across 50 studies: **70.22%**. Range of individual studies: ~56.8% (Fresh Relevance 2018) to **84.27%** (SaleCycle 2020). — Baymard, https://baymard.com/lists/cart-abandonment-rate
- Reason breakdown (excluding "just browsing"): **40% extra costs too high**; **20% delivery too slow**; **19% didn't trust site with card info**; **18% forced account creation**; **17% too long/complicated checkout**; **17% site errors/crashed**; **13% returns policy**; **12% couldn't see total up-front**; **10% card declined**; **9% not enough payment methods**. — Baymard, https://baymard.com/lists/cart-abandonment-rate
- **~$260B in US+EU orders** (combined ~$738B ecommerce) is recoverable via better checkout design; the average large ecommerce site can gain **+35.26% conversion** purely from checkout UX — benchmarked against Walmart, Amazon, Wayfair, ASOS, etc. Average site has **39 potential checkout improvements**. — Baymard, https://baymard.com/lists/cart-abandonment-rate
- **[GENERAL / commonly cited]** Baymard's separate mobile research reports mobile abandonment ~**85.65%** vs desktop ~**73.07%**.

### One-page vs multi-step checkout
- **[GENERAL / commonly cited]** Well-run CRO tests split both ways; the consistent winners are (a) multi-step with a visible progress indicator for long checkouts, and (b) one-page for short ones. Reported one-page wins are often **+20–30%** but only when the original multi-step had no progress feedback. Baymard's fetched data (above) implies the mechanism that matters is total form elements (12–14 ideal), not literally page count.

---

## 3. Where drop-off happens in typical funnels

- **[GENERAL / commonly cited]** Ecommerce funnel benchmarks: of sessions, ~**5–10%** view a product, ~**3–7%** add to cart, and ~**25–30% of carts** convert (complementary to the 70% abandonment figure). Net session→purchase lands at ~**1–2%**.
- **[GENERAL / commonly cited]** The single biggest drop is cart → checkout entry and checkout → purchase: with 70% abandonment, roughly **2 in 7 carts** make it through; half of those who enter checkout abandon within it (per Baymard-style data above, driven by costs, account walls, long forms, and distrust).
- **[GENERAL / commonly cited]** For SaaS/B2B: ~**50–70% of visitors bounce** from landing pages; of the rest, only 1–5% click the primary CTA; of those, a fraction complete the form → free-trial/demo conversion of ~1–3% is a good target.
- **[GENERAL / commonly cited]** NN/g guidance (qualitative, fetched): popups that interrupt before the user gains value trigger instant close/search-escape behavior — premature interruption shifts drop-off earlier in the funnel. — NN/g, https://www.nngroup.com/articles/popups/

---

## 4. Email capture / lead magnet / popup conversion

- **[GENERAL / commonly cited]** OptinMonster internal data (largest popup platform): **average popup conversion rate ~3.81%** of viewers; top-performing popup campaigns hit **30–40%**.
- **[GENERAL / commonly cited]** Popup type ranking by conversion: **exit-intent ~9–12%** > scroll-triggered ~6–8% > timed ~3–5% > on-click/inline. Incentive (lead magnet) popups convert ~2–3x non-incentive popups.
- **[GENERAL / commonly cited]** Dedicated lead-magnet landing pages (email in exchange for a PDF/course/checklist) typically opt in **10–25% of visitors** when the magnet is highly relevant and the page is single-CTA; 25%+ is exceptional.
- **[GENERAL / commonly cited]** Homepage/sidebar email capture converts ~**0.5–1.5%** of visitors; inline content opt-ins ~**1–3%**; full-screen exit popups 3–5x those numbers.

---

## 5. A/B testing statistical guidance

- **Significance:** 95% confidence is the standard threshold; a "95% chance of beating original" means: assuming no true difference, this-sized difference would occur by chance 5% of the time. Insignificant results carry Type I (false-positive) risk. — CXL, https://cxl.com/blog/ab-testing-statistics/
- **Power:** **80% statistical power is the standard** used by testing tools — the probability of detecting a real effect. Low power → you miss real winners (Type II). — CXL, https://cxl.com/blog/ab-testing-statistics/
- **Don't peek / fixed horizon:** peek at results repeatedly → **"alpha error inflation"** (false positives). Predetermine sample size and stopping point before launch; most tools oscillate significant↔insignificant over time. — CXL, https://cxl.com/blog/ab-testing-statistics/
- **Confidence intervals:** a result like "20% ± 2%" means margin of error ±2pp. If two variations' CIs overlap, keep testing — results are not distinguishable. — CXL, https://cxl.com/blog/ab-testing-statistics/
- **Worked sample-size example (Evan Miller's calculator, defaults):** baseline conversion **10.2%**, minimum detectable effect **+3pp (10.2% → 13.2%, i.e., ~+29% relative)** at 80% power / 95% significance requires **2,545 visitors per variation** (~5,090 total). — Evan Miller, https://www.evanmiller.org/ab-testing/sample-size.html
- **Implied guidance (derive, don't memorize):** at a 2% baseline, detecting a +20% relative lift (2.0→2.4%) at 80% power needs roughly **~30,000 visitors per variation**; most sites should optimize for MDE ≥ 20–30% relative, use Bayesian or sequential methods at low traffic, and never launch a "winner" found in under a few thousand conversions.

---

## Sources consulted (fetched URLs)

- WordStream — "What Is a Good Conversion Rate?": https://www.wordstream.com/blog/ws/2014/03/17/what-is-a-good-conversion-rate
- Unbounce — Landing page benchmarks (Q4 2024): https://unbounce.com/landing-page-benchmarks/
- Baymard Institute — 50 Cart Abandonment Rate Statistics: https://baymard.com/lists/cart-abandonment-rate
- CXL — A/B Testing Statistics: An Easy-to-Understand Guide: https://cxl.com/blog/ab-testing-statistics/
- Evan Miller — A/B Sample Size Calculator: https://www.evanmiller.org/ab-testing/sample-size.html
- NN/g — Popups: 10 Problematic Trends and Alternatives: https://www.nngroup.com/articles/popups/

**URLs attempted but blocked/unavailable (404 or bot-gated)** — figures attributed to them above are marked **[GENERAL / commonly cited]**:
- Invesp (form-fields and cart-abandonment articles) — https://www.invespcro.com/ (multiple paths 404)
- OptinMonster popup-statistics pages — https://optinmonster.com/ (multiple paths 404)
- Portent page-load-time study — https://www.portent.com/ (paths 404)
- HubSpot form-fields experiment — https://blog.hubspot.com/marketing/ (paths 404)
- Think with Google mobile-speed research — https://www.thinkwithgoogle.com/ (content not served)
- Sumo popup-conversion study — https://sumo.com/stories/popup-conversion-rate (redirected off-topic)
- VWO social-proof / testing-mistakes articles — https://vwo.com/blog/ (paths 404)
- Baymard mobile-abandonment article — https://baymard.com/blog/ (paths 404)
