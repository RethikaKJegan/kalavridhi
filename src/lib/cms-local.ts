import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export type Collection = 'artworks' | 'workshops' | 'site-settings';
const attempts = new Map<string,{count:number,expires:number}>();
export async function takeLoginAttempt(key:string) {
  const now=Date.now();
  for(const [key,value] of attempts)if(value.expires<now)attempts.delete(key);
  const record=attempts.get(key)||{count:0,expires:now+900000};
  record.count++;attempts.set(key,record);
  return record.count<=10;
}
export async function readRecords<T>(collection: Collection): Promise<T[]> {
  const value = JSON.parse(await readFile(path.join(process.cwd(), 'data', `${collection}.json`), 'utf8'));
  return collection === 'site-settings' ? [value] : value;
}
export async function putRecord(collection: Collection, id: string, value: unknown) {
  const filename = path.join(process.cwd(), 'data', `${collection}.json`);
  if (collection === 'site-settings') return writeFile(filename, JSON.stringify(value, null, 2));
  const records = await readRecords<{id:string}>(collection);
  const index = records.findIndex(item => item.id === id);
  if (index < 0) records.push(value as {id:string}); else records[index] = value as {id:string};
  await writeFile(filename, JSON.stringify(records, null, 2));
}
export async function removeRecord(collection: Collection, id: string) {
  const records = await readRecords<{id:string}>(collection);
  await writeFile(path.join(process.cwd(), 'data', `${collection}.json`), JSON.stringify(records.filter(item => item.id !== id), null, 2));
}
export async function saveUpload(name: string, type: string, data: ArrayBuffer) {
  const directory = path.join(process.cwd(), 'public/images/uploads');
  await mkdir(directory, {recursive:true});
  await writeFile(path.join(directory, name), Buffer.from(data));
}
export async function readUpload(name: string) {
  try { return {data: await readFile(path.join(process.cwd(), 'public/images/uploads', name)), type: name.endsWith('.png') ? 'image/png' : name.endsWith('.webp') ? 'image/webp' : name.endsWith('.gif') ? 'image/gif' : 'image/jpeg'}; }
  catch { return null; }
}
