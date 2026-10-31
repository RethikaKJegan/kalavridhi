import fs from 'node:fs/promises';
const base='http://localhost:3000';
const response=await fetch(base);const html=await response.text();
const manifest=JSON.parse(await fs.readFile('docs/phase-2-review/assets.json','utf8'));
const statuses=await Promise.all(manifest.map(async a=>({path:a.path,status:(await fetch(base+a.path)).status})));
const checks={homepageStatus:response.status,hasHeroLayers:html.includes('kv-layered-hero'),hasSixScenes:['hero','about','gallery','workshops','recognition','footer'].every(s=>html.includes('kv-scene-'+s)),hasArtworkGallery:html.includes('Selected artworks'),hasWorkshopControls:html.includes('Next workshop and exhibition photos'),missingOldHero:!html.includes('src="/images/decoration/hero-art-collage.webp"'),assets:statuses,screenVerification:'Not performed: local browser use reported disabled, including after user reported enabling it.'};
await fs.writeFile('docs/phase-2-review/http-checks.json',JSON.stringify(checks,null,2));console.log(checks);
if(response.status!==200||statuses.some(a=>a.status!==200))process.exitCode=1;
