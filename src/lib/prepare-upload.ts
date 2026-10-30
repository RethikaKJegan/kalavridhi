// Compress new photos for the free D1 upload store. Existing public assets stay unchanged.
export async function prepareUpload(file:File):Promise<File> {
  const limit = 1_500_000;
  if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)) throw new Error('Choose a JPEG, PNG, WebP or GIF image.');
  if (file.size > 10*1024*1024) throw new Error('Choose an image smaller than 10 MB.');
  if (file.size <= limit) return file;
  if (file.type === 'image/gif') throw new Error('Animated GIFs must be smaller than 1.5 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    let edge = 2000;
    for (let attempt=0;attempt<5;attempt++) {
      const ratio = Math.min(1,edge/Math.max(bitmap.width,bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1,Math.round(bitmap.width*ratio));
      canvas.height = Math.max(1,Math.round(bitmap.height*ratio));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Your browser could not prepare this image.');
      context.drawImage(bitmap,0,0,canvas.width,canvas.height);
      const blob = await new Promise<Blob|null>(resolve => canvas.toBlob(resolve,'image/webp',.86-attempt*.05));
      if (blob && blob.size <= limit) return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.webp',{type:'image/webp'});
      edge *= .75;
    }
    throw new Error('Please choose a smaller photo.');
  } finally { bitmap.close(); }
}
