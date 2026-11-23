const photo = (id, alt) => ['web-' + id + '.jpg', alt]

const coding = photo(36496927, 'Developer working in a code editor on a laptop and monitor')
const keyboard = photo(5926382, 'Hands typing code on a laptop')
const devices = photo(38164328, 'Laptop and phone on a modern desk')
const workspace = photo(34803967, 'Laptop and smartphone on a development workstation')
const desk = photo(15549074, 'Desktop monitor, laptop, and smartphone on a desk')
const planning = photo(8217423, 'Clipboard and digital devices on a desk')
const testing = photo(33072751, 'Phone on a stand next to an open laptop')
const review = photo(4271621, 'Laptop and phone arranged for cross-device review')
const publishing = photo(7054522, 'Laptop, smartphone, and pen on a desk')

export const projects = [
  {
    id: 'investments',
    title: 'Web Design & Development',
    lines: ['Web Design &', 'Development'],
    tags: ['strategy', 'responsive design', 'frontend development'],
    url: '/blog-posts/responsive-web-design-testing-checklist',
    summary: 'We design and build responsive marketing sites and landing pages. Start with what your visitors need to learn or do, then design the pages and interactions that help them get there.',
    facts: [['Discovery', 'Goals and page inventory'], ['Design', 'Responsive prototype'], ['Development', 'Reusable page components'], ['Verification', 'Keyboard and device testing'], ['Delivery', 'Tested production build']],
    gallery: [coding, devices, planning, keyboard, testing, desk],
    strip: [1, 0, 2, 3],
    stripWidths: [176, 251, 133, 228],
  },
  {
    id: 'aescape',
    title: 'Performance & Technical SEO',
    lines: ['Performance &', 'Technical SEO'],
    tags: ['core web vitals', 'technical SEO', 'site migrations'],
    url: '/blog-posts/improve-core-web-vitals',
    summary: 'We identify the bottlenecks that affect loading, interaction, and discoverability. Use a clear baseline to prioritize fixes and verify changes against the same pages and user journeys.',
    facts: [['Baseline', 'Page and template audit'], ['Performance', 'Loading and responsiveness'], ['Search', 'Crawl and index checks'], ['Release', 'Redirect verification'], ['Monitoring', 'Field data and regressions']],
    gallery: [desk, coding, keyboard, testing, review, workspace],
    strip: [0, 1, 3, 4, 5],
    stripWidths: [177, 252, 133, 241, 241],
  },
  {
    id: 'landscaping',
    title: 'CMS & Website Maintenance',
    lines: ['CMS & Website', 'Maintenance'],
    tags: ['content workflows', 'site maintenance', 'publishing'],
    url: '/blog-posts/when-to-choose-a-cms',
    summary: 'We help you choose a publishing setup that matches how your team works. Give editors a clear way to update content and keep releases, backups, and ongoing maintenance manageable.',
    facts: [['Content model', 'Reusable page sections'], ['Editing', 'Roles and permissions'], ['Publishing', 'Preview and review'], ['Maintenance', 'Backups and release workflow'], ['Handoff', 'Documentation and training']],
    gallery: [workspace, planning, review, publishing],
    strip: [0, 1, 2, 3],
    stripWidths: [177, 257, 133, 228],
  },
]

export const team = [
  ['Christopher John O. Picardo', 'Backend Developer', 'team-christopher.jpg',
    'Connects the studio’s creative direction with the technical decisions behind each build, from how the site stores content to how it handles a project inquiry.', [
      ['Project planning', 'Technical scope'], ['Application architecture', 'Data and service boundaries'], ['API design', 'Form and integration endpoints'], ['Content workflows', 'Publishing and review'], ['Release preparation', 'Deployment and handoff'],
    ]],
  ['Sam Leonard Barber', 'UI/UX Designer', 'team-sam.jpg',
    'Shapes the path from a visitor’s first impression to their next action. Designs page layouts and interaction states so teams can test their ideas before development begins.', [
      ['Site structure', 'Information architecture'], ['User journeys', 'Navigation and key flows'], ['Visual design', 'Typography and layout'], ['Prototyping', 'Interaction and responsive states'], ['Design handoff', 'Components and specifications'],
    ]],
  ['Marc Kevin Del Mundo', 'Frontend Developer', 'team-marc.jpg',
    'Builds responsive pages and accessible interactions, carrying a design through to working components that people can use with a mouse, keyboard, or touch.', [
      ['Page development', 'Responsive components'], ['Accessibility', 'Keyboard and focus behavior'], ['Motion', 'GSAP and reduced motion'], ['Performance', 'Media loading and layout stability'], ['Quality checks', 'Cross-device testing'],
    ]],
  ['Arlan Martin Jalop', 'Backend Developer', 'team-arlan.jpg',
    'Works on the data, application logic, and integrations that support publishing and site operations. Focuses on clear validation and predictable behavior when something goes wrong.', [
      ['Data modeling', 'Content and application records'], ['Business logic', 'Validation and permissions'], ['Integrations', 'Third-party service connections'], ['Reliability', 'Error handling and recovery'], ['Maintenance', 'Operational documentation'],
    ]],
]

export const essays = [
  ['How to Improve Core Web Vitals', 'improve-core-web-vitals', 'Find what slows down your site, prioritize LCP, INP, and CLS fixes, and verify improvements with real-user data.'],
  ['Website Redesign SEO Checklist', 'website-redesign-seo-checklist', 'Protect search visibility during a redesign with a URL map, redirect testing, and post-launch monitoring.'],
  ['Responsive Web Design Testing Checklist', 'responsive-web-design-testing-checklist', 'Test a responsive website for layout, keyboard access, readability, and interaction across real viewport sizes.'],
  ['When to Choose a CMS for Your Website', 'when-to-choose-a-cms', 'Compare static pages, a managed CMS, and a headless CMS based on how your team publishes and maintains content.'],
]

export const essayBody = {
  'improve-core-web-vitals': [
    ['Start with the pages people use', 'Check a representative landing page, article, and conversion page in PageSpeed Insights. Use field data to identify which metric needs attention, then reproduce slow cases in DevTools. A lab run helps diagnose the cause and provides a repeatable baseline.'],
    ['Reduce the wait for the largest element', 'Identify the Largest Contentful Paint element before optimizing an image. If the hero image is the culprit, serve a correctly sized file, make it discoverable in the initial HTML, and avoid lazy-loading it. If the delay happens before the browser receives HTML, investigate the server response first.'],
    ['Improve responsiveness and visual stability', 'For slow interactions, record the actual click or key press and look for long JavaScript tasks or expensive rendering. Break up the responsible work or defer it until after feedback appears. For layout shifts, reserve space for media and embeds and avoid inserting content above what the reader is viewing.'],
    ['Verify the change', 'Repeat the same lab test and compare the trace. After release, review real-user data as it accumulates. Record the affected URL, test conditions, and before-and-after results so a future regression is easier to isolate.'],
  ],
  'website-redesign-seo-checklist': [
    ['Inventory your current URLs', 'Export indexed pages, top landing pages, and pages that earn links. Record each URL, title, status code, and its replacement. Keep valuable URLs stable where possible so navigation, links, and analytics continue to work.'],
    ['Map redirects before release', 'When a URL changes, redirect it permanently to its closest equivalent. Update internal links to point directly to the new destination. Test a sample of old URLs on staging and watch for loops, chains, and links that all land on an unrelated homepage.'],
    ['Check the launch build', 'Compare titles, descriptions, headings, and canonical URLs against the inventory. Check that important pages return 200 and that staging-only indexing restrictions have been removed from the production build. Submit the updated sitemap once the new URLs are live.'],
    ['Monitor performance after launch', 'Inspect your highest-priority URLs in Search Console. Watch for unexpected 404s and changes in clicks and conversions, then investigate by page group. Keep the original inventory so you can trace a missing page back to its intended successor.'],
  ],
  'responsive-web-design-testing-checklist': [
    ['Test the sections that change layout', 'Open a narrow phone viewport, a wider phone, a tablet, and desktop. Check both sides of each breakpoint. Look for clipped headlines, overlapping labels, unintended horizontal scroll, and media crops that hide important information.'],
    ['Repeat the same user journey', 'At each viewport, open the menu, follow a link, use a form, and return with browser history. Test with keyboard input and check where focus goes when a dialog closes. Try touch on real hardware when possible, especially for drag and swipe interactions.'],
    ['Check readability and motion settings', 'Increase browser zoom and look for text that becomes clipped or controls that leave the viewport. Enable reduced motion and verify that the page remains usable when animations are skipped. Review the content order in both the visual layout and keyboard sequence.'],
    ['Write a reproducible report', 'Record the URL, viewport, browser, steps, and expected outcome for each issue. Include a screenshot when placement matters and a short recording when timing matters. Recheck the same state after the fix.'],
  ],
  'when-to-choose-a-cms': [
    ['Start with the publishing workflow', 'List who changes the site, how often, and which changes need review. A small site that changes a few times a year may be easy to maintain in code. A team publishing weekly articles usually benefits from preview, scheduling, and editor permissions.'],
    ['Compare the options using a real update', 'Try publishing an article with a photo, a description, and a related link. Measure how much training and manual work it takes. A managed CMS can simplify common publishing tasks. A headless CMS may fit when the same structured content needs to feed multiple frontends.'],
    ['Account for maintenance and portability', 'Check how updates, backups, exports, localization, redirects, and access controls work. Confirm that a developer can test changes safely and that an editor can undo a mistake. Include hosting and integration costs when you compare options.'],
    ['Choose the smallest setup that fits', 'Write down the requirements the chosen setup must meet within the next year. Revisit the decision when publishing volume, permissions, or distribution channels change. A clear content model is useful regardless of the platform.'],
  ],
}

export const essayMedia = {
  'improve-core-web-vitals': coding,
  'website-redesign-seo-checklist': planning,
  'responsive-web-design-testing-checklist': testing,
  'when-to-choose-a-cms': workspace,
}

export const essaySources = {
  'improve-core-web-vitals': ['Web Vitals documentation', 'https://web.dev/articles/vitals'],
  'website-redesign-seo-checklist': ['Google Search Central’s redirects guide', 'https://developers.google.com/search/docs/crawling-indexing/301-redirects'],
}
