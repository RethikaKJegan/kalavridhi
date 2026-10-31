import fs from 'node:fs/promises';
import sharp from 'sharp';
const source='C:/Users/JKRFamily/.codex/generated_images/01a1906e-1d9e-7103-b3c3-d82c7a457e60/';
const assets=[
 ['exec-3d3585bb-5f84-4f41-944e-7e3811373633.png','watercolor-wash-v2',1200,'Abstract granular rose, saffron and blue watercolor pigment; decoration only'],
 ['exec-10e9abdc-8459-4071-b405-db09fd8ad70c.png','lotus-sprig-v2',700,'Pink lotus flowers and buds with sage leaves; decoration only'],
 ['exec-589f9c1c-f420-4475-ba21-9582253af59f.png','zendoodle-ornament-v2',1000,'Imaginary ink illustrated profile; generated decoration, not a client artwork or portrait'],
 ['exec-34ab4650-751d-4f4a-aa2f-5051143c408c.png','paintbrush-v2',550,'Burgundy artist brush with brass ferrule and pink bristles; decoration only'],
 ['exec-9867afe7-352e-4e3f-b8fb-737221259810.png','peacock-ornament-v2',800,'Blue peacock ornament; generated decoration, not a signed client painting'],
];
const manifest=[];
for(const [file,name,width,purpose] of assets){
 for(const [suffix,size] of [['',width],['-small',Math.round(width*.55)]]){
 const path='public/images/decoration/'+name+suffix+'.webp';
 await sharp(source+file).resize({width:size,withoutEnlargement:true}).webp({quality:83,alphaQuality:90,effort:6}).toFile(path);
 const m=await sharp(path).metadata(),stats=await sharp(path).stats();
 manifest.push({path:'/'+path.replace('public/',''),width:m.width,height:m.height,bytes:(await fs.stat(path)).size,hasAlpha:m.hasAlpha,alphaMin:stats.channels[3]?.min,alphaMax:stats.channels[3]?.max,source:'Built-in ImageGen',sourceFile:source+file,purpose,alt:'',consentStatus:'Generated decoration; no client original altered'});
 }
}
await fs.writeFile('docs/phase-2-review/assets.json',JSON.stringify(manifest,null,2));
console.log(manifest.map(({path,bytes,hasAlpha,alphaMin,alphaMax})=>({path,bytes,hasAlpha,alphaMin,alphaMax})));
