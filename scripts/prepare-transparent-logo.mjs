import sharp from 'sharp';import fs from 'node:fs/promises';
const input='C:/Users/JKRFamily/.codex/generated_images/01a1906e-1d9e-7103-b3c3-d82c7a457e60/exec-6fdc9094-8c1e-45df-b705-b33c598bcdcc.png';
const path='public/images/logo/kalavridhi-transparent-v2.webp';
await sharp(input).trim().resize({width:1600,withoutEnlargement:true}).webp({lossless:true,effort:6}).toFile(path);
const m=await sharp(path).metadata(),s=await sharp(path).stats();console.log({width:m.width,height:m.height,hasAlpha:m.hasAlpha,alphaMin:s.channels[3].min,alphaMax:s.channels[3].max,bytes:(await fs.stat(path)).size});
