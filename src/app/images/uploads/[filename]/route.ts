import { readUpload } from '@/lib/cms-local';
export async function GET(_:Request, {params}:{params:Promise<{filename:string}>}) {
  const {filename} = await params;
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) return new Response('Not found',{status:404});
  const upload = await readUpload(filename);
  if (!upload) return new Response('Not found',{status:404});
  return new Response(new Uint8Array(upload.data),{headers:{'Content-Type':upload.type,'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=31536000, immutable'}});
}
