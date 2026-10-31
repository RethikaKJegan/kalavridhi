import fs from 'node:fs/promises';import sharp from 'sharp';
const src='C:/Users/JKRFamily/.codex/generated_images/01a1906e-1d9e-7103-b3c3-d82c7a457e60/exec-59951cb9-3e95-40e1-a096-54086b711fbf.png';
for(const [suffix,width] of [['',1500],['-small',750]]){const path='public/images/decoration/hero-reference-collage-v3'+suffix+'.webp';await sharp(src).resize({width,withoutEnlargement:true}).webp({quality:87,alphaQuality:92,effort:6}).toFile(path);const m=await sharp(path).metadata();console.log({path,width:m.width,height:m.height,alpha:m.hasAlpha,bytes:(await fs.stat(path)).size});}
