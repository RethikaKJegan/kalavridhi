import sharp from 'sharp';

const input = process.argv[2];
if (!input) throw new Error('Pass the generated transparent background plate path.');
const target = 'public/images/decoration/hero-depth-backing';
await sharp(input).resize(1484, 1060, { fit: 'fill' }).webp({ quality: 88, alphaQuality: 100 }).toFile(`${target}.webp`);
await sharp(input).resize(840, 600, { fit: 'fill' }).webp({ quality: 84, alphaQuality: 100 }).toFile(`${target}-small.webp`);
