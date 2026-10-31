import sharp from 'sharp';
const names=['watercolor-wash-v2','lotus-sprig-v2','zendoodle-ornament-v2','peacock-ornament-v2','paintbrush-v2'];
const layers=[];
for(let i=0;i<names.length;i++)layers.push({input:await sharp('public/images/decoration/'+names[i]+'.webp').resize({width:260,height:360,fit:'contain',background:'#fff9f2'}).flatten({background:'#fff9f2'}).png().toBuffer(),left:i*280+10,top:10});
await sharp({create:{width:1400,height:380,channels:3,background:'#fff9f2'}}).composite(layers).png().toFile('docs/phase-2-review/asset-proof.png');
