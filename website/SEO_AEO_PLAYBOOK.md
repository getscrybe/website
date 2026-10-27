# SEO + AEO PLAYBOOK — 2026

## Purpose

This document is the operating manual for an AI model that optimizes websites end-to-end and gets them ranked in Google Search **and** in AI answer engines (Google AI Overviews/AI Mode, ChatGPT Search, Perplexity, Microsoft Copilot, Gemini, and Siri). It compiles two verified research drafts into one actionable system: the traditional SEO layer (crawlability, on-page, off-page, authority) and the AEO layer (citations, grounding, answer-shaped content, schema/entities, factual authority). Every instruction is written as a concrete step an AI executor can run without human judgment calls.

## How to use this document

Read in this order — the sections compound:

1. **Part 0** first: 90 seconds to internalize the two governing insights and the seven highest-leverage actions.
2. **Parts 1-4**: the traditional SEO foundation (how search works, technical, on-page, off-page). Do not skip; AEO inherits every one of these requirements.
3. **Part 5**: the AEO layer — the cited-sentence mechanic is the single highest-leverage tactic in the entire playbook. Read it twice.
4. **Parts 6-7**: schema/entities and factual authority — this is where "citable" is manufactured conditionally: markup plus the evidence layer of a trustworthy corpus.
5. **Part 8**: monitoring. An AI executor lives here weekly; measuring is part of doing.
6. **Part 9**: the unified roadmap — the execution order. Run stages 0-6 sequentially.
7. **Part 10**: ready-to-run SOPs. Run these as procedures whenever the corresponding task is assigned.
8. **Parts 11-12 + Sources**: reference material. Consult on demand; do not read linearly.

---

## 0. THE 60-SECOND TL;DR

### The two governing insights

- **Google ranks for understanding, not keyword matching.** Crawl-index-serve is unchanged infrastructure, but ranking today is decided by people-first content, semantic/entity depth, E-E-A-T (trust above all, YMYL-weighted), and authority from relevant links. Page experience (Core Web Vitals) is a tiebreaker, not the winner. No secret formula exists: "There are no secrets here that'll automatically rank your site first in Google."
- **AI answer engines select one citable sentence.** Answer engines ground answers in retrieved passages via a "query fan-out" plus training memory. The unit of visibility is no longer a ranked URL — it is being the specific, self-contained, named-and-dated sentence an LLM lifts verbatim and cites. Traditional SEO makes you eligible; answer-shape makes you selected.

### The 7 highest-leverage actions (priority order)

1. **Fix crawlability and indexability first.** Verify in Google Search Console, submit the sitemap, confirm every money page is "Indexed"/"Valid" via URL Inspection, kill 404s/soft-404s, enforce one canonical per page. Nothing else works if Google cannot read the page.
2. **Make every money page's first ~50-100 words a direct, self-contained, dated answer.** Answer first, elaborate second. This single change manufactures the cited sentence both Google snippets and every LLM extractor want.
3. **Deploy JSON-LD sitewide: Organization + Person (per author) + Article + BreadcrumbList; then FAQPage, HowTo, Product, Review per page type.** Keep markup strictly matching the visible text. This gates rich results and raises extraction confidence.
4. **Write question-shaped, comparison, and how-to content** — real Q&A blocks, tables with a one-sentence verdict, numbered steps — for the question queries people actually type into ChatGPT and Perplexity.
5. **Make every empirical claim attibutable in the sentence itself**: "Semrush's 2025 study of 10M keywords found 13.14%..." — source name, date, methodology inline. Publish 3-5 original research/data assets (the most-cited content class).
6. **Earn relevant authority, not raw links**: one strong linkable asset + digital PR + outreach to pages that mention your topic without linking. Brand anchors, natural velocity, content placement.
7. **Instrument a weekly monitoring loop**: GSC Performance (Web type, includes AI Overviews/AI Mode) + a repeated LLM prompt set on your top 20 money queries, diffing citations week over week. Iterate the exact sentences that get lifted; fix the ones that get ignored.

---

## 1. How Modern Search Works

### 1.1 The three-stage pipeline: Crawling, Indexing, Serving

Google Search is fully automated and operates in three documented stages:

1. **Crawling** — crawlers (primarily Googlebot) discover URLs across the web and fetch page content.
2. **Indexing** — Google analyzes and stores page content in an index of "hundreds of billions" of pages; rendering (executing JS/CSS like a browser) is part of indexing, not a separate step.
3. **Serving (Ranking)** — on a query, an algorithm scans the index in real time and serves the results it believes best answer the query.

Operational facts to know:

- The vast majority of sites are added to the index **automatically**; you usually need to do nothing beyond publishing.
- Googlebot decides what to crawl, how often, and how many pages, and throttles itself (HTTP 500s tell it to slow down).
- Googlebot crawls only the **first 15MB** of a file by default; supports HTTP/1.1 and HTTP/2 (HTTP/2 saves resources, no ranking boost), gzip/deflate/Brotli, and HTTP caching via `ETag`/`If-None-Match` and `Last-Modified`/`If-Modified-Since`.
- If CSS or JS is hidden from Googlebot, pages may not render or rank correctly.
- **Changes take a few hours to months. Wait a few weeks before judging whether a change worked.**
- Check indexation with `site:yoursite.com`. Diagnose with Search Console's **URL Inspection** tool, which shows the rendered HTML Googlebot actually received and can request re-crawling (days to months).

### 1.2 From links and keywords to entities, machine learning, and satisfaction

Twenty years ago Google ranked mostly on keywords, links (PageRank), and on-page markup. That era is over:

- **PageRank is one of many signals.** Google says there is much more to Search than links; PageRank survives but is one input among hundreds.
- **Neural language understanding** (BERT, MUM, the RankBrain family) processes the *meaning* of queries and documents — not just words — enabling cross-language, cross-format, and ambiguous-query matching.
- **Entity/Knowledge Graph understanding** is central internally: rankings reflect topical authority and entity associations, not keyword frequency.
- **User satisfaction signals** matter — whether users find the result useful, engaging, and satisfying influences systems.
- **Assembled SERPs**: AI Overviews, AI Mode, People Also Ask, images, video, and shopping units are served inside results. Sites appearing in AI features are **reported inside Search Console Performance under the "Web" search type**; no special AI files or markup are required — existing SEO fundamentals apply.

### 1.3 Ranking systems, updates, and AI-assisted ranking

Google maintains documented ranking systems plus systems that remove low-quality/spam content:

- **Core ranking systems** — continuously updated; periodic "core updates" refine relevance and quality broadly. The former "helpful content update" merged into core systems (March 2024).
- **Spam systems** — automatically remove/demote violations: scraped content, cloaking, keyword stuffing, link spam, scale-missed-site abuse, expired-domain abuse, and content generated primarily to manipulate rankings (including AI-generated content produced to manipulate search).
- **Reviews system** — applied sitewide-ish; evaluates first-hand, evidence-based review content.
- **Link analysis systems** — estimate authority from links and link-quality models (e.g., the Reasonable Surfer model).
- **AI-assisted query understanding** — RankBrain-style mapping of rare queries to related concepts; BERT/MUM deepen language understanding.

There is no secret formula ("no secrets here..."), and no amount of tricks compensates for content and authority.

### 1.4 SERP features and intent matching

Modern SERPs are assembled feature stacks, not ten blue links. Match content format to the dominant feature per query:

- **Text results (blue links)** — the organic core.
- **AI Overviews and AI Mode** — AI summaries at the top; appear in GSC "Web" Performance; no special markup; same fundamentals (crawlability, internal links, text content, schema matching visible text) apply.
- **People Also Ask (PAA)** — related-question boxes; question-phrased content and FAQ sections surface here.
- **Shopping / product rich results** — Product structured data + Merchant Center feeds.
- **Review stars, breadcrumbs, sitelinks, video/image carousels, local packs** — gated on specific structured data or Business Profile accuracy.
- **Entities in the Knowledge Panel** — consistent naming + marked-up Organization/Person data + Wikipedia-style citations feed these.

Implication: inspect which feature mix dominates a keyword's SERP *before* writing the page, then build the format that matches.

### 1.5 E-E-A-T: the quality framework (not a "ranking factor")

- E-E-A-T = **Experience, Expertise, Authoritativeness, Trustworthiness**.
- **Trust is the most important**; others contribute to trust; content need not demonstrate all four.
- E-E-A-T **is not itself a ranking factor** (Google says so directly) — ranking systems use mixed factors that identify content with good E-E-A-T.
- Content touching health, finance, safety, or societal well-being gets extra scrutiny — **YMYL** ("Your Money or Your Life").
- Quality raters do **not** directly control rankings; their feedback validates whether automated systems work.
- Evaluate content via **Who / How / Why**:
  - **Who** created it — self-evident bylines linking to author background.
  - **How** it was created — disclose AI-generation/automation where relevant; product reviews show what was tested, how, and evidence (photos).
  - **Why** it exists — primarily to help people, not to attract search visits; automation used chiefly to manipulate rankings violates spam policies.

### 1.6 Helpful content: the people-first vs search-engine-first divide

Google's self-assessment framework — people-first signals:

- An existing/intended audience would find the content useful directly.
- Content demonstrates first-hand expertise and depth (actual product use, visited a place).
- The site has a primary purpose or focus.
- A reader leaves having learned enough to achieve their goal.
- A reader leaves with a satisfying experience.

Search-engine-first warning signs ("yes" to these = rewrite):

- Content created mainly to attract search visits rather than help an audience.
- Content that exists because "everyone writes about this topic."
- Automation at scale to produce content on many topics.
- Changing dates to fake freshness without substance.
- Summing up what others say without adding value.

Auditing after a traffic drop: identify which pages lost the most, for which searches, and re-score them against these questions.

### 1.7 Crawler technical details (for debugging)

- Googlebot runs across thousands of machines and datacenters; logs show many IPs; default egress is mostly US.
- Verify crawlers three ways: HTTP `user-agent` header, source IP, and reverse-DNS hostname.
- Crawlers respond to `Cache-Control: max-age`, `ETag` (preferred), and `Last-Modified`.
- You can **reduce the crawl rate** in Search Console if Googlebot overwhelms your server.
- Don't block necessary assets in robots.txt; don't serve different content to Googlebot (cloaking = spam).
- Monitor server logs for Googlebot IP ranges and for unexpected crawl spikes or bandwidth abuse.

### 1.8 Why structural SEO still matters

- **URLs, sitemaps, and canonicals are the plumbing of indexing** — they decide which URL Google stores and shows.
- **Internal links are how authority flows** — link equity converges on money pages only if architecture supports it.
- **Breadcrumbs** are learned from URL words but can be influenced with `BreadcrumbList` structured data.
- Consistency across desktop/mobile, protocol variants, and locale versions (hreflang) prevents split signals.

---

## 2. Technical SEO

Technical SEO's goal: ensure search engines find, crawl, and index every page you want indexed, fast, secure, and mobile-friendly. If Google cannot crawl and index, on-page and off-page work is wasted.

### 2.1 Crawlability

- **robots.txt** — serves at `robots.txt` root. User agents include `Googlebot` (web search), `Googlebot-Image`, `Googlebot-Video`, `Storebot-Google` (shopping). Block wasted crawl (admin pages, search/filter results, infinite faceted nav) but **never use robots.txt to block indexing of pages you want removed** — use `noindex` instead (a robots block can silently drop pages from the index with no removal signal to Google).
- **XML sitemaps** — list the URLs you care about; not required (Google finds most via links) but helps surface important URLs, images/video, and news. Use a sitemap index for large sites. Submit in Search Console.
- **Internal links** — the key discovery mechanism. Every page reachable through links from another indexed page; use descriptive anchor text (never "click here"); add `rel="nofollow"`/`ugc`/`sponsored` on outbound links to sites you don't trust.
- **Canonicalization** — one canonical URL per piece of content; serve each at exactly one URL, 301 non-preferred versions, use `rel="canonical"` when redirecting is impossible. Duplicate content is not a spam violation but wastes crawl budget; Google auto-picks a canonical if you don't.
- **URL structure** — words useful to users (they also drive breadcrumbs); avoid identifier-only URLs (`/p.php?id=123`); 301 old URLs when you change them.
- **Site architecture** — categories with intuitive hierarchy, interlinked; flat hierarchies + breadcrumbs are standard. Don't drop everything and reorganize; architecture is a long-term lever.
- **Mobile-first indexing** — the **mobile version is the primary version Google uses for indexing and ranking**. Desktop/mobile content parity (including structured data) matters; responsive is recommended.
- **JavaScript SEO** — critical content must be reachable without requiring interactions; avoid client-side-only rendering for important content; verify render via URL Inspection comparing crawled vs rendered HTML.

### 2.2 Indexability

- **noindex** — via `noindex` meta tag or `X-Robots-Tag` header for thin/policy/gated/duplicate-simpliciter pages. This is the correct index exclusion mechanism (robots.txt is for crawl). `data-nosnippet` prevents snippet text use.
- **404s and soft-404s** — non-existent pages return true 404 (or 410). Consolidate thin content via 301 instead of deleting. Returning 200 for empty/error pages creates soft-404s that waste crawl budget.
- **Redirects** — 301/308 permanent redirects consolidate duplicates and preserve value; minimize chains and loops.
- **HTTP status correctness** — 200 for live, 404/410 for gone, 301/308 for moved; 500s signal Googlebot to slow down.
- **Page speed / Core Web Vitals (CWV)** — page experience signals, with thresholds (measured at the **75th percentile** of real-user loads, mobile and desktop):
  - **LCP** (Largest Contentful Paint, loading): **≤ 2.5 seconds.**
  - **INP** (Interaction to Next Paint, responsiveness): **≤ 200 milliseconds.** (INP replaced FID; FID missed long interactions.)
  - **CLS** (Cumulative Layout Shift, visual stability): **≤ 0.1.**
  - Field data comes from **Chrome User Experience Report (CrUX)** and powers PageSpeed Insights and GSC's Core Web Vitals report; add your own Real User Monitoring (RUM) to diagnose regressions early.
  - CWV is one signal among many — a baseline requirement and tiebreaker, not the thing that ranks you.
- **HTTPS** — table stakes: eligibility for rich results, browser baseline, and a trust signal.

### 2.3 Structured data basics

- schema.org vocabulary via **JSON-LD** (recommended by Google: easiest to implement and maintain at scale) describes page entities: `Organization`, `Product`, `Article`, `FAQPage`, `BreadcrumbList`, `Review`, `Person`, `Event`.
- It does **not** give a generic ranking boost; it makes pages **eligible for rich results**, raising SERP visibility and CTR.
- Structured data **must match the visible text** (Google flags mismatches). Validate with the Rich Results Test; monitor via GSC Rich Results Status. Full schema system in **Part 6**.

### 2.4 Server-side hygiene (Googlebot operational checklist)

- Don't clash: serve identical content to Googlebot and users (cloaking = spam violation).
- Don't block CSS/JS in robots.txt; Googlebot must render like a browser.
- Enable gzip/Brotli compression and HTTP/2 (no boost, but faster pages help CWV).
- Set `Cache-Control: max-age`, `ETag`, `Last-Modified` so Google recrawls efficiently.
- Monitor logs for Googlebot (verified by hostname), crawl spikes, bandwidth abuse.
- Set correct status codes; verify Googlebot identity three ways (UA, IP, rDNS).

### 2.5 Technical audit checklist (executor checklist)

Each item: concrete action + where it is configured. Run on every site (new intake and quarterly).

1. [ ] **Verify ownership in Google Search Console** — add the site property, complete DNS/site verification. Where: GSC.
2. [ ] **Submit the XML sitemap** at the sitemap root URL; confirm "success" status. Where: sitemap + GSC.
3. [ ] **Run `site:domain.com`** and confirm expected pages are in the index. Where: GSC / search.
4. [ ] **Review Index Coverage (Page indexing)** — fix "Error" rows first (404s, redirect errors, blocked by robots), then "Warnings," then "Excluded," per page group. Where: GSC.
5. [ ] **Audit robots.txt** — confirm no blocked CSS/JS or crucial sections; `User-agent: Googlebot` allows the site; confirm Googlebot can fetch. Where: robots.txt.
6. [ ] **Confirm exactly one canonical per page**; audit 301s (no chains, no loops, target URL correct). Where: page head / server rules.
7. [ ] **Verify HTTPS everywhere** — no mixed-content warnings; canonicals use the HTTPS protocol. Where: server.
8. [ ] **Run Core Web Vitals / PageSpeed Insights** — pass LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at the 75th percentile on mobile and desktop. Where: page speed tooling + server.
9. [ ] **Confirm mobile usability** — content parity, readable text, tap targets (mobile-first indexing checklist). Where: templates/CSS.
10. [ ] **Ensure internal links reach every indexable page**; no orphan pages; descriptive anchors. Where: content/templates.
11. [ ] **Validate structured data** with the Rich Results Test; review the Rich Results Status report. Where: JSON-LD + GSC.
12. [ ] **Check indexed file types** — HTML over PDF for most content; serve text alongside images/video. Where: templates/publishing.
13. [ ] **Sweep duplicate-content patterns** — trailing slashes, `?param` versions, www vs non-www, HTTP vs HTTPS; consolidate to one canonical. Where: server + canonicals.
14. [ ] **Confirm title tags and meta descriptions exist** on all indexable pages. Where: templates.
15. [ ] **Scan server logs / GSC Crawl stats** — anomalies: huge 5xx growth, unusual crawl spikes. Where: server + GSC.

---

## 3. On-Page SEO

On-page SEO optimizes each page for relevance, usefulness, and intent fit — for both users and search engines.

### 3.1 Keyword research fruit (the essentials)

Search intent buckets:

- **Informational** — learn ("how much caffeine in coffee") → guides/how-tos.
- **Navigational** — reach a specific site ("facebook login") → brand pages + Google Business Profile.
- **Commercial investigation** — compare options ("best instant coffee") → comparison/alternatives or category pages.
- **Transactional** — ready to act/buy ("buy cuisinart coffee maker") → product/service pages.

Match page type to intent; Google rewards intent fit, not keyword presence. If the SERP for a query is full of guides, a product page will not rank, and vice versa.

Full workflow with free+paid tooling is staged in **Part 9 / SOP A**; the durable rules: traffic potential > raw volume, cluster keywords whose top-ranking pages overlap into one comprehensive page, use CPC only directionally (commercial queries carry high CPC — e.g., "project management software" ~$30 vs informational "methodologies" ~$6), and mine GSC Performance + Reddit/forums for real user phrasing.

### 3.2 Title tags

- The title link (from `<title>` plus headings) is your result headline; the target keyword inside it directly helps rank for that term.
- Make it compelling for humans — it drives CTR.
- Google can rewrite titles; write naturally, aligned with intent, no keyword padding.

### 3.3 Meta descriptions

- **Not a ranking factor** — but a CTR factor: people read it to decide whether to click.
- Write enticing, specific, keyword-bearing descriptions (Google bolds matched terms); a strong description steals clicks from results above you.
- Target roughly ≤160 characters.

### 3.4 Header hierarchy and content structure

- Headings break content into sections and aid navigation; keep text easy to read.
- Google explicitly says heading *order* is not a ranking factor and there is no ideal heading count ("if you think it's too much, it probably is") — but semantic H1/H2/H3 order matters for accessibility/screen readers.
- Short sentences, short paragraphs, useful visuals, logical navigation.

### 3.5 Content length

- **No magical word-count target** — no minimum, no maximum; length alone doesn't rank.
- Longer, non-repetitive content naturally matches more query variations; comprehensive topic coverage beats arbitrary word counts.

### 3.6 Keyword placement and semantic/topic coverage

- Use the target keyword naturally in the title tag, first paragraph/H1 context, headings, and body.
- **Keyword stuffing is spam** against Google spam policies and readers.
- Include synonyms and related terms so one page ranks for its whole cluster ("outreach tools," "backlink analysis" alongside "link building tools").
- Target a **topic cluster**, not a single phrase: when top-ranking pages are near-identical for two queries, Google treats one as a subtopic of the other, and one comprehensive page can rank for both.
- Density percentages are obsolete; semantic relevance + intent coverage are the modern signals.

### 3.7 Internal linking

- Point keyword-rich internal anchors at money pages and to all pages on the site.
- Internal links demonstrate topic knowledge, pass authority, and aid crawling.
- Linking out to trusted resources shows confidence; only link to sites you trust, else `nofollow`.

### 3.8 Images

Engines can't fully "see" images, so provide:

- Descriptive filenames (`mobile-seo-guide-comments.png`).
- Alt text describing the image (accessibility + image search).
- Image title (often copies alt text).
- Pair text with high-quality images/video where it strengthens the answer.

### 3.9 FAQ sections

- FAQ/PAA-style sections and question headings capture longer-tail question queries (autocomplete + PAA reveal real phrasing).
- Use `FAQPage` structured data only where questions genuinely appear on the page. Google has long narrowed visible FAQ rich results for most sites — the visible FAQ content still helps topical coverage and AI answer surfaces.
- Question clusters align directly with AI Overviews quoting well-structured answers (see Part 5).

### 3.10 Where on-page SEO meets AEO: answer-first guidance

These on-page elements double as AEO levers — apply them together:

- Lead paragraph answers the query in the first **40-100 words** (direct-answer pattern), then elaborate.
- Question-as-heading + 2-4 sentence answer blocks (native extraction targets for ChatGPT and Perplexity).
- Comparison tables paired with a one-sentence verdict underneath.
- How-to content as numbered steps with an intro summary sentence stating outcome + effort/time.
- Every factual claim self-contained with source name + date inline.
- Page remains fragment-eligible: clear title/description, text-forward, minimal pre-answer clutter.

---

## 4. Off-Page / Authority

Off-page SEO is everything outside your domain that signals authority: backlinks, brand mentions, digital PR, entity signals.

### 4.1 Why links still matter

- Google: "If other prominent websites on the subject link to the page, that's a good sign that the information is of high quality." Authority comes largely from links; relevance of the linking site matters.
- Links are among the biggest ranking drivers, but PageRank is one system among many — quality and relevance overpower raw counts.

### 4.2 The five link-quality concepts

1. **Authority** — links from well-known, authoritative sites (national newspaper over a tiny blog) weigh far more. Industry metrics: Ahrefs Domain Rating (DR), Moz Domain Authority (DA); page-level authority (Ahrefs URL Rating / UR) mirrors PageRank's original vote.
2. **Relevance** — same-topic links weigh more than off-topic ones; adjacent topics (nutrition for a fitness site) are still natural; shoehorned links are the danger zone.
3. **Anchor text** — PageRank's original patent used anchors to infer page subject. **Do not over-optimize**: controlled money-keyword anchors in mass suggest manipulation. Let the author write anchors; favor brand anchors.
4. **Placement** — the "Reasonable Surfer" model: clickable links pass more authority — content-block links (early in the article) beat sidebar/footer links.
5. **Destination** — point links where they help: homepage, linkable assets, money pages. Earn links to assets, then let authority flow to money pages via internal links.

`nofollow` links generally don't cast a vote (use `sponsored`/`ugc` variants appropriately).

### 4.3 Link-building tactics

- **Skyscraper technique** — make something noticeably better than the current best content (depth, data, design), then pitch everyone who links to the old piece. (Backlinko's classic post earned ~1,700 backlinks.)
- **Guest posting** — legitimate only at small scale on related sites with brand anchors and mixed anchors; "guest blogging at scale" reads unnatural (spam).
- **Linkable assets / link bait** — industry studies, myth-busting pieces, visual guides, free tools, curated lists (Backlinko's SEO tools list earned 2,000+ links). Content designed to attract links, not traffic.
- **Digital PR & press** — original data studies, surveys, and timely news hooks pitched to journalists; research-backed content is the most reliable PR hook (Ahrefs' ranking-time study still earns mentions years later).
- **Content promotion** — advertising, influencer outreach, email/audience building; promote older content inside new content. "It's hard to make friends if your site isn't interesting."
- **Niche edits** — placing a link inside a relevant, existing, contextual article. Fastest (mature pages already rank) but must be relevance-driven; large-scale paid insertions are link spam.

**Outreach workflow** (repeatable round):

1. Pull top-ranking pages for the keyword (Ahrefs Keywords Explorer → SERP Overview) and list their backlinks.
2. Filter to "meaningful backlinks" (relevant sites, not directories); manually open candidates; check whether context allows adding your link.
3. Pitch site owners with a case.
4. Find pages that **mention your topic but don't link out** (Content Explorer, often 100k+ candidates) and pitch adding a link.
5. Track outreach in Pitchbox/BuzzStream/GMass; find contacts via Hunter.io or Voila Norbert.

### 4.4 Link quality vs quantity

- Prefer a small number of relevant, authoritative, content-placed links over directory/forum mass.
- **Link velocity** (new links/month): sudden unnatural spikes (hundreds overnight from expired domains/PBNs) are a manipulation footprint. Healthy: a slow ramp — a handful of quality referring domains monthly for a new site.
- Track **referring domains per month**, not raw links; watch share of authoritative/relevant domains and a natural velocity curve.

### 4.5 Disavow and negative SEO

- Use Google's **Disavow Links tool** only for clearly toxic patterns (mass paid links, PBNs, link spam after a manual action or algorithmic hit); disavowing good links can hurt.
- First attempt removal via outreach; disavow is the fallback.

### 4.6 Brand signals

- Unlinked brand mentions and brand-name citations in content give contextual votes even without a link.
- Rising branded-search volume reinforces entity authority (citations and brand mentions → later branded searches).
- Keep consistent naming everywhere; see Part 6 entity SEO.

---

## 5. Answer Engine Optimization (AEO)

### 5.1 What AEO is — and is not

- **AEO** = making content visible and useful to AI systems that deliver direct answers: Google AI Overviews, AI Mode, ChatGPT/OpenAI search, Perplexity, Microsoft Copilot, Gemini, and voice assistants.
- Primary goal: **being mentioned and cited inside the generated answer**, not ranking a URL — there may be no clickable link list at all.
- **GEO** (Generative Engine Optimization) is a near-synonym for visibility inside AI responses; **ASO** (Agentic Search Optimization) extends to AI agents that take actions (shopping, booking, coding agents).
- AEO builds **on** SEO; it does not replace it. You still need crawlable, indexable, optimized pages. The shift is from ranking a page to packaging information AI can trust and reuse.

### 5.2 The citations / grounding mechanic — how engines choose what to cite

Two retrieval pathways:

1. **Training-memory pathway (parametric).** The LLM has seen enormous amounts of the web during training. Stable, evergreen facts are answered from memory without live retrieval. Content wins this pathway by being highly repeated, well-structured, encyclopedia-like, and consistent across the web (Wikipedia and established references dominate).
2. **Live-retrieval pathway (grounding / RAG).** For fresh, niche, or verifiable queries, the engine runs what Google calls a **"query fan-out" — issuing multiple related searches across subtopics and data sources** to develop a response. It retrieves candidate pages, extracts candidate passages, scores them, and composes the answer with citations back to the selected passages.

Platform-verified mechanics:

- Google: while AI responses generate, "our advanced models identify more supporting web pages, allowing us to display a wider and more diverse set of helpful links... than classic web search" — **answer engines are built to cite a broader set of pages than the classic top-10.**
- OpenAI: ChatGPT search "leverages third-party search providers as well as content provided directly by our partners"; search is a fine-tuned GPT-4o; ChatGPT decides when to search based on the query; every web-backed answer carries a **Sources** button → sidebar of linked references.
- Perplexity has cited in every answer since day one and says it has "updated how our systems index and cite sources" in response to publisher feedback.
- Gemini (API/Vertex) offers explicit grounding hooks: "Grounding with Google Search," "Grounding with Google Maps," a custom search API, dynamic retrieval, and RAG — anchoring generation to real-time, verifiable web data.

Implication: you win either by being a canonical repeated source over years (training memory) or by being highly retrievable, extractable, and citation-worthy right now (grounding). **New brands can only win the grounding pathway quickly; both require extraordinary factual clarity.**

### 5.3 Per-platform breakdown

#### 5.3.1 Google AI Overviews and AI Mode

- **Triggering**: AI Overviews summarize the gist of complicated topics and are "shown only when systems determine it is additive to classic Search... often don't trigger." Baseline: **13.14% of Google searches triggered AI Overviews** (Semrush study of 10M keywords, March 2025) — a fraction, and it moves. AI Mode is a deeper conversational mode for reasoning, complex comparisons, and multi-step exploration; responses and links can differ from Overviews.
- **Eligibility**: a page must be **indexed and snippet-eligible**, satisfying Google's technical requirements. **No additional technical requirements and no special schema** — being eligible guarantees nothing (crawling, indexing, serving are never guaranteed).
- **Quality signals to operationalize**: crawling allowed (robots.txt/CDN/host); content findable via internal links; great page experience (CWV + usability); important content as *text*; high-quality images/video supporting text; **structured data matching visible text**; up-to-date Google Business Profile and Merchant Center; helpful, reliable, people-first content.
- **What gets cited**: snippet-eligible, text-forward, topically focused pages, fresh when the query is time-sensitive, corroborated across the web. Google notes users now visit a **greater diversity of websites** — long-tail sites gained a seat at the table.
- **Monitoring**: AI Overviews/AI Mode traffic is inside the GSC **Performance report under the "Web" search type**; clicks from SERPs with AI Overviews are **higher quality — users spend more time on site**. Isolate via query/date filters or GSC API exports.
- **Controls**: robots.txt for crawl access; `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex` to reduce appearance; **Google-Extended** separately controls AI training/grounding in Google's other (non-Search) systems.

#### 5.3.2 ChatGPT Search (OpenAI)

- **Mechanics**: launched Oct 31, 2024 (Plus/Team); Dec 16, 2024 (all logged-in users); **Feb 5, 2025 (everyone, no signup)** in supported regions. ChatGPT chooses to search based on the query (fresh/current topics trigger retrieval; conversation context counts), or users trigger the web-search icon. Every web-grounded answer includes a Sources button → sidebar of linked references. Backend = fine-tuned GPT-4o + third-party search providers + partner content (AP, Axel Springer, Condé Nast, Dotdash Meredith, Financial Times, GEDI, Hearst, Le Monde, News Corp, Prisa/El País, Reuters, The Atlantic, Time, Vox Media). Any site can appear organically — no paid gate; feedback channel: publishers-feedback@openai.com.
- **What ChatGPT cites**: factual, well-structured, current content — it needs answer text, not linkbait. Original research/stats with named authors and dates (Semrush's own study gets cited because it's data-rich and heavily linked). **Recency matters** — ChatGPT cited newer studies over older ones for the same query.
- **Checklist for ChatGPT citation**:
  1. Publish stats with named sources, dates, and methodology.
  2. Put the direct answer in the first paragraph.
  3. Make factual claims attributable to your page (don't aggregate others').
  4. Keep visible dates so the model treats content as fresh.
  5. Ensure robots.txt/indexing allows the third-party crawler stack that feeds its search.

#### 5.3.3 Perplexity + Publishers Program

- **Program (announced Jul 30, 2024)**: revenue sharing — when Perplexity earns ad revenue from an interaction where your content is referenced, you earn a share of ad revenue served through related-questions features and Pages. Partners get access to Perplexity's Online LLM APIs to build answer engines citing only their content, related-questions tech to embed, one year of enterprise Pro for employees, and analytics via ScalePost.ai (citation volume insights).
- **Economics**: citations = the new impressions; the program monetizes zero-click traffic and gives citation data.
- **What Perplexity cares about**: "trusted, accurate sources covering the topics people care about most" — trustworthiness, topic coverage, accuracy. First partners were premium original news (TIME, Der Spiegel, Fortune, The Texas Tribune) plus WordPress.com — premium, original, accessible content is favored. Citation-format/policy changes are frequent; re-check periodically.

#### 5.3.4 Microsoft Copilot / Bing

- Copilot is grounded on the **Bing index**: if Bing can crawl, index, and understand a page, Copilot can retrieve and cite it.
- **Bing Webmaster Tools** is the operational surface: URL submission, **IndexNow** (near-instant URL submission), search performance, crawler controls. Bing's webmaster blog is the release channel for Copilot SEO features.
- Best-practice anchor: submit an XML sitemap; use **IndexNow** for instant indexing of new pages; keep pages crawlable; don't block Microsoft/Bing AI crawlers; publish answer-shaped content (Part 5.4).

#### 5.3.5 Google Gemini

- **Grounding/citations**: Gemini (consumer app and API) has explicit grounding — "Grounding with Google Search," "Grounding with Google Maps," custom search API, parallel web search, or RAG data. When grounded answers use live data, Gemini displays source links ("View resources"). "High Confidence" grounding promotes answers with verifiable sources over uncertain generations.
- **What Gemini favors**: the same Google-eligible index as AI Overviews (the live web via Google Search as the evidence layer). Pass Google's technical requirements, use entity-consistent markup, and carry crisp answer text; these survive grounding scoring.

#### 5.3.6 Apple Intelligence / Siri

- Apple Intelligence (WWDC 2024, shipped with iOS/iPadOS/macOS) uses a ~3B-parameter on-device model plus a server model on Private Cloud Compute.
- Siri gained richer language understanding, typing, device-support Q&A over "how do I do X on iPhone," onscreen awareness, and cross-app actions.
- **ChatGPT integration**: "When a user grants permission, Siri can tap into ChatGPT's broad world knowledge and present an answer directly" — Apple routes world-knowledge questions to ChatGPT. Practical implication: optimizing for ChatGPT currently covers the largest slice of the Apple surface. Apple has since expanded Siri web-search features; monitor Apple's ground-truth behavior (unverified details were excluded from this research).

### 5.4 Answer-first content formats (in priority order)

The master principle: **answer first, elaborate second.** Design the page so a machine extractor finds the answer in the first 40-100 words — "most of the answer above the fold." If the query is "how long does it take to charge a Tesla," the first sentence must be a defensible number plus conditions, then context.

Formats that score highest:

1. **Direct answer paragraph** (first ~50 words) — highest priority for all engines.
2. **Q&A/FAQ blocks** — question-as-heading + 2-4 sentence answer; native extraction targets for ChatGPT and Perplexity.
3. **How-to/numbered steps** with an intro summary sentence (outcome + effort/time).
4. **Definitions** — "X is Y" pattern:
   > "Answer engine optimization (AEO) is the practice of making your content visible inside AI-generated answers."
5. **Tables with a verdict sentence** — comparisons, pricing, specs; engines love parsing tables, and the verdict under it becomes the citable sentence ("For most coffee drinkers, X wins on price, Y on flavor").
6. **Named-source statistics** — drives ChatGPT citations: "According to the March 2025 Semrush study of 10 million keywords, 13.14% of Google searches triggered AI Overviews."
7. **Direct-answer-then-rationale** — verdict first, conditions/context after ("Yes — Googlebot will set a +30-day freshness date... The rules: (1)... (2)... (3)...").
8. **Q&A verdict pattern** ("Q: Does AI Overviews appear on every query? A: No...") — natural foil for "is this true" queries: lead with verdict, then evidence, then nuance.
9. **Definition-with-limits** — "X is Y when Z; X is NOT Y when W" — preempts hallucination and hands the model a boundary sentence.
10. **Lists of independently citable facts** ("top 10 reasons") where each item stands alone.
11. **Manually curated data feeds** — clean CSV/JSON/page tables that retrieval systems and agents parse directly.

### 5.5 Cited-sentence optimization (the single highest-leverage tactic) — step-by-step recipe

Models mostly cite *one sentence or a short paragraph*. Engineer each money page for exactly that:

1. **Position the answer at answer-spot.** Put the extractable answer at the top of an H2/H3 section or the opening paragraph — never buried (a #6 page with a buried answer loses to a #11 page with a direct answer).
2. **Make the sentence self-contained.** It must be true *without* upstream context. Bad: "The study found this." Good: "13.14% of Google searches triggered AI Overviews."
3. **Name + date + attribute inside the sentence.** "Semrush's 2025 study of 10M keywords found 13.14%..." — the citation engine must be able to point at a source from the sentence itself.
4. **Strip logical hedges from the headline sentence.** Keep caveats, conditions, and nuance in the *following* sentence, not the cited one.
5. **Perfect verbatim-snippet hygiene.** The sentence must read cleanly when lifted: no orphan pronouns, no dangling referents, no "as mentioned above," no inline author voice that breaks isolation.
6. **Corroborate.** Repeat the same fact with the same phrasing across pages on your site and link out to primary sources; consistency raises the model's confidence band.
7. **Make it fresh when it matters.** For time-sensitive claims, the cited sentence carries a visible, honest date — never a faked one.
8. **Measure and iterate.** Track which exact sentences get lifted (Part 8); rewrite non-winners into tighter, more self-contained versions; put winners verbatim into your "quote bank."

### 5.6 Anti-patterns that suppress extraction and citation

- Answer buried under 800 words of preamble, CTA stacking, or "before we answer" caveats.
- FAQ content that evades: "Well, it depends..." as the first line — extractors throw it away.
- Promising an answer that has no answer (fake release dates, unverifiable claims) — Google flags it explicitly.
- Massive word counts for their own sake — Google: "No, we don't" have a preferred word count.
- Changing dates to fake freshness without substantive change — explicitly warned against.
- "Summing up what others have to say without adding much value" — explicitly warned against.
- Keyword-stuffed question headings with no real answer under them — the extractor finds nothing and scores the whole page down.
- Disinformation-style framing: anonymous contradiction of consensus, "studies show" with no source, manufactured urgency/controversy.
- Unlabeled AI-generated content at scale.

---

## 6. Schema & Entity SEO

### 6.1 Why schema raises citation rates

- Structure gives extractors confidence: data that is **parseable and consistent between markup and visible text** scores higher for "clean dataset" extraction. Google: "make sure your structured data matches the visible text on the page."
- AI Overviews/AI Mode have **no special required schema** — standard schema is what matters; JSON-LD is the recommended format.
- Schema conditions the Knowledge Graph/entity layer, which feeds the **training-memory pathway** for named-entity queries ("who is the CEO of X," "what is brand Y") — where much answer-engine volume lives.

### 6.2 JSON-LD types to deploy (priority order)

Use schema.org vocabulary via JSON-LD in the `<head>`:

1. **Organization** — legal name, logo, sameAs links to Wikidata/Knowledge Graph, address, founding date. The base entity everything else hangs off.
2. **Person** — per author: name, jobTitle, url, sameAs (LinkedIn, Scholar, Wikipedia); link authors to your Organization.
3. **Article / BlogPosting / NewsArticle** — author, datePublished, dateModified, headline, image, mainEntityOfPage. Keep dateModified honest; never fake freshness.
4. **FAQPage** — question/answer pairs; high extraction value. Google no longer shows FAQ rich results for most sites, but the data model still primes extraction.
5. **HowTo** — `step` + `position`; pairs with the how-to content pattern.
6. **Product** — offers, price, availability, aggregateRating, review; feeds shopping agents (ASO) and product-summary answers.
7. **Review** — product/service reviews with author and rating.
8. **SoftwareApplication** — for software/app pages used in "alternatives to X" and "best tools for Y" queries.
9. **BreadcrumbList** — reinforces site structure and entity context on every page.
10. **MedicalCondition / Drug etc.** — only for legitimate health content; YMYL pages get extra E-E-A-T weight, so schema there must be accurate — it cannot be faked cheaply.

Keep markup ≤ the visible content; mismatches are a trust negative.

### 6.3 Example — Organization JSON-LD block

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Acme Coffee Co.",
  "url": "https://acmecoffee.com/",
  "logo": "https://acmecoffee.com/logo.png",
  "foundingDate": "2015-03-01",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "120 Market St",
    "addressLocality": "Portland",
    "addressRegion": "OR",
    "postalCode": "97205",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://www.wikidata.org/wiki/Q00000000",
    "https://www.linkedin.com/company/acme-coffee",
    "https://www.wikipedia.org/wiki/Acme_Coffee_Co"
  ]
}
```

### 6.4 Validation tooling (Google-official)

- **Rich Results Test** — Google-specific rich results + visual preview.
- **Schema Markup Validator** — all schema.org types, no Google bias (the old Structured Data Testing Tool migrated here).
- Run both on every schema-bearing URL after deploy and on a rolling monthly sample; monitor GSC Rich Results Status between runs.

### 6.5 Entity / Knowledge Graph SEO

Goal: make every machine-disambiguated "named thing" about your brand identical everywhere. Brand entity audit checklist:

1. **Consistent naming** — one legal name, one merchant name, one display name across website, Google Business Profile, Wikidata, LinkedIn, Crunchbase, PitchBook, app stores, socials.
2. **Author entity** — every page gets a real, linked author with credentials (compounds into domain E-E-A-T across dozens of pages).
3. **sameAs network** — connect Organization/Person to Wikipedia/Wikidata/social/academic records via `sameAs` in JSON-LD.
4. **Knowledge Graph appearance** — via Google Business Profile + high co-occurrence of NAP (name/address/phone) across the web; GBP/Merchant Center data feeding Google is an explicitly-listed AI-features best practice.
5. **Wikipedia** — not required, but it is the single most-cited entity source in training data; a neutral, sourced article materially helps the training-memory pathway. Skip for most small brands (effort high, maintenance risk real).

### 6.6 Wikidata

- Create/claim a **Wikidata item** for your Organization, key Person authors, and products; this is the shared "entity ID" Google and other LLM stacks press into knowledge bases.
- Add stable identifiers (website, logo, official name, socials) — consistency here propagates everywhere.

### 6.7 Google Business Profile (GBP)

- Keep name, address, phone, category, hours, and photos current and consistent with your site's NAP.
- Google lists updated Business Profile/Merchant Center info as an AI-features best practice — it feeds local packs, Knowledge Panels, and answer surfaces.
- For commerce sites, keep Merchant Center feeds (price, availability, shipping) accurate — shopping agents act on them.

---

## 7. Factual Authority / Being Citable

### 7.1 The trust ladder that LLMs climb

Models prefer citations that are: (a) internally consistent, (b) corroborated by many other sources, (c) attributed, (d) recent when the claim is time-sensitive, (e) from a domain and author with a documented record. This is the E-E-A-T machinery Google documents — and it is the same machinery answer engines absorb through training on helpful-content signal patterns. Trust is most important; YMYL gets amplified weight.

### 7.2 Publishing verifiable claims

- Every empirical claim carries: source name, date, sample size/methodology where relevant ("10M keywords," "surveys of 1,200 users").
- **Cite your own sources inline** — outbound links to original research (self-citation + third-party backlinks/brand mentions are the external corroboration AI cites).
- **Corroborate internally** — multiple pages on your domain repeat the same facts consistently; contradictions kill excerpt selection.
- Avoid "stat soup": unverifiable percentages, unnamed "studies," and anonymous anecdotes get filtered by confidence scoring.

### 7.3 Freshness (the honest kind)

- Publish dates change **only when content substantially changes** — date-faking is explicitly search-engine-first behavior.
- For time-sensitive queries, newest-and-trustworthy beats oldest-and-authoritative (ChatGPT's observed recency bias amplifies this).
- Maintain a version history / "last reviewed [date]" line so freshness is demonstrable without date games.

### 7.4 Original research (the highest-trust content class)

Case: Semrush's data-rich original study (10M-keyword AI-Overviews analysis, March 2025) became *the* citation ChatGPT gives for "how common are AI Overviews" — original, shareable, named, dated, independently linked (1,900+ links).

Formula for citable original-research pages:

1. Name the study, date, and dataset openly.
2. Lead paragraph = one headline finding (the cited sentence).
3. Publish a clean results table + methodology section.
4. Make it linkable: chart images, quote blocks, a "media can cite" box.
5. Distribute where engines harvest: news, newsletters, Reddit, forums, LinkedIn.

### 7.5 E-E-A-T signals that map to LLM trust

- **Bylines on everything** and author pages with credentials, history, and topical focus (Google: "We strongly encourage adding accurate authorship information... to content where readers might expect it").
- **About pages** answering Who-How-Why: who created the content, how it was produced (including AI-assist disclosure), why it matters.
- **Editorial standards pages**: corrections policy, fact-check/standards statement, contact + masthead — media-trustworthiness is the stated Perplexity criterion.
- **First-hand experience** (products tested by you, places visited) with photos/evidence.
- **YMYL** pages need credentials-level E-E-A-T: licensed experts, citations to primary literature, medical/regulatory review dates.

### 7.6 Patterns that actively hurt LLM citations

- Disinformation-style framing: anonymous contradiction of consensus, "studies show" with no source, urgent-but-vague claims, manufactured controversy.
- Unlabeled AI content at scale ("extensive automation to produce content on many topics" is an explicit Google warning flag).
- Content that promises to answer a question with no answer.
- Keyword-stuffed question headings with nothing real beneath them.

---

## 8. MONITORING & MEASURING

### 8.1 Google Search Console walkthrough (the control plane)

- **Setup**: verify the domain (DNS or site ownership); submit the sitemap; confirm Google can fetch.
- **Performance report** — the core KPI table (queries × pages × countries/devices): total clicks, total impressions, average CTR, average position. **AI Overviews/AI Mode clicks appear here under the "Web" search type** — no separate property. Watch for impression jumps on question-queries and "higher quality" clicks (more time on site) from AI-adjacent SERPs. Isolate with query/date filters and GSC API exports. Branded-query filter: Performance → + Add filter → Query → "Queries containing" → brand name; track branded impressions/CTR as citations grow (citations → later branded searches).
- **Index coverage (Page indexing)** — errors vs warnings vs excluded; the health of what Google knows about you.
- **Rich Results Status** — structured-data errors/warnings that limit rich-result appearance.
- **Core Web Vitals report** — field data (CrUX) for LCP/INP/CLS across URLs.
- **URL Inspection** — per-URL status, crawled vs rendered HTML, request indexing.
- **AI Overviews appearances** — not a discrete GSC report as of this research: detect via query/date filters, SERP-API snapshots, and manual checks.

### 8.2 KPI targets table

| KPI | Target | Notes / source |
|---|---|---|
| Impressions growth | Rising impressions on high-intent queries, month over month | Leading indicator that indexation + relevance work |
| Average CTR | Above ~2-6% for text results at positions 1-3; #1 captures ~27.6% of clicks | Use CTR relatively, vs same-position alternatives |
| Average position | Top 3 for head terms; long-tail faster | Give changes 2-4+ weeks |
| Indexed pages % | No "Error" rows in Index Coverage; target pages "Indexed"/"Valid" within weeks of publishing; 90%+ of meaningful URLs crawled/indexable | Exit criterion from roadmap |
| Core Web Vitals pass rate | LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at the 75th percentile, mobile + desktop; no CWV failures on money pages | Web.dev thresholds |
| Citation share | 100% of your top 20 money queries tracked weekly for citation status; share-of-voice vs competitors improving month over month | AI-visibility tooling (Part 8.4); Semrush AI Visibility Score 0-100 |
| Link KPIs | A handful of quality referring domains/month for new sites; natural velocity curve | Not raw links; hundreds/day is a red flag |
| Organic revenue | Traffic × conversion × AOV; ~1% visit-to-customer is a common illustrative benchmark | The ultimate KPI |

### 8.3 Monitoring cadence

- **Daily**: SERP snapshots for monitored queries (AI Overviews presence above organic results); index blips; 5xx spikes.
- **Weekly**: GSC Performance (last 28/90 days, segment by query and page); position movers and pages dropping out of top 10; Index Coverage totals; LLM answer checks on top 20 money queries (runbook below); keyword-tracker position/CTR columns.
- **Monthly**: content gap re-run vs competitors; anchor text + referring-domain review; CWV report check; decide which pages to refresh vs consolidate; export GSC queries into topic-cluster review; schema validation sample; citation win/loss log with a hypothesis per change.
- **Quarterly**: deep technical audit of one site area (template rollout, faceted nav, JS rendering); schema validation sweep; NAP/business-profile consistency; competitor landscape refresh; self-assess top pages against the Quality Rater Guidelines (Who/How/Why, YMYL grade, intent fit).
- **On major updates**: after a core/spam/reviews update, wait for rollout completion (~2 weeks) before judging; then identify losing/winning page patterns and plan targeted improvements — never panic-edit mid-rollout.
- **Always**: separate technical/hygiene fires from ranking strategy work.

### 8.4 AI-answer monitoring tooling

**The weekly LLM monitoring runbook** (free/manual tier):

For each of your top 20 money queries, run the same prompt set every week and record:

- Query: exact string.
- Did the engine answer from web, or from memory? (flag memory answers — you cannot win those through retrieval).
- Which sources/citations appear (capture the Sources list).
- What exact sentence lifted from you, if any.
- Who else got cited (competitors + authority picks).

Prompt template (paste into ChatGPT/Perplexity/Copilot):

> "Answer the following question as you normally would, then list every website your answer relied on, verbatim URLs, and quote the exact sentence(s) you used from each. Question: [QUERY]"

Tooling tiers:

- **Free/manual**: the weekly runbook above.
- **AEO suites**: Ahrefs Brand Radar, AI Mode Tracker, AI Overviews Tracker, AI Visibility Checker; Semrush AI Visibility Toolkit (AI Visibility Score 0-100, Mentions, Monthly Audience, share-of-voice).
- **Free checkers**: Backlinko-style AI Visibility Checker, AI Agent Readiness Checker, Agentic Browsing Readiness Checker (verify agents can access/parse your site).
- **SERP snapshot APIs**: SerpApi, Semrush Sensor, Ahrefs SERP checker (incl. AI Overviews tracker) — daily snapshots for monitored queries; track "AI Overviews shown above organic results" as a share metric (baseline: 13.14% of searches, early 2025, shifting).
- **Programmatic**: scrape via engine APIs at cadence, store raw citation JSON to a table, diff weekly — respect rate limits; the manual tier is recommended before automation.
- **Perplexity partners**: ScalePost.ai analytics for citation volume when enrolled in the Publishers Program.
- **WordPress plugins** (AIOSEO AI-Overviews monitoring and similar): wrappers on the SERP-API layer — evaluate against raw GSC + manual LLM checks before paying.

---

## 9. THE NOOB-TO-PRO ROADMAP

One unified, ordered progression. Each stage has a goal, exit criteria, and a numbered checklist. Finish a stage before the next; the merge point between SEO and AEO is explicit.

### Stage 0 — Audit and setup (week 1)

**Goal**: infrastructure in place; baseline recorded; no hidden technical fires.

**Exit criteria**: site verified in GSC, sitemap submitting cleanly, `site:` returns expected pages, baseline Performance/CWV screenshots saved.

1. [ ] Verify site in Google Search Console (DNS or site ownership); submit XML sitemap.
2. [ ] Run `site:domain.com`; confirm expected pages are in the index.
3. [ ] Run the Part 2.5 technical audit and fix "Error"-class findings.
4. [ ] Record baseline Core Web Vitals (mobile + desktop, 75th percentile) and Performance-report snapshot.
5. [ ] Enroll in Bing Webmaster Tools and set up IndexNow for near-instant indexing.
6. [ ] Set up the GSC API export pipeline and the weekly LLM runbook (Part 8.4).
7. [ ] Confirm site is mobile-usable and HTTPS-clean.

### Stage 1 — Technical (weeks 1-4)

**Goal**: fully crawlable and indexable; page experience baseline passes.

**Exit criteria**: 90%+ of meaningful URLs crawled/indexable; zero "Error" rows in Index Coverage; no Core Web Vitals failures on money pages; every money page snippet-eligible (clear title, description, text-forward content).

1. [ ] robots.txt: block only wasted crawl (admin, filters, faceted nav); never block CSS/JS.
2. [ ] Sitemap current + submitted; canonicals unique per page; 301s chain/loop-free.
3. [ ] HTTPS everywhere; correct status codes (200/301/308/404/410, no soft-404s).
4. [ ] Internal links reach every indexable page; no orphans; descriptive anchors.
5. [ ] Validate structured data (Rich Results Test + Schema Markup Validator); fix warnings.
6. [ ] URL Inspection passes for all money pages (request indexing where needed).

### Stage 2 — On-page / keyword (weeks 2-8)

**Goal**: keyword-mapped topic list; one rigorous page per cluster; intent matched.

**Exit criteria**: every cluster has a mapped page (existing or planned) with intent + page type assigned; title/meta/headings/synonyms/images/FAQ/internal links applied; keyword-to-page tracker live.

1. [ ] Run the keyword workflow (SOP A): seed braindump → free generators → GSC mining → competitor Content Gap → niche forums → metrics (traffic potential, KD read by SERP reading, CPC directionally, business potential).
2. [ ] Cluster keywords whose top pages overlap into one comprehensive page per cluster.
3. [ ] Map clusters to intents and page types (informational → guide; commercial → best-of/category; transactional → product/service).
4. [ ] Produce the keyword-to-page tracker: cluster, seed, target URL, volume, traffic potential, difficulty, intent, page type, owner, publish date, position, CTR, clicks.
5. [ ] Apply on-page checks to every page: title with keyword, ≤160-char description, semantic H1/H2/H3, synonyms, internal links, descriptive images, genuine FAQ.
6. [ ] Review each page via GSC 2-4 weeks after publish; iterate titles/descriptions on weak CTR.

### Stage 3 — Answer-first content (months 1-4)

**Goal**: every money page manufactures a cited sentence; answer formatting is complete.

**Exit criteria**: every money page has a one-sentence, self-contained, dated answer above the fold; Q&A/FAQ, tables+verdict, and numbered-step patterns present where applicable; first 100 words answer the query read in isolation.

1. [ ] Rewrite the opening of each flagship page to the direct-answer pattern (Part 5.4).
2. [ ] Add a Q&A/FAQ block per page with the queries your audience types into ChatGPT ("What is X," "X vs Y," "how to Z").
3. [ ] Add tables + one-sentence verdicts for comparison content.
4. [ ] Convert step sections into extractable, numbered HowTo-ready lists.
5. [ ] Apply the cited-sentence recipe (Part 5.5) — position, self-containment, name+date+attribution, no hedge in the headline sentence, verbatim-snippet hygiene.
6. [ ] Remove AEO anti-patterns (Part 5.6) from every page.

### Stage 4 — Schema and entities (months 1-3, overlaps 2-3)

**Goal**: markup done, validated, entity-consistent.

**Exit criteria**: zero validation errors on money pages; Organization + Person + Article live on 100% of editorial pages; name/NAP aligned across GBP, Wikidata, socials, directories.

1. [ ] Deploy JSON-LD: Organization + Person (each author) + Article + BreadcrumbList sitewide.
2. [ ] Add FAQPage to Q&A pages; HowTo to procedure pages; Product/review data to commerce pages; SoftwareApplication to tool pages.
3. [ ] Validate everything in Rich Results Test and Schema Markup Validator.
4. [ ] Create/claim Wikidata items for Organization, authors, products; wire sameAs.
5. [ ] Align naming/NAP across Google Business Profile, Wikidata, socials, directories; check Merchant Center feeds for commerce.
6. [ ] Confirm structured data matches visible text on every marked-up page.

### Stage 5 — Authority / links (months 3-12)

**Goal**: earned authority from relevant, authoritative domains at a natural velocity.

**Exit criteria**: first linkable asset live and promoted; outreach rounds producing new referring domains monthly; anchor-text spread healthy; digital PR running for YMYL/reputational topics.

1. [ ] Build one linkable asset: original study, tool, visual guide, or curated list (Part 4.3 formulas).
2. [ ] Run the outreach workflow (SOP E) — top-ranking-page backlinks, topic-mention-no-link pages, tracked pitches.
3. [ ] Guest post at small scale on related sites with brand anchors.
4. [ ] Publish original-research pages (Part 7.4) and distribute to news/forums/newsletters/Reddit.
5. [ ] Audit DR/DA of linking domains, anchor-text spread, and link velocity monthly; disavow only clear toxic patterns after removal outreach fails.

### Stage 6 — Monitoring / scale (months 6-24+)

**Goal**: compounding measurement, refresh cadence, and diversification across engines and agents.

**Exit criteria**: monthly reporting cadence runs; every citation win/loss has a documented hypothesis test; branded-query impressions rising; agent-ready data layers live for commerce.

1. [ ] Run the weekly GSC + LLM runbook on all tracked queries; log citation wins/losses with hypotheses (Part 8.4).
2. [ ] Topical-map the entire niche; fill gaps monthly (Content Gap re-runs).
3. [ ] Refresh pages whose rankings decay; consolidate thin pages via 301 — never delete in place.
4. [ ] Quarterly rater-guidelines self-audit on top pages.
5. [ ] For commerce: publish machine-readable layers (availability/price APIs, inventory feeds); Product/Offer markup current; GBP/Merchant Center currency maintained as an AI-features best practice.
6. [ ] Feed the "quote bank": promote the exact sentences that get lifted; rewrite ignored passages into tighter self-contained forms.

Timeline honesty: established brands see AEO traction in "weeks to months"; new/little-known brands realistically need **12-18 months** because citation-worthiness compounds through authority accumulation.

---

## 10. EXECUTOR SOPs

### SOP A — Keyword research → content brief for a new page

1. State the topic; write 10 seed keywords from domain knowledge of the offer.
2. Generate ideas: Google autocomplete + People Also Ask on live SERPs; a free keyword generator (Ahrefs Free Keyword Generator: ~20 keywords + ~20 questions per seed); Google Keyword Planner; answer-the-public Q&A phrases; ask an LLM for 10 short keywords per seed (ideation only — no metrics).
3. Open each candidate in a keyword tool; record volume, keyword difficulty, CPC, and traffic potential (total search traffic of the pages currently ranking, across their variations — not raw volume).
4. Read the live SERP: who ranks, their domain authority, page structure, and which features dominate (AI Overviews? PAA? video? shopping?). If top pages overlap heavily for two keywords, merge them into one cluster.
5. Classify intent (I/N/C/T) and pick the page type (guide, best-of/category, product/service, brand).
6. Estimate business potential: traffic × achievable-position probability × conversion likelihood; decide invest/skip.
7. Write the brief: target URL, title tag, one direct-answer opening (state the answer + conditions in the first 40-100 words), H2 outline aligned with user questions (question-as-heading), FAQ block with 3-6 real questions, one comparison table + verdict if "X vs Y" or "best" intent, internal links (2-4 traffic sources + 1-2 money destinations), primary keyword + synonym list, structured data list (Article + FAQPage and/or HowTo/Product), and 1-2 original facts/statistics to mint as cited sentences (source named and dated).
8. Log the row in the keyword-to-page tracker (Status: In production).

### SOP B — Optimize an existing page (on-page audit → edits → validation)

1. Pull the URL's GSC row: query set, impressions, clicks, CTR, average position (last 28 and 90 days).
2. Check the live SERP: dominant feature type, top 3 competitors' structure, and whether your snippet could claim the featured slot.
3. Verify technical status: indexed (URL Inspection), canonical points to itself, Crawled vs Rendered OK, CWV green in the GSC CWV report.
4. Score the page against the on-page checks: title has the target keyword (natural), ≤160-char description that sells, one H1, logical H2/H3s, keyword + synonyms present, internal links land + descriptive anchors, images named/alt'd, genuine FAQ.
5. Test answer-first: does the first 100 words answer the primary query in isolation, with a named+dated fact if one exists? If not, rewrite the opening (Part 5.5 recipe).
6. Check schema: markup present, validated, matches visible text (Rich Results Test).
7. Apply edits; re-validate schema; request indexing via URL Inspection.
8. Keep the old meta/title variants in the tracker notes; schedule a follow-up in 2-4 weeks; if CTR lagged, test an alternative title/description.

### SOP C — Weekly monitoring & reaction loop (GSC + AI answers)

1. Monday: export GSC Performance (last 28 days, Web type), filter top 20 queries and top 20 pages.
2. Flag movers: queries that gained/lost ≥ 3 positions or ≥ 20% impressions/clicks week-over-week.
3. Check Index Coverage totals and Core Web Vitals report for regressions; log any new Errors.
4. Run the LLM runbook (Part 8.4 prompt template) on the top 20 money queries across ChatGPT, Perplexity, and Copilot; record sources, lifted sentences, and competitor/authority picks.
5. Diff citations vs last week: wins → add the winning sentence to the quote bank and consider amplifying it; losses → note the hypothesis (freshness? structure? new competitor? partner feed?).
6. Take no more than 3 targeted actions this week (rewrite one ignored answer, refresh one time-sensitive page honestly, request indexing on one new submission).
7. Log results; update the keyword-to-page tracker; file the weekly report to the project log.

### SOP D — Site-wide technical audit (new client intake)

1. Run Part 2.5 checklist items 1-15 in order: GSC verification, sitemap submission, `site:` check, Index Coverage error triage, robots.txt, canonicals/redirects, HTTPS, CWV, mobile usability, internal-link coverage, structured data validation, indexed file types, duplicate-content sweep, meta completeness, log/Crawl-anomaly review.
2. Export findings into a triage sheet: broken (site-breaking), crawl (blocking indexation), rank (costing performance), hygiene (long-term debt). Fix broken + crawl immediately.
3. Baseline the KPI table (Part 8.2): impressions, CTR, positions, indexed %, CWV pass rate, citation status on top 20 queries.
4. Produce a stage plan mapping fixes to Roadmap Stages 0-2.
5. Present findings as: what works, what is broken, what is slowing growth, what to measure.

### SOP E — Link-building outreach round (1 week)

1. Day 1: Pick 3 target keywords; pull top-ranking pages and their backlinks (Ahrefs Keywords Explorer → SERP Overview); export candidate domains.
2. Day 2: Filter to "meaningful backlinks" (relevant, non-directory, content-placed); open each; record the exact context where your link would fit.
3. Day 3: In Ahrefs Content Explorer, find pages mentioning your topic that don't link out; shortlist 20.
4. Day 4: Write personalized pitches (two templates: "this section of your article implies X; here's the one-sentence proof" and "you mention the topic; here's the resource"). Track in Pitchbox/BuzzStream/GMass; find contacts via Hunter.io / Voila Norbert.
5. Days 5-7: Send (aim 20-30/day max), follow up once after 4 days on no-replies, log results (sent/replied/accepted/live), and record new referring domains in the link tracker. Stop when you have 3-5 accepted placements per round; never mass-blast.

---

## 11. Common Myths & Mistakes

Condensed from both research drafts. Myth | Truth | Action.

| Myth | Truth | Action |
|---|---|---|
| E-E-A-T is a ranking factor | Framework; ranking systems use many factors that identify good E-E-A-T | Embed E-E-A-T visibly (bylines, Who/How/Why, evidence), don't "target" it |
| There's a magical content length | No min/max; length alone doesn't rank | Cover the topic completely; stop at done |
| Heading order matters to Google | Not a ranking factor; semantic order is for accessibility | Use logical H1/H2/H3 anyway |
| Meta keywords help | Unused since 2009 | Delete/ignore |
| Keywords in domain/URL give a big boost | Minimal effect beyond breadcrumbs | Use clean URL words; don't chase exact-match domains |
| Duplicate content is a penalty | Not spam; wasteful and bad UX; Google auto-picks a canonical | Consolidate to one canonical URL |
| PageRank is all that matters / links are dead | One system among hundreds; relevance + usefulness dominate | Keep earning relevant, authoritative links |
| More backlinks always win | Quality, relevance, placement, and natural velocity matter more | Filter link tools for "meaningful backlinks" only |
| Submit to 100 directories = done | Directory spam is low/negative value | Few authoritative, relevant, content links |
| Mobile SEO is optional | Mobile-first indexing: mobile is primary | Desktop/mobile parity, responsive, tap targets |
| Buying links is safe if undetected | Link schemes are manipulative; disavow cleans up, doesn't license spam | Outreach + assets; never purchase mass links |
| SEO works overnight | Days to months; wait weeks before judging | Set expectations by stage/routine; never panic-edit |
| Structured data boosts rankings | It gates rich-result eligibility and lifts CTR, not rank | Deploy accurate schema matching visible text |
| Meta descriptions affect ranking | They affect CTR only | Write click-worthy descriptions |
| All AI content is auto-penalized | Automation is fine when helpful; spam only when made to manipulate | Disclose AI-assist; make content people-first |
| Must rank #1 or SEO failed | Long-tail + zero-volume queries at scale win; #1 takes ~27.6% of clicks | Realistic positions; intent match per page |
| Keyword research = stuff one keyword everywhere | One comprehensive page per parent-topic cluster (e.g., "whipped coffee" + "recipe") | Cluster, don't repeat |
| Guest posting is always bad | Small scale, related sites, brand anchors = legit early tactic | Scale = red flag; do it sparingly |
| Ignore technical SEO if small | Architecture becomes decisive as you scale; page experience is baseline | Fix technical debt from day one |
| You need an AI file / llms.txt for AI Overviews | Google: no new machine-readable files, AI text files, markup, or special schema | Rely on standard SEO + answer shape; llms.txt optional only, supplementary at best |
| There's a special optimization guaranteeing AI inclusion | Google: "no additional requirements... nor other special optimizations necessary"; serving isn't guaranteed | Build the eligibility base; diversify engines |
| AI Overviews appear on every query | "Often don't trigger"; ~13.14% of searches in March 2025 and shifting | Target question-queries where they trigger; don't fear them |
| AI Overviews kill your traffic | Google reports those clicks are higher quality (more time on site) | Monitor quality metrics, not just click counts |
| Structured data is useless for AI | Engines hunger for clean, parseable, visible-text-matching data | Markup must match text; validate |
| Freshness = change the date | Date-faking without substance is flagged search-engine-first behavior | Honest dateModified + "last reviewed" lines |
| Citations are luck / can't be influenced | A named, dated, original study reliably gets cited; recency decides between studies | Build 3-5 original data assets (the Semrush formula) |
| Ranking #1 guarantees AI citations | Correlated, not causal: #1 + answer-shape is safest; a #11 direct-answer page beats a #6 buried answer | Optimize the citable sentence, not just position |

---

## 12. Cheat Sheet

### 12.1 Core algorithms / updates glossary

- **Crawl** — discovery of URLs by Googlebot.
- **Index** — storage/rendering of page content in Google's index.
- **Serve** — real-time ranking and assembly of results per query.
- **PageRank** — link-based authority system; now one signal among hundreds.
- **BERT / MUM / RankBrain** — neural language-understanding / query-mapping systems.
- **Core updates** — periodic broad relevance/quality refinements; helpful-content system merged into core (March 2024).
- **Spam systems** — remove scraping, cloaking, keyword stuffing, link spam, site-abuse, misleading AI-generated content.
- **Reviews system** — evaluates first-hand, evidence-based review content.
- **Link analysis systems** — authority estimation via links and click-behavior ("Reasonable Surfer") models.
- **E-E-A-T** — Experience, Expertise, Authoritativeness, Trustworthiness (framework; trust matters most).
- **YMYL** — "Your Money or Your Life" content; receives extra scrutiny and needs credentials-grade trust.
- **Helpful content system** — now inside core: people-first vs search-engine-first evaluation.
- **AI Overviews / AI Mode** — Google's generative answer surfaces, reported under GSC "Web" Performance.
- **Grounding / RAG** — anchoring an LLM answer to retrieved, verifiable passages.
- **Query fan-out** — engines issuing multiple related searches across data sources before composing an answer.
- **GEO / ASO** — Generative Engine Optimization; Agentic Search Optimization (agents taking actions).
- **CrUX** — Chrome User Experience Report; the field-data source for Core Web Vitals.

### 12.2 Ranking-factor-ish checklist (what actually moves rankings)

- Indexable, crawlable, canonical-clean pages (foundation).
- People-first, intent-matching content per cluster.
- Semantic depth: synonyms, related terms, entity coverage, cross-links.
- Visible E-E-A-T: bylines, author pages, About (Who/How/Why), editorial standards.
- Trust: consistent facts, honest dates, attributed sources, first-hand evidence.
- Structured data matching visible text; rich-result eligibility.
- Core Web Vitals green at the 75th percentile, mobile + desktop.
- HTTPS everywhere; mobile-first parity.
- Relevant, authoritative, naturally-velocitied links; anchor-text spread.
- Answer-first formatting: citable sentence in the first 40-100 words.
- Freshness that's real; original research; 3-5 data assets.
- Entity consistency: naming, NAP, Wikidata, sameAs, Knowledge Graph.

### 12.3 Schema speedy reference

| Type | Use on | Why |
|---|---|---|
| Organization | All pages (sitewide) | Base entity; logo, sameAs, NAP |
| Person | Every author | Credentials, links, author entity |
| Article/BlogPosting | Editorial pages | Authorship, honest dates, headline |
| FAQPage | Q&A sections | Primes answer extraction (rich results narrowed for most sites) |
| HowTo | Procedure content | Step/position extraction |
| Product | Commerce pages | Offers, price, availability, ratings — agent fuel |
| Review | Review pages | Author + rating |
| SoftwareApplication | Tool/software pages | "Alternatives to X" queries |
| BreadcrumbList | All pages | Structure + entity context |

Validate with Rich Results Test (Google-specific) + Schema Markup Validator (all types). Markup must match the visible text.

### 12.4 Core Web Vitals targets

- LCP ≤ 2.5s (loading). INP ≤ 200ms (responsiveness). CLS ≤ 0.1 (stability). Measure at the 75th percentile, mobile and desktop, from CrUX.

### 12.5 Key tools

Free: Google Search Console, Google Analytics 4, PageSpeed Insights, Google Keyword Planner, Google Trends, Google Rich Results Test, Schema Markup Validator, Bing Webmaster Tools + IndexNow, Ahrefs Free Keyword Generator, Answer the Public (limited), LLM prompt runbook, `site:` operator, SERP APIs at free tier.

Paid: Ahrefs (Keywords Explorer, Site Explorer, Content Explorer, SERP/AI-Overview trackers, Brand Radar, AI Mode Tracker), Semrush (organic research, AI Visibility Toolkit, Sensor), Moz (Domain Authority), Pitchbox / BuzzStream / GMass (outreach), Hunter.io / Voila Norbert (contacts), SerpApi (SERP snapshots), ScalePost.ai (Perplexity partner analytics).

### 12.6 Do's & don'ts one-liners

- Do fix crawlability before anything else; don't chase links to a site Google can't read.
- Do answer in the first 50-100 words; don't bury answers under preamble.
- Do write self-contained, named-and-dated cited sentences; don't leave orphan pronouns.
- Do use schema that matches visible text; don't markup what isn't on the page.
- Do update dates only when content really changes; don't fake freshness.
- Do publish 3-5 original data assets; don't aggregate others' findings without adding value.
- Do earn relevant links at natural velocity; don't buy, mass-guest-post, or disavow good links.
- Do monitor weekly (GSC + LLM runbook); don't decide strategy from anecdote or rank alone.
- Do diversify across Google, ChatGPT, Perplexity, Copilot, Gemini, Siri; don't bank on any single engine's policy staying put.
- Do refresh decaying pages and 301-consolidate thin ones; don't delete indexed pages in place.
- Do measure relative CTR to same-position peers; don't obsess over the #1 slot on every head term.

---

## Sources & research

https://developers.google.com/search/docs/fundamentals/seo-starter-guide
https://developers.google.com/search/docs/fundamentals/how-search-works
https://developers.google.com/search/docs/fundamentals/creating-helpful-content
https://developers.google.com/search/docs/essentials
https://developers.google.com/search/docs/monitor-debug/search-console-start
https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers
https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
https://developers.google.com/search/docs/appearance/ranking-systems-guide
https://developers.google.com/search/docs/appearance/ai-overviews
https://blog.google/products/search/generative-ai-search/
https://web.dev/articles/vitals
https://ahrefs.com/blog/google-ranking-factors/
https://ahrefs.com/blog/what-is-seo/
https://ahrefs.com/blog/keyword-research/
https://ahrefs.com/blog/on-page-seo/
https://ahrefs.com/blog/link-building/
https://ahrefs.com/blog/digital-pr/
https://ahrefs.com/blog/answer-engine-optimization/
https://backlinko.com/hub/seo/what-is-seo
https://backlinko.com/hub/seo
https://backlinko.com/link-building
https://backlinko.com/chatgpt-for-seo
https://www.semrush.com/blog/what-is-seo/
https://www.semrush.com/blog/answer-engine-optimization/
https://www.searchenginejournal.com/seo-guide/
https://moz.com/beginners-guide-to-seo
https://openai.com/index/introducing-chatgpt-search/
https://www.perplexity.ai/hub/blog/introducing-the-perplexity-publishers-program
https://www.apple.com/newsroom/2024/06/introducing-apple-intelligence-for-iphone-ipad-and-mac/
https://machinelearning.apple.com/research/apple-intelligence-foundation-language-models
https://cloud.google.com/vertex-ai/generative-ai/docs/grounding/overview
https://blogs.bing.com/webmaster/

Note: several secondary sources (Search Engine Journal's "State of AEO & GEO in 2026," Gemini "View sources" UI details, Bing Webmaster Tools help-center specifics, 2025-era Siri web-search expansion, a Forbes piece on Perplexity payouts) could not be fetched during the research pass; no claims in this playbook depend on them.