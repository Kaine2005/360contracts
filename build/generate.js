/* ==========================================================================
   360 Contracts — static site generator
   Run:  node build/generate.js
   Emits plain static HTML (index.html, services.html, /services/*.html,
   work.html, reviews.html, areas.html, contact.html) + sitemap.xml + robots.txt.
   No build step needed to deploy — just upload the HTML. This only keeps the
   ~18 pages consistent (shared nav / footer / SEO head).
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

/* -------------------------------------------------------------- site config */
const SITE = {
  name: '360 Contracts',
  domain: 'https://360-contracts.com',
  phone: '07824 347377',
  phoneRaw: '07824347377',
  email: 'info@360-contracts.com',
  areaLine: 'Arbroath · Dundee · Angus · Aberdeen',
  addressTown: 'Arbroath',
  region: 'Angus',
  postcode: 'DD11',
  builder: { name: 'CopyByKaine', url: 'https://copybykaine.com/' }
};

/* -------------------------------------------------------------------- icons */
const IC = {
  building: '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 11h.01M15 11h.01"/>',
  monoblocking: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  slabbing: '<path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  landscaping: '<path d="M12 2s7 6 7 12a7 7 0 0 1-14 0c0-6 7-12 7-12z"/><path d="M12 22V12"/>',
  'new-builds': '<path d="M3 21h18M5 21v-9h5v9M14 21V7h5v14M6 12V9M8 12V9"/>',
  'digger-work': '<path d="M3 18h4l2-6 4 3h6M7 18v3M3 18v3M13 6l3-2 4 2v3l-4 2-3-2z"/><circle cx="6" cy="21" r="1"/>',
  stonework: '<rect x="3" y="4" width="6" height="6"/><rect x="12" y="4" width="9" height="6"/><rect x="3" y="14" width="9" height="6"/><rect x="15" y="14" width="6" height="6"/>',
  drainage: '<path d="M4 4v6a8 8 0 0 0 8 8 8 8 0 0 0 8-8V4M12 18v3M9 21h6"/>',
  tarmac: '<path d="M3 17h18M3 17l3-9h12l3 9M9 8v9M15 8v9"/>',
  fencing: '<path d="M3 21V8l3-2 3 2v13M15 21V8l3-2 3 2v13M3 12h6M15 12h6M9 21h6"/>',
  extensions: '<path d="M4 20h16M6 20V10l6-5 6 5v10M9 20v-5h6v5"/>'
};
const svc_ic = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg>`;

const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
const phoneIc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
const mailIc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>';
const star = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15 9 22 9.3 17 14 18.5 21 12 17.3 5.5 21 7 14 2 9.3 9 9"/></svg>';
const stars5 = `<div class="stars" aria-label="5 out of 5 stars">${star.repeat(5)}</div>`;

/* ----------------------------------------------------------------- services */
const SERVICES = [
  {
    slug: 'building', title: 'Building Services', num: '01', icon: 'building',
    img: 'commercial-paving.jpg',
    short: 'General building work from foundations to final finish, planned and managed by one team.',
    meta: 'General building contractor in Arbroath, Angus & Tayside. 360 Contracts handles building work from foundations to finish — one team, one point of contact.',
    lead: 'Whatever the job needs, we build it. 360 Contracts covers general building work across Arbroath, Dundee, Angus and up to Aberdeen, with every trade supplied and project-managed under one roof.',
    body: [
      { h: 'Building work, handled properly', p: 'From foundations to the final finish, we plan, price and manage the whole job so you deal with one team instead of chasing three or four separate contractors. Clear timelines, tidy sites and a standard we stand behind.' },
      { h: "What's involved", list: ['Foundations, groundwork and structural work', 'Blockwork, brickwork and rendering', 'Alterations, knock-throughs and repairs', 'Full project management and one point of contact', 'Finished on time, on budget and signed off'] }
    ]
  },
  {
    slug: 'monoblocking', title: 'Monoblocking', num: '02', icon: 'monoblocking',
    img: 'driveway-block.jpg',
    short: 'Block-paved driveways and paths laid dead level, edged and finished to last for decades.',
    meta: 'Monoblock driveways in Arbroath, Dundee & Angus. Block paving laid dead level on a proper sub-base, edged and finished to last. Free quotes from 360 Contracts.',
    lead: 'Block-paved driveways and paths laid dead level on a proper sub-base, edged sharp and finished to last for decades. Serving Arbroath, Dundee, Angus and Aberdeen.',
    body: [
      { h: 'Driveways done right from the ground up', p: 'A monoblock drive is only as good as what goes underneath it. We excavate to the right depth, lay and compact a proper sub-base, then set the blocks level with clean lines and solid edge restraints so nothing shifts or sinks.' },
      { h: "What's involved", list: ['Excavation and full sub-base preparation', 'Block paving in your choice of colour and pattern', 'Solid edge courses and kerbing', 'Drainage and levels sorted so water runs away', 'Kiln-dried sand, compacted and finished'] }
    ]
  },
  {
    slug: 'slabbing', title: 'Slabbing & Patios', num: '03', icon: 'slabbing',
    img: 'porcelain-patio.jpg',
    short: 'Porcelain and natural stone patios that turn a back garden into a proper outdoor room.',
    meta: 'Patios & slabbing in Angus and Tayside. Porcelain and natural stone patios laid level with clean joints by 360 Contracts. Free quotes across Arbroath to Aberdeen.',
    lead: 'Porcelain and natural stone patios that turn a back garden into a proper outdoor room. Laid level, jointed clean and built to last.',
    body: [
      { h: 'Patios that lift the whole garden', p: 'Porcelain, Indian sandstone or natural stone — laid on a full mortar bed with the right falls so water drains away, pointed neatly and finished to a standard you will actually want to show off.' },
      { h: "What's involved", list: ['Porcelain, sandstone and natural stone patios', 'Full mortar bed with correct falls and drainage', 'Neat pointing and clean, consistent joints', 'Steps, edging and feature borders', 'Sealed and finished ready to use'] }
    ]
  },
  {
    slug: 'landscaping', title: 'Landscaping', num: '04', icon: 'landscaping',
    img: 'landscaping-after.jpg',
    short: 'Full garden transformations: levels, lawns, artificial grass, planting and features.',
    meta: 'Garden landscaping in Arbroath, Angus & Tayside. Full garden transformations — levels, lawns, artificial grass, patios and features by 360 Contracts.',
    lead: 'Full garden transformations from one team — levels, lawns, artificial grass, planting and features, all handled start to finish.',
    body: [
      { h: 'Your whole garden, one team', p: 'We take gardens from tired and uneven to finished outdoor spaces — reworking levels, building patios and paths, laying real or artificial lawn and pulling it all together so it works as one space.' },
      { h: "What's involved", list: ['Garden design, levelling and groundwork', 'Artificial grass and real turf', 'Patios, paths and retaining walls', 'Planting beds, borders and features', 'Fencing, screening and lighting'] }
    ]
  },
  {
    slug: 'new-builds', title: 'New Builds', num: '05', icon: 'new-builds',
    img: 'commercial-paving.jpg',
    short: 'Ground-up builds handled from the first dig to the keys, on time and built to spec.',
    meta: 'New build construction in Angus & Tayside. Ground-up builds handled from first dig to handover by 360 Contracts. One team, every trade, built to spec.',
    lead: 'Ground-up builds handled from the first dig to the keys — on time, built to spec and managed by one team the whole way.',
    body: [
      { h: 'From bare plot to handover', p: 'We take new builds through every stage — groundwork, foundations, structure, trades and finish — coordinating each trade so the job runs to programme without you having to chase anyone.' },
      { h: "What's involved", list: ['Site clearance, groundwork and foundations', 'Structural build and blockwork', 'Every trade supplied and coordinated', 'Full project management to programme', 'Finished, snagged and handed over'] }
    ]
  },
  {
    slug: 'digger-work', title: 'Digger Work', num: '06', icon: 'digger-work',
    img: 'driveway-mono.jpg',
    short: 'Excavation, site clearance and groundwork with our own plant and experienced operators.',
    meta: 'Digger hire with operator & groundwork in Angus and Tayside. Excavation, site clearance and muck-away by 360 Contracts. Free quotes Arbroath to Aberdeen.',
    lead: 'Excavation, site clearance and groundwork with our own plant and experienced operators. No waiting on a third party.',
    body: [
      { h: 'Groundwork with our own machines', p: 'Because we run our own diggers and operators, the groundwork stage never holds a job up. Digging out, grading, trenching or clearing a site — it gets done quickly, accurately and tidied up after.' },
      { h: "What's involved", list: ['Excavation and dig-outs to level', 'Site clearance and muck-away', 'Trenching for drainage and services', 'Grading, levelling and reduced dig', 'Experienced, ticketed operators'] }
    ]
  },
  {
    slug: 'stonework', title: 'Stonework', num: '07', icon: 'stonework',
    img: 'path-steps.jpg',
    short: 'Walls, steps and feature stonework built by hand. The detail that lifts a whole project.',
    meta: 'Stonework & stone walls in Angus and Tayside. Garden walls, steps and feature stonework built by hand by 360 Contracts. Free quotes across the east coast.',
    lead: 'Walls, steps and feature stonework built by hand — the detail that lifts a whole project from good to finished.',
    body: [
      { h: 'Handbuilt stone that lasts', p: 'Retaining walls, garden walls, steps and feature stonework built properly with the right foundations and materials. Natural stone or facing brick, finished with a neat, consistent point.' },
      { h: "What's involved", list: ['Retaining and garden walls', 'Natural stone and facing brick', 'Steps, pillars and copings', 'Feature walls and cladding', 'Repointing and repairs'] }
    ]
  },
  {
    slug: 'drainage', title: 'Drainage', num: '08', icon: 'drainage',
    img: 'driveway-mono.jpg',
    short: 'Soakaways, channel drains and full drainage put in properly so water goes where it should.',
    meta: 'Drainage solutions in Angus and Tayside. Soakaways, channel drains and surface water drainage installed properly by 360 Contracts. Free quotes Arbroath to Aberdeen.',
    lead: 'Soakaways, channel drains and full drainage put in properly so water goes where it should — not where it shouldn\'t.',
    body: [
      { h: 'Water sorted, first time', p: 'Standing water and poor drainage wreck driveways, patios and gardens. We design and install the right solution — soakaways, channels, gullies and land drains — so surface water is dealt with for good.' },
      { h: "What's involved", list: ['Soakaways and land drainage', 'Channel and linear drains', 'Gullies, gratings and connections', 'Correct falls designed into every job', 'Driveway and patio surface drainage'] }
    ]
  },
  {
    slug: 'tarmac', title: 'Tarmac', num: '09', icon: 'tarmac',
    img: 'driveway-mono.jpg',
    short: 'Smooth, hard-wearing tarmac driveways and surfaces laid clean, level and edged sharp.',
    meta: 'Tarmac driveways & surfacing in Angus and Tayside. Smooth, hard-wearing tarmac laid level and edged sharp by 360 Contracts. Free quotes Arbroath to Aberdeen.',
    lead: 'Smooth, hard-wearing tarmac driveways and surfaces laid clean, level and edged sharp on a properly prepared base.',
    body: [
      { h: 'Tarmac that stays flat', p: 'A good tarmac surface starts with the base. We prepare and compact the sub-base, lay to the correct falls and finish with clean edges so the surface drains, wears well and looks sharp for years.' },
      { h: "What's involved", list: ['Driveways, paths and larger surfaces', 'Full base preparation and compaction', 'Machine-laid, rolled finish', 'Sharp edging and defined borders', 'Correct falls for drainage'] }
    ]
  },
  {
    slug: 'fencing', title: 'Fencing', num: '10', icon: 'fencing',
    img: 'garden-full.jpg',
    short: 'Timber, composite and screening fitted straight, solid and built to take a Scottish winter.',
    meta: 'Fencing in Arbroath, Angus & Tayside. Timber, composite and screening fitted straight and solid by 360 Contracts. Free quotes across the east coast.',
    lead: 'Timber, composite and screening fitted straight, solid and built to take a Scottish winter without leaning or rattling.',
    body: [
      { h: 'Fencing built to stand', p: 'Posts set properly, panels level and everything squared up. Whether it is close-board, panels, composite or decorative screening, it goes in straight and stays that way.' },
      { h: "What's involved", list: ['Close-board, panel and slatted fencing', 'Composite and low-maintenance systems', 'Decorative screening and gates', 'Posts concreted in solid', 'Old fencing removed and disposed of'] }
    ]
  },
  {
    slug: 'extensions', title: 'Extensions', num: '11', icon: 'extensions',
    img: 'hero-garden.jpg',
    short: 'Extensions that add real space and value to your home, built and finished to a high standard.',
    meta: 'House extensions in Angus & Tayside. Single and double-storey extensions built and finished to a high standard by 360 Contracts. One team, one point of contact.',
    lead: 'Extensions that add real space and value to your home — built and finished to a high standard by one team from footings to final coat.',
    body: [
      { h: 'More space, done once, done right', p: 'From footings to the final finish, we manage every trade your extension needs so it runs to programme and comes together as one job. Real space, real value, no juggling contractors.' },
      { h: "What's involved", list: ['Single and double-storey extensions', 'Foundations, structure and roofing', 'Every trade supplied and coordinated', 'Plastering, finishes and making good', 'Managed to programme, one point of contact'] }
    ]
  }
];

/* ------------------------------------------------------------------ reviews */
const REVIEWS = [
  { n: 'Lewis Edgar', s: 'Driveway · Arbroath', t: 'Very friendly, efficient and top quality work. Paul came to price up lowering my kerb & was back the next week to do the job. I asked him yesterday to price up removing my old front garden & stone chipping it to create a driveway for my cars. 8 o’clock this morning they were back to do the job which was completed by mid afternoon. Amazing service!' },
  { n: 'Clare Collie', s: 'Landscaping · Angus', t: 'Highly recommend Paul and his guys — our garden transformation is just amazing! High standard of work and great finish. Very friendly guys and made sure the garden was exactly how we wanted it. Thanks again.' },
  { n: 'Laura Steven', s: 'Driveway & Drainage · Tayside', t: 'Blown away with the transformation of our drive. We had a major drainage issue and it wasn’t a straightforward job. No problem to Paul (the perfectionist) and his team — helpful, reliable, professional and hard working. I wouldn’t hesitate to recommend them — or their banter! Huge thanks.' },
  { n: 'Jacqui Gallacher', s: 'Landscaping · Angus', t: 'Wonderful service. Helpful, friendly and approachable. Great quality of work. Definitely recommend.' },
  { n: 'Shona Johnstone', s: 'Garden · Arbroath', t: 'Great job Paul. Very quick to carry out work. Definitely recommended.' },
  { n: 'Sean Greenhill', s: 'Building · Tayside', t: 'Outstanding service and very professional. I will continue to recommend to everyone I know.' },
  { n: 'Pauline Burgess', s: 'Fencing · Angus', t: 'Had my fence erected and what a cracking job — it looks great. Very highly recommended, very pleasant and top class service.' },
  { n: 'Danielle Burgess', s: 'Landscaping · Arbroath', t: 'Friendly and professional. Top quality standards. Would definitely recommend.' },
  { n: 'Vicki Webster', s: 'Angus & Tayside', t: '5 star service, friendly & reliable.' },
  { n: 'Stephen Burns', s: 'Fencing · Angus', t: 'We needed a new fence and got three quotes from companies we didn’t know. We chose these guys because of the detailed, professional quote. The work was done exactly as required and to a very high standard. No quibbles. Highly recommended.' },
  { n: 'Leanne Hardy', s: 'Landscaping · Arbroath', t: 'Fantastic service, great job done, and all great lads, very hard working. Love our garden now, would highly recommend!' },
  { n: 'Sharon Duthie', s: 'Garden · Tayside', t: 'Fantastic service from start to finish. Nothing was too much bother. Always kept informed of what was happening day to day. Garden finished to an extremely high standard. Very pleased and would highly recommend.' }
];

/* -------------------------------------------------------------------- areas */
const AREAS = ['Dundee', 'Arbroath', 'Carnoustie', 'Montrose', 'Brechin', 'Forfar', 'Monifieth', 'Stonehaven', 'Aberdeen', 'Angus', 'Tayside'];

/* ------------------------------------------------------------------ gallery */
const GALLERY = [
  { c: 'g1', img: 'garden-full.jpg', s: 'Landscaping', t: 'Split-Level Garden', alt: 'Split-level garden with porcelain patio, steps and artificial lawn' },
  { c: 'g2', img: 'driveway-block.jpg', s: 'Monoblocking', t: 'Block Driveway', alt: 'Grey block-paved driveway with chip border to a bungalow' },
  { c: 'g3', img: 'porcelain-patio.jpg', s: 'Slabbing', t: 'Sandstone Patio', alt: 'Indian sandstone patio with sleeper edging and artificial lawn' },
  { c: 'g4', img: 'hero-garden.jpg', s: 'Landscaping', t: 'Slate & Lawn', alt: 'Large slate patio with circular artificial lawn and pergola' },
  { c: 'g5', img: 'driveway-mono.jpg', s: 'Driveways', t: 'Charcoal Block', alt: 'Charcoal monoblock driveway with brick pillars' },
  { c: 'g6', img: 'astro-slab.jpg', s: 'Artificial Grass', t: 'Rear Lawn', alt: 'Artificial lawn beside a stone-clad house with slab patio' },
  { c: 'g7', img: 'path-steps.jpg', s: 'Paths & Steps', t: 'Side Access', alt: 'Block-paved path and steps beside a rendered house' },
  { c: 'g8', img: 'commercial-paving.jpg', s: 'Commercial', t: 'Restaurant Paving', alt: 'Large commercial paved area outside a local restaurant' },
  { c: 'g9', img: 'landscaping-after.jpg', s: 'Landscaping', t: 'Full Transformation', alt: 'Finished landscaped garden with artificial lawn and slab patio' }
];

/* -------------------------------------------------------------- partials */
const R = (base, p) => base + p; // relative link helper

function head(o) {
  const url = SITE.domain + '/' + o.path;
  const title = o.title;
  const desc = o.desc;
  const ogImg = SITE.domain + '/images/' + (o.ogImg || 'hero-garden.jpg');
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow" />
<meta name="theme-color" content="#0a0a0a" />
<meta name="author" content="${SITE.name}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${SITE.name}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${ogImg}" />
<meta property="og:locale" content="en_GB" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${ogImg}" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${o.base}assets/styles.css" />
${o.jsonld ? o.jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n') : ''}
</head>
<body>`;
}

function nav(base, active) {
  const dd = SERVICES.map(s => `<a href="${base}services/${s.slug}.html"><b>${s.title}</b><span>${s.short.split(',')[0].split('.')[0].slice(0, 42)}</span></a>`).join('\n        ');
  const on = k => active === k ? ' active' : '';
  return `
<header class="topbar${active === 'home' ? '' : ' solid'}" id="topbar">
  <a href="${base}index.html" class="brand" aria-label="360 Contracts home">
    <span class="mark"><span>360</span></span>
    <span class="name">360<b>.</b>Contracts<span class="sub">Building &amp; Landscaping</span></span>
  </a>
  <nav class="nav-links" aria-label="Primary">
    <div class="nav-item">
      <a href="${base}services.html" class="${on('services')}">Services
        <svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </a>
      <div class="dropdown">
        ${dd}
        <a class="dd-all" href="${base}services.html"><b>View all services →</b></a>
      </div>
    </div>
    <a href="${base}work.html" class="${on('work')}">Work</a>
    <a href="${base}reviews.html" class="${on('reviews')}">Reviews</a>
    <a href="${base}areas.html" class="${on('areas')}">Areas</a>
    <a href="${base}contact.html" class="${on('contact')}">Contact</a>
    <a href="tel:${SITE.phoneRaw}" class="nav-cta">${phoneIc}${SITE.phone}</a>
  </nav>
  <button class="hamburger" id="hamburger" aria-label="Open menu" aria-controls="mobileMenu">
    <svg class="open-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
    <svg class="close-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
  </button>
</header>
<nav class="mobile-menu" id="mobileMenu" aria-label="Mobile">
  <a href="${base}index.html">Home</a>
  <a href="${base}services.html">Services</a>
  <div class="mm-label">Our trades</div>
  ${SERVICES.map(s => `<a class="mm-sub" href="${base}services/${s.slug}.html">${s.title}</a>`).join('\n  ')}
  <a href="${base}work.html" style="margin-top:22px">Work</a>
  <a href="${base}reviews.html">Reviews</a>
  <a href="${base}areas.html">Areas</a>
  <a href="${base}contact.html">Contact</a>
  <a class="mm-cta" href="tel:${SITE.phoneRaw}">${phoneIc}${SITE.phone}</a>
</nav>`;
}

function marquee() {
  const items = ['Monoblocking', 'Slabbing & Patios', 'Landscaping', 'Fencing', 'Stonework', 'Driveways', 'Drainage', 'Extensions', 'Digger Work', 'New Builds'];
  const run = items.map(i => `${i}<i></i>`).join('');
  return `
<div class="strip" aria-hidden="true">
  <div class="marquee">
    <span>${run}</span>
    <span>${run}</span>
  </div>
</div>`;
}

function ctaBlock() {
  return `
<section class="cta">
  <div class="wrap">
    <h2 class="reveal">Let's build<br>something.</h2>
    <p class="reveal">Tell us what you've got in mind and we'll get a free, no-obligation quote back to you. One team, every trade, no hassle.</p>
    <div class="cta-actions reveal">
      <a href="tel:${SITE.phoneRaw}" class="btn btn-dark">${phoneIc}${SITE.phone}</a>
      <a href="mailto:${SITE.email}" class="btn btn-outline-dark">${mailIc}Email us</a>
    </div>
  </div>
</section>`;
}

function footer(base) {
  return `
<footer>
  <div class="wrap">
    <div class="foot-top">
      <div class="foot-brand">
        <a href="${base}index.html" class="brand">
          <span class="mark"><span>360</span></span>
          <span class="name">360<b>.</b>Contracts<span class="sub">Building &amp; Landscaping</span></span>
        </a>
        <p>All trades supplied and sorted by one team. Driveways, patios, landscaping and builds across Arbroath, Dundee, Angus &amp; Aberdeen. Done right, no hassle.</p>
      </div>
      <div class="foot-col">
        <h4>Services</h4>
        ${SERVICES.slice(0, 6).map(s => `<a href="${base}services/${s.slug}.html">${s.title}</a>`).join('\n        ')}
        <a href="${base}services.html">View all →</a>
      </div>
      <div class="foot-col">
        <h4>Get in touch</h4>
        <a href="tel:${SITE.phoneRaw}">${SITE.phone}</a>
        <a href="mailto:${SITE.email}">${SITE.email}</a>
        <p>Mon–Sun · 8:00–21:00</p>
        <p>${SITE.addressTown}, ${SITE.region}, ${SITE.postcode}</p>
      </div>
    </div>
    <div class="foot-bottom">
      <p>© <span data-year>2026</span> ${SITE.name} Ltd. All rights reserved.</p>
      <p class="made">Built by <a href="${SITE.builder.url}" target="_blank" rel="noopener">${SITE.builder.name}</a></p>
    </div>
  </div>
</footer>
<script src="${base}assets/main.js" defer></script>
</body>
</html>`;
}

/* ------------------------------------------------------------- coverage map */
/* static dark map image of the Angus/Aberdeenshire coast, service area in yellow */
function coverageMap(base = '') {
  return `
<div class="map-card reveal">
  <img src="${base}images/coverage-map.jpg" width="1672" height="941" loading="lazy" decoding="async"
       alt="Map of the east coast of Scotland showing 360 Contracts' service area from Dundee and Arbroath up to Aberdeen" />
</div>`;
}

/* ----------------------------------------------------------- shared blocks */
function servicesGridHome(base) {
  return SERVICES.map(s => `      <a class="svc reveal" href="${base}services/${s.slug}.html">
        <div class="no">${s.num}</div>
        <div class="ic">${svc_ic(s.icon)}</div>
        <h3>${s.title}</h3>
        <p>${s.short}</p>
        <span class="go">Learn more ${arrow}</span>
      </a>`).join('\n');
}

function reviewCard(r) {
  const initial = r.n.charAt(0);
  return `      <article class="rev">
        ${stars5}
        <p>"${r.t}"</p>
        <div class="who"><div class="av">${initial}</div><div><b>${r.n}</b><span>${r.s}</span></div></div>
      </article>`;
}

function reviewsCarousel(list) {
  return `
<section class="reviews" id="reviews">
  <div class="wrap">
    <div class="rev-head">
      <div class="sec-head reveal" style="margin-bottom:0">
        <div class="kicker">Straight from the customers</div>
        <h2 class="display">Highly<br><em>recommended</em></h2>
      </div>
      <div class="rev-controls reveal">
        <button id="revPrev" aria-label="Previous reviews"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
        <button id="revNext" aria-label="More reviews"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
    </div>
    <div class="rev-track" id="revTrack">
${list.map(reviewCard).join('\n')}
    </div>
    <div class="rev-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> Swipe or drag to read more</div>
  </div>
</section>`;
}

/* ---------------------------------------------------------------- JSON-LD */
const localBusiness = {
  '@context': 'https://schema.org', '@type': 'GeneralContractor',
  name: SITE.name, image: SITE.domain + '/images/hero-garden.jpg', '@id': SITE.domain,
  url: SITE.domain, telephone: '+447824347377', email: SITE.email,
  priceRange: '££',
  address: { '@type': 'PostalAddress', addressLocality: 'Arbroath', addressRegion: 'Angus', postalCode: 'DD11', addressCountry: 'GB' },
  areaServed: ['Dundee', 'Arbroath', 'Montrose', 'Stonehaven', 'Aberdeen', 'Angus', 'Tayside'],
  openingHours: 'Mo-Su 08:00-21:00',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: String(REVIEWS.length) }
};
function breadcrumb(items) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE.domain + '/' + it.path })) };
}

/* ============================================================ PAGE BUILDERS */
function pageHome() {
  const base = '';
  const jsonld = [localBusiness, {
    '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.domain
  }];
  return head({
    path: 'index.html', base,
    title: '360 Contracts | All Trades. Sorted. | Building & Landscaping, Angus, Tayside & Aberdeen',
    desc: '360 Contracts. One team for driveways, patios, landscaping, fencing, stonework and extensions across Arbroath, Dundee, Angus & Aberdeen. Every trade supplied and sorted. No hassle.',
    jsonld
  }) + nav(base, 'home') + `
<section class="hero" id="top">
  <div class="hero-bg">
    <img src="images/hero-garden.jpg" alt="Premium landscaped garden with porcelain patio and artificial lawn by 360 Contracts" fetchpriority="high" />
  </div>
  <div class="wrap">
    <span class="eyebrow reveal">${SITE.areaLine}</span>
    <h1 class="display reveal">All Trades.<br><em>Sorted.</em></h1>
    <p class="lead reveal">Driveways, patios, landscaping, fencing, stonework and extensions, all handled by one team from start to finish. You get a single point of contact and a finish you'll actually want to show off. No hassle.</p>
    <div class="hero-actions reveal">
      <a href="contact.html" class="btn btn-primary">Get a free quote ${arrow}</a>
      <a href="work.html" class="btn btn-ghost">See our work</a>
    </div>
  </div>
</section>
${marquee()}
<section class="stats">
  <div class="wrap">
    <div class="stats-grid">
      <div class="stat reveal"><div class="num"><b>20</b>+</div><div class="label">Years Experience</div></div>
      <div class="stat reveal"><div class="num"><b>1</b></div><div class="label">Point Of Contact</div></div>
      <div class="stat reveal"><div class="num"><b>360</b>°</div><div class="label">Every Trade Covered</div></div>
    </div>
  </div>
</section>
<section class="pitch" id="about">
  <div class="wrap">
    <div class="pitch-grid">
      <div class="reveal">
        <h2 class="display">One call.<br><em>Every trade.</em><br>Zero hassle.</h2>
        <p>Most projects mean juggling three or four contractors, chasing dates and hoping it all lines up. 360 Contracts is the full circle. We supply and manage every trade your job needs, so you deal with us and nobody else.</p>
        <ul>
          <li>${check} Every trade supplied &amp; project-managed under one roof</li>
          <li>${check} One quote, one timeline, one team you can trust</li>
          <li>${check} On time, on budget, finished to a standard we'll stand behind</li>
        </ul>
      </div>
      <div class="ring reveal" aria-hidden="true">
        <div class="disc"></div><div class="disc d2"></div><div class="disc d3"></div>
        <div class="spin"></div>
        <div class="core"><div class="big">360<span>°</span></div><div class="cap">Full-Service Build</div></div>
        <div class="chip c1"><b>Groundwork</b></div>
        <div class="chip c2"><b>Landscaping</b></div>
        <div class="chip c3"><b>Stonework</b></div>
        <div class="chip c4"><b>Finishing</b></div>
      </div>
    </div>
  </div>
</section>
<section class="services" id="services">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="kicker">What we do</div>
      <h2 class="display">A full range of<br><em>quality trades</em></h2>
      <p>From the ground up to the final finish, here's what the 360 team handles day in, day out. Tap any trade for the detail.</p>
    </div>
    <div class="svc-grid">
${servicesGridHome(base)}
    </div>
  </div>
</section>
<section class="ba" id="before-after">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="kicker">Before &amp; after</div>
      <h2 class="display">Drag to see the<br><em>difference</em></h2>
      <p>Slide across to see a tired back garden turned into a finished landscaped space. Same garden, one team, start to finish.</p>
    </div>
    ${baSlider()}
  </div>
</section>
<section class="work" id="work">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="kicker">Recent work</div>
      <h2 class="display">Proof, not<br><em>promises</em></h2>
      <p>Real jobs, real driveways and gardens across Angus and Tayside. Every one signed off by a happy customer.</p>
    </div>
    ${galleryBlock(GALLERY.slice(0, 8))}
    <div style="text-align:center;margin-top:36px" class="reveal"><a href="work.html" class="btn btn-ghost">See more work ${arrow}</a></div>
  </div>
</section>
${reviewsCarousel(REVIEWS.slice(0, 8))}
<section class="coverage" id="areas">
  <div class="wrap">
    <div class="cov-grid">
      <div class="cov-head reveal">
        <h2>Covering <em>Dundee to Aberdeen</em></h2>
        <p>Based in Arbroath and working right up the east coast — from Dundee and the Angus towns to Stonehaven and Aberdeen.</p>
        <div class="areas">
          ${AREAS.map(a => `<a class="area" href="areas.html">${a}</a>`).join('\n          ')}
        </div>
      </div>
      ${coverageMap(base)}
    </div>
  </div>
</section>
${ctaBlock()}` + footer(base);
}

function baSlider() {
  return `<div class="ba-slider reveal" id="baSlider">
      <img class="ba-after" src="images/landscaping-after.jpg" alt="After — finished landscaped garden with artificial lawn and slab patio by 360 Contracts">
      <div class="ba-before-wrap" id="baBeforeWrap">
        <img id="baBeforeImg" src="images/landscaping-before.png" alt="Before — garden prior to landscaping">
      </div>
      <span class="ba-tag ba-tag-before">Before</span>
      <span class="ba-tag ba-tag-after">After</span>
      <div class="ba-handle" id="baHandle">
        <span class="ba-knob"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 3 12 9 18"/><polyline points="15 6 21 12 15 18"/></svg></span>
      </div>
      <input type="range" min="0" max="100" value="50" class="ba-range" id="baRange" aria-label="Drag to compare before and after">
    </div>`;
}

function galleryBlock(items) {
  return `<div class="gallery">
${items.map(g => `      <div class="tile ${g.c} reveal"><img src="images/${g.img}" alt="${g.alt}" loading="lazy"><div class="cap"><div class="s">${g.s}</div><div class="t">${g.t}</div></div></div>`).join('\n')}
    </div>`;
}

function crumbs(base, items) {
  return `<div class="crumbs">` + items.map((it, i) => {
    if (i === items.length - 1) return `<span class="here">${it.name}</span>`;
    return `<a href="${base}${it.href}">${it.name}</a><span class="sep">/</span>`;
  }).join(' ') + `</div>`;
}

function pageServicesHub() {
  const base = '';
  const jsonld = [breadcrumb([{ name: 'Home', path: 'index.html' }, { name: 'Services', path: 'services.html' }])];
  return head({
    path: 'services.html', base,
    title: 'Our Services | Driveways, Patios, Landscaping & Building | 360 Contracts',
    desc: 'Every trade under one roof — monoblocking, slabbing, landscaping, fencing, stonework, drainage, tarmac, extensions and full builds across Angus, Tayside & Aberdeen.',
    jsonld
  }) + nav(base, 'services') + `
<section class="page-hero">
  <div class="wrap">
    ${crumbs(base, [{ name: 'Home', href: 'index.html' }, { name: 'Services' }])}
    <h1 class="display reveal">Every trade.<br><em>One team.</em></h1>
    <p class="reveal">From the first dig to the final finish, 360 Contracts supplies and manages every trade your job needs. Pick a service below for the detail, or just call us and we'll sort the lot.</p>
  </div>
</section>
${marquee()}
<section class="services">
  <div class="wrap">
    <div class="svc-grid">
${servicesGridHome(base)}
    </div>
  </div>
</section>
${ctaBlock()}` + footer(base);
}

function pageService(s) {
  const base = '../';
  const related = SERVICES.filter(x => x.slug !== s.slug).slice(0, 6);
  const jsonld = [
    breadcrumb([{ name: 'Home', path: 'index.html' }, { name: 'Services', path: 'services.html' }, { name: s.title, path: 'services/' + s.slug + '.html' }]),
    {
      '@context': 'https://schema.org', '@type': 'Service',
      serviceType: s.title, provider: { '@type': 'GeneralContractor', name: SITE.name, telephone: '+447824347377' },
      areaServed: ['Arbroath', 'Dundee', 'Angus', 'Aberdeen', 'Tayside'],
      description: s.meta, url: SITE.domain + '/services/' + s.slug + '.html'
    }
  ];
  const body = s.body.map(sec => {
    let html = `<h2>${sec.h}</h2>`;
    if (sec.p) html += `\n        <p>${sec.p}</p>`;
    if (sec.list) html += `\n        <ul>\n${sec.list.map(li => `          <li>${check} ${li}</li>`).join('\n')}\n        </ul>`;
    return '        ' + html;
  }).join('\n');
  return head({
    path: 'services/' + s.slug + '.html', base, ogImg: s.img,
    title: `${s.title} | Arbroath, Dundee, Angus & Aberdeen | 360 Contracts`,
    desc: s.meta, jsonld
  }) + nav(base, 'services') + `
<section class="page-hero has-img">
  <div class="ph-bg"><img src="${base}images/${s.img}" alt="${s.title} by 360 Contracts in Angus and Tayside"></div>
  <div class="wrap">
    ${crumbs(base, [{ name: 'Home', href: 'index.html' }, { name: 'Services', href: 'services.html' }, { name: s.title }])}
    <div class="ic" style="width:52px;height:52px;color:var(--yellow);margin-bottom:20px">${svc_ic(s.icon)}</div>
    <h1 class="display reveal">${s.title}</h1>
    <p class="reveal">${s.lead}</p>
  </div>
</section>
<section class="svc-detail">
  <div class="wrap">
    <div class="svc-detail-grid">
      <div class="svc-body reveal">
${body}
        <div class="svc-figure"><img src="${base}images/${s.img}" alt="Example of ${s.title.toLowerCase()} completed by 360 Contracts" loading="lazy"></div>
        <p>Every ${s.title.toLowerCase()} job is priced clearly and managed by one team — so you get a single point of contact from the first visit to the final sign-off, right across Arbroath, Dundee, Angus and Aberdeen.</p>
      </div>
      <aside class="svc-aside">
        <div class="aside-card reveal">
          <h3>Free quote</h3>
          <p>Tell us what you need and we'll get a no-obligation price back to you fast.</p>
          <a href="tel:${SITE.phoneRaw}" class="btn btn-primary">${phoneIc}${SITE.phone}</a>
          <a href="${base}contact.html" class="btn btn-ghost">Send a message</a>
        </div>
        <div class="aside-card reveal">
          <h3>Other trades</h3>
          <div class="aside-list">
            ${related.map(r => `<a href="${base}services/${r.slug}.html">${r.title} ${arrow}</a>`).join('\n            ')}
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>
${ctaBlock()}` + footer(base);
}

function pageWork() {
  const base = '';
  const jsonld = [breadcrumb([{ name: 'Home', path: 'index.html' }, { name: 'Work', path: 'work.html' }])];
  return head({
    path: 'work.html', base,
    title: 'Our Work | Driveways, Patios & Garden Transformations | 360 Contracts',
    desc: 'Recent driveways, patios and garden transformations across Arbroath, Dundee, Angus and Aberdeen. Real jobs, signed off by happy customers. See the 360 Contracts portfolio.',
    jsonld
  }) + nav(base, 'work') + `
<section class="page-hero">
  <div class="wrap">
    ${crumbs(base, [{ name: 'Home', href: 'index.html' }, { name: 'Work' }])}
    <h1 class="display reveal">Proof, not<br><em>promises</em></h1>
    <p class="reveal">Real jobs, real driveways and gardens across Angus, Tayside and Aberdeenshire — every one signed off by a happy customer.</p>
  </div>
</section>
<section class="ba" style="border-top:none;padding-top:70px">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="kicker">Before &amp; after</div>
      <h2 class="display">Drag to see the<br><em>difference</em></h2>
    </div>
    ${baSlider()}
  </div>
</section>
<section class="work" style="border-top:none">
  <div class="wrap">
    ${galleryBlock(GALLERY)}
  </div>
</section>
${ctaBlock()}` + footer(base);
}

function pageReviews() {
  const base = '';
  const jsonld = [
    breadcrumb([{ name: 'Home', path: 'index.html' }, { name: 'Reviews', path: 'reviews.html' }]),
    Object.assign({}, localBusiness, {
      review: REVIEWS.map(r => ({
        '@type': 'Review', author: { '@type': 'Person', name: r.n },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }, reviewBody: r.t
      }))
    })
  ];
  return head({
    path: 'reviews.html', base,
    title: 'Reviews | 5-Star Rated Builders & Landscapers | 360 Contracts',
    desc: 'Read what customers across Arbroath, Angus and Tayside say about 360 Contracts. Friendly, reliable, top-quality driveways, patios, landscaping and fencing. 5-star rated.',
    jsonld
  }) + nav(base, 'reviews') + `
<section class="page-hero">
  <div class="wrap">
    ${crumbs(base, [{ name: 'Home', href: 'index.html' }, { name: 'Reviews' }])}
    <h1 class="display reveal">Highly<br><em>recommended</em></h1>
    <p class="reveal">Straight from the customers — friendly, reliable work across Angus, Tayside and Aberdeenshire, finished to a standard people are happy to put their name to.</p>
  </div>
</section>
<section class="reviews">
  <div class="wrap">
    <div class="rev-grid">
${REVIEWS.map(reviewCard).join('\n')}
    </div>
  </div>
</section>
${ctaBlock()}` + footer(base);
}

function pageAreas() {
  const base = '';
  const jsonld = [breadcrumb([{ name: 'Home', path: 'index.html' }, { name: 'Areas', path: 'areas.html' }])];
  return head({
    path: 'areas.html', base,
    title: 'Areas We Cover | Dundee, Arbroath, Angus & Aberdeen | 360 Contracts',
    desc: 'Based in Arbroath, 360 Contracts covers the whole east coast — Dundee, Carnoustie, Montrose, Brechin, Forfar, Stonehaven and Aberdeen. Driveways, patios, landscaping & builds.',
    jsonld
  }) + nav(base, 'areas') + `
<section class="page-hero">
  <div class="wrap">
    ${crumbs(base, [{ name: 'Home', href: 'index.html' }, { name: 'Areas' }])}
    <h1 class="display reveal">Where we<br><em>work</em></h1>
    <p class="reveal">Based in Arbroath and working right up the east coast — from Dundee and the Angus towns all the way to Stonehaven and Aberdeen.</p>
  </div>
</section>
<section class="coverage" style="border-top:none">
  <div class="wrap">
    <div class="cov-grid">
      <div class="cov-head reveal">
        <h2>Covering <em>Dundee to Aberdeen</em></h2>
        <p>If you're anywhere along the east coast between Dundee and Aberdeen, we cover you. Not sure if you're in the zone? Just give us a call — chances are we can help.</p>
        <div class="areas">
          ${AREAS.map(a => `<span class="area">${a}</span>`).join('\n          ')}
        </div>
      </div>
      ${coverageMap(base)}
    </div>
  </div>
</section>
${ctaBlock()}` + footer(base);
}

function pageContact() {
  const base = '';
  const jsonld = [breadcrumb([{ name: 'Home', path: 'index.html' }, { name: 'Contact', path: 'contact.html' }])];
  return head({
    path: 'contact.html', base,
    title: 'Contact | Get a Free Quote | 360 Contracts, Arbroath',
    desc: 'Get a free, no-obligation quote from 360 Contracts. Call 07824 347377 or send a message. Driveways, patios, landscaping and builds across Angus, Tayside & Aberdeen.',
    jsonld
  }) + nav(base, 'contact') + `
<section class="page-hero">
  <div class="wrap">
    ${crumbs(base, [{ name: 'Home', href: 'index.html' }, { name: 'Contact' }])}
    <h1 class="display reveal">Get a<br><em>free quote</em></h1>
    <p class="reveal">Tell us what you've got in mind and we'll get a no-obligation price back to you. One team, every trade, no hassle.</p>
  </div>
</section>
<section class="contact">
  <div class="wrap">
    <div class="contact-grid">
      <div class="contact-info reveal">
        <div class="ci-item">
          <div class="ci-ic">${phoneIc}</div>
          <div><h4>Call us</h4><a href="tel:${SITE.phoneRaw}">${SITE.phone}</a></div>
        </div>
        <div class="ci-item">
          <div class="ci-ic">${mailIc}</div>
          <div><h4>Email</h4><a href="mailto:${SITE.email}">${SITE.email}</a></div>
        </div>
        <div class="ci-item">
          <div class="ci-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
          <div><h4>Based in</h4><p>${SITE.addressTown}, ${SITE.region}, ${SITE.postcode}</p></div>
        </div>
        <div class="ci-item">
          <div class="ci-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div><h4>Hours</h4><p>Mon–Sun · 8:00–21:00</p></div>
        </div>
      </div>
      <form class="form reveal" action="#" method="post" onsubmit="return false" aria-label="Request a quote">
        <div class="row">
          <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" required autocomplete="name" placeholder="Your name"></div>
          <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" required autocomplete="tel" placeholder="07…"></div>
        </div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" placeholder="you@email.com"></div>
        <div class="field"><label for="f-service">Service</label>
          <select id="f-service" name="service">
            <option value="">Choose a trade…</option>
            ${SERVICES.map(s => `<option value="${s.title}">${s.title}</option>`).join('\n            ')}
            <option value="Other">Something else</option>
          </select>
        </div>
        <div class="field"><label for="f-msg">About the job</label><textarea id="f-msg" name="message" placeholder="Tell us roughly what you're after, where you are, and any timescales."></textarea></div>
        <button type="submit" class="btn btn-primary">Send enquiry ${arrow}</button>
        <p class="note">Prefer to talk? Call <a href="tel:${SITE.phoneRaw}" style="color:var(--yellow)">${SITE.phone}</a> — Mon–Sun, 8am–9pm.</p>
      </form>
    </div>
  </div>
</section>` + footer(base);
}

/* ------------------------------------------------------------- sitemap etc */
function sitemap() {
  const urls = ['index.html', 'services.html', 'work.html', 'reviews.html', 'areas.html', 'contact.html']
    .concat(SERVICES.map(s => 'services/' + s.slug + '.html'));
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE.domain}/${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${u === 'index.html' ? '1.0' : '0.7'}</priority></url>`).join('\n')}
</urlset>`;
}
function robots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`;
}

/* ---------------------------------------------------------------- write out */
function write(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log('wrote', rel);
}

write('index.html', pageHome());
write('services.html', pageServicesHub());
SERVICES.forEach(s => write('services/' + s.slug + '.html', pageService(s)));
write('work.html', pageWork());
write('reviews.html', pageReviews());
write('areas.html', pageAreas());
write('contact.html', pageContact());
write('sitemap.xml', sitemap());
write('robots.txt', robots());
console.log('\nDone — ' + (6 + SERVICES.length) + ' pages + sitemap + robots.');
