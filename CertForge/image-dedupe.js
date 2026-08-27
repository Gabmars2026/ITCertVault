(()=>{
/* Legacy route compatibility loader. This file intentionally does NOT modify image URLs. */
const addCss=href=>{if(document.querySelector(`link[href^="${href.split('?')[0]}"]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l)};
const addJs=src=>{if(document.querySelector(`script[src^="${src.split('?')[0]}"]`))return;const s=document.createElement('script');s.src=src;s.async=false;document.body.appendChild(s)};
addCss('/media-fix.css?v=20260827n');
addCss('/site-upgrade.css?v=20260827n');
addCss('/header-polish.css?v=20260827n');
addCss('/about.css?v=20260827n');
addCss('/site-live.css?v=20260827n');
addJs('/about-page.js?v=20260827n');
addJs('/breaking-live.js?v=20260827n');
addJs('/site-upgrade.js?v=20260827n');
addJs('/nav-cleanup.js?v=20260827n');
addJs('/sort-news.js?v=20260827n');
addJs('/site-live.js?v=20260827n');
})();
