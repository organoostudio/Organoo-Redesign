/* ===================== DATA (content from the previous Organoo design) ===================== */
const webFeat = [
  ['Mobile-first & responsive', 'Every page designed and tested for phones first, then scaled up.'],
  ['Fast loading', 'Optimized images and lean code so pages open in a blink.'],
  ['SEO-ready', 'Clean structure, meta tags, sitemap and Search Console from day one.'],
  ['Easy to update', 'A simple editor so the team can change text and images without code.']
];
const webMetrics = [['Pages built', '[X]', true], ['Load time', '[X.Xs]'], ['Lighthouse score', '[XX]']];
const webScope = (pages, features) => ({ type: 'scope', pages, features });

const SERVICES = [
  { slug: 'uiux', n: '01', name: 'UI/UX Design', kind: 'uiux', short: 'Intuitive interfaces for mobile apps, websites and dashboards that keep users coming back.',
    chips: ['Mobile & web UI', 'Dashboards', 'Design system', 'Prototype'], pic: 'pelni.webp', light: true,
    h1: 'Interfaces people <em class="s">love</em> to use', lead: 'Intuitive, user-friendly design for mobile apps, websites and dashboards — so users stay longer and get things done faster.', cta: 'Start a design project',
    delivTitle: 'What we <em class="s">design</em>', delivNote: 'From the first sitemap to a clickable prototype your developers can build from.',
    deliv: [['Mobile app UI', 'iOS and Android screens designed around real user tasks.'], ['Website UI', 'Marketing sites and web pages that guide visitors to act.'], ['Dashboard & web app', 'Data-heavy tools made clear, fast and easy to learn.'], ['Information architecture', 'Sitemaps and user flows that make navigation obvious.'], ['Design system', 'Reusable components and styles that keep products consistent.'], ['Interactive prototype', 'Clickable flows to test with users before any code.']],
    steps: [['Research', 'We learn your users, their tasks and where they get stuck today.'], ['Wireframe', 'Low-fidelity layouts and flows to agree on structure fast.'], ['UI design', 'Polished, on-brand screens for every state and device.'], ['Prototype & handoff', 'A clickable prototype plus specs your developers can build from.']],
    projects: ['pelni', 'bank-sampah'], projTitle: 'Recent <em class="s">designs</em>', priceNote: 'Clear starting prices. Final quote depends on the number of screens and flows.', per: '',
    plans: [['Starter', 'For a landing page or a single user flow.', 'Rp [price]', ['Up to [N] screens', 'Wireframe + UI design', 'Mobile & desktop layouts', '[N] revision rounds', 'Design files handoff']], ['Product', 'For a full app or dashboard.', 'Rp [price]', ['Up to [N] screens', 'User flows & sitemap', 'Clickable prototype', 'Component library', 'Developer handoff & specs'], true], ['Design System', 'For teams scaling a product.', 'Rp [price]', ['UI audit of your product', 'Tokens: color, type, spacing', 'Documented component library', 'Usage guidelines', 'Team onboarding session']]],
    faqs: [['What do I receive at the end?', 'Organized design files for every screen, a clickable prototype and handoff specs for your developers.'], ['Can you also build what you design?', 'For websites and web apps, our development team can take it from design to launch. For native apps we hand off to your developers.'], ['How many revisions are included?', 'Each package includes set revision rounds per stage, so feedback stays focused and the timeline stays on track.'], ['Can you redesign our existing app?', 'Yes. We start with a UX audit of your current product, then prioritize the changes with the biggest impact.']],
    ctaWords: ["Let's design", 'something', 'intuitive.'] },
  { slug: 'web', n: '02', name: 'Website Development', kind: 'web', short: 'Fast, SEO-ready websites — from a single landing page to full e-commerce.',
    chips: ['Landing page', 'Company profile', 'E-commerce', 'SEO setup'], pic: 'demos/halden-and-rowe-card.webp', light: true,
    h1: 'Websites that <em class="s">work</em> as hard as you do', lead: 'Fast, SEO-ready websites built to turn visitors into enquiries — from a single landing page to a full online store.', cta: 'Start your website',
    delivTitle: 'What we <em class="s">build</em>', delivNote: 'Every site is mobile-first, fast-loading and set up for Google from day one.',
    deliv: [['Landing page', 'One focused page built to convert ad traffic into leads.'], ['Company profile', 'A credible multi-page home for your business and services.'], ['E-commerce', 'An online store with catalog, cart and payment integration.'], ['Portfolio & personal', 'Showcase your work with a clean, fast personal site.'], ['Wedding & event', 'Invitations, RSVPs and event details in one beautiful page.'], ['SEO & maintenance', 'On-page SEO, speed tuning, updates and backups after launch.']],
    steps: [['Brief & sitemap', 'We map your goals, audience and every page the site needs.'], ['Design', 'High-fidelity designs for desktop and mobile, reviewed with you.'], ['Development', 'Clean, fast code with an easy editor for your team.'], ['Launch & SEO', 'Domain, analytics and Google setup — then we keep improving.']],
    projects: ['lumetric', 'arbor-and-co', 'halden-and-rowe', 'strata-atelier'], projTitle: 'Recent <em class="s">websites</em>', priceNote: 'Clear starting prices. Final quote depends on scope — no hidden costs.', per: '',
    plans: [['Landing Page', 'For campaigns, launches and promos.', 'Rp [price]', ['1 conversion-focused page', 'Mobile-first responsive design', 'WhatsApp & form integration', 'Basic on-page SEO', 'Google Analytics setup']], ['Company Profile', 'For businesses that need credibility.', 'Rp [price]', ['Up to [N] pages', 'Custom design, no templates', 'Blog / news section', 'Full on-page SEO setup', 'Easy content editor', '[N] months of support'], true], ['E-commerce', 'For selling products online.', 'Rp [price]', ['Product catalog & search', 'Cart, checkout & payment gateway', 'Order & stock management', 'Shipping cost integration', 'Training for your team']]],
    faqs: [['Can I edit the website myself?', 'Yes. We set up a simple editor so your team can update text, images and blog posts without touching code.'], ['Is the domain and hosting included?', 'We can handle domain and hosting for you, or deploy to your existing provider. It is listed clearly in your quote.'], ['Will my website show up on Google?', 'Every site ships with on-page SEO, a sitemap and Search Console setup. Ranking takes time — a blog helps a lot.'], ['Do you redesign existing websites?', 'Yes. We audit your current site, keep what works and move your content over without losing your Google rankings.']],
    ctaWords: ["Let's build", 'your next', 'website.'] },
  { slug: 'ads', n: '03', name: 'Google & Meta Ads', kind: 'ads', short: 'Performance campaigns that reach the right people and turn clicks into qualified leads.',
    chips: ['Google Search', 'Meta Ads', 'Lead generation', 'Reporting'], pic: 'google-charts.webp', light: true,
    h1: 'Ads that turn clicks into <em class="s">customers</em>', lead: 'Performance campaigns on Google and Meta that reach the right audience, lower your cost per lead and report every rupiah clearly.', cta: 'Get a free ads audit',
    delivTitle: 'What we <em class="s">manage</em>', delivNote: 'Full-funnel campaign management — from tracking setup to the landing page your ads send people to.',
    deliv: [['Google Search Ads', 'Intent-based keywords that catch people actively looking for you.'], ['Meta Ads', 'Facebook and Instagram campaigns with creatives built to stop the scroll.'], ['Lead & WhatsApp campaigns', 'Lead forms and click-to-chat flows that land in your sales team.'], ['Conversion tracking', 'Pixel, UTM and analytics setup so every result is measurable.'], ['Landing page optimization', 'Better pages behind your ads for a lower cost per lead.'], ['Monthly reporting', 'Spend, reach, leads and cost per result — explained in plain language.']],
    steps: [['Audit & goals', 'We review past campaigns and agree on the KPIs that matter.'], ['Setup & tracking', 'Accounts, pixels, audiences and conversion tracking done right.'], ['Launch & test', 'Multiple creatives and audiences go live to find what converts.'], ['Optimize & report', 'Budget moves to winners; you get a clear report every month.']],
    projects: ['batu-panorama', 'dasindo'], projTitle: 'Campaign <em class="s">results</em>', priceNote: 'Monthly management fee. Your ad budget is paid directly to Google or Meta.', per: '/mo',
    plans: [['Starter', 'One platform, one clear goal.', 'Rp [price]', ['Google or Meta Ads', 'Up to [N] campaigns', 'Conversion tracking setup', '[N] ad creatives / month', 'Monthly report']], ['Growth', 'Google and Meta working together.', 'Rp [price]', ['Google + Meta Ads', 'Up to [N] campaigns', 'A/B testing of creatives', 'Landing page recommendations', 'Monthly report + call'], true], ['Scale', 'For bigger budgets and multiple products.', 'Custom', ['Multi-platform strategy', 'Unlimited campaigns', 'Dedicated ads specialist', 'Custom dashboard', 'Weekly check-ins']]],
    faqs: [['Is the ad budget included in the fee?', 'No. Our fee covers strategy and management; your ad budget is paid directly to Google or Meta, so you always see exactly what was spent.'], ['What is the minimum ad budget?', 'It depends on your market and goals. We recommend a starting budget during the free audit so campaigns have enough data to learn.'], ['How soon will I see results?', 'Campaigns start collecting data right away; the first weeks are for testing, then we scale what performs.'], ['Do I keep access to my ad accounts?', 'Always. Campaigns run on accounts you own, and you can see everything we do.']],
    ctaWords: ["Let's make", 'your ads', 'profitable.'] },
  { slug: 'graphic', n: '04', name: 'Graphic Design', kind: 'graphic', short: 'Brand identities and scroll-stopping creatives that keep your look consistent everywhere.',
    chips: ['Logo & identity', 'Social creatives', 'Print & packaging'], pic: null,
    h1: 'Brands people <em class="s">remember</em>', lead: 'Logos, identities and everyday creatives that keep your brand consistent — on social media, in ads and in print.', cta: 'Start a design brief',
    delivTitle: 'What we <em class="s">create</em>', delivNote: 'Every file delivered print-ready and in the formats your team actually uses.',
    deliv: [['Logo & brand identity', 'A distinctive logo system with colors and typography to match.'], ['Brand guidelines', 'A clear guide so anyone can use your brand the right way.'], ['Social media templates', 'Editable feed and story templates your team can reuse.'], ['Ad creatives', 'Static and motion creatives sized for every ad placement.'], ['Print & packaging', 'Brochures, banners, labels and packaging, print-ready.'], ['Presentation decks', 'Pitch and company decks that look as good as your offer.']],
    steps: [['Brief', 'We learn your brand, audience, competitors and what you need.'], ['Moodboard', 'Visual directions to agree on the feel before designing.'], ['Concepts', 'Design options presented with the thinking behind each one.'], ['Final files', 'Refined design delivered in every format you need.']],
    projects: ['brand-identity'], projTitle: 'Recent <em class="s">work</em>', priceNote: 'Project-based or monthly — pick what fits how often you need design.', per: '',
    plans: [['Creative Pack', 'For one-off campaigns and promos.', 'Rp [price]', ['[N] custom designs', 'Feed, story & ad sizes', 'Source files included', '[N] revision rounds', 'Delivery in [N] days']], ['Brand Identity', 'For new or rebranding businesses.', 'Rp [price]', ['[N] logo concepts', 'Color palette & typography', 'Brand guidelines document', 'Business card & letterhead', 'Social media kit'], true], ['Monthly Design', 'For brands that need design every week.', 'Rp [price]', ['Up to [N] designs / month', 'Priority turnaround', 'Dedicated designer', 'Brand-consistent templates', 'Monthly planning call']]],
    faqs: [['Do I own the final designs?', 'Yes. Once the project is paid, full rights and source files are yours.'], ['What file formats will I receive?', 'Vector files for logos, plus PNG, JPG and PDF — and editable source files for templates.'], ['Can you work with our existing brand?', 'Of course. We follow your guidelines, or help tidy them up if they need it.'], ['How many revisions do I get?', 'Each package includes set revision rounds so feedback stays focused and on schedule.']],
    ctaWords: ["Let's give", 'your brand', 'a face.'] },
  { slug: 'social', n: '05', name: 'Social Media Management', kind: 'social', short: 'Content planning and account management for Instagram and TikTok — consistent, on-brand, on time.',
    chips: ['Content plan', 'Feed & reels', 'Copywriting', 'Monthly insights'], pic: null,
    h1: 'Content that <em class="s">grows</em> your brand', lead: 'We plan, design, write and publish your Instagram and TikTok content every month — so you stay consistent without the daily stress.', cta: 'Grow my social media',
    delivTitle: 'What we <em class="s">handle</em>', delivNote: 'Everything from strategy to posting — you just approve the calendar.',
    deliv: [['Content strategy', 'Content pillars and tone of voice built around your audience.'], ['Monthly content calendar', 'A full month planned ahead and approved by you.'], ['Feed design & reels', 'On-brand posts, carousels, stories and short videos.'], ['Copywriting & captions', 'Captions and hashtags written to spark engagement.'], ['Community management', 'Replies to comments and DMs so no customer is ignored.'], ['Monthly insights', 'Reach, engagement and growth — with what to do next.']],
    steps: [['Strategy', 'We audit your accounts and competitors, then set goals and pillars.'], ['Content plan', 'A monthly calendar of topics and formats for your approval.'], ['Production', 'Design, copy and video produced in batches, on brand.'], ['Publish & report', 'We post on schedule and report what worked each month.']],
    projects: ['social-brand'], projTitle: 'Accounts we <em class="s">manage</em>', priceNote: 'Monthly plans — upgrade or adjust as your brand grows.', per: '/mo',
    plans: [['Basic', 'Stay consistent on one platform.', 'Rp [price]', ['1 platform', '[N] feed posts / month', '[N] stories / month', 'Captions & hashtags', 'Monthly report']], ['Growth', 'Build an audience on Instagram and TikTok.', 'Rp [price]', ['2 platforms', '[N] posts + [N] reels / month', 'Content strategy & pillars', 'Community management', 'Monthly insights call'], true], ['Premium', 'Full-service content for active brands.', 'Rp [price]', ['Multi-platform', '[N]+ content pieces / month', 'Photo / video shoot days', 'Influencer coordination', 'Weekly reporting']]],
    faqs: [['Do I need to provide photos?', 'Existing product photos help, but we can design with graphics or plan a shoot day in higher plans.'], ['Do I approve content before it goes live?', 'Yes. You review the monthly calendar first, and nothing is published without your approval.'], ['Can you also run ads for our posts?', 'Yes. Social management pairs well with our Meta Ads service to boost your best-performing content.'], ['Is there a minimum contract?', 'Plans are monthly. We recommend at least three months to see real growth trends.']],
    ctaWords: ["Let's make", 'your feed', 'work.'] }
];
const svcBySlug = Object.fromEntries(SERVICES.map(s => [s.slug, s]));

const PROJECTS = [
  { slug: 'pelni', svc: 'uiux', service: 'UI/UX Design', title: 'PT Pelni — Pelni Docs', h1: 'Pelni <em class="s">Docs</em>', sub: 'Document checker · Mobile app', img: 'pelni.webp', light: true, tags: ['UI/UX', 'Mobile app', 'State-owned'],
    lead: 'A document checker app for PT Pelni (Persero) — turning document verification into a clear, step-by-step flow with checkers and an approver.',
    meta: [['Client', 'PT Pelni (Persero)'], ['Industry', 'Maritime transport'], ['Service', 'UI/UX Design'], ['Platform', 'Mobile app'], ['Year', '[Year]']],
    blocks: [{ type: 'overview', items: [['The client', "PT Pelni (Persero) is Indonesia's state-owned passenger shipping company, operating routes across the archipelago."], ['The challenge', 'Checking required documents involved several people, and it was hard to see who had checked what. [Add specific context.]'], ['Our approach', 'A checklist-first mobile flow with clear roles, a status for every item and one approver who signs off at the end.']] },
      { type: 'devices', img: 'pelni.webp' },
      { type: 'flow', title: 'The core <em class="s">flow</em>', items: [['Open a document set', 'See every required document and its status at a glance.'], ['Check item by item', 'Each checker marks their step, with notes where needed.'], ['Track progress', 'A clear timeline shows who checked what, and when.'], ['Approve', 'The approver reviews everything and signs off in one tap.']] },
      { type: 'gallery', lead: 'uiux.webp', items: ['[Wireframes / user flow]', '[Component library]'] },
      { type: 'metrics', items: [['Screens designed', '[XX]', true], ['User roles', '[X]'], ['Deliverables', 'Flows · UI · Prototype']] }, { type: 'quote' }] },
  { slug: 'batu-panorama', svc: 'ads', service: 'Meta Ads', title: 'Batu Panorama Residence', h1: 'Batu Panorama <em class="s">Residence</em>', sub: 'PT. Artiland Group · 1,200+ conversions', img: 'meta-table.webp', light: true, wide: true, tags: ['Meta Ads', 'Property', '1,200+ conversions'],
    lead: 'How we turned scattered ad spend into a steady flow of website leads and WhatsApp conversations for a growing property developer in Batu.',
    meta: [['Client', 'PT. Artiland Group'], ['Industry', 'Property development'], ['Platform', 'Meta Ads'], ['Objective', 'Website leads + WhatsApp']],
    blocks: [{ type: 'metrics', items: [['Total conversions', '1,200+', true], ['Website leads', '+97.76%'], ['Impressions', '+91.65%'], ['Click-through rate', '+22.63%']] },
      { type: 'strip', items: [['609K', 'accounts reached'], ['1.64M', 'impressions'], ['1.02%', 'average CTR'], ['Rp52.6M', 'ad spend managed']] },
      { type: 'dashboard', title: 'Campaign results', note: 'Source: Meta Ads Manager · 50 campaigns', img: 'meta-table.webp' },
      { type: 'story', items: [['Objective', 'Generate a healthy mix of website leads and WhatsApp conversations through Meta Ads — expanding reach while keeping cost per result under control.'], ['Challenge', 'CTR swung between 0.42% and 1.14% across ad sets, and messaging campaigns ran at a high cost per result — up to Rp43,314 — dragging down overall efficiency.'], ['Solution', ['Doubled down on high-converting creatives for website leads and sharpened CTA copy for messaging.', 'Rebalanced budget between lead-form and WhatsApp objectives.', 'Tracked CPC and CTR per creative to decide what to optimize or reallocate.', 'Tuned ad frequency to avoid audience fatigue.']], ['Result', '1,200+ total conversions with a healthy 1.02% CTR and especially strong website-lead performance. Messaging campaigns delivered at a higher cost — our clear next lever for the following phase.']] }] },
  { slug: 'dasindo', svc: 'ads', service: 'Google Ads', title: 'PT. Dasindo Media', h1: 'Dasindo <em class="s">Media</em>', sub: 'Dale Carnegie Training · 11× ROAS', img: 'google-charts.webp', light: true, wide: true, tags: ['Google Ads', 'Training', '11× ROAS'],
    lead: 'Qualified leads for Dale Carnegie Training through Google Search Ads — at an 11× return on ad spend.',
    meta: [['Client', 'PT. Dasindo Media'], ['Brand', 'Dale Carnegie Training'], ['Platform', 'Google Search Ads'], ['Objective', 'Lead form submissions']],
    blocks: [{ type: 'metrics', items: [['Return on ad spend', '11×', true], ['Lead forms submitted', '100+'], ['Impressions', '68.6K'], ['Peak click-through rate', '6.54%']] },
      { type: 'dashboard', title: 'Two campaign periods', note: 'Source: Google Ads · period-over-period', img: 'google-charts.webp' },
      { type: 'story', items: [['Objective', 'Generate qualified leads by sending targeted Google Search traffic to a lead form — while keeping costs efficient and conversion potential high.'], ['Challenge', 'Previous campaigns brought low-quality traffic at a high cost per click, so few visitors became leads and a lot of budget was wasted.'], ['Solution', ['Intent-based keyword targeting to reach people ready to enrol.', 'Refined geo-targeting to the areas that matter.', 'Rewritten ad copy focused on outcomes, not features.', 'UTM tracking so every lead is traced to its keyword.', 'Improved landing page UX for higher form completion.', 'Restructured funnel with smarter budget allocation.']], ['Result', 'Sharper targeting, the right tracking and ongoing optimization delivered 100+ lead forms and an 11× return on ad spend.']] }] },
  { slug: 'bank-sampah', svc: 'uiux', service: 'UI/UX Design', title: 'Bank Sampah Ki Ageng Senggurun', h1: 'Bank Sampah <em class="s">dashboard</em>', sub: 'Waste bank · Admin dashboard', img: 'banksampah.webp', light: true, tags: ['UI/UX', 'Dashboard', 'Community'],
    lead: 'An admin dashboard for a community waste bank — members, waste deposits and transactions in one clear view.',
    meta: [['Client', 'Bank Sampah Ki Ageng Senggurun'], ['Industry', 'Community / environment'], ['Service', 'UI/UX Design'], ['Platform', 'Web dashboard'], ['Year', '[Year]']],
    blocks: [{ type: 'overview', items: [['The client', 'A community waste bank where members deposit sorted waste and build savings. [Add details.]'], ['The challenge', 'Member, waste and transaction records needed to be easy to manage for a small admin team. [Add specifics.]'], ['Our approach', 'A calm dashboard with key totals on top and the latest members, waste deposits and transactions right below.']] },
      { type: 'devices', img: 'banksampah.webp', desk: true },
      { type: 'flow', title: 'Key <em class="s">screens</em>', items: [['Overview', 'Totals for members, pickups and waste collected at a glance.'], ['Members', 'Register and manage waste bank members.'], ['Waste deposits', 'Record waste by type and weight.'], ['Transactions', "Track every member's balance and history."]] },
      { type: 'gallery', items: ['[Dashboard full screen]', '[Member detail]', '[Transaction history]'] }, { type: 'quote' }] },
  { slug: 'brand-identity', svc: 'graphic', service: 'Graphic Design', title: '[Brand name]', h1: '[Brand name] <em class="s">identity</em>', sub: 'Brand identity · Logo & guidelines', img: null, tags: ['Graphic', 'Identity', 'Guidelines'],
    lead: 'A complete brand identity for [Brand name] — logo, colors, typography and the templates that bring it to life every day.',
    meta: [['Client', '[Brand name]'], ['Industry', '[Industry]'], ['Service', 'Graphic Design'], ['Deliverables', 'Logo · Guidelines · Social kit'], ['Year', '[Year]']],
    blocks: [{ type: 'overview', items: [['The client', '[Who the brand is, what it sells and who it sells to.]'], ['The challenge', '[Why they needed a new identity.]'], ['The idea', '[The concept behind the logo and visual language.]']] }, { type: 'brand' },
      { type: 'gallery', items: ['[Packaging mockup]', '[Business card]', '[Social posts]'] }, { type: 'quote' }] },
  { slug: 'social-brand', svc: 'social', service: 'Social Media', title: '[Brand name]', h1: '[Brand name] <em class="s">on social</em>', sub: 'Instagram & TikTok · Monthly management', img: null, tags: ['Social', 'Instagram', 'TikTok'],
    lead: 'Monthly Instagram and TikTok management for [Brand name] — from content strategy to posting and reporting.',
    meta: [['Client', '[Brand name]'], ['Industry', '[Industry]'], ['Platforms', 'Instagram · TikTok'], ['Service', 'Social Media Management'], ['Period', '[Month Year – Month Year]']],
    blocks: [{ type: 'metrics', items: [['New followers', '[+X]', true], ['Reach growth', '[+X%]'], ['Engagement rate', '[X%]'], ['Content published', '[XX]']] },
      { type: 'overview', items: [['The client', '[Who the brand is and who follows them.]'], ['The challenge', '[e.g. irregular posting, low engagement, no clear visual style.]'], ['Our approach', 'Clear content pillars, a consistent visual system and a monthly calendar the client approves before anything goes live.']] },
      { type: 'social' }, { type: 'quote' }] }
];
/* ---------- concept demos: live sites served from /demos/<slug>/, synced from organoostudio/Dummy-Project at build ---------- */
const demo = o => ({ svc: 'web', cat: 'concept', service: 'Concept · Live demo', img: `demos/${o.slug}-card.webp`, full: true, demo: `/demos/${o.slug}/`, ...o,
  tags: ['Concept', o.category, 'Live demo'],
  meta: [['Client', o.client || 'Concept — fictional brand'], ['Category', o.category], ['Type', 'Concept project'], ['Year', '2026'], ['Live demo', `organoostudio.com/demos/${o.slug}`]],
  blocks: [{ type: 'shots', slug: o.slug, title: o.title }, { type: 'overview', items: o.overview }, { type: 'scope', pages: o.pages, features: o.features, tech: o.tech || 'HTML, CSS, vanilla JavaScript · fully client-side' }] });
const DEMOS = [
    demo({ slug: 'lumetric', title: 'Lumetric', h1: 'Lumetric <em class="s">analytics</em>', sub: 'Marketing analytics SaaS · Landing + dashboard', bg: '#1E0C33', category: 'SaaS · Marketing analytics',
      lead: 'A concept SaaS for marketing attribution: a landing page that sells the product and a full dashboard app behind it, with demo data you can click through.',
      overview: [['The brief', 'Show how we design a classic SaaS: a marketing site that converts and an app that feels real from the first click.'], ['The idea', 'One revenue model across ad spend, store orders and CRM deals, told with a bold magenta palette and clear data.'], ['What to try', 'Switch attribution models, run the ROI calculator, open the dashboard and flip to dark mode.']],
      pages: ['Landing', 'Pricing', 'Integrations', 'Login & signup', 'Dashboard', 'Payments', 'Customers', 'Analytics', 'Invoices', 'Automation'],
      features: [['Attribution switcher', 'Change the model and watch the numbers update.'], ['Pricing calculator', 'Monthly/annual, three currencies and a seat slider.'], ['Full dashboard app', 'Eleven app pages with tables, charts and filters.'], ['Command palette', 'Ctrl/Cmd + K to jump anywhere, plus dark mode.']] }),
    demo({ slug: 'tandem', title: 'Tandem', h1: 'Tandem <em class="s">AI CRM</em>', sub: 'AI-native CRM · Landing + app', bg: '#0B2226', category: 'AI product · CRM',
      lead: 'A concept AI-native CRM for studios that sell abroad: ask questions in plain language, draft replies in your own voice and see where revenue is heading.',
      overview: [['The brief', 'Design an AI product that feels useful, not gimmicky, with AI features woven into everyday CRM work.'], ['The idea', 'Teal and coral, a serif accent and an “Ask Tandem” box that streams answers from the demo data.'], ['What to try', 'Ask a question on the landing page, drag cards on the project board and try Smart Reply in the inbox.']],
      pages: ['Landing', 'Pricing', 'Overview', 'Clients', 'Projects', 'Inbox', 'Analytics'],
      features: [['Ask Tandem', 'Streaming answers generated from demo data (rule-based, no API).'], ['Smart Reply', 'Drafts replies in different tones.'], ['Kanban board', 'Drag-and-drop projects between stages.'], ['AI pricing', 'A credit slider shows the cost of AI usage.']] }),
    demo({ slug: 'stockroom', title: 'Stockroom', h1: 'Stock<em class="s">room</em>', sub: 'E-commerce SaaS · Landing + admin', bg: '#0C1D1A', category: 'SaaS · E-commerce analytics',
      lead: 'A concept dashboard for online sellers: orders, inventory, payouts and ad spend from every channel in one calm view.',
      overview: [['The brief', 'An admin tool for brands that sell on several marketplaces at once.'], ['The idea', 'Sea-glass greens and navy, a margin calculator on the landing page and a dashboard that customises itself.'], ['What to try', 'Run the fees calculator, customise dashboard widgets, fulfil an order and add a discount code.']],
      pages: ['Landing', 'Pricing', 'Integrations', 'Dashboard', 'Customers', 'Orders', 'Products', 'Transactions', 'Goals', 'Sales', 'Marketing'],
      features: [['Margin calculator', 'See how fees and returns eat into revenue.'], ['Custom widgets', 'Show, hide and reorder dashboard cards.'], ['Order actions', 'Fulfil, refund and create orders.'], ['Product CRUD', 'Bulk actions and stock levels.']] }),
    demo({ slug: 'arbor-and-co', title: 'Arbor & Co.', h1: 'Arbor <em class="s">& Co.</em>', sub: 'DTC furniture · Online store', bg: '#1A1715', category: 'E-commerce · Furniture',
      lead: 'A concept direct-to-consumer furniture store with an editorial feel: shop-the-look hero, filters, product pages, cart and a three-step checkout.',
      overview: [['The brief', 'A Shopify-style storefront that feels like a magazine, not a catalogue.'], ['The idea', 'Rotating room “looks” with hotspots you can shop, warm oak and terracotta accents and real photography.'], ['What to try', 'Add the look to your cart, apply code WELCOME30 and go through checkout.']],
      pages: ['Home', 'Shop', 'Product', 'Cart', 'Checkout', 'Our story', 'Showrooms', 'Delivery'],
      features: [['Shop the look', 'Hotspots on the hero photo add items to the cart.'], ['Smart filters', 'Category, price and colour, with sorting.'], ['Delivery estimate', 'Dates by US ZIP or Australian postcode.'], ['Checkout flow', 'Discount codes, validation and an order confirmation.']] }),
    demo({ slug: 'sangkarloka', title: 'Sangkarloka', h1: 'Sangkar<em class="s">loka</em>', sub: 'Mini plant house · Online store', bg: '#1F3310', category: 'E-commerce · Plants', client: 'Sangkarloka (Organoo’s own brand)',
      lead: 'A store concept for Sangkarloka, our own mini succulent and cactus brand: a plant-shelf hero, a plant-match quiz and a checkout built for Indonesia.',
      overview: [['The brief', 'Give a small plant brand a shop that feels as friendly as its products, in Bahasa Indonesia with an English toggle.'], ['The idea', 'The logo’s two greens, cut-out plants on a shelf and a sentence-builder quiz instead of a form.'], ['What to try', 'Finish the plant-match sentence, add gift wrap and check out with JNE, SiCepat or GoSend.']],
      pages: ['Beranda', 'Katalog', 'Produk', 'Cerita', 'Keranjang', 'Checkout'],
      features: [['Plant match', 'A sentence builder that recommends the right plant.'], ['Gift wrapping', 'Live preview of the “Just For You” card.'], ['Care guide', 'Tabs with a watering calculator.'], ['Local checkout', 'Couriers, BCA VA, QRIS and COD by city.']] }),
    demo({ slug: 'halden-and-rowe', title: 'Halden & Rowe', h1: 'Halden <em class="s">& Rowe</em>', sub: 'Wealth & business advisory · Company profile', bg: '#0A1438', category: 'Professional services',
      lead: 'A concept company profile for an advisory firm: credible and premium, with lots of motion and a booking flow that works end to end.',
      overview: [['The brief', 'The “compro” that sells best — for law, accounting, consulting and financial firms — but bright and alive.'], ['The idea', 'Cobalt and citrus, a serif headline with an inline photo pill, and scroll effects in every section.'], ['What to try', 'Scroll the pinned services, play with the planning calculator and book a consultation.']],
      pages: ['Home', 'Services', '6 service pages', 'Advisors', 'Insights', '4 articles', 'Book a consultation'],
      features: [['Planning calculator', 'Sliders feed an animated projection chart.'], ['Booking wizard', 'Service, advisor, format and time zone-aware slots.'], ['Advisor profiles', 'Filters and modals with next free slot.'], ['Scroll motion', 'Pinned horizontal services and stacking cards.']] }),
    demo({ slug: 'forma', title: 'FORMA', h1: 'FORMA <em class="s">club</em>', sub: 'Fitness & recovery club · Website + QR check-in', bg: '#161616', category: 'Healthcare & wellness',
      lead: 'A concept fitness and recovery club with a working QR attendance system: a member card that refreshes every 30 seconds, a front-desk scanner and an admin dashboard.',
      overview: [['The brief', 'Booking and service pages for a wellness brand, plus a daily attendance system that stops card sharing at the door.'], ['The idea', 'Black, white and lime, expanded type and a phone that becomes your key.'], ['What to try', 'Open the member card, simulate a scan (even a screenshot) and watch it appear in the admin feed.']],
      pages: ['Home', 'Classes', 'Coaches', 'Memberships', 'Recovery', 'Journal', 'Join', 'Member card', 'Scanner', 'Admin'],
      features: [['Rotating QR', 'Signed codes that expire, written from scratch.'], ['Anti-fraud rules', 'Catches screenshots, double entries and expired plans.'], ['Class schedule', 'Two clubs, filters and booking.'], ['Admin dashboard', 'Live feed, charts, members and CSV export.']] }),
    demo({ slug: 'aurelle-estates', title: 'Aurelle Estates', h1: 'Aurelle <em class="s">Estates</em>', sub: 'Real estate & developments · Listings site', bg: '#141518', category: 'Real estate',
      lead: 'A concept for an agency and developer selling luxury homes in Sydney, Los Angeles and Lisbon: listings, filters, a map and live development availability.',
      overview: [['The brief', 'Show off luxury visuals while keeping search, filters and maps genuinely useful.'], ['The idea', 'Ivory and ember with a Didone serif, a zooming hero and floating price cards.'], ['What to try', 'Filter homes, compare three listings, run the mortgage calculator and reserve a residence.']],
      pages: ['Home', 'Buy', 'Rent', 'New developments', 'Property', 'Development', 'Sell / valuation', 'Agents', 'Saved'],
      features: [['Listings & map', 'Grid, split and map views with filters.'], ['Compare', 'Up to three homes side by side.'], ['Mortgage calculator', 'Donut chart that updates live.'], ['Availability grid', 'Reserve units in a development.']] }),
    demo({ slug: 'strata-atelier', title: 'Strata Atelier', h1: 'Strata <em class="s">Atelier</em>', sub: 'Architecture & 3D studio · Award-style site', bg: '#121316', category: 'Architecture & interiors',
      lead: 'An award-style concept for an architecture studio, built around cinematic 3D: scroll and a house builds itself from site lines to a lit dusk scene.',
      overview: [['The brief', 'Experiment freely, Awwwards-style, with property shown as a cinematic 3D object.'], ['The idea', 'Six buildings generated in code with three.js: sun studies, section cuts, exploded floors and a massing lab.'], ['What to try', 'Scroll the home page, drag the model, move the sun to dusk and shape your own house in the Lab.']],
      pages: ['Home', 'Work', '6 project pages', 'Massing Lab', 'Studio', 'Journal', 'Start a project'],
      features: [['Cinematic scroll', 'Site → structure → envelope → light → landscape.'], ['Live 3D viewer', 'Sun, section cut, explode and camera presets.'], ['Massing Lab', 'A parametric house with live area, cost and carbon.'], ['PNG stills', 'Save a render of any view.']], tech: 'three.js (WebGL), HTML, CSS, JavaScript · fully client-side' }),
];
PROJECTS.push(...DEMOS);
const projBySlug = Object.fromEntries(PROJECTS.map(p => [p.slug, p]));
/* cases shown in the home TV viewer (real imagery only) */
const SHOWCASE = ['lumetric', 'pelni', 'dasindo', 'arbor-and-co', 'batu-panorama', 'halden-and-rowe', 'bank-sampah', 'strata-atelier', 'sangkarloka'];

const g = (x, y, a) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(31,174,94,${a}), transparent 62%)`;
const POSTS = [
  { slug: 'landing-vs-profile', cat: 'Website', word: 'Landing <em class="s">vs</em> Profile', title: 'Landing page vs company profile: which one does your business need?', time: '6 min read', glow: g(30, 110, .7), excerpt: 'Both are "websites", but they do very different jobs. Here\'s how to choose based on your goal, budget and where your traffic comes from.' },
  { slug: 'website-cost', cat: 'Website', word: 'Budget', title: 'How much does a website cost in Indonesia in 2026?', time: '8 min read', glow: g(80, 110, .6), excerpt: 'What actually drives the price of a website — and how to scope one so you pay for what moves the needle.' },
  { slug: 'google-vs-meta', cat: 'Ads', word: 'Google <em class="s">vs</em> Meta', title: 'Google Ads vs Meta Ads: where should local businesses spend first?', time: '7 min read', glow: g(20, 100, .55), excerpt: 'Intent vs discovery: a simple way to decide where your first rupiah of ad budget should go.' },
  { slug: 'losing-customers', cat: 'Website', word: '5 signs', title: '5 signs your website is quietly losing you customers', time: '5 min read', glow: g(50, 120, .6), excerpt: 'Slow pages, buried contact buttons and three other leaks we see on almost every audit.' },
  { slug: 'what-is-uiux', cat: 'UI/UX', word: 'Usability', title: 'What is UI/UX design — and why does it affect sales?', time: '6 min read', glow: g(90, 40, .5), excerpt: 'Good UX is invisible. Bad UX shows up in your conversion rate. Here\'s the link.' },
  { slug: 'content-calendar', cat: 'Social Media', word: 'Calendar', title: 'An Instagram content calendar you will actually stick to', time: '6 min read', glow: g(10, 20, .5), excerpt: 'A lightweight monthly system for planning, batching and publishing without the daily scramble.' },
  { slug: 'brand-consistency', cat: 'Design', word: 'Consistency', title: 'Brand consistency: why a logo alone is not enough', time: '4 min read', glow: g(60, 0, .5), excerpt: 'Colors, type, tone and templates — the quiet system that makes a brand recognizable.' }
];
const postBySlug = Object.fromEntries(POSTS.map(p => [p.slug, p]));

const CLIENTS = [['PUPR', 'font-weight:800;letter-spacing:.08em'], ['PT PELNI', 'font-weight:800'], ['Cazmilk', 'font-weight:300;font-style:italic'], ['JWAHER', 'font-weight:800;letter-spacing:.24em;font-size:.82em'], ['WP Malang', 'font-weight:600'], ['Dasindo Media', 'font-family:var(--mono);font-weight:500;font-size:.8em'], ['Artiland Group', 'font-weight:300'], ['Dale Carnegie', 'font-weight:500']];

const TEAM = [
  ['Radiyyan Ghifari', 'RG', ['Founder', 'Creative Director', 'Strategy']],
  ['[Name]', 'PD', ['Product Designer', 'UI/UX', 'Design systems']],
  ['[Name]', 'WD', ['Web Developer', 'Frontend', 'CMS']],
  ['[Name]', 'AS', ['Ads Specialist', 'Google & Meta', 'Analytics']],
  ['[Name]', 'BD', ['Brand Designer', 'Identity', 'Print']],
  ['[Name]', 'CS', ['Content Strategist', 'Social', 'Copy']]
];

const PROCESS = [
  ['01', 'Discover', 'We dig into your business, audience and competitors to find the one problem worth solving first.', ['Workshop', 'Audit', '1 week'], 'uiux.webp', true],
  ['02', 'Strategy', 'A clear plan with goals, KPIs, sitemap or campaign structure — agreed before anything is designed.', ['Roadmap', 'KPIs', 'Sitemap'], 'google-charts.webp', true],
  ['03', 'Design', 'On-brand interfaces and creatives, reviewed with you at every milestone.', ['UI', 'Brand', 'Prototype'], 'pelni.webp', true],
  ['04', 'Build', 'Fast, clean builds and campaign setups with tracking done right from day one.', ['Development', 'Tracking', 'QA'], 'demos/stockroom-desktop.webp', true],
  ['05', 'Grow', 'We launch, measure and keep improving — budget and effort move to what works.', ['Launch', 'Optimize', 'Report'], 'meta-table.webp', true]
];

/* items floating in the 3D flythrough hero: [kind, src/label, x(vw), y(vh), z(px), extra] */
const FLY = [
  ['shot', 'demos/lumetric-card.webp', -30, -14, -350],
  ['card', 'pelni.webp', 28, -18, -700],
  ['chip', ['1,200+', 'conversions', 'Batu Panorama'], -16, 22, -520],
  ['shot', 'demos/arbor-and-co-card.webp', 32, 20, -1050],
  ['chrome', '', -2, -4, -1400],
  ['card', 'banksampah.webp', -34, 16, -1250],
  ['chip', ['11×', 'ROAS', 'Dale Carnegie'], 18, -26, -1500],
  ['shot', 'demos/halden-and-rowe-card.webp', -26, -24, -1800],
  ['wide', 'google-charts.webp', 26, 26, -1950],
  ['shot', 'demos/strata-atelier-card.webp', 30, -6, -2300],
  ['card', 'uiux.webp', -30, 4, -2450],
  ['chip', ['+97.8%', 'website leads', 'after optimization'], -6, 30, -2200],
  ['shot', 'demos/sangkarloka-card.webp', 4, -30, -2700]
];
