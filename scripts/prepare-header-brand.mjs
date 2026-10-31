import sharp from 'sharp';
await sharp('C:/Users/JKRFAM~1/AppData/Local/Temp/codex-clipboard-4a28d90b-86a7-492b-90f1-944f2096ea09.png').webp({quality:94}).toFile('public/images/logo/kalavridhi-script-wordmark.webp');
await sharp('public/images/logo/logo.png').resize({width:180}).webp({quality:90}).toFile('public/images/logo/kalavridhi-square.webp');
